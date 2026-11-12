"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import { Search, ChevronDown, Check, X, Clock, Building2 } from "lucide-react"
import type { Supplier } from "@/types/supplier"
import { getSupplierAvatarStyle, getSupplierInitials } from "@/lib/supplier-colors"

const RECENT_SUPPLIERS_STORAGE_KEY = "llt_recent_supplier_ids"

export function recordRecentSupplierId(supplierId?: string | null) {
  if (!supplierId || supplierId === "none" || typeof window === "undefined") return
  try {
    const raw = window.localStorage.getItem(RECENT_SUPPLIERS_STORAGE_KEY)
    const existing: string[] = raw ? JSON.parse(raw) : []
    const updated = [supplierId, ...existing.filter((id) => id !== supplierId)].slice(0, 10)
    window.localStorage.setItem(RECENT_SUPPLIERS_STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // ignore storage errors
  }
}

function getLocalRecentSupplierIds(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(RECENT_SUPPLIERS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

interface SupplierSearchSelectProps {
  suppliers: Supplier[]
  value: string // supplier id or "" / "none"
  onChange: (supplierId: string) => void
  noneLabel?: string
  placeholder?: string
  className?: string
}

export function SupplierSearchSelect({
  suppliers,
  value,
  onChange,
  noneLabel = "Direct Offline Booking (No Supplier)",
  placeholder = "Search supplier by name...",
  className = "",
}: SupplierSearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [localRecentIds, setLocalRecentIds] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const normalizedValue = value && value !== "none" ? value : ""

  const selectedSupplier = useMemo(
    () => suppliers.find((s) => s.id === normalizedValue) || null,
    [suppliers, normalizedValue]
  )

  useEffect(() => {
    if (open) {
      setLocalRecentIds(getLocalRecentSupplierIds())
      setSearchQuery("")
      const t = setTimeout(() => {
        inputRef.current?.focus()
      }, 20)
      return () => clearTimeout(t)
    }
  }, [open])

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  // Compute Top 3 most recently used suppliers when search is empty
  const topRecentSuppliers = useMemo(() => {
    const activeSuppliers = suppliers.filter((s) => (s.is_active ?? true) && Boolean(s.id))
    const pool = activeSuppliers.length > 0 ? activeSuppliers : suppliers.filter((s) => Boolean(s.id))

    const sorted = [...pool].sort((a, b) => {
      const aLocalIdx = a.id ? localRecentIds.indexOf(a.id) : -1
      const bLocalIdx = b.id ? localRecentIds.indexOf(b.id) : -1

      // 1. Prioritize suppliers recently picked in this browser session
      if (aLocalIdx !== -1 && bLocalIdx !== -1) return aLocalIdx - bLocalIdx
      if (aLocalIdx !== -1) return -1
      if (bLocalIdx !== -1) return 1

      // 2. Next prioritize by most recent booking timestamp (last_used_at from DB)
      const aUsed = a.last_used_at ? new Date(a.last_used_at).getTime() : 0
      const bUsed = b.last_used_at ? new Date(b.last_used_at).getTime() : 0
      if (aUsed !== bUsed) return bUsed - aUsed

      // 3. Fallback to most recently added supplier (created_at)
      const aCreated = a.created_at ? new Date(a.created_at).getTime() : 0
      const bCreated = b.created_at ? new Date(b.created_at).getTime() : 0
      return bCreated - aCreated
    })

    return sorted.slice(0, 3)
  }, [suppliers, localRecentIds])

  // Filter suppliers when user types a search query
  const matchingSuppliers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return topRecentSuppliers

    return suppliers
      .filter((s) => s.name.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1
        const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1
        if (aStarts !== bStarts) return aStarts - bStarts
        return a.name.localeCompare(b.name)
      })
  }, [suppliers, searchQuery, topRecentSuppliers])

  const handleSelect = (supplierId: string) => {
    if (supplierId && supplierId !== "none") {
      recordRecentSupplierId(supplierId)
    }
    onChange(supplierId)
    setOpen(false)
    setSearchQuery("")
  }

  const isSearching = searchQuery.trim().length > 0

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-white px-3 py-2 text-xs shadow-xs transition-colors hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
      >
        {selectedSupplier ? (
          <span className="flex items-center gap-2 min-w-0">
            <span
              className="w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center shrink-0"
              style={getSupplierAvatarStyle(selectedSupplier)}
            >
              {getSupplierInitials(selectedSupplier.name)}
            </span>
            <span className="font-semibold text-gray-900 truncate">{selectedSupplier.name}</span>
          </span>
        ) : (
          <span className="text-gray-700 truncate">{noneLabel}</span>
        )}

        <div className="flex items-center gap-1 shrink-0">
          {selectedSupplier && (
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation()
                handleSelect("")
              }}
              className="p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"
              title="Clear supplier"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1.5 rounded-xl border border-purple-200 bg-white shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
          {/* Search Input Bar */}
          <div className="p-2 border-b border-gray-100 bg-purple-50/40">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-purple-600 absolute left-2.5 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.stopPropagation()
                    setOpen(false)
                  } else if (e.key === "Enter") {
                    e.preventDefault()
                    if (isSearching && matchingSuppliers.length > 0 && matchingSuppliers[0].id) {
                      handleSelect(matchingSuppliers[0].id)
                    }
                  }
                }}
                placeholder={placeholder}
                className="w-full h-8 pl-8 pr-7 rounded-lg border border-purple-200 bg-white text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    inputRef.current?.focus()
                  }}
                  className="absolute right-2 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
            {/* Direct Offline Booking (No Supplier) option when not typing or if matching */}
            {!isSearching && (
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                  !normalizedValue
                    ? "bg-purple-50 text-purple-950 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded bg-gray-100 border border-gray-200 text-gray-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-3 h-3" />
                  </span>
                  <span className="truncate">{noneLabel}</span>
                </span>
                {!normalizedValue && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
              </button>
            )}

            {/* Section Header */}
            <div className="px-2.5 pt-1.5 pb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <span className="flex items-center gap-1">
                {!isSearching ? (
                  <>
                    <Clock className="w-3 h-3 text-purple-500" />
                    <span>Recent Suppliers (Top 3)</span>
                  </>
                ) : (
                  <span>Matching Suppliers ({matchingSuppliers.length})</span>
                )}
              </span>
              {!isSearching && suppliers.length > 3 && (
                <span className="text-[10px] font-normal normal-case text-purple-600">
                  Type to search all ({suppliers.length})
                </span>
              )}
            </div>

            {/* Supplier Options */}
            {matchingSuppliers.length > 0 ? (
              matchingSuppliers.map((sup) => {
                const isSelected = sup.id === normalizedValue
                return (
                  <button
                    key={sup.id}
                    type="button"
                    onClick={() => handleSelect(sup.id!)}
                    className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                      isSelected
                        ? "bg-purple-50 text-purple-950 font-bold"
                        : "text-gray-800 hover:bg-gray-50 font-medium"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-6 h-6 rounded-md text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs"
                        style={getSupplierAvatarStyle(sup)}
                      >
                        {getSupplierInitials(sup.name)}
                      </span>
                      <span className="truncate">{sup.name}</span>
                    </span>

                    <span className="flex items-center gap-1.5 shrink-0">
                      {!isSearching && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-500 font-medium">
                          Recent
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-purple-600" />}
                    </span>
                  </button>
                )
              })
            ) : (
              <div className="py-6 px-3 text-center text-xs text-gray-400">
                No supplier found matching{" "}
                <span className="font-semibold text-gray-600">&ldquo;{searchQuery}&rdquo;</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

