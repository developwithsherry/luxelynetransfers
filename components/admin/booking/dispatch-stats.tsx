"use client"

import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PoundSterling,
  ArrowUpRight,
} from "lucide-react"

export interface DispatchStatsProps {
  totalBookings: number
  upcomingCount: number
  pastCount: number
  notAssignedCount: number
  totalRevenue: number
  activeCard?: string | null
  onCardClick?: (cardKey: string) => void
}

export function DispatchStats({
  totalBookings,
  upcomingCount,
  pastCount,
  notAssignedCount,
  totalRevenue,
  activeCard,
  onCardClick,
}: DispatchStatsProps) {
  const cards = [
    {
      key: "all",
      label: "Total Bookings",
      value: totalBookings,
      subtext: "All dispatch jobs",
      icon: CalendarDays,
      badgeColor: "bg-slate-100 text-slate-700",
      iconColor: "text-slate-700",
      activeRing: "ring-2 ring-slate-900 border-slate-900",
      accentBg: "bg-white",
    },
    {
      key: "upcoming",
      label: "Upcoming",
      value: upcomingCount,
      subtext: "Scheduled for future",
      icon: Clock,
      badgeColor: "bg-blue-100 text-blue-800",
      iconColor: "text-blue-600",
      activeRing: "ring-2 ring-blue-600 border-blue-600",
      accentBg: "bg-white",
    },
    {
      key: "past",
      label: "Past Jobs",
      value: pastCount,
      subtext: "Completed journeys",
      icon: CheckCircle2,
      badgeColor: "bg-purple-100 text-purple-800",
      iconColor: "text-purple-600",
      activeRing: "ring-2 ring-purple-600 border-purple-600",
      accentBg: "bg-white",
    },
    {
      key: "not_assigned",
      label: "Needs Driver",
      value: notAssignedCount,
      subtext: notAssignedCount > 0 ? "⚠️ Needs driver allocation" : "All jobs allocated",
      icon: AlertTriangle,
      badgeColor:
        notAssignedCount > 0
          ? "bg-rose-100 text-rose-800 font-bold"
          : "bg-emerald-100 text-emerald-800",
      iconColor: notAssignedCount > 0 ? "text-rose-600" : "text-emerald-600",
      activeRing: "ring-2 ring-rose-600 border-rose-600",
      accentBg: notAssignedCount > 0 ? "bg-rose-50/50 border-rose-200" : "bg-white",
      isAlert: notAssignedCount > 0,
    },
    {
      key: "revenue",
      label: "Total Revenue",
      value: `£${totalRevenue.toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      subtext: "Customer fares total",
      icon: PoundSterling,
      badgeColor: "bg-lime-100 text-lime-900 font-bold",
      iconColor: "text-lime-700",
      activeRing: "ring-2 ring-lime-600 border-lime-600",
      accentBg: "bg-white border-lime-200",
      nonClickable: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3 mb-5 w-full">
      {cards.map((card) => {
        const Icon = card.icon
        const isActive = activeCard === card.key
        const isClickable = Boolean(onCardClick && !card.nonClickable)

        return (
          <div
            key={card.key}
            onClick={() => {
              if (isClickable && onCardClick) {
                onCardClick(card.key)
              }
            }}
            className={`relative rounded-xl p-3 sm:p-3.5 border transition-all duration-150 select-none shadow-xs min-w-0 ${
              card.accentBg
            } ${
              isActive
                ? card.activeRing
                : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
            } ${isClickable ? "cursor-pointer group" : ""}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider truncate group-hover:text-slate-900 transition-colors">
                {card.label}
              </span>
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${card.badgeColor}`}
              >
                <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-1">
              <div
                className={`text-lg sm:text-xl font-extrabold tracking-tight truncate ${
                  card.isAlert ? "text-rose-600" : "text-slate-950"
                }`}
              >
                {card.value}
              </div>
              {isClickable && (
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 transition-all shrink-0" />
              )}
            </div>

            <p className="text-[10px] text-slate-500 mt-0.5 truncate">
              {card.subtext}
            </p>
          </div>
        )
      })}
    </div>
  )
}
