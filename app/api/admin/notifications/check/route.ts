import { NextResponse } from "next/server"
import { createClient } from "@/util/supabase/server"
import { runAdminReminderCheck } from "@/lib/admin-reminder-engine"

export const dynamic = "force-dynamic"

async function handleCheck() {
  try {
    const reminderResult = await runAdminReminderCheck()
    const supabase = await createClient()

    const { data: recentLogs } = await supabase
      .from("admin_notification_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(35)

    return NextResponse.json({
      success: true,
      checkedBookings: reminderResult.checkedBookings,
      triggeredNotifications: reminderResult.triggeredNotifications,
      logs: recentLogs || [],
    })
  } catch (err: any) {
    console.error("Error in /api/admin/notifications/check:", err)
    return NextResponse.json(
      {
        success: false,
        checkedBookings: 0,
        triggeredNotifications: [],
        logs: [],
        error: err?.message,
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return handleCheck()
}

export async function POST() {
  return handleCheck()
}

