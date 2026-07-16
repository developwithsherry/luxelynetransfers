"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDateUK } from "@/lib/format-util"
import { formatLocation } from "@/components/format-location/format-location"

interface BookingRowProps {
  booking: any
}

export default function BookingRow({ booking }: BookingRowProps) {
  const route = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-lime-500 text-white"
      case "cancelled":
        return "bg-black text-white"
      case "pending":
        return "bg-lime-400 text-black"
      case "completed":
        return "bg-lime-600 text-white"
      default:
        return "bg-black/10 text-black"
    }
  }

  const formatStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1)

  const onRowClick = () => {
    route.push(`/admin/bookings/${booking.id}`)
  }

  return (
    <tr
      className="hover:bg-lime-50 cursor-pointer transition-colors duration-200 border-b border-black/5"
      onClick={onRowClick}
    >
      <td className="px-6 py-4 text-sm font-mono font-bold text-black">
        <Link
          href={`/admin/bookings/${booking.id}`}
          className="text-lime-600 hover:text-lime-800 transition-colors"
        >
          {booking.id?.substring(0, 4).toUpperCase()}
        </Link>
      </td>

      <td className="px-6 py-4 text-sm text-black">
        <div className="flex items-center gap-3">
          <span className="font-medium">
            {booking.first_name} {booking.last_name}
          </span>
          {booking.with_return && (
            <span className="bg-lime-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Return
            </span>
          )}
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-black">
        <div>
          <div className="text-xs">{booking.date ? formatDateUK(booking.date) : "N/A"}</div>
          <div className="text-xs text-black/60">{booking.time || "N/A"}</div>
          {booking.with_return && booking.return_date && (
            <div className="text-xs text-lime-600 mt-1 font-medium">
              Return: {formatDateUK(booking.return_date)} at {booking.return_time || "N/A"}
            </div>
          )}
        </div>
      </td>

      {/* ✅ From */}
      <td className="px-6 py-4 text-sm text-black max-w-[250px] whitespace-normal break-words">
        <div className="text-left">
          <div className="truncate sm:whitespace-normal">{formatLocation(booking.pickup_location)}</div>
          {booking.with_return && (
            <div className="text-xs text-black/60 truncate sm:whitespace-normal">
              Return from: {formatLocation(booking.drop_off_location)}
            </div>
          )}
        </div>
      </td>

      {/* ✅ To */}
      <td className="px-6 py-4 text-sm text-black max-w-[250px] whitespace-normal break-words">
        <div className="text-right">
          <div className="truncate sm:whitespace-normal">{formatLocation(booking.drop_off_location)}</div>
          {booking.with_return && (
            <div className="text-[10px] text-black/60 truncate sm:whitespace-normal">
              Return to: {formatLocation(booking.pickup_location)}
            </div>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-col gap-2 items-center">
          <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusColor(
              booking.status
            )}`}
          >
            {formatStatus(booking.status)}
          </span>
          {booking.with_return && (
            <span className="text-xs text-black/60 font-medium">
              {booking.with_return ? "2 journeys" : "1 journey"}
            </span>
          )}
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-right">
        <div className="flex flex-col gap-1 items-end">
          <div className="font-bold text-black text-lg">
            £{booking.final_amount?.toFixed(2) || "0.00"}
          </div>
          {booking.with_return && <div className="text-xs text-black/60">Return trip</div>}
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-center">
        <Link
          href={`/admin/bookings/${booking.id}`}
          className="inline-flex items-center px-3 py-2 text-xs font-bold text-lime-600 hover:text-white hover:bg-lime-600 border border-lime-600 rounded-lg transition-all duration-200"
        >
          View Details
        </Link>
      </td>
    </tr>
  )
}
