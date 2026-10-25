"use client"

import { useState } from "react"
import { Supplier } from "@/types/supplier"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Mail,
  User,
  Lock,
  Phone,
  FileText,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Loader2,
  ExternalLink,
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
import { deleteSupplier, toggleSupplierActiveStatus } from "@/app/admin/suppliers/action"
import { SupplierJobsDialog } from "./supplier-jobs-dialog"

interface SupplierCardProps {
  supplier: Supplier
  onEdit: (supplier: Supplier) => void
  onDeleted: (id: string) => void
  onStatusChange?: (id: string, isActive: boolean) => void
}

export default function SupplierCard({
  supplier,
  onEdit,
  onDeleted,
  onStatusChange,
}: SupplierCardProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [jobsDialogOpen, setJobsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTogglingStatus, setIsTogglingStatus] = useState(false)

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      toast.success(`${fieldName} copied to clipboard!`)
      setTimeout(() => {
        setCopiedField(null)
      }, 2000)
    } catch {
      toast.error("Failed to copy to clipboard")
    }
  }

  const handleDelete = async () => {
    if (!supplier.id) return
    setIsDeleting(true)
    try {
      const res = await deleteSupplier(supplier.id)
      if (!res.success) {
        throw new Error(res.error || "Failed to delete supplier")
      }
      toast.success(`Supplier "${supplier.name}" deleted`)
      onDeleted(supplier.id)
      setDeleteDialogOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to delete supplier")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!supplier.id) return
    const newStatus = !(supplier.is_active ?? true)
    setIsTogglingStatus(true)
    try {
      const res = await toggleSupplierActiveStatus(supplier.id, newStatus)
      if (!res.success) {
        throw new Error(res.error || "Failed to change status")
      }
      toast.success(`Supplier marked as ${newStatus ? "Active" : "Inactive"}`)
      if (onStatusChange) {
        onStatusChange(supplier.id, newStatus)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status")
    } finally {
      setIsTogglingStatus(false)
    }
  }

  const isActive = supplier.is_active ?? true

  // Generate initials for avatar
  const initials = supplier.name
    ? supplier.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "SP"

  return (
    <>
      <div 
        onClick={() => setJobsDialogOpen(true)}
        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-400 transition-all flex flex-col justify-between overflow-hidden cursor-pointer group"
      >
        {/* Card Header */}
        <div className="p-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-black font-bold text-base shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                {initials}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-lg leading-tight truncate group-hover:text-purple-700 transition-colors">
                  {supplier.name}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
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
                  {isActive ? "Active Supplier" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(supplier)}
                className="h-8 w-8 p-0 text-gray-600 hover:text-black hover:bg-gray-100"
                title="Edit supplier"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Delete supplier"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Card Body - Supplier Details */}
        <div className="p-5 space-y-3 flex-1 text-sm">
          {/* Customer Support Email */}
          <div className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="w-4 h-4 text-lime-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium">Support Email</p>
                {supplier.support_email ? (
                  <a
                    href={`mailto:${supplier.support_email}`}
                    className="font-medium text-gray-900 hover:text-lime-700 hover:underline truncate block"
                    title={supplier.support_email}
                  >
                    {supplier.support_email}
                  </a>
                ) : (
                  <span className="text-gray-400 italic text-xs">Not provided</span>
                )}
              </div>
            </div>
            {supplier.support_email && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(supplier.support_email!, "Support Email")}
                className="h-7 w-7 p-0 text-gray-400 hover:text-black"
                title="Copy email"
              >
                {copiedField === "Support Email" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </Button>
            )}
          </div>

          {/* Credentials Section */}
          <div className="p-3 rounded-lg border border-gray-200 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-lime-600" /> Portal Credentials
              </span>
            </div>

            {/* Username */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-gray-500 flex items-center gap-1.5 shrink-0">
                <User className="w-3.5 h-3.5 text-gray-400" /> Username:
              </span>
              <div className="flex items-center gap-1.5 min-w-0">
                {supplier.username ? (
                  <>
                    <code className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-800 font-mono text-xs truncate max-w-[150px]">
                      {supplier.username}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(supplier.username!, "Username")}
                      className="text-gray-400 hover:text-black p-0.5"
                      title="Copy username"
                    >
                      {copiedField === "Username" ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400 italic text-xs">None</span>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-gray-500 flex items-center gap-1.5 shrink-0">
                <Lock className="w-3.5 h-3.5 text-gray-400" /> Password:
              </span>
              <div className="flex items-center gap-1.5 min-w-0">
                {supplier.password ? (
                  <>
                    <code className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-800 font-mono text-xs truncate max-w-[130px]">
                      {showPassword ? supplier.password : "••••••••"}
                    </code>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-black p-0.5"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(supplier.password!, "Password")}
                      className="text-gray-400 hover:text-black p-0.5"
                      title="Copy password"
                    >
                      {copiedField === "Password" ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400 italic text-xs">None</span>
                )}
              </div>
            </div>
          </div>

          {/* Optional Phone */}
          {supplier.phone && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{supplier.phone}</span>
            </div>
          )}

          {/* Optional Notes */}
          {supplier.notes && (
            <div className="p-2.5 rounded bg-amber-50/60 border border-amber-100 text-xs text-amber-900 flex items-start gap-2">
              <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="line-clamp-2 leading-relaxed text-gray-700">{supplier.notes}</p>
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
            className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold px-2.5 shadow-sm"
          >
            Jobs & Volume
          </Button>

          <div className="flex items-center gap-2">
            <span>
              {supplier.created_at
                ? `Added ${new Date(supplier.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}`
                : "Partner"}
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
              {isTogglingStatus ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : null}
              {isActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>
      </div>

      {/* Supplier Profile, Jobs & Volume Dialog */}
      <SupplierJobsDialog
        open={jobsDialogOpen}
        setOpen={setJobsDialogOpen}
        supplier={supplier}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{supplier.name}</strong>? This action cannot be
              undone and will remove their contact details and credentials.
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
                "Delete Supplier"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
