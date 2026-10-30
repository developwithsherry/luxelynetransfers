"use client"

import React, { useState, useEffect, useRef } from "react"
import { Clock, ChevronUp, ChevronDown } from "lucide-react"
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
  inputClassName?: string
  required?: boolean
  disabled?: boolean
  hideHelperText?: boolean
  allowEmpty?: boolean
}

export interface ParsedTime {
  hour: number // 0..23 (24-hour format)
  minute: number // 0..59
}

const ITEM_HEIGHT = 36 // px per wheel row

export function parseTimeString(input: string): ParsedTime | null {
  if (!input) return null
  const cleaned = input.trim().toLowerCase()

  // Match 24-hour ("14:30", "09:00", "23:45", "9:15") and legacy 12-hour ("07:30 pm", "9:00 am")
  const timeRegex = /^(\d{1,2})(?:[:.](\d{1,2}))?(?::\d{1,2})?\s*(am|pm|a\.m\.|p\.m\.)?$/i
  const match = cleaned.match(timeRegex)

  if (match) {
    let hour = parseInt(match[1], 10)
    const minute = match[2] ? parseInt(match[2], 10) : 0
    const periodStr = match[3]

    if (isNaN(hour) || isNaN(minute)) return null
    if (minute < 0 || minute > 59) return null

    if (periodStr) {
      const isPM = periodStr.startsWith("p")
      if (hour < 1 || hour > 12) return null
      if (isPM && hour < 12) hour += 12
      if (!isPM && hour === 12) hour = 0
      return { hour, minute }
    } else {
      if (hour >= 0 && hour <= 23) {
        return { hour, minute }
      }
    }
  }

  return null
}

export function formatTime24H(time: ParsedTime): string {
  const h = time.hour.toString().padStart(2, "0")
  const m = time.minute.toString().padStart(2, "0")
  return `${h}:${m}`
}

// Keep alias for backward compatibility
export const formatTimeAMPM = formatTime24H

export function TimePickerInput({
  value,
  onChange,
  placeholder = "HH:MM (24h)",
  id,
  className,
  inputClassName,
  required,
  disabled,
  hideHelperText = false,
  allowEmpty = false,
}: TimePickerInputProps) {
  const [open, setOpen] = useState(false)
  const initialParsed = parseTimeString(value || (allowEmpty ? "" : "09:00"))
  const [inputValue, setInputValue] = useState<string>(
    initialParsed ? formatTime24H(initialParsed) : allowEmpty ? "" : "09:00"
  )
  const [hasError, setHasError] = useState(false)

  const [pickerHour, setPickerHour] = useState<number>(initialParsed ? initialParsed.hour : 9)
  const [pickerMinute, setPickerMinute] = useState<number>(initialParsed ? initialParsed.minute : 0)

  const hourWheelRef = useRef<HTMLDivElement | null>(null)
  const minuteWheelRef = useRef<HTMLDivElement | null>(null)
  const scrollTimeoutRef = useRef<{ hour?: ReturnType<typeof setTimeout>; minute?: ReturnType<typeof setTimeout> }>({})

  // Sync external value changes
  useEffect(() => {
    if (value) {
      const parsed = parseTimeString(value)
      if (parsed) {
        const formatted24 = formatTime24H(parsed)
        setInputValue(formatted24)
        setPickerHour(parsed.hour)
        setPickerMinute(parsed.minute)
        setHasError(false)
        if (value !== formatted24) {
          onChange(formatted24)
        }
      } else {
        setInputValue(value)
      }
    } else if (allowEmpty) {
      setInputValue("")
    }
  }, [value, allowEmpty])

  // Position wheels to active hour & minute when popover opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if (hourWheelRef.current) {
          hourWheelRef.current.scrollTop = pickerHour * ITEM_HEIGHT
        }
        if (minuteWheelRef.current) {
          minuteWheelRef.current.scrollTop = pickerMinute * ITEM_HEIGHT
        }
      }, 10)
      return () => clearTimeout(timer)
    }
  }, [open])

  const applyPickerTime = (h = pickerHour, m = pickerMinute) => {
    const formatted = formatTime24H({ hour: h, minute: m })
    setInputValue(formatted)
    setHasError(false)
    onChange(formatted)
  }

  const selectHour = (h: number, smooth = true) => {
    const clamped = (h + 24) % 24
    setPickerHour(clamped)
    applyPickerTime(clamped, pickerMinute)
    if (hourWheelRef.current) {
      hourWheelRef.current.scrollTo({
        top: clamped * ITEM_HEIGHT,
        behavior: smooth ? "smooth" : "auto",
      })
    }
  }

  const selectMinute = (m: number, smooth = true) => {
    const clamped = (m + 60) % 60
    setPickerMinute(clamped)
    applyPickerTime(pickerHour, clamped)
    if (minuteWheelRef.current) {
      minuteWheelRef.current.scrollTo({
        top: clamped * ITEM_HEIGHT,
        behavior: smooth ? "smooth" : "auto",
      })
    }
  }

  const handleHourScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop
    const idx = Math.max(0, Math.min(23, Math.round(top / ITEM_HEIGHT)))
    if (idx !== pickerHour) {
      setPickerHour(idx)
      if (scrollTimeoutRef.current.hour) clearTimeout(scrollTimeoutRef.current.hour)
      scrollTimeoutRef.current.hour = setTimeout(() => {
        applyPickerTime(idx, pickerMinute)
      }, 60)
    }
  }

  const handleMinuteScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop
    const idx = Math.max(0, Math.min(59, Math.round(top / ITEM_HEIGHT)))
    if (idx !== pickerMinute) {
      setPickerMinute(idx)
      if (scrollTimeoutRef.current.minute) clearTimeout(scrollTimeoutRef.current.minute)
      scrollTimeoutRef.current.minute = setTimeout(() => {
        applyPickerTime(pickerHour, idx)
      }, 60)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputValue(raw)

    if (!raw.trim() && allowEmpty) {
      setHasError(false)
      onChange("")
      return
    }

    const parsed = parseTimeString(raw)
    if (parsed) {
      setHasError(false)
      setPickerHour(parsed.hour)
      setPickerMinute(parsed.minute)
      if (/^\d{1,2}[:.]\d{2}(\s*[ap]m)?$/i.test(raw.trim())) {
        onChange(formatTime24H(parsed))
      }
    } else if (raw.trim().length > 5) {
      setHasError(true)
    }
  }

  const handleBlur = () => {
    if (!inputValue.trim()) {
      setHasError(false)
      if (allowEmpty) onChange("")
      return
    }
    const parsed = parseTimeString(inputValue)
    if (parsed) {
      const formatted = formatTime24H(parsed)
      setInputValue(formatted)
      setHasError(false)
      onChange(formatted)
    } else {
      setHasError(true)
    }
  }

  return (
    <div className={cn("space-y-1", className)}>
      <div className="relative flex items-center">
        <Input
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onClick={() => !disabled && setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            "pr-10 font-mono tracking-wide bg-white text-sm",
            hasError && "border-red-500 focus-visible:ring-red-400",
            inputClassName,
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
              title="Open 24h time wheel"
            >
              <Clock className="h-4 w-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            side="bottom"
            align="center"
            collisionPadding={16}
            className="w-52 p-3 shadow-xl border border-slate-200 rounded-2xl bg-white z-50"
          >
            {/* Column Labels */}
            <div className="grid grid-cols-2 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 pb-1">
              <span>Hour</span>
              <span>Min</span>
            </div>

            {/* Up Stepper Arrows */}
            <div className="grid grid-cols-2 gap-2 mb-0.5">
              <button
                type="button"
                onClick={() => selectHour(pickerHour - 1)}
                className="flex items-center justify-center py-0.5 text-slate-400 hover:text-slate-900 transition-colors"
                aria-label="Previous hour"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => selectMinute(pickerMinute - 1)}
                className="flex items-center justify-center py-0.5 text-slate-400 hover:text-slate-900 transition-colors"
                aria-label="Previous minute"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            {/* 24-Hour Scroll Wheel Container */}
            <div className="relative h-[180px] flex items-center select-none">
              {/* Top & Bottom Fade Gradients */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white via-white/80 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />

              {/* Center Selection Highlight Bar */}
              <div className="pointer-events-none absolute inset-x-1 top-1/2 -translate-y-1/2 h-9 rounded-xl bg-lime-400/20 border border-lime-500/40 z-0 flex items-center justify-center">
                <span className="font-mono font-bold text-slate-900 text-base">:</span>
              </div>

              {/* Hours Wheel (00 - 23) */}
              <div
                ref={hourWheelRef}
                onScroll={handleHourScroll}
                className="flex-1 h-full overflow-y-auto snap-y snap-mandatory py-[72px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative z-10"
              >
                {Array.from({ length: 24 }, (_, h) => {
                  const active = pickerHour === h
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => selectHour(h)}
                      className={cn(
                        "w-full h-9 snap-center flex items-center justify-center font-mono transition-all",
                        active
                          ? "text-base font-extrabold text-slate-950 scale-105"
                          : "text-sm font-medium text-slate-400 hover:text-slate-700",
                      )}
                    >
                      {h.toString().padStart(2, "0")}
                    </button>
                  )
                })}
              </div>

              {/* Minutes Wheel (00 - 59) */}
              <div
                ref={minuteWheelRef}
                onScroll={handleMinuteScroll}
                className="flex-1 h-full overflow-y-auto snap-y snap-mandatory py-[72px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative z-10"
              >
                {Array.from({ length: 60 }, (_, m) => {
                  const active = pickerMinute === m
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => selectMinute(m)}
                      className={cn(
                        "w-full h-9 snap-center flex items-center justify-center font-mono transition-all",
                        active
                          ? "text-base font-extrabold text-slate-950 scale-105"
                          : "text-sm font-medium text-slate-400 hover:text-slate-700",
                      )}
                    >
                      {m.toString().padStart(2, "0")}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Down Stepper Arrows */}
            <div className="grid grid-cols-2 gap-2 mt-0.5">
              <button
                type="button"
                onClick={() => selectHour(pickerHour + 1)}
                className="flex items-center justify-center py-0.5 text-slate-400 hover:text-slate-900 transition-colors"
                aria-label="Next hour"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => selectMinute(pickerMinute + 1)}
                className="flex items-center justify-center py-0.5 text-slate-400 hover:text-slate-900 transition-colors"
                aria-label="Next minute"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Simple Confirm Button */}
            <Button
              type="button"
              onClick={() => {
                applyPickerTime(pickerHour, pickerMinute)
                setOpen(false)
              }}
              className="w-full mt-2 bg-slate-950 hover:bg-slate-800 text-lime-400 font-semibold text-xs h-8 rounded-xl"
            >
              Done ({formatTime24H({ hour: pickerHour, minute: pickerMinute })})
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      {!hideHelperText && hasError && (
        <div className="text-[11px] px-1 text-red-600 font-medium">
          Enter valid 24h time (e.g. 09:15 or 14:30)
        </div>
      )}
    </div>
  )
}
