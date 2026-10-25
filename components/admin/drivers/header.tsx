"use client"

import { Button } from "@/components/ui/button"
import { Plus, UserCheck } from "lucide-react"

interface DriversHeaderProps {
  onAddNew: () => void
  totalCount: number
}

export default function DriversHeader({ onAddNew, totalCount }: DriversHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-lime-100 text-lime-800 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Drivers</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your driver roster, licensing documents, and vehicle compliance ({totalCount})
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onAddNew}
          className="bg-lime-400 hover:bg-lime-500 text-black font-semibold shadow-sm transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </div>
    </div>
  )
}
