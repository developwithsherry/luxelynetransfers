"use client"

import { formatDate } from "date-fns"
import type { Payment } from "@/types/payment"
import { CreditCard, Calendar, Clock, CheckCircle } from "lucide-react"

interface BookingPaymentTableProps {
  payment: Payment
}

export function BookingPaymentTable({ payment }: BookingPaymentTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-lime-500 text-white"
      case "pending":
        return "bg-lime-400 text-black"
      default:
        return "bg-black text-white"
    }
  }

  return (
    <div className="bg-white border border-lime-200 rounded-2xl shadow-lg overflow-hidden my-8">
      <div className="bg-lime-50 px-8 py-6 border-b border-lime-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-lime-500 rounded-xl">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-black">Payment Details</h3>
            <p className="text-lime-700 font-medium">Transaction information for this booking</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid gap-6">
          <div className="flex items-center justify-between p-6 bg-black rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-lime-500 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-lime-400 uppercase tracking-wide">Payment ID</p>
                <p className="text-white font-bold text-lg">{payment.id}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-6 border border-lime-200 rounded-xl">
              <div className="p-2 bg-lime-500 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-lime-700 uppercase tracking-wide">Created</p>
                <p className="text-black font-semibold text-lg">{formatDate(payment?.created_at)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 border border-lime-200 rounded-xl">
              <div className="p-2 bg-lime-600 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-lime-700 uppercase tracking-wide">Last Updated</p>
                <p className="text-black font-semibold text-lg">{formatDate(payment?.updated_at)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 border border-lime-200 rounded-xl">
            <div>
              <p className="text-sm font-bold text-lime-700 uppercase tracking-wide mb-2">Payment Status</p>
              <div
                className={`inline-flex items-center px-6 py-3 rounded-full font-bold text-lg uppercase tracking-wide ${getStatusColor(payment.status)}`}
              >
                {payment.status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
