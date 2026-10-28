import { CircleAlert } from "lucide-react"
import { getAccountsReportData } from "./action"
import AccountsAndReportsClient from "./client"

export const dynamic = "force-dynamic"

export default async function AccountsAndReportsPage() {
  const { bookings, suppliers, drivers, vehicles, error } = await getAccountsReportData()

  if (error) {
    return (
      <div className="w-full min-h-[70vh] flex justify-center items-center">
        <div className="flex flex-col items-center space-y-3 text-center">
          <CircleAlert className="text-red-500 w-7 h-7" />
          <p className="text-slate-600 font-medium text-sm">
            Unable to load financial accounts data. Please try again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <AccountsAndReportsClient
      initialBookings={bookings}
      suppliers={suppliers}
      drivers={drivers}
      vehicles={vehicles}
    />
  )
}

