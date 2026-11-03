import type { Booking } from "@/types/booking"

export type CalendarJobCategory = "completed" | "covered" | "uncovered" | "canceled"

export interface CalendarCategoryMeta {
  key: CalendarJobCategory
  label: string
  description: string
  barBg: string
  barHoverBg: string
  barText: string
  barBorder: string
  dotBg: string
  badgeBg: string
  badgeText: string
  badgeBorder: string
  stripeBg: string
}

export const CALENDAR_CATEGORY_META: Record<CalendarJobCategory, CalendarCategoryMeta> = {
  completed: {
    key: "completed",
    label: "Completed",
    description: "Journey completed",
    barBg: "bg-emerald-600",
    barHoverBg: "hover:bg-emerald-700",
    barText: "text-white",
    barBorder: "border-emerald-700",
    dotBg: "bg-emerald-500",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    badgeBorder: "border-emerald-200",
    stripeBg: "bg-emerald-500",
  },
  covered: {
    key: "covered",
    label: "Covered",
    description: "Driver assigned & covered",
    barBg: "bg-blue-600",
    barHoverBg: "hover:bg-blue-700",
    barText: "text-white",
    barBorder: "border-blue-700",
    dotBg: "bg-blue-600",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-200",
    stripeBg: "bg-blue-600",
  },
  uncovered: {
    key: "uncovered",
    label: "Uncovered",
    description: "Unassigned / needs driver",
    barBg: "bg-slate-500",
    barHoverBg: "hover:bg-slate-600",
    barText: "text-white",
    barBorder: "border-slate-600",
    dotBg: "bg-slate-500",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    badgeBorder: "border-slate-300",
    stripeBg: "bg-slate-400",
  },
  canceled: {
    key: "canceled",
    label: "Canceled",
    description: "Booking canceled",
    barBg: "bg-rose-600",
    barHoverBg: "hover:bg-rose-700",
    barText: "text-white",
    barBorder: "border-rose-700",
    dotBg: "bg-rose-600",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    badgeBorder: "border-rose-200",
    stripeBg: "bg-rose-600",
  },
}

export function getBookingCalendarCategory(booking: Booking): CalendarJobCategory {
  const status = (booking.status || "").toLowerCase().trim()

  if (status === "cancelled" || status === "canceled" || status === "complaint") {
    return "canceled"
  }
  if (status === "completed") {
    return "completed"
  }
  if (status === "covered" || status === "pob" || Boolean(booking.driver_id)) {
    return "covered"
  }
  return "uncovered"
}

export function normalizeBookingDateYMD(dateVal?: string | null): string {
  if (!dateVal) return ""
  const trimmed = dateVal.trim()
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }
  const d = new Date(trimmed)
  if (isNaN(d.getTime())) return ""
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function getISOWeekNumber(date: Date): number {
  const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = tempDate.getUTCDay() || 7
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1))
  return Math.ceil(((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

export interface CalendarDayCell {
  dateStr: string // YYYY-MM-DD
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  dateObj: Date
}

export interface CalendarWeekRow {
  weekNumber: number
  days: CalendarDayCell[]
}

export function buildMonthCalendarGrid(
  year: number,
  monthIndex: number, // 0 = Jan, 11 = Dec
  todayStr: string
): CalendarWeekRow[] {
  const firstDayOfMonth = new Date(year, monthIndex, 1)
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0)

  // Convert JS Sunday=0..Saturday=6 into Monday=0..Sunday=6
  const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7
  const totalDaysInMonth = lastDayOfMonth.getDate()

  const totalCellsNeeded = Math.ceil((startDayOffset + totalDaysInMonth) / 7) * 7
  const gridStartDate = new Date(year, monthIndex, 1 - startDayOffset)

  const weeks: CalendarWeekRow[] = []

  for (let i = 0; i < totalCellsNeeded; i += 7) {
    const days: CalendarDayCell[] = []
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(
        gridStartDate.getFullYear(),
        gridStartDate.getMonth(),
        gridStartDate.getDate() + i + d
      )
      const cellY = cellDate.getFullYear()
      const cellM = String(cellDate.getMonth() + 1).padStart(2, "0")
      const cellDay = String(cellDate.getDate()).padStart(2, "0")
      const dateStr = `${cellY}-${cellM}-${cellDay}`
      const dayOfWeek = cellDate.getDay()

      days.push({
        dateStr,
        dayNumber: cellDate.getDate(),
        isCurrentMonth: cellDate.getMonth() === monthIndex && cellDate.getFullYear() === year,
        isToday: dateStr === todayStr,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        dateObj: cellDate,
      })
    }

    weeks.push({
      weekNumber: getISOWeekNumber(days[0].dateObj),
      days,
    })
  }

  return weeks
}

export function formatFullDateHeadingUK(ymd: string): string {
  const parts = ymd.split("-").map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return ymd
  const d = new Date(parts[0], parts[1] - 1, parts[2])
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

