"use client"

import { XCircle } from "lucide-react"
import Link from "next/link"

export default function BookingCancel() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-red-400">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Booking Cancelled
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your booking was not completed. If this was a mistake, please try again.
        </p>
        <Link
          href="/"
          className="inline-block bg-red-400 hover:bg-red-500 text-white font-medium py-2 px-6 rounded-lg shadow transition"
        >
          Try Again
        </Link>
      </div>
    </div>
  )
}
