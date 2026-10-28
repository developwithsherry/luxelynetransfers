"use client"

import React, { useState, useEffect, useRef } from "react"
import { format, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { formatDateUK } from "@/lib/format-util"

interface DatePickerInputProps {
  value?: Date | null
  onChange: (date: Date) => void
  placeholder?: string
  id?: string
  className?: string
  required?: boolean
  disabled?: boolean
}

export function parseUKDate(str: string): Date | null {
  if (!str) return null
  const cleaned = str.trim().replace(/\s+/g, "")
  const parts = cleaned.split(/[\/\-\.]/)
  if (parts.length !== 3) return null

  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[2], 10)

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null
  if (month < 1 || month > 12) return null
  if (year < 1900 || year > 2100) return null

  const daysInMonth = new Date(year, month, 0).getDate()
  if (day < 1 || day > daysInMonth) return null

  const date = new Date(year, month - 1, day, 12, 0, 0)
  return isValid(date) ? date : null
}

export function DatePickerInput({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  id,
  className,
  required,
  disabled,
}: DatePickerInputProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState<string>(() => {
    return value && isValid(value) ? format(value, "dd/MM/yyyy") : ""
  })
  const [hasError, setHasError] = useState(false)

  // Sync external value changes into input text
  useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, "dd/MM/yyyy"))
      setHasError(false)
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value

    // Auto-masking: handle user typing digits directly
    // Strip non-digits and slashes
    const cleaned = raw.replace(/[^\d\/]/g, "")

    // If user is typing digits without slashes, auto-insert slashes
    let formatted = cleaned
    const digitsOnly = cleaned.replace(/\//g, "")
    if (!cleaned.includes("/") || cleaned.length <= 8) {
      if (digitsOnly.length > 4) {
        formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4, 8)}`
      } else if (digitsOnly.length > 2) {
        formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
      } else {
        formatted = digitsOnly
      }
    }

    setInputValue(formatted)

    // Check if fully typed DD/MM/YYYY
    if (formatted.length === 10) {
      const parsed = parseUKDate(formatted)
      if (parsed) {
        setHasError(false)
        onChange(parsed)
      } else {
        setHasError(true)
      }
    } else {
      setHasError(false)
    }
  }

  const handleBlur = () => {
    if (!inputValue) {
      setHasError(false)
      return
    }
    const parsed = parseUKDate(inputValue)
    if (parsed) {
      setHasError(false)
      setInputValue(format(parsed, "dd/MM/yyyy"))
      onChange(parsed)
    } else {
      setHasError(true)
    }
  }

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && isValid(selectedDate)) {
      onChange(selectedDate)
      setInputValue(format(selectedDate, "dd/MM/yyyy"))
      setHasError(false)
      setOpen(false)
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
          placeholder={placeholder}
          maxLength={10}
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
              title="Open calendar"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={value && isValid(value) ? value : undefined}
              onSelect={handleCalendarSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center justify-between text-[11px] px-1">
        {hasError ? (
          <span className="text-red-600 font-medium">Please enter a valid date (DD/MM/YYYY)</span>
        ) : value && isValid(value) ? (
          <span className="text-gray-500 font-medium">{formatDateUK(value)}</span>
        ) : (
          <span className="text-gray-400">Type DD/MM/YYYY or click calendar</span>
        )}
      </div>
    </div>
  )
}
