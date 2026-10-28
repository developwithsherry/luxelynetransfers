"use client"

import { useState, useEffect } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, Check, RotateCcw } from "lucide-react"

export type ColumnKey =
  | "id"
  | "source"
  | "customer"
  | "dateTime"
  | "journey"
  | "driver"
  | "status"
  | "price"
  | "actions"

export interface ColumnConfig {
  key: ColumnKey
  label: string
  alwaysVisible?: boolean
}

export const ALL_COLUMNS: ColumnConfig[] = [
  { key: "id", label: "Booking ID" },
  { key: "source", label: "Source / Supplier" },
  { key: "customer", label: "Passenger" },
  { key: "dateTime", label: "Date & Time" },
  { key: "journey", label: "Journey (Route)" },
  { key: "driver", label: "Assigned Driver" },
  { key: "status", label: "Job & Payment Status" },
  { key: "price", label: "Customer Price" },
  { key: "actions", label: "Action Buttons", alwaysVisible: true },
]

export const DEFAULT_VISIBLE_COLUMNS: Record<ColumnKey, boolean> = {
  id: true,
  source: true,
  customer: true,
  dateTime: true,
  journey: true,
  driver: true,
  status: true,
  price: true,
  actions: true,
}

const STORAGE_KEY = "luxelyne_booking_visible_columns"

export function useVisibleColumns() {
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>(
    DEFAULT_VISIBLE_COLUMNS
  )
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setVisibleColumns({ ...DEFAULT_VISIBLE_COLUMNS, ...parsed })
      }
    } catch {
      // fallback
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const toggleColumn = (key: ColumnKey) => {
    setVisibleColumns((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  const resetColumns = () => {
    setVisibleColumns(DEFAULT_VISIBLE_COLUMNS)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_VISIBLE_COLUMNS))
    } catch {
      // ignore
    }
  }

  return { visibleColumns, toggleColumn, resetColumns, isLoaded }
}

interface ColumnVisibilityToggleProps {
  visibleColumns: Record<ColumnKey, boolean>
  toggleColumn: (key: ColumnKey) => void
  resetColumns: () => void
}

export function ColumnVisibilityToggle({
  visibleColumns,
  toggleColumn,
  resetColumns,
}: ColumnVisibilityToggleProps) {
  const [open, setOpen] = useState(false)

  const activeCount = Object.values(visibleColumns).filter(Boolean).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 text-xs font-semibold border-slate-300 hover:bg-slate-100 flex items-center gap-1.5 bg-white shadow-sm"
          title="Choose columns to display in bookings table"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
          <span>Columns</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
            {activeCount}/{ALL_COLUMNS.length}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-3 bg-white shadow-xl border-slate-200 rounded-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
          <p className="text-xs font-bold text-slate-900">Customize Columns</p>
          <button
            type="button"
            onClick={resetColumns}
            className="text-[11px] text-slate-500 hover:text-lime-700 flex items-center gap-1 transition"
            title="Reset to all columns"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        <p className="text-[11px] text-slate-500 mb-2 leading-tight">
          Check the columns you want to view. Your selection is automatically saved for your next login.
        </p>

        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {ALL_COLUMNS.map((col) => {
            const isChecked = Boolean(visibleColumns[col.key])
            const isAlways = Boolean(col.alwaysVisible)

            return (
              <label
                key={col.key}
                onClick={(e) => {
                  if (isAlways) {
                    e.preventDefault()
                    return
                  }
                }}
                className={`flex items-center justify-between p-1.5 px-2 rounded-lg text-xs cursor-pointer transition select-none ${
                  isChecked
                    ? "bg-lime-50/70 text-slate-900 font-medium"
                    : "hover:bg-slate-100 text-slate-500"
                } ${isAlways ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <span>{col.label}</span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isAlways}
                  onChange={() => toggleColumn(col.key)}
                  className="w-4 h-4 rounded text-lime-600 focus:ring-lime-500 accent-lime-600 cursor-pointer"
                />
              </label>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
