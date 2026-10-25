"use client"

import { useEffect, useState, useMemo } from "react"
import { Driver } from "@/types/driver"
import { getDrivers } from "@/app/admin/drivers/action"
import DriversHeader from "./header"
import DriverCard from "./driver-card"
import DriverDialog from "./driver-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  UserCheck,
  Search,
  Loader2,
  ShieldCheck,
  FileCheck,
  Car,
  Database,
  Plus,
  Copy,
  Check,
} from "lucide-react"
import { toast } from "sonner"

export function DriversClient() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [copiedSql, setCopiedSql] = useState<boolean>(false)

  const fetchDrivers = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const res = await getDrivers()
      if (res.error) {
        setErrorMessage(res.error)
      } else if (res.data) {
        setDrivers(res.data)
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load drivers")
      toast.error("Failed to load drivers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  const handleAddNew = () => {
    setSelectedDriver(null)
    setDialogOpen(true)
  }

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver)
    setDialogOpen(true)
  }

  const handleDeleted = (id: string) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id))
  }

  const handleStatusChange = (id: string, isActive: boolean) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_active: isActive } : d))
    )
  }

  const handleDialogSuccess = (saved: Driver) => {
    setDrivers((prev) => {
      const existingIndex = prev.findIndex((d) => d.id === saved.id)
      if (existingIndex >= 0) {
        const copy = [...prev]
        copy[existingIndex] = saved
        return copy
      } else {
        return [saved, ...prev]
      }
    })
  }

  // Filtered drivers
  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        d.name.toLowerCase().includes(query) ||
        d.phone.toLowerCase().includes(query) ||
        (d.area_operates && d.area_operates.toLowerCase().includes(query)) ||
        (d.vehicle_model && d.vehicle_model.toLowerCase().includes(query)) ||
        (d.vehicle_reg && d.vehicle_reg.toLowerCase().includes(query)) ||
        (d.notes && d.notes.toLowerCase().includes(query))

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && (d.is_active ?? true)) ||
        (statusFilter === "inactive" && !(d.is_active ?? true))

      return matchesSearch && matchesStatus
    })
  }, [drivers, searchQuery, statusFilter])

  // Statistics
  const stats = useMemo(() => {
    const total = drivers.length
    const active = drivers.filter((d) => d.is_active ?? true).length
    const withLicense = drivers.filter((d) => Boolean(d.driving_license_url)).length
    const withVehicle = drivers.filter(
      (d) => Boolean(d.vehicle_model || d.vehicle_reg || (d.vehicle_images && d.vehicle_images.length > 0))
    ).length
    return { total, active, withLicense, withVehicle }
  }, [drivers])

  const copySqlInstruction = async () => {
    try {
      await navigator.clipboard.writeText("drivers.sql")
      setCopiedSql(true)
      toast.success("Filename copied. Find drivers.sql in the project root.")
      setTimeout(() => setCopiedSql(false), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <DriversHeader onAddNew={handleAddNew} totalCount={drivers.length} />

      {/* Supabase Notice if table doesn't exist */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-200/70 rounded-lg text-amber-800 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Supabase Database Setup Required</h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                {errorMessage}
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Open Supabase Dashboard → <strong>SQL Editor</strong> → Paste & Run the contents of{" "}
                <code className="bg-amber-100 font-mono px-1 py-0.5 rounded border border-amber-200 font-semibold">
                  drivers.sql
                </code>{" "}
                (also located in <code className="bg-amber-100 font-mono px-1 py-0.5 rounded">schema/drivers.sql</code>).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={copySqlInstruction}
              className="bg-white border-amber-300 hover:bg-amber-100 text-xs"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" /> Copy File Name
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={fetchDrivers}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
            >
              Retry Sync
            </Button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Drivers
            </span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
          <span className="text-xs text-gray-400">Registered chauffeur roster</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Active Drivers
            </span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.active}</p>
          <span className="text-xs text-gray-400">Ready for job dispatch</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Driving Licenses
            </span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.withLicense}</p>
          <span className="text-xs text-gray-400">Verified driving licenses</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vehicle Docs
            </span>
            <div className="p-1.5 bg-lime-100 text-lime-800 rounded-lg">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.withVehicle}</p>
          <span className="text-xs text-gray-400">With vehicles registered</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search drivers by name, phone, area operates, vehicle, or plate #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-gray-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                statusFilter === "all"
                  ? "bg-white text-gray-900 shadow-sm font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              All ({drivers.length})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                statusFilter === "active"
                  ? "bg-white text-gray-900 shadow-sm font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                statusFilter === "inactive"
                  ? "bg-white text-gray-900 shadow-sm font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Inactive ({drivers.length - stats.active})
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-lime-600 mb-2" />
          <p className="text-gray-600 text-sm font-medium">Loading drivers...</p>
        </div>
      ) : filteredDrivers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDrivers.map((driver) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              onEdit={handleEdit}
              onDeleted={handleDeleted}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-dashed border-gray-300 text-center">
          <div className="w-16 h-16 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center mb-4">
            <UserCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {searchQuery ? "No matching drivers found" : "No drivers added yet"}
          </h3>
          <p className="text-sm text-gray-500 max-w-md mb-6">
            {searchQuery
              ? `No drivers matched your search query "${searchQuery}". Try adjusting your keywords or filters.`
              : "Register your chauffeur drivers with phone numbers, operating areas, driving/PHV licenses, and vehicle compliance documents."}
          </p>
          <Button
            onClick={handleAddNew}
            className="bg-lime-400 hover:bg-lime-500 text-black font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </Button>
        </div>
      )}

      {/* Add / Edit Dialog Modal */}
      <DriverDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        driver={selectedDriver}
        onSuccess={handleDialogSuccess}
      />
    </div>
  )
}
