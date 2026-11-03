import { createClient } from "@/util/supabase/server"
import { dispatchAdminNotification, AdminNotificationPayload } from "@/lib/admin-push"

/**
 * Parses a booking's date ("YYYY-MM-DD") and time ("HH:MM") as UK time (Europe/London)
 * and returns the difference in minutes from now (positive = in the future, negative = in the past).
 */
function getMinutesUntilPickupUK(dateStr?: string | null, timeStr?: string | null): number | null {
  if (!dateStr || !timeStr) return null
  const dateMatch = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!dateMatch) return null

  const timeMatch = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i)
  if (!timeMatch) return null

  const year = Number(dateMatch[1])
  const month = Number(dateMatch[2])
  const day = Number(dateMatch[3])

  let hours = Number(timeMatch[1])
  const minutes = Number(timeMatch[2])
  const meridiem = timeMatch[3]?.toUpperCase()
  if (meridiem === "PM" && hours < 12) hours += 12
  if (meridiem === "AM" && hours === 12) hours = 0

  // Current time in Europe/London
  const nowUkParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date())

  const partMap: Record<string, number> = {}
  nowUkParts.forEach((p) => {
    if (p.type !== "literal") partMap[p.type] = Number(p.value)
  })

  const nowUkUtcMs = Date.UTC(
    partMap.year,
    (partMap.month || 1) - 1,
    partMap.day || 1,
    partMap.hour === 24 ? 0 : partMap.hour || 0,
    partMap.minute || 0,
    partMap.second || 0
  )

  const pickupUkUtcMs = Date.UTC(year, month - 1, day, hours, minutes, 0)
  return Math.round((pickupUkUtcMs - nowUkUtcMs) / 60000)
}

export async function runAdminReminderCheck(): Promise<{
  checkedBookings: number
  triggeredNotifications: AdminNotificationPayload[]
}> {
  const triggeredNotifications: AdminNotificationPayload[] = []

  try {
    const supabase = await createClient()

    const [{ data: bookings }, { data: drivers }] = await Promise.all([
      supabase
        .from("booking")
        .select(
          "id, date, time, pickup_location, drop_off_location, first_name, last_name, status, driver_id, total_amount"
        )
        .order("date", { ascending: true }),
      supabase.from("drivers").select("id, name"),
    ])

    if (!bookings || bookings.length === 0) {
      return { checkedBookings: 0, triggeredNotifications: [] }
    }

    const driverMap = new Map<string, string>(
      (drivers || []).map((d: any) => [String(d.id), String(d.name || "Assigned Driver")])
    )

    for (const b of bookings) {
      if (!b.id || !b.date || !b.time) continue

      const status = String(b.status || "pending").toLowerCase().trim()
      if (status === "cancelled" || status === "canceled" || status === "completed") {
        continue
      }

      const minutesUntil = getMinutesUntilPickupUK(b.date, b.time)
      if (minutesUntil === null) continue

      // Ignore bookings more than 26 hours in the future or more than 6 hours in the past
      if (minutesUntil > 1560 || minutesUntil < -360) continue

      const shortId = String(b.id).slice(0, 6).toUpperCase()
      const timeLabel = String(b.time).slice(0, 5)
      const passenger =
        [b.first_name, b.last_name].filter(Boolean).join(" ").trim() || "Passenger"
      const pickup = String(b.pickup_location || "Pickup").split(",")[0]
      const dropoff = String(b.drop_off_location || "Drop-off").split(",")[0]
      const driverName = b.driver_id ? driverMap.get(String(b.driver_id)) : null
      const bookingUrl = `/admin/bookings/${b.id}`

      // 1. 1 Day Before Job Reminder (20h to 25h before pickup = 1200 to 1500 mins)
      if (minutesUntil >= 1200 && minutesUntil <= 1500) {
        const notif: AdminNotificationPayload = {
          notificationKey: `reminder_24h_${b.id}`,
          category: "reminder_24h",
          title: `📅 Tomorrow's Job #${shortId} at ${timeLabel}`,
          body: `${passenger} • ${pickup} → ${dropoff} • ${
            driverName ? `Driver: ${driverName}` : "⚠️ UNASSIGNED"
          }`,
          url: bookingUrl,
          bookingId: b.id,
        }
        const res = await dispatchAdminNotification(notif)
        if (res.sent) triggeredNotifications.push(notif)
      }

      // 2. Unassigned Driver Escalation: Within 24h (0 < minutesUntil <= 1440) -> Every 3 hours
      if (minutesUntil > 0 && minutesUntil <= 1440 && !b.driver_id) {
        // 3-hour slot index (0..7) so it fires once every 3 hours until assigned
        const slotIndex = Math.floor(minutesUntil / 180)
        const hoursLeft = Math.max(1, Math.round(minutesUntil / 60))
        const notif: AdminNotificationPayload = {
          notificationKey: `unassigned_3h_${b.id}_slot_${slotIndex}`,
          category: "unassigned_3h",
          title: `⚠️ Assign Driver! #${shortId} (${hoursLeft}h left)`,
          body: `Job at ${timeLabel} (${b.date}) is still UNASSIGNED! ${pickup} → ${dropoff}. Tap to assign driver.`,
          url: bookingUrl,
          bookingId: b.id,
        }
        const res = await dispatchAdminNotification(notif)
        if (res.sent) triggeredNotifications.push(notif)
      }

      // 3. 2 Hours Before Pickup Reminder (90m to 130m before pickup)
      if (minutesUntil >= 90 && minutesUntil <= 130) {
        const notif: AdminNotificationPayload = {
          notificationKey: `reminder_2h_${b.id}`,
          category: "reminder_2h",
          title: `⏰ 2 Hours Until Pickup • #${shortId} (${timeLabel})`,
          body: `${passenger} • ${pickup} → ${dropoff} • ${
            driverName ? `Driver: ${driverName}` : "⚠️ NO DRIVER ASSIGNED"
          }`,
          url: bookingUrl,
          bookingId: b.id,
        }
        const res = await dispatchAdminNotification(notif)
        if (res.sent) triggeredNotifications.push(notif)
      }

      // 4. 30 Minutes Before Pickup Reminder (15m to 38m before pickup)
      if (minutesUntil >= 15 && minutesUntil <= 38) {
        const notif: AdminNotificationPayload = {
          notificationKey: `reminder_30m_${b.id}`,
          category: "reminder_30m",
          title: `🚨 30 Mins Until Pickup • #${shortId} (${timeLabel})`,
          body: `Final dispatch check: ${passenger} (${pickup} → ${dropoff}) • ${
            driverName ? `Driver: ${driverName}` : "⚠️ UNASSIGNED"
          }`,
          url: bookingUrl,
          bookingId: b.id,
        }
        const res = await dispatchAdminNotification(notif)
        if (res.sent) triggeredNotifications.push(notif)
      }

      // 5. 20 Minutes After Pickup Time: Ask to update status to POB or not (-240m to -20m)
      if (
        minutesUntil <= -20 &&
        minutesUntil >= -240 &&
        status !== "pob" &&
        status !== "completed" &&
        status !== "complaint"
      ) {
        const notif: AdminNotificationPayload = {
          notificationKey: `pob_check_20m_${b.id}`,
          category: "pob_check_20m",
          title: `🚘 Update POB Status? • #${shortId} (${timeLabel})`,
          body: `20+ mins past pickup for ${passenger} (${pickup} → ${dropoff}). Is Passenger On Board (POB)? Tap to update status.`,
          url: bookingUrl,
          bookingId: b.id,
        }
        const res = await dispatchAdminNotification(notif)
        if (res.sent) triggeredNotifications.push(notif)
      }
    }

    return {
      checkedBookings: bookings.length,
      triggeredNotifications,
    }
  } catch (err) {
    console.error("Error running admin reminder check:", err)
    return {
      checkedBookings: 0,
      triggeredNotifications: [],
    }
  }
}

