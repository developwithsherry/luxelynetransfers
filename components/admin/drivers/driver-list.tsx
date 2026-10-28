"use client"

import { useState } from "react"
import { Driver } from "@/types/driver"
import { Button } from "@/components/ui/button"
import {
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
  AlertTriangle,
  Clock,
  MessageSquare,
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

interface DriverListProps {
  drivers: Driver[]
  onEdit: (driver: Driver) => void
  onDeleted: (id: string) => void
  onStatusChange?: (id: string, isActive: boolean) => void
}

export function DriverList({
  drivers,
  onEdit,
  onDeleted,
  onStatusChange,
}: DriverListProps) {
  const [selectedDriverForJobs, setSelectedDriverForJobs] = useState<Driver | null>(null)
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null)

  const copyPhone = async (e: React.MouseEvent, phone: string, id: string) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(phone)
      setCopiedPhoneId(id)
      toast.success("Phone number copied to clipboard!")
      setTimeout(() => setCopiedPhoneId(null), 2000)
    } catch {
      toast.error("Failed to copy phone number")
    }
  }

  const handleDelete = async () => {
    if (!driverToDelete?.id) return
    setIsDeleting(true)
    try {
      const res = await deleteDriver(driverToDelete.id)
      if (!res.success) {
        throw new Error(res.error || "Failed to delete driver")
      }
      toast.success(`Driver "${driverToDelete.name}" deleted`)
      onDeleted(driverToDelete.id)
      setDriverToDelete(null)
    } catch (error: any) {
      toast.error(error.message || "Failed to delete driver")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStatus = async (e: React.MouseEvent, driver: Driver) => {
    e.stopPropagation()
    if (!driver.id) return
    const newStatus = !(driver.is_active ?? true)
    setTogglingId(driver.id)
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
      setTogglingId(null)
    }
  }

  const renderDocIndicator = (
    labelShort: string,
    labelFull: string,
    url?: string | null,
    expiryDate?: string | null
  ) => {
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
        formattedDate = d.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "2-digit",
        })
      }
    }

    if (!url) {
      return (
        <span
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-400 border border-gray-200"
          title={`${labelFull}: Not uploaded`}
        >
          {labelShort}
        </span>
      )
    }

    if (isExpired) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 transition shadow-2xs"
          title={`${labelFull} EXPIRED on ${formattedDate}. Click to view file.`}
        >
          <AlertTriangle className="w-2.5 h-2.5 text-rose-600 shrink-0" />
          <span>{labelShort}</span>
          <span className="text-[9px] font-extrabold text-rose-700">!</span>
        </a>
      )
    }

    if (isExpiringSoon) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition"
          title={`${labelFull} expires soon on ${formattedDate}. Click to view.`}
        >
          <Clock className="w-2.5 h-2.5 text-amber-600 shrink-0" />
          <span>{labelShort}</span>
        </a>
      )
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-lime-50 text-lime-800 border border-lime-300 hover:bg-lime-100 transition"
        title={formattedDate ? `${labelFull} valid until ${formattedDate}` : `${labelFull}: Uploaded`}
      >
        <FileCheck className="w-2.5 h-2.5 text-lime-700 shrink-0" />
        <span>{labelShort}</span>
      </a>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Operates</th>
                <th className="py-3 px-3">Vehicle</th>
                <th className="py-3 px-3">Compliance Docs</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Earnings</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {drivers.map((driver) => {
                const isActive = driver.is_active ?? true
                const initials = driver.name
                  ? driver.name
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()
                  : "DR"

                const cleanPhone = driver.phone ? driver.phone.replace(/[^0-9]/g, "") : ""
                const formattedPhone = cleanPhone.startsWith("0") ? `44${cleanPhone.slice(1)}` : cleanPhone
                const whatsappUrl = formattedPhone ? `https://wa.me/${formattedPhone}` : null

                const hasExpired = Boolean(
                  (driver.driving_license_expiry && new Date(driver.driving_license_expiry).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) ||
                  (driver.phv_license_expiry && new Date(driver.phv_license_expiry).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) ||
                  (driver.log_book_expiry && new Date(driver.log_book_expiry).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) ||
                  (driver.insurance_expiry && new Date(driver.insurance_expiry).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) ||
                  (driver.mot_expiry && new Date(driver.mot_expiry).setHours(0,0,0,0) < new Date().setHours(0,0,0,0))
                )

                return (
                  <tr
                    key={driver.id}
                    onClick={() => setSelectedDriverForJobs(driver)}
                    className="hover:bg-gray-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Driver Profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {driver.photo_url ? (
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                            <img
                              src={driver.photo_url}
                              alt={driver.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-lime-400 to-lime-600 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900 group-hover:text-lime-700 transition-colors truncate">
                              {driver.name}
                            </span>
                            {hasExpired && (
                              <span
                                className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"
                                title="Driver has expired documents"
                              />
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 block">
                            {driver.created_at
                              ? `Joined ${new Date(driver.created_at).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}`
                              : "Driver"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact & WhatsApp */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`tel:${driver.phone}`}
                          className="font-medium text-gray-800 hover:text-lime-700 hover:underline"
                        >
                          {driver.phone}
                        </a>
                        {whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded transition"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={(e) => copyPhone(e, driver.phone, driver.id!)}
                          className="p-1 text-gray-400 hover:text-gray-700 rounded transition"
                          title="Copy phone"
                        >
                          {copiedPhoneId === driver.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Operating Area */}
                    <td className="py-3 px-3">
                      {driver.area_operates ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 max-w-[150px] truncate" title={driver.area_operates}>
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">{driver.area_operates}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">—</span>
                      )}
                    </td>

                    {/* Vehicle */}
                    <td className="py-3 px-3">
                      {driver.vehicle_model || driver.vehicle_reg ? (
                        <div className="space-y-0.5">
                          {driver.vehicle_model && (
                            <span className="text-gray-800 font-medium block truncate max-w-[140px]">
                              {driver.vehicle_model}
                            </span>
                          )}
                          {driver.vehicle_reg && (
                            <span className="inline-block px-1.5 py-0.2 rounded bg-black text-white font-mono text-[9px] uppercase font-bold tracking-wider">
                              {driver.vehicle_reg}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">No vehicle</span>
                      )}
                    </td>

                    {/* Compliance Docs Badges */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {renderDocIndicator("License", "Driving License", driver.driving_license_url, driver.driving_license_expiry)}
                        {renderDocIndicator("PHV", "PHV License", driver.phv_license_url, driver.phv_license_expiry)}
                        {renderDocIndicator("V5C", "Log Book", driver.log_book_url, driver.log_book_expiry)}
                        {renderDocIndicator("Ins", "Insurance", driver.insurance_url, driver.insurance_expiry)}
                        {renderDocIndicator("MOT", "MOT Certificate", driver.mot_url, driver.mot_expiry)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => handleToggleStatus(e, driver)}
                        disabled={togglingId === driver.id}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold transition ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                        }`}
                        title="Click to toggle status"
                      >
                        {togglingId === driver.id ? (
                          <Loader2 className="w-2.5 h-2.5 animate-spin mr-1" />
                        ) : (
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              isActive ? "bg-emerald-500" : "bg-gray-400"
                            }`}
                          />
                        )}
                        {isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Jobs & Earnings Button */}
                    <td className="py-3 px-3 text-center">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedDriverForJobs(driver)
                        }}
                        className="h-6 text-[10px] bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold px-2 shadow-2xs"
                      >
                        Jobs & Payouts
                      </Button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(driver)}
                          className="h-7 w-7 p-0 text-gray-600 hover:text-black hover:bg-gray-100"
                          title="Edit driver"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDriverToDelete(driver)}
                          className="h-7 w-7 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          title="Delete driver"
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
      </div>

      {/* Driver Profile, Jobs & Earnings Dialog */}
      <DriverJobsDialog
        open={Boolean(selectedDriverForJobs)}
        setOpen={(open) => !open && setSelectedDriverForJobs(null)}
        driver={selectedDriverForJobs}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(driverToDelete)}
        onOpenChange={(open) => !open && setDriverToDelete(null)}
      >
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Driver</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{driverToDelete?.name}</strong>? This action cannot be
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
