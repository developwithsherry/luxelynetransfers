import { CircleAlert } from "lucide-react"
import { getPendingBooking } from "@/app/admin/bookings/action"
import CalendarDateDetailClient from "./client"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ date: string }> | { date: string }
}

export default async function CalendarDateDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params)
  const dateStr = decodeURIComponent(resolvedParams.date || "")

  const res = await getPendingBooking()

  if (!res.success) {
    return (
      <div className="w-full min-h-[60vh] flex justify-center items-center">
        <div className="flex flex-col items-center space-y-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <CircleAlert className="text-rose-500 w-7 h-7" />
          <p className="text-sm font-medium text-slate-600">
            {res.error || "Something went wrong loading bookings for this date."}
          </p>
        </div>
      </div>
    )
  }

  return <CalendarDateDetailClient dateStr={dateStr} allBookings={res.data || []} />
}

