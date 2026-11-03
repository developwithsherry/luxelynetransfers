import { NextResponse } from "next/server"
import { createClient } from "@/util/supabase/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const id = body?.id
    const markAll = Boolean(body?.markAll)

    const supabase = await createClient()

    if (markAll) {
      await supabase
        .from("admin_notification_logs")
        .update({ is_read: true })
        .eq("is_read", false)
    } else if (id) {
      await supabase
        .from("admin_notification_logs")
        .update({ is_read: true })
        .eq("id", id)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 })
  }
}

