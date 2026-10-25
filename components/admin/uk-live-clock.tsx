"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar } from "lucide-react"

export function UKLiveClock() {
  const [mounted, setMounted] = useState(false)
  const [ukTime, setUkTime] = useState("")
  const [ukDate, setUkDate] = useState("")

  useEffect(() => {
    setMounted(true)

    const updateClock = () => {
      const now = new Date()

      // Format time in London timezone (handles GMT vs BST automatically)
      const timeStr = now.toLocaleTimeString("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })

      // Format date in London timezone
      const dateStr = now.toLocaleDateString("en-GB", {
        timeZone: "Europe/London",
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })

      // Determine timezone abbreviation (GMT or BST)
      const isBST = () => {
        const d = new Date()
        // Compare UTC offset with January vs July
        const jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset()
        const jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset()
        return Math.max(jan, jul) !== d.getTimezoneOffset()
      }
      const tzName = isBST() ? "BST" : "GMT"

      setUkTime(`${timeStr} ${tzName}`)
      setUkDate(dateStr)
    }

    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Clock className="w-3.5 h-3.5 text-lime-600" />
        <span>London, UK</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/90 rounded-lg px-2.5 py-1 text-slate-700 shadow-2xs">
      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="UK Live Operations" />
        <span>{ukTime}</span>
      </div>
      <span className="text-slate-300">•</span>
      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium hidden sm:flex">
        <Calendar className="w-3 h-3 text-slate-400" />
        <span>{ukDate}</span>
      </div>
      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden md:inline">
        UK
      </span>
    </div>
  )
}
