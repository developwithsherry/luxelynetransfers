"use client"

import { useState } from "react"
import { Driver } from "@/types/driver"
import { Button } from "@/components/ui/button"
import {
  UserCheck,
  Phone,
  MapPin,
  Car,
  FileText,
  Shield,
  Pencil,
  Trash2,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  FileCheck,
  Image as ImageIcon,
  AlertTriangle,
  Clock,
} from "lucide-react"
import { toast } from "sonner"
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
import { deleteDriver, toggleDriverActiveStatus } from "@/app/admin/drivers/action"
import { DriverJobsDialog } from "./driver-jobs-dialog"

interface DriverCardProps {
  driver: Driver
  onEdit: (driver: Driver) => void
  onDeleted: (id: string) => void
  onStatusChange?: (id: string, isActive: boolean) => void
}

export default function DriverCard({
  driver,
  onEdit,
  onDeleted,
  onStatusChange,
}: DriverCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [jobsDialogOpen, setJobsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTogglingStatus, setIsTogglingStatus] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(driver.phone)
      setCopiedPhone(true)
      toast.success("Phone number copied to clipboard!")
      setTimeout(() => setCopiedPhone(false), 2000)
    } catch {
      toast.error("Failed to copy phone number")
    }
  }

  const handleDelete = async () => {
    if (!driver.id) return
    setIsDeleting(true)
    try {
      const res = await deleteDriver(driver.id)
      if (!res.success) {
        throw new Error(res.error || "Failed to delete driver")
      }
      toast.success(`Driver "${driver.name}" deleted`)
      onDeleted(driver.id)
      setDeleteDialogOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to delete driver")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!driver.id) return
    const newStatus = !(driver.is_active ?? true)
    setIsTogglingStatus(true)
    try {
      const res = await toggleDriverActiveStatus(driver.id, newStatus)
      if (!res.success) {
        throw new Error(res.error || "Failed to change status")
      }
      toast.success(`Driver marked as ${newStatus ? "Active" : "Inactive"}`)
      if (onStatusChange) {
        onStatusChange(driver.id, newStatus)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status")
    } finally {
      setIsTogglingStatus(false)
    }
  }

  const isActive = driver.is_active ?? true

  const initials = driver.name
    ? driver.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "DR"

  const vehicleImages = Array.isArray(driver.vehicle_images) ? driver.vehicle_images : []

  // Generate WhatsApp direct chat link
  const cleanPhone = driver.phone ? driver.phone.replace(/[^0-9]/g, "") : ""
  const formattedPhone = cleanPhone.startsWith("0") ? `44${cleanPhone.slice(1)}` : cleanPhone
  const whatsappUrl = formattedPhone ? `https://wa.me/${formattedPhone}` : null

  // Check if driver has any expired documents
  const hasExpiredDoc = Boolean(
    (driver.driving_license_expiry && new Date(driver.driving_license_expiry).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) ||
    (driver.phv_license_expiry && new Date(driver.phv_license_expiry).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) ||
    (driver.log_book_expiry && new Date(driver.log_book_expiry).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) ||
    (driver.insurance_expiry && new Date(driver.insurance_expiry).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) ||
    (driver.mot_expiry && new Date(driver.mot_expiry).setHours(0,0,0,0) < new Date().setHours(0,0,0,0))
  )

  // Document helper with expiration checks
  const renderDocBadge = (title: string, url?: string | null, expiryDate?: string | null) => {
    let isExpired = false
    let isExpiringSoon = false
    let formattedDate = ""

    if (expiryDate) {
      const parts = expiryDate.split("-").map(Number)
      let d: Date
      if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        d = new Date(parts[0], parts[1] - 1, parts[2])
      } else {
        d = new Date(expiryDate)
      }

      if (!isNaN(d.getTime())) {
        d.setHours(0, 0, 0, 0)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const diffDays = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        isExpired = diffDays < 0
        isExpiringSoon = diffDays >= 0 && diffDays <= 30
        formattedDate = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })
      }
    }

    if (!url) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-gray-100 text-gray-400 border border-gray-200">
          <FileText className="w-3 h-3" />
          {title}: Missing
        </span>
      )
    }

    if (isExpired) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-300 font-bold transition-colors shadow-2xs"
          title={`${title} EXPIRED on ${formattedDate}. Click to view.`}
        >
          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
          <span>{title}: Expired ({formattedDate})</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
        </a>
      )
    }

    if (isExpiringSoon) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 font-semibold transition-colors shadow-2xs"
          title={`${title} expires soon on ${formattedDate}. Click to view.`}
        >
          <Clock className="w-3 h-3 text-amber-600 shrink-0" />
          <span>{title}: Exp {formattedDate}</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
        </a>
      )
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-lime-50 text-lime-800 hover:bg-lime-100 border border-lime-300 font-medium transition-colors"
        title={formattedDate ? `${title} valid until ${formattedDate}` : `View ${title}`}
      >
        <FileCheck className="w-3 h-3 text-lime-700" />
        <span>{title}{formattedDate ? `: Exp ${formattedDate}` : ""}</span>
        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
      </a>
    )
  }

  return (
    <>
      <div 
        onClick={() => setJobsDialogOpen(true)}
        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-lime-400 transition-all flex flex-col justify-between overflow-hidden cursor-pointer group"
      >
        {/* Card Header */}
        <div className="p-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {driver.photo_url ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <img
                    src={driver.photo_url}
                    alt={driver.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-black font-bold text-base shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-lg leading-tight truncate group-hover:text-lime-700 transition-colors">
                  {driver.name}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        isActive ? "bg-emerald-500" : "bg-gray-400"
                      }`}
                    />
                    {isActive ? "Active Driver" : "Inactive"}
                  </span>
                  {hasExpiredDoc && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                      <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                      Doc Expired
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(driver)}
                className="h-8 w-8 p-0 text-gray-600 hover:text-black hover:bg-gray-100"
                title="Edit driver"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Delete driver"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3.5 flex-1 text-sm">
          {/* Phone */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2 min-w-0">
              <Phone className="w-4 h-4 text-lime-600 shrink-0" />
              <a
                href={`tel:${driver.phone}`}
                className="font-medium text-gray-900 hover:text-lime-700 hover:underline truncate"
              >
                {driver.phone}
              </a>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {/* WhatsApp direct chat link */}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded-md transition-all flex items-center justify-center border border-transparent hover:border-emerald-600"
                  title="Chat with driver on WhatsApp"
                  aria-label="Chat with driver on WhatsApp"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <title>WhatsApp</title>
                    <path d="M16.006 3C9.373 3 4 8.373 4 15.006c0 2.642.746 5.068 2.04 7.138L4 29l7.06-2.007A11.933 11.933 0 0 0 16.006 27C22.64 27 28 21.627 28 15.006 28 8.373 22.64 3 16.006 3Zm0 21.93c-1.96 0-3.865-.53-5.527-1.54l-.397-.24-4.196 1.193 1.206-4.093-.26-.42A9.939 9.939 0 0 1 6.07 15c0-5.485 4.45-9.93 9.936-9.93 5.486 0 9.937 4.445 9.937 9.93 0 5.486-4.451 9.93-9.937 9.93Zm5.453-7.36c-.297-.149-1.76-.867-2.033-.964-.273-.099-.472-.149-.67.15-.198.297-.768.963-.941 1.16-.173.198-.347.223-.644.074-.297-.148-1.255-.462-2.39-1.474-.883-.788-1.48-1.76-1.654-2.057-.173-.297-.018-.457.13-.605.134-.133.298-.347.446-.52.149-.174.198-.297.298-.495.099-.198.05-.371-.025-.52-.075-.149-.67-1.61-.918-2.204-.242-.579-.487-.5-.67-.51l-.57-.01c-.198 0-.52.074-.792.371-.273.297-1.04 1.015-1.04 2.476s1.065 2.87 1.213 3.068c.149.198 2.1 3.205 5.08 4.49.71.306 1.262.488 1.694.623.712.228 1.36.195 1.871.118.571-.085 1.76-.718 2.009-1.411.248-.694.248-1.288.174-1.412-.074-.124-.272-.198-.57-.347Z" />
                  </svg>
                </a>
              )}
              {/* Copy phone number */}
              <button
                type="button"
                onClick={copyPhone}
                className="text-gray-400 hover:text-black p-1.5 rounded-md hover:bg-gray-200/50 transition-colors"
                title="Copy phone number"
                aria-label="Copy phone number"
              >
                {copiedPhone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Area Operates */}
          {driver.area_operates && (
            <div className="flex items-start gap-2 text-xs text-gray-700">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-500">Operates: </span>
                <span>{driver.area_operates}</span>
              </div>
            </div>
          )}

          {/* Vehicle Info */}
          {(driver.vehicle_model || driver.vehicle_reg || vehicleImages.length > 0) && (
            <div className="p-3 rounded-lg border border-gray-200 bg-white space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                <span className="flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-lime-600" />
                  {driver.vehicle_model || "Registered Vehicle"}
                </span>
                {driver.vehicle_reg && (
                  <span className="px-2 py-0.5 rounded bg-black text-white font-mono text-[10px] uppercase font-bold tracking-wider">
                    {driver.vehicle_reg}
                  </span>
                )}
              </div>

              {/* Vehicle Photos Gallery */}
              {vehicleImages.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                  {vehicleImages.map((img, i) => (
                    <a
                      key={i}
                      href={img}
                      target="_blank"
                      rel="noreferrer"
                      className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-200 hover:opacity-85 transition-opacity"
                      title={`View vehicle image ${i + 1}`}
                    >
                      <img src={img} alt="Vehicle" className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Document Compliance Badges */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Documents & Compliance
            </p>
            <div className="flex flex-wrap gap-1.5">
              {renderDocBadge("Driving License", driver.driving_license_url, driver.driving_license_expiry)}
              {renderDocBadge("PHV License", driver.phv_license_url, driver.phv_license_expiry)}
              {renderDocBadge("Log Book", driver.log_book_url, driver.log_book_expiry)}
              {renderDocBadge("Insurance", driver.insurance_url, driver.insurance_expiry)}
              {renderDocBadge("MOT", driver.mot_url, driver.mot_expiry)}
            </div>
          </div>

          {/* Notes */}
          {driver.notes && (
            <div className="p-2.5 rounded bg-amber-50/60 border border-amber-100 text-xs text-gray-700 flex items-start gap-2">
              <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="line-clamp-2 leading-relaxed">{driver.notes}</p>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setJobsDialogOpen(true)
            }}
            className="h-7 text-xs bg-lime-400 hover:bg-lime-500 text-slate-950 font-semibold px-2.5 shadow-sm"
          >
            Jobs & Earnings
          </Button>

          <div className="flex items-center gap-2">
            <span>
              {driver.created_at
                ? `Joined ${new Date(driver.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}`
                : "Driver"}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleToggleStatus()
              }}
              disabled={isTogglingStatus}
              className="h-7 text-xs text-gray-600 hover:text-black hover:bg-gray-200/60 px-2"
            >
              {isTogglingStatus ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
              {isActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>
      </div>

      {/* Driver Profile, Jobs & Earnings Dialog */}
      <DriverJobsDialog
        open={jobsDialogOpen}
        setOpen={setJobsDialogOpen}
        driver={driver}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Driver</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{driver.name}</strong>? This action cannot be
              undone and will remove their profile, contact information, and uploaded licensing documents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Driver"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
