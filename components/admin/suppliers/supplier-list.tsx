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

interface SupplierListProps {
  suppliers: Supplier[]
  onEdit: (supplier: Supplier) => void
  onDeleted: (id: string) => void
  onStatusChange?: (id: string, isActive: boolean) => void
}

export function SupplierList({
  suppliers,
  onEdit,
  onDeleted,
  onStatusChange,
}: SupplierListProps) {
  const [selectedSupplierForJobs, setSelectedSupplierForJobs] = useState<Supplier | null>(null)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({})
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyToClipboard = async (e: React.MouseEvent, text: string, key: string, label: string) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      toast.success(`${label} copied to clipboard!`)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      toast.error("Failed to copy to clipboard")
    }
  }

  const togglePasswordVisibility = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setShowPasswordMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleDelete = async () => {
    if (!supplierToDelete?.id) return
    setIsDeleting(true)
    try {
      const res = await deleteSupplier(supplierToDelete.id)
      if (!res.success) {
        throw new Error(res.error || "Failed to delete supplier")
      }
      toast.success(`Supplier "${supplierToDelete.name}" deleted`)
      onDeleted(supplierToDelete.id)
      setSupplierToDelete(null)
    } catch (error: any) {
      toast.error(error.message || "Failed to delete supplier")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStatus = async (e: React.MouseEvent, supplier: Supplier) => {
    e.stopPropagation()
    if (!supplier.id) return
    const newStatus = !(supplier.is_active ?? true)
    setTogglingId(supplier.id)
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
      setTogglingId(null)
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Supplier Partner</th>
                <th className="py-3 px-3">Support Email</th>
                <th className="py-3 px-3">Portal Credentials</th>
                <th className="py-3 px-3">Contact #</th>
                <th className="py-3 px-3">Notes</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Volume</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suppliers.map((supplier) => {
                const isActive = supplier.is_active ?? true
                const isPasswordShown = Boolean(supplier.id && showPasswordMap[supplier.id])
                const initials = supplier.name
                  ? supplier.name
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()
                  : "SP"

                return (
                  <tr
                    key={supplier.id}
                    onClick={() => setSelectedSupplierForJobs(supplier)}
                    className="hover:bg-gray-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Supplier Partner */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors block truncate max-w-[160px]">
                            {supplier.name}
                          </span>
                          <span className="text-[10px] text-gray-400 block">
                            {supplier.created_at
                              ? `Added ${new Date(supplier.created_at).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}`
                              : "Partner"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Support Email */}
                    <td className="py-3 px-3">
                      {supplier.support_email ? (
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <Mail className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <a
                            href={`mailto:${supplier.support_email}`}
                            className="font-medium text-gray-800 hover:text-purple-700 hover:underline truncate max-w-[170px]"
                            title={supplier.support_email}
                          >
                            {supplier.support_email}
                          </a>
                          <button
                            type="button"
                            onClick={(e) =>
                              copyToClipboard(
                                e,
                                supplier.support_email!,
                                `email-${supplier.id}`,
                                "Support Email"
                              )
                            }
                            className="p-1 text-gray-400 hover:text-gray-700 rounded transition"
                            title="Copy email"
                          >
                            {copiedKey === `email-${supplier.id}` ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">—</span>
                      )}
                    </td>

                    {/* Portal Credentials */}
                    <td className="py-3 px-3">
                      <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                        {supplier.username ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-gray-400 flex items-center gap-0.5 font-medium">
                              <User className="w-2.5 h-2.5" /> User:
                            </span>
                            <code className="px-1 py-0.2 bg-gray-100 rounded text-gray-800 font-mono text-[10px] truncate max-w-[120px]">
                              {supplier.username}
                            </code>
                            <button
                              type="button"
                              onClick={(e) =>
                                copyToClipboard(
                                  e,
                                  supplier.username!,
                                  `user-${supplier.id}`,
                                  "Username"
                                )
                              }
                              className="text-gray-400 hover:text-black p-0.5"
                              title="Copy username"
                            >
                              {copiedKey === `user-${supplier.id}` ? (
                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-2.5 h-2.5" />
                              )}
                            </button>
                          </div>
                        ) : null}

                        {supplier.password ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-gray-400 flex items-center gap-0.5 font-medium">
                              <Lock className="w-2.5 h-2.5" /> Pass:
                            </span>
                            <code className="px-1 py-0.2 bg-gray-100 rounded text-gray-800 font-mono text-[10px] truncate max-w-[110px]">
                              {isPasswordShown ? supplier.password : "••••••••"}
                            </code>
                            <button
                              type="button"
                              onClick={(e) => togglePasswordVisibility(e, supplier.id!)}
                              className="text-gray-400 hover:text-black p-0.5"
                              title={isPasswordShown ? "Hide password" : "Show password"}
                            >
                              {isPasswordShown ? (
                                <EyeOff className="w-2.5 h-2.5" />
                              ) : (
                                <Eye className="w-2.5 h-2.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={(e) =>
                                copyToClipboard(
                                  e,
                                  supplier.password!,
                                  `pass-${supplier.id}`,
                                  "Password"
                                )
                              }
                              className="text-gray-400 hover:text-black p-0.5"
                              title="Copy password"
                            >
                              {copiedKey === `pass-${supplier.id}` ? (
                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-2.5 h-2.5" />
                              )}
                            </button>
                          </div>
                        ) : null}

                        {!supplier.username && !supplier.password && (
                          <span className="text-gray-400 italic text-[11px]">No credentials</span>
                        )}
                      </div>
                    </td>

                    {/* Contact Phone */}
                    <td className="py-3 px-3">
                      {supplier.phone ? (
                        <div className="flex items-center gap-1.5 text-gray-700" onClick={(e) => e.stopPropagation()}>
                          <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                          <a
                            href={`tel:${supplier.phone}`}
                            className="font-medium hover:text-purple-700 hover:underline"
                          >
                            {supplier.phone}
                          </a>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">—</span>
                      )}
                    </td>

                    {/* Notes Preview */}
                    <td className="py-3 px-3 max-w-[160px]">
                      {supplier.notes ? (
                        <span
                          className="line-clamp-2 text-gray-600 text-[11px] leading-relaxed block"
                          title={supplier.notes}
                        >
                          {supplier.notes}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => handleToggleStatus(e, supplier)}
                        disabled={togglingId === supplier.id}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold transition ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                        }`}
                        title="Click to toggle status"
                      >
                        {togglingId === supplier.id ? (
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

                    {/* Jobs & Volume Button */}
                    <td className="py-3 px-3 text-center">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedSupplierForJobs(supplier)
                        }}
                        className="h-6 text-[10px] bg-purple-600 hover:bg-purple-700 text-white font-bold px-2 shadow-2xs"
                      >
                        Jobs & Volume
                      </Button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(supplier)}
                          className="h-7 w-7 p-0 text-gray-600 hover:text-black hover:bg-gray-100"
                          title="Edit supplier"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSupplierToDelete(supplier)}
                          className="h-7 w-7 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          title="Delete supplier"
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

      {/* Supplier Profile, Jobs & Volume Dialog */}
      <SupplierJobsDialog
        open={Boolean(selectedSupplierForJobs)}
        setOpen={(open) => !open && setSelectedSupplierForJobs(null)}
        supplier={selectedSupplierForJobs}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(supplierToDelete)}
        onOpenChange={(open) => !open && setSupplierToDelete(null)}
      >
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{supplierToDelete?.name}</strong>? This action cannot be
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
