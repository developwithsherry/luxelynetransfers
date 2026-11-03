import { NextResponse } from "next/server"
import { createClient } from "@/util/supabase/server"
import { getVapidPublicKey, sendWebPushToSubscription } from "@/lib/admin-push"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = await createClient()
    const { count } = await supabase
      .from("admin_push_subscriptions")
      .select("id", { count: "exact", head: true })

    return NextResponse.json({
      publicKey: getVapidPublicKey(),
      subscribedDevicesCount: count || 0,
    })
  } catch {
    return NextResponse.json({
      publicKey: getVapidPublicKey(),
      subscribedDevicesCount: 0,
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const subscription = body?.subscription
    const deviceLabel = body?.deviceLabel || "Admin Device"
    const sendTest = Boolean(body?.sendTest)

    const endpoint = subscription?.endpoint
    const p256dh = subscription?.keys?.p256dh
    const auth = subscription?.keys?.auth

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json(
        { success: false, error: "Invalid push subscription payload" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const userAgent = request.headers.get("user-agent") || ""

    const { error } = await supabase.from("admin_push_subscriptions").upsert(
      {
        endpoint,
        p256dh,
        auth,
        user_agent: userAgent,
        device_label: deviceLabel,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "endpoint" }
    )

    if (error && error.code === "42P01") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Table 'admin_push_subscriptions' does not exist yet. Please run supabase/admin_pwa_notifications.sql in Supabase SQL Editor.",
        },
        { status: 500 }
      )
    }

    if (sendTest) {
      await sendWebPushToSubscription(
        { endpoint, p256dh, auth },
        {
          title: "✅ LLT-Management Push Active",
          body: "Background alerts enabled for new bookings, leads, driver applications, and job reminders.",
          url: "/admin/dashboard",
          tag: `llt-welcome-${Date.now()}`,
          category: "test",
        }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Error saving push subscription:", err)
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to save subscription" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const endpoint = body?.endpoint
    if (!endpoint) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    const supabase = await createClient()
    await supabase.from("admin_push_subscriptions").delete().eq("endpoint", endpoint)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 })
  }
}

