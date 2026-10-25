"use client"

import { Button } from "@/components/ui/button"
import { Plus, Building2 } from "lucide-react"

interface SuppliersHeaderProps {
  onAddNew: () => void
  totalCount: number
}

export default function SuppliersHeader({ onAddNew, totalCount }: SuppliersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-lime-100 text-lime-800 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Suppliers</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage external transport partners, support contacts, and portal credentials ({totalCount})
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onAddNew}
          className="bg-lime-400 hover:bg-lime-500 text-black font-medium shadow-sm transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>
    </div>
  )
}
