import crypto from "crypto"
import { createClient } from "@/util/supabase/server"

// Verified P-256 (prime256v1) VAPID keypair (can be overridden via environment variables)
const DEFAULT_VAPID_PUBLIC_KEY =
  "BKQTQrCg35FK5y0AK8Wu17iWF9GaJoWrO9-lLlfF65p3Ar7io-ZE_Gw-lBzMJZtPlfBkpM-eJrOPmN_l7LWWJYk"
const DEFAULT_VAPID_PRIVATE_KEY =
  "A1ek2MrcY6M-qYUv_VXBAOlv4_5oaMo3RZEq0L_4jH0"
const DEFAULT_VAPID_SUBJECT = "mailto:info@luxelynetransfers.co.uk"

export function getVapidPublicKey(): string {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || DEFAULT_VAPID_PUBLIC_KEY
}

function getVapidConfig() {
  return {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || DEFAULT_VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY || DEFAULT_VAPID_PRIVATE_KEY,
    subject: process.env.VAPID_SUBJECT || DEFAULT_VAPID_SUBJECT,
  }
}

function fromBase64Url(input: string): Buffer {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/")
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4))
  return Buffer.from(base64 + pad, "base64")
}

function toBase64Url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}

/**
 * Generates an RFC 8292 VAPID Authorization header using ES256 (P-256 ECDSA)
 */
function createVapidAuthHeader(
  endpoint: string,
  publicKeyB64: string,
  privateKeyB64: string,
  subject: string
): string {
  const parsedUrl = new URL(endpoint)
  const audience = `${parsedUrl.protocol}//${parsedUrl.host}`
  const exp = Math.floor(Date.now() / 1000) + 12 * 3600

  const headerObj = { typ: "JWT", alg: "ES256" }
  const payloadObj = {
    aud: audience,
    exp,
    sub: subject,
  }

  const unsignedToken = `${toBase64Url(Buffer.from(JSON.stringify(headerObj)))}.${toBase64Url(
    Buffer.from(JSON.stringify(payloadObj))
  )}`

  const pubBytes = fromBase64Url(publicKeyB64)
  // Uncompressed P-256 public key is 65 bytes: 0x04 || X (32 bytes) || Y (32 bytes)
  const xB64 = toBase64Url(pubBytes.subarray(1, 33))
  const yB64 = toBase64Url(pubBytes.subarray(33, 65))
  const dB64 = toBase64Url(fromBase64Url(privateKeyB64))

  const privateKeyObj = crypto.createPrivateKey({
    key: {
      kty: "EC",
      crv: "P-256",
      x: xB64,
      y: yB64,
      d: dB64,
    },
    format: "jwk",
  })

  const signature = crypto.sign("sha256", Buffer.from(unsignedToken), {
    key: privateKeyObj,
    dsaEncoding: "ieee-p1363",
  })

  const jwt = `${unsignedToken}.${toBase64Url(signature)}`
  return `vapid t=${jwt}, k=${toBase64Url(pubBytes)}`
}

/**
 * Encrypts a Web Push payload according to RFC 8291 (aes128gcm content-encoding)
 */
function encryptWebPushPayload(
  payloadText: string,
  clientPublicKeyB64: string,
  clientAuthB64: string
): Buffer {
  const clientPublicKey = fromBase64Url(clientPublicKeyB64)
  const clientAuth = fromBase64Url(clientAuthB64)
  const salt = crypto.randomBytes(16)

  const serverEcdh = crypto.createECDH("prime256v1")
  serverEcdh.generateKeys()
  const serverPublicKey = serverEcdh.getPublicKey()
  const sharedSecret = serverEcdh.computeSecret(clientPublicKey)

  // IKM derivation: HKDF-SHA256(salt=clientAuth, ikm=sharedSecret, info="WebPush: info\0" || ua_public || as_public, L=32)
  const keyInfo = Buffer.concat([
    Buffer.from("WebPush: info\0", "ascii"),
    clientPublicKey,
    serverPublicKey,
  ])
  const ikm = Buffer.from(crypto.hkdfSync("sha256", sharedSecret, clientAuth, keyInfo, 32))

  // CEK & Nonce derivation
  const cekInfo = Buffer.from("Content-Encoding: aes128gcm\0", "ascii")
  const nonceInfo = Buffer.from("Content-Encoding: nonce\0", "ascii")

  const cek = Buffer.from(crypto.hkdfSync("sha256", ikm, salt, cekInfo, 16))
  const nonce = Buffer.from(crypto.hkdfSync("sha256", ikm, salt, nonceInfo, 12))

  // Plaintext with 0x02 delimiter byte
  const plaintext = Buffer.concat([Buffer.from(payloadText, "utf8"), Buffer.from([2])])

  const cipher = crypto.createCipheriv("aes-128-gcm", cek, nonce)
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final(), cipher.getAuthTag()])

  // RFC 8188 aes128gcm header: salt (16) || rs (4, uint32BE = 4096) || idlen (1 = 65) || keyid (serverPublicKey, 65)
  const rsBuf = Buffer.alloc(4)
  rsBuf.writeUInt32BE(4096, 0)
  const idLenBuf = Buffer.from([serverPublicKey.length])

  return Buffer.concat([salt, rsBuf, idLenBuf, serverPublicKey, encrypted])
}

export interface AdminPushSubscriptionRow {
  id?: string
  endpoint: string
  p256dh: string
  auth: string
}

export interface AdminNotificationPayload {
  notificationKey: string
  category:
    | "new_booking"
    | "reminder_24h"
    | "reminder_2h"
    | "reminder_30m"
    | "unassigned_3h"
    | "pob_check_20m"
    | "contact_lead"
    | "driver_application"
    | "test"
  title: string
  body: string
  url: string
  bookingId?: string | null
  skipDedupe?: boolean
}

export async function sendWebPushToSubscription(
  sub: AdminPushSubscriptionRow,
  payload: Record<string, any>
): Promise<{ ok: boolean; status?: number }> {
  try {
    const { publicKey, privateKey, subject } = getVapidConfig()
    const payloadStr = JSON.stringify(payload)
    const encryptedBody = encryptWebPushPayload(payloadStr, sub.p256dh, sub.auth)
    const authHeader = createVapidAuthHeader(sub.endpoint, publicKey, privateKey, subject)

    const response = await fetch(sub.endpoint, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/octet-stream",
        "Content-Encoding": "aes128gcm",
        "Content-Length": String(encryptedBody.length),
        TTL: "86400",
        Urgency: "high",
      },
      body: new Uint8Array(encryptedBody),
    })

    return { ok: response.ok, status: response.status }
  } catch (err) {
    console.error("Web push send failed for endpoint:", sub.endpoint, err)
    return { ok: false }
  }
}

/**
 * Deduplicates by notificationKey, records to admin_notification_logs,
 * and pushes to all registered iOS & Android admin devices.
 */
export async function dispatchAdminNotification(
  input: AdminNotificationPayload
): Promise<{ sent: boolean; pushedDevices: number }> {
  try {
    const supabase = await createClient()

    // 1. Check if this notificationKey has already been sent (unless skipDedupe is true)
    if (!input.skipDedupe) {
      const { data: existing } = await supabase
        .from("admin_notification_logs")
        .select("id")
        .eq("notification_key", input.notificationKey)
        .maybeSingle()

      if (existing?.id) {
        return { sent: false, pushedDevices: 0 }
      }
    }

    // 2. Insert into admin_notification_logs (gracefully ignore if table not created yet)
    const { error: insertErr } = await supabase.from("admin_notification_logs").upsert(
      {
        notification_key: input.notificationKey,
        category: input.category,
        title: input.title,
        body: input.body,
        url: input.url,
        booking_id: input.bookingId || null,
        is_read: false,
      },
      { onConflict: "notification_key" }
    )

    if (insertErr && insertErr.code === "23505" && !input.skipDedupe) {
      // Unique constraint hit concurrently
      return { sent: false, pushedDevices: 0 }
    }

    // 3. Fetch all subscribed admin devices
    const { data: subscriptions } = await supabase
      .from("admin_push_subscriptions")
      .select("id, endpoint, p256dh, auth")

    if (!subscriptions || subscriptions.length === 0) {
      return { sent: true, pushedDevices: 0 }
    }

    const pushPayload = {
      title: input.title,
      body: input.body,
      url: input.url,
      tag: input.notificationKey,
      notification_key: input.notificationKey,
      category: input.category,
      bookingId: input.bookingId || null,
      requireInteraction: true,
    }

    let pushedCount = 0
    const staleEndpoints: string[] = []

    await Promise.all(
      subscriptions.map(async (sub) => {
        const res = await sendWebPushToSubscription(sub, pushPayload)
        if (res.ok) {
          pushedCount++
        } else if (res.status === 404 || res.status === 410) {
          staleEndpoints.push(sub.endpoint)
        }
      })
    )

    // Remove expired/unsubscribed endpoints automatically
    if (staleEndpoints.length > 0) {
      await supabase
        .from("admin_push_subscriptions")
        .delete()
        .in("endpoint", staleEndpoints)
    }

    return { sent: true, pushedDevices: pushedCount }
  } catch (err) {
    console.error("Error in dispatchAdminNotification:", err)
    return { sent: false, pushedDevices: 0 }
  }
}

