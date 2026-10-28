"use client"

import React, { useState, useEffect } from "react"
import { Clock, Check, ChevronUp, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TimePickerInputProps {
  value?: string
  onChange: (time: string) => void
  placeholder?: string
  id?: string
  className?: string
  required?: boolean
  disabled?: boolean
}

export interface ParsedTime {
  hour: number // 1..12
  minute: number // 0..59
  period: "AM" | "PM"
}

export function parseTimeString(input: string): ParsedTime | null {
  if (!input) return null
  const cleaned = input.trim().toLowerCase()

  // Match formats like: "09:15 AM", "9:15am", "9:15 am", "08.23 pm", "9am", "9 pm"
  const ampmRegex = /^(\d{1,2})(?:[:.](\d{1,2}))?\s*(am|pm|a\.m\.|p\.m\.)?$/i
  const match = cleaned.match(ampmRegex)

  if (match) {
    let hour = parseInt(match[1], 10)
    let minute = match[2] ? parseInt(match[2], 10) : 0
    const periodStr = match[3]

    if (isNaN(hour) || isNaN(minute)) return null
    if (minute < 0 || minute > 59) return null

    if (periodStr) {
      const period: "AM" | "PM" = periodStr.startsWith("p") ? "PM" : "AM"
      if (hour < 1 || hour > 12) return null
      return { hour, minute, period }
    } else {
      // 24-hour military time e.g. 14:30 or plain 09:00
      if (hour >= 0 && hour <= 23) {
        if (hour === 0) return { hour: 12, minute, period: "AM" }
        if (hour === 12) return { hour: 12, minute, period: "PM" }
        if (hour > 12) return { hour: hour - 12, minute, period: "PM" }
        return { hour, minute, period: "AM" }
      }
    }
  }

  return null
}

export function formatTimeAMPM(time: ParsedTime): string {
  const h = time.hour.toString().padStart(2, "0")
  const m = time.minute.toString().padStart(2, "0")
  return `${h}:${m} ${time.period}`
}

export function TimePickerInput({
  value,
  onChange,
  placeholder = "HH:MM AM/PM (e.g. 09:00 AM)",
  id,
  className,
  required,
  disabled,
}: TimePickerInputProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState<string>(value || "09:00 AM")
  const [hasError, setHasError] = useState(false)

  // Internal state for the picker popover
  const initialParsed = parseTimeString(value || "09:00 AM") || { hour: 9, minute: 0, period: "AM" }
  const [pickerHour, setPickerHour] = useState<number>(initialParsed.hour)
  const [pickerMinute, setPickerMinute] = useState<number>(initialParsed.minute)
  const [pickerPeriod, setPickerPeriod] = useState<"AM" | "PM">(initialParsed.period)

  // Sync external changes
  useEffect(() => {
    if (value) {
      setInputValue(value)
      const parsed = parseTimeString(value)
      if (parsed) {
        setPickerHour(parsed.hour)
        setPickerMinute(parsed.minute)
        setPickerPeriod(parsed.period)
        setHasError(false)
      }
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputValue(raw)

    const parsed = parseTimeString(raw)
    if (parsed) {
      setHasError(false)
      setPickerHour(parsed.hour)
      setPickerMinute(parsed.minute)
      setPickerPeriod(parsed.period)
      // If user typed a complete AM/PM string, fire onChange
      if (/[ap]m/i.test(raw)) {
        onChange(formatTimeAMPM(parsed))
      }
    } else if (raw.length > 5) {
      setHasError(true)
    }
  }

  const handleBlur = () => {
    if (!inputValue) {
      setHasError(false)
      return
    }
    const parsed = parseTimeString(inputValue)
    if (parsed) {
      const formatted = formatTimeAMPM(parsed)
      setInputValue(formatted)
      setHasError(false)
      onChange(formatted)
    } else {
      setHasError(true)
    }
  }

  const applyPickerTime = (h = pickerHour, m = pickerMinute, p = pickerPeriod) => {
    const formatted = formatTimeAMPM({ hour: h, minute: m, period: p })
    setInputValue(formatted)
    setHasError(false)
    onChange(formatted)
  }

  const handleApplyAndClose = () => {
    applyPickerTime()
    setOpen(false)
  }

  const handlePresetSelect = (preset: string) => {
    const parsed = parseTimeString(preset)
    if (parsed) {
      setPickerHour(parsed.hour)
      setPickerMinute(parsed.minute)
      setPickerPeriod(parsed.period)
      applyPickerTime(parsed.hour, parsed.minute, parsed.period)
      setOpen(false)
    }
  }

  const incrementMinute = (step = 1) => {
    setPickerMinute((prev) => {
      const next = (prev + step + 60) % 60
      applyPickerTime(pickerHour, next, pickerPeriod)
      return next
    })
  }

  // Common quick presets in AM and PM
  const morningPresets = ["06:00 AM", "07:00 AM", "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "11:00 AM"]
  const afternoonPresets = ["12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"]

  return (
    <div className={cn("space-y-1", className)}>
      <div className="relative flex items-center">
        <Input
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            "pr-10 font-mono tracking-wide bg-white text-sm",
            hasError && "border-red-500 focus-visible:ring-red-400",
          )}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              className="absolute right-1 h-8 w-8 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md"
              title="Open time selector"
            >
              <Clock className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 space-y-4 shadow-xl border-lime-200" align="end">
            {/* Header: Large Interactive Digital Clock Display */}
            <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl">
              <div className="flex items-baseline gap-1 font-mono text-2xl font-bold tracking-wider">
                <span className="text-lime-400">{pickerHour.toString().padStart(2, "0")}</span>
                <span className="text-gray-400 animate-pulse">:</span>
                <span className="text-lime-400">{pickerMinute.toString().padStart(2, "0")}</span>
                <span className="text-xs font-sans uppercase ml-2 px-2 py-0.5 rounded bg-lime-500/20 text-lime-300 font-bold">
                  {pickerPeriod}
                </span>
              </div>

              {/* AM / PM Segmented Control */}
              <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setPickerPeriod("AM")
                    applyPickerTime(pickerHour, pickerMinute, "AM")
                  }}
                  className={cn(
                    "px-2.5 py-1 text-xs font-bold rounded-md transition-all",
                    pickerPeriod === "AM"
                      ? "bg-lime-400 text-black shadow-sm"
                      : "text-gray-400 hover:text-white",
                  )}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPickerPeriod("PM")
                    applyPickerTime(pickerHour, pickerMinute, "PM")
                  }}
                  className={cn(
                    "px-2.5 py-1 text-xs font-bold rounded-md transition-all",
                    pickerPeriod === "PM"
                      ? "bg-lime-400 text-black shadow-sm"
                      : "text-gray-400 hover:text-white",
                  )}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Hour Selector (1 - 12) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                Hour (1 - 12)
              </span>
              <div className="grid grid-cols-6 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => {
                      setPickerHour(h)
                      applyPickerTime(h, pickerMinute, pickerPeriod)
                    }}
                    className={cn(
                      "py-1.5 text-xs font-semibold rounded-md border text-center transition-all",
                      pickerHour === h
                        ? "bg-lime-500 text-white border-lime-600 shadow-sm"
                        : "bg-gray-50 hover:bg-lime-50 text-gray-700 border-gray-200",
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Minute Selector with ANY minute support */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Minute (Any 00 - 59)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => incrementMinute(-1)}
                    className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                    title="-1 min"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold w-7 text-center">
                    {pickerMinute.toString().padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={() => incrementMinute(1)}
                    className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                    title="+1 min"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Fast 5-minute interval chips */}
              <div className="grid grid-cols-6 gap-1">
                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setPickerMinute(m)
                      applyPickerTime(pickerHour, m, pickerPeriod)
                    }}
                    className={cn(
                      "py-1 text-[11px] font-mono rounded-md border text-center transition-all",
                      pickerMinute === m
                        ? "bg-black text-lime-400 border-black font-bold shadow-sm"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200",
                    )}
                  >
                    :{m.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick AM/PM Presets */}
            <div className="space-y-1.5 pt-1 border-t">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                Quick Presets
              </span>
              <div className="grid grid-cols-4 gap-1">
                {(pickerPeriod === "AM" ? morningPresets : afternoonPresets).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={cn(
                      "py-1 px-1 text-[10px] rounded font-medium border text-center truncate transition-colors",
                      inputValue === preset
                        ? "bg-lime-100 text-lime-800 border-lime-300 font-bold"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50",
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm & Close Button */}
            <Button
              type="button"
              onClick={handleApplyAndClose}
              className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold text-xs h-8"
            >
              <Check className="mr-1.5 h-3.5 w-3.5" />
              Done ({formatTimeAMPM({ hour: pickerHour, minute: pickerMinute, period: pickerPeriod })})
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center justify-between text-[11px] px-1">
        {hasError ? (
          <span className="text-red-600 font-medium">Please enter valid time (e.g. 09:15 AM or 02:30 PM)</span>
        ) : (
          <span className="text-gray-400">Type HH:MM AM/PM or pick from timer</span>
        )}
      </div>
    </div>
  )
}
