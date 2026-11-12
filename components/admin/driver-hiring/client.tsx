"use client"

import { useState, useMemo } from "react"
import {
  UserPlus,
  Search,
  RotateCcw,
  Phone,
  Mail,
  MapPin,
  Car,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  Copy,
  Trash2,
  Eye,
  Loader2,
  ExternalLink,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DRIVER_VEHICLE_CATEGORIES,
  type DriverApplication,
  type DriverApplicationStatus,
} from "@/types/driver-application"
import {
  updateDriverApplication,
  deleteDriverApplication,
} from "@/app/admin/driver-hiring/action"
import { toast } from "sonner"
import Link from "next/link"

interface Props {
  initialApplications: DriverApplication[]
  dbError?: string | null
}

const STATUS_BADGE_MAP: Record<
  DriverApplicationStatus,
  { label: string; className: string }
> = {
  new: {
    label: "New Applicant",
    className: "bg-lime-400 text-slate-950 border-lime-500 font-bold",
  },
  contacted: {
    label: "Contacted",
    className: "bg-blue-50 text-blue-800 border-blue-200 font-semibold",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "bg-amber-50 text-amber-800 border-amber-200 font-semibold",
  },
  hired: {
    label: "Hired",
    className: "bg-emerald-600 text-white border-emerald-700 font-bold",
  },
  rejected: {
    label: "Rejected",
    className: "bg-slate-100 text-slate-600 border-slate-200 font-medium",
  },
}

export function DriverHiringClient({ initialApplications, dbError }: Props) {
  const [applications, setApplications] =
    useState<DriverApplication[]>(initialApplications)

  // Filters
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [vehicleFilter, setVehicleFilter] = useState<string>("all")

  // Active modal states
  const [selectedApp, setSelectedApp] = useState<DriverApplication | null>(null)
  const [draftStatus, setDraftStatus] =
    useState<DriverApplicationStatus>("new")
  const [draftNotes, setDraftNotes] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<DriverApplication | null>(
    null
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const hasFilters = Boolean(
    search.trim() || statusFilter !== "all" || vehicleFilter !== "all"
  )

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) {
        return false
      }
      if (vehicleFilter !== "all" && app.vehicle_category !== vehicleFilter) {
        return false
      }
      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const haystack = [
          app.full_name,
          app.phone,
          app.email,
          app.city_area,
          app.vehicle_category,
          app.vehicle_make_model || "",
          app.experience_years || "",
          app.availability || "",
          app.message || "",
          app.admin_notes || "",
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [applications, search, statusFilter, vehicleFilter])

  // KPI Stats dynamically follow the filtered applications
  const stats = useMemo(() => {
    let newCount = 0
    let inProgressCount = 0
    let hiredCount = 0

    filteredApplications.forEach((app) => {
      if (app.status === "new") newCount++
      else if (app.status === "contacted" || app.status === "shortlisted")
        inProgressCount++
      else if (app.status === "hired") hiredCount++
    })

    return {
      total: filteredApplications.length,
      newCount,
      inProgressCount,
      hiredCount,
    }
  }, [filteredApplications])

  const getWhatsAppUrl = (app: DriverApplication) => {
    const clean = (app.phone || "").replace(/[^0-9]/g, "")
    const formatted = clean.startsWith("0") ? `44${clean.slice(1)}` : clean
    if (!formatted) return null
    const text = encodeURIComponent(
      `Hello ${app.full_name}, thank you for applying to drive with Luxelyne Transfers LTD with your ${app.vehicle_category}. Our recruitment team reviewed your application—when are you available for a quick onboarding chat?`
    )
    return `https://wa.me/${formatted}?text=${text}`
  }

  const copyText = (value: string, label: string) => {
    navigator.clipboard.writeText(value)
    toast.success(`${label} copied to clipboard`)
  }

  const handleQuickStatusChange = async (
    app: DriverApplication,
    nextStatus: DriverApplicationStatus
  ) => {
    const prevStatus = app.status
    setApplications((prev) =>
      prev.map((item) =>
        item.id === app.id ? { ...item, status: nextStatus } : item
      )
    )

    const res = await updateDriverApplication(app.id, { status: nextStatus })
    if (!res.success) {
      setApplications((prev) =>
        prev.map((item) =>
          item.id === app.id ? { ...item, status: prevStatus } : item
        )
      )
      toast.error(res.error || "Failed to update status")
    } else {
      toast.success(`Application marked as ${STATUS_BADGE_MAP[nextStatus].label}`)
    }
  }

  const openDetailsModal = (app: DriverApplication) => {
    setSelectedApp(app)
    setDraftStatus(app.status)
    setDraftNotes(app.admin_notes || "")
  }

  const handleSaveModal = async () => {
    if (!selectedApp) return
    setIsSaving(true)
    try {
      const res = await updateDriverApplication(selectedApp.id, {
        status: draftStatus,
        admin_notes: draftNotes.trim() || null,
      })
      if (!res.success) {
        toast.error(res.error || "Failed to save changes")
        return
      }
      setApplications((prev) =>
        prev.map((item) =>
          item.id === selectedApp.id
            ? {
                ...item,
                status: draftStatus,
                admin_notes: draftNotes.trim() || null,
              }
            : item
        )
      )
      toast.success("Application updated")
      setSelectedApp(null)
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await deleteDriverApplication(deleteTarget.id)
      if (!res.success) {
        toast.error(res.error || "Failed to delete application")
        return
      }
      setApplications((prev) =>
        prev.filter((item) => item.id !== deleteTarget.id)
      )
      toast.success("Driver application deleted")
      setDeleteTarget(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-5 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-lime-700 mb-1">
            <span className="w-2 h-2 rounded-full bg-lime-500" />
            Recruitment & Fleet Onboarding
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Driver Hiring & Applications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review driver applications submitted from the website, contact candidates via WhatsApp or phone, and manage onboarding status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/apply-as-driver" target="_blank">
            <Button
              variant="outline"
              className="h-9 px-3.5 text-xs font-semibold border-slate-200 bg-white hover:bg-slate-50 rounded-xl"
            >
              View Public Apply Page
              <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-slate-500" />
            </Button>
          </Link>
          <Link href="/admin/drivers">
            <Button className="h-9 px-3.5 text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-white rounded-xl">
              Active Drivers Roster
            </Button>
          </Link>
        </div>
      </div>

      {/* Database Setup Alert if table not created yet */}
      {dbError && (
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 flex items-start gap-3 text-amber-950 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              Database Notice: Please run <code>supabase/driver_applications.sql</code> in your Supabase SQL Editor
            </p>
            <p className="text-amber-800">
              {dbError}
            </p>
          </div>
        </div>
      )}

      {/* Top KPI Cards (Follow Filters) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div
          onClick={() => setStatusFilter("all")}
          className={`rounded-xl bg-white border p-4 shadow-2xs cursor-pointer transition ${
            statusFilter === "all"
              ? "ring-2 ring-slate-900 border-slate-900"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Applications
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-950 mt-1.5 tabular-nums">
            {stats.total}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Matching current filters
          </p>
        </div>

        <div
          onClick={() =>
            setStatusFilter((prev) => (prev === "new" ? "all" : "new"))
          }
          className={`rounded-xl bg-white border p-4 shadow-2xs cursor-pointer transition ${
            statusFilter === "new"
              ? "ring-2 ring-lime-600 border-lime-600"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-lime-700">
              New / Unreviewed
            </span>
            <div className="w-8 h-8 rounded-lg bg-lime-100 text-lime-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-950 mt-1.5 tabular-nums">
            {stats.newCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Awaiting first contact
          </p>
        </div>

        <div
          onClick={() =>
            setStatusFilter((prev) =>
              prev === "contacted" ? "all" : "contacted"
            )
          }
          className={`rounded-xl bg-white border p-4 shadow-2xs cursor-pointer transition ${
            statusFilter === "contacted" || statusFilter === "shortlisted"
              ? "ring-2 ring-blue-600 border-blue-600"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Contacted & Shortlisted
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-950 mt-1.5 tabular-nums">
            {stats.inProgressCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            In onboarding pipeline
          </p>
        </div>

        <div
          onClick={() =>
            setStatusFilter((prev) => (prev === "hired" ? "all" : "hired"))
          }
          className={`rounded-xl bg-white border p-4 shadow-2xs cursor-pointer transition ${
            statusFilter === "hired"
              ? "ring-2 ring-emerald-600 border-emerald-600"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Hired Drivers
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-950 mt-1.5 tabular-nums">
            {stats.hiredCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Approved & onboarded
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by driver name, phone, email, postcode/area, vehicle..."
              className="w-full h-9 pl-9 pr-8 text-xs border border-slate-300 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            )}
          </div>

          {/* Vehicle Category Filter */}
          <div>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="w-full h-9 px-2.5 text-xs font-medium border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              <option value="all">All Vehicle Categories (6)</option>
              {DRIVER_VEHICLE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-9 px-2.5 text-xs font-medium border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New Applicant</option>
              <option value="contacted">Contacted</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>

            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("")
                  setStatusFilter("all")
                  setVehicleFilter("all")
                }}
                className="h-9 px-2.5 text-xs text-rose-600 hover:bg-rose-50 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-lime-100 text-lime-800 flex items-center justify-center mx-auto">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              No driver applications found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {hasFilters
                ? "No applications match your current search or filter criteria."
                : "When drivers apply on /apply-as-driver, their applications will appear here immediately."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="bg-slate-950 text-white text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 pl-4 pr-3 text-left font-bold">Applicant</th>
                  <th className="py-3 px-3 text-left font-bold">Contact & Quick Reach</th>
                  <th className="py-3 px-3 text-left font-bold">Base Area</th>
                  <th className="py-3 px-3 text-left font-bold">Vehicle Category</th>
                  <th className="py-3 px-3 text-left font-bold">Experience & Shift</th>
                  <th className="py-3 px-3 text-left font-bold">Applied On</th>
                  <th className="py-3 px-3 text-center font-bold">Status</th>
                  <th className="py-3 pl-3 pr-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((app) => {
                  const waUrl = getWhatsAppUrl(app)
                  const badge = STATUS_BADGE_MAP[app.status] || STATUS_BADGE_MAP.new

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Applicant Name */}
                      <td className="py-3.5 pl-4 pr-3 whitespace-nowrap max-w-[190px]">
                        <div className="font-bold text-slate-900 text-sm truncate max-w-[175px]">
                          {app.full_name}
                        </div>
                        {app.admin_notes && (
                          <div className="text-[11px] text-amber-700 font-medium truncate max-w-[175px] mt-0.5">
                            Note: {app.admin_notes}
                          </div>
                        )}
                      </td>

                      {/* Contact & Quick Reach */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <Phone className="w-3 h-3 text-lime-600" />
                          <a
                            href={`tel:${app.phone}`}
                            className="hover:underline"
                          >
                            {app.phone}
                          </a>
                          <button
                            type="button"
                            onClick={() => copyText(app.phone, "Phone number")}
                            className="text-slate-400 hover:text-slate-700 p-0.5"
                            title="Copy phone"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[170px]">{app.email}</span>
                          <button
                            type="button"
                            onClick={() => copyText(app.email, "Email")}
                            className="text-slate-400 hover:text-slate-700 p-0.5"
                            title="Copy email"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>

                        {waUrl && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-[10px] font-bold transition"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-600" />
                            WhatsApp Driver
                          </a>
                        )}
                      </td>

                      {/* Base Area */}
                      <td className="py-3.5 px-3 whitespace-nowrap max-w-[165px]">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-800 max-w-[150px]">
                          <MapPin className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                          <span className="truncate">{app.city_area}</span>
                        </span>
                      </td>

                      {/* Vehicle Category + Make/Model */}
                      <td className="py-3.5 px-3 whitespace-nowrap max-w-[175px]">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900 text-lime-400 max-w-[160px]">
                          <Car className="w-3 h-3 shrink-0" />
                          <span className="truncate">{app.vehicle_category}</span>
                        </span>
                        {app.vehicle_make_model && (
                          <div className="text-[11px] text-slate-600 font-medium mt-1 truncate max-w-[160px]">
                            {app.vehicle_make_model}
                          </div>
                        )}
                      </td>

                      {/* Experience & Availability */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {app.availability || "Full-Time"}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Exp: {app.experience_years || "Not specified"}
                        </div>
                      </td>

                      {/* Date Applied */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-600">
                        {app.created_at
                          ? new Date(app.created_at).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleQuickStatusChange(
                              app,
                              e.target.value as DriverApplicationStatus
                            )
                          }
                          className={`px-2.5 py-1 rounded-full text-[11px] border cursor-pointer focus:outline-none ${badge.className}`}
                        >
                          <option value="new">New Applicant</option>
                          <option value="contacted">Contacted</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="hired">Hired</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pl-3 pr-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDetailsModal(app)}
                            className="h-8 px-2.5 text-xs font-semibold border-slate-200 hover:bg-slate-100"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1 text-slate-600" />
                            View / Notes
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteTarget(app)}
                            className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            title="Delete application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View & Manage Applicant Modal */}
      <Dialog
        open={Boolean(selectedApp)}
        onOpenChange={(open) => !open && setSelectedApp(null)}
      >
        <DialogContent className="max-w-lg rounded-2xl">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-extrabold text-slate-950 flex items-center justify-between pr-4">
                  <span>{selectedApp.full_name}</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-950 text-lime-400">
                    {selectedApp.vehicle_category}
                  </span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 text-xs pt-2">
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Phone / WhatsApp
                    </span>
                    <a
                      href={`tel:${selectedApp.phone}`}
                      className="font-bold text-slate-900 hover:underline mt-0.5 block"
                    >
                      {selectedApp.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${selectedApp.email}`}
                      className="font-bold text-slate-900 hover:underline mt-0.5 block truncate"
                    >
                      {selectedApp.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Base Area / Postcode
                    </span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {selectedApp.city_area}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Vehicle Make & Model
                    </span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {selectedApp.vehicle_make_model || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Experience
                    </span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {selectedApp.experience_years || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Preferred Availability
                    </span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {selectedApp.availability || "Full-Time"}
                    </span>
                  </div>
                </div>

                {selectedApp.message && (
                  <div className="p-3.5 rounded-xl bg-lime-50/60 border border-lime-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-lime-800 block">
                      Applicant Message
                    </span>
                    <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                      {selectedApp.message}
                    </p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Hiring Status
                  </label>
                  <select
                    value={draftStatus}
                    onChange={(e) =>
                      setDraftStatus(e.target.value as DriverApplicationStatus)
                    }
                    className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-semibold text-slate-900"
                  >
                    <option value="new">New Applicant</option>
                    <option value="contacted">Contacted</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Internal Team Notes
                  </label>
                  <textarea
                    rows={3}
                    value={draftNotes}
                    onChange={(e) => setDraftNotes(e.target.value)}
                    placeholder="Add call notes, document check status, agreed airport rates..."
                    className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  {getWhatsAppUrl(selectedApp) ? (
                    <a
                      href={getWhatsAppUrl(selectedApp)!}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Contact on WhatsApp
                    </a>
                  ) : (
                    <span />
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedApp(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={isSaving}
                      onClick={handleSaveModal}
                      className="bg-lime-500 hover:bg-lime-600 text-slate-950 font-bold"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Driver Application?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the application from{" "}
              <strong>{deleteTarget?.full_name}</strong> (
              {deleteTarget?.vehicle_category})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              {isDeleting ? "Deleting..." : "Delete Application"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

