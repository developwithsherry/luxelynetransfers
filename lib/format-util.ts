import { format } from "date-fns"

// Convert kilometers to miles
export function kmToMiles(km: number): number {
  return km * 0.621371
}

// Format distance in miles
export function formatDistance(km: number): string {
  const miles = kmToMiles(km)
  return `${miles.toFixed(2)} miles`
}

// Format duration with "Approx" prefix
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `Approx ${hours}h ${minutes}m`
  }
  return `Approx ${minutes} mins`
}

// Format date in UK format (DD Month YYYY)
export function formatDateUK(dateInput: string | Date): string {
  if (typeof dateInput === "string") {
    const trimmed = dateInput.trim()
    const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (ymdMatch) {
      const y = Number(ymdMatch[1])
      const m = Number(ymdMatch[2])
      const d = Number(ymdMatch[3])
      return format(new Date(y, m - 1, d), "dd MMMM yyyy")
    }
    return format(new Date(trimmed), "dd MMMM yyyy")
  }
  return format(dateInput, "dd MMMM yyyy")
}

// Format complete journey details
export function formatJourneyDetails(distance: number, duration: number, date: string, time: string): string {
  return `${formatDistance(distance)} • ${formatDuration(duration)} • ${formatDateUK(date)} at ${time}`
}
