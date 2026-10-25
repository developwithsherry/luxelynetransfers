"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Eye, EyeOff, Loader2, Building2, Mail, Lock, User, Phone, FileText } from "lucide-react"
import type { Supplier } from "@/types/supplier"
import { saveSupplier } from "@/app/admin/suppliers/action"
import { toast } from "sonner"

interface SupplierDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  supplier?: Supplier | null
  onSuccess: (saved: Supplier) => void
}

interface FormValues {
  name: string
  support_email: string
  username: string
  password: string
  phone: string
  notes: string
  is_active: boolean
}

export default function SupplierDialog({
  open,
  setOpen,
  supplier,
  onSuccess,
}: SupplierDialogProps) {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isEditing = Boolean(supplier?.id)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      support_email: "",
      username: "",
      password: "",
      phone: "",
      notes: "",
      is_active: true,
    },
  })

  const isActive = watch("is_active")

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name || "",
        support_email: supplier.support_email || "",
        username: supplier.username || "",
        password: supplier.password || "",
        phone: supplier.phone || "",
        notes: supplier.notes || "",
        is_active: supplier.is_active ?? true,
      })
    } else {
      reset({
        name: "",
        support_email: "",
        username: "",
        password: "",
        phone: "",
        notes: "",
        is_active: true,
      })
    }
    setShowPassword(false)
  }, [supplier, reset, open])

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      const res = await saveSupplier({
        ...(supplier?.id ? { id: supplier.id } : {}),
        name: values.name,
        support_email: values.support_email || null,
        username: values.username || null,
        password: values.password || null,
        phone: values.phone || null,
        notes: values.notes || null,
        is_active: values.is_active,
      })

      if (!res.success || res.error) {
        throw new Error(res.error || "Failed to save supplier")
      }

      toast.success(isEditing ? "Supplier updated successfully" : "Supplier added successfully")
      if (res.data) {
        onSuccess(res.data)
      }
      setOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to save supplier")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-lime-100 text-lime-800 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                {isEditing ? "Edit Supplier" : "Add New Supplier"}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                {isEditing
                  ? "Update supplier details and portal credentials."
                  : "Save a new supplier with optional contact email and portal logins."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Supplier Name (Required) */}
          <div className="space-y-1.5">
            <Label htmlFor="supplier-name" className="text-sm font-semibold flex items-center gap-1.5">
              Supplier Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="supplier-name"
                type="text"
                placeholder="e.g. Heathrow Chauffeur Logistics Ltd"
                className="pl-9"
                {...register("name", {
                  required: "Supplier name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                })}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Customer Support Email (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="supplier-email" className="text-sm font-semibold flex items-center gap-1.5">
              Customer Support Email <span className="text-xs text-gray-500 font-normal">(Optional)</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="supplier-email"
                type="email"
                placeholder="e.g. support@supplier.co.uk"
                className="pl-9"
                {...register("support_email")}
              />
            </div>
          </div>

          {/* Credentials Section */}
          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <Lock className="w-3.5 h-3.5 text-lime-600" />
              <span>Supplier Portal Credentials (Optional)</span>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <Label htmlFor="supplier-username" className="text-xs font-medium text-gray-700">
                Portal Username / Account ID
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="supplier-username"
                  type="text"
                  placeholder="e.g. luxelyne_admin"
                  className="pl-9 bg-white"
                  {...register("username")}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="supplier-password" className="text-xs font-medium text-gray-700">
                Portal Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="supplier-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter or paste supplier password"
                  className="pl-9 pr-10 bg-white"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Contact Phone (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="supplier-phone" className="text-sm font-semibold flex items-center gap-1.5">
              Dispatch / Support Phone <span className="text-xs text-gray-500 font-normal">(Optional)</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="supplier-phone"
                type="tel"
                placeholder="e.g. +44 20 7946 0991"
                className="pl-9"
                {...register("phone")}
              />
            </div>
          </div>

          {/* Notes (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="supplier-notes" className="text-sm font-semibold flex items-center gap-1.5">
              Internal Notes / Portal URL <span className="text-xs text-gray-500 font-normal">(Optional)</span>
            </Label>
            <div className="relative">
              <Textarea
                id="supplier-notes"
                rows={3}
                placeholder="e.g. Portal URL: https://partner.supplier.com. Specializes in Mercedes V-Class transfers."
                {...register("notes")}
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-900">Active Partnership</p>
              <p className="text-xs text-gray-500">
                Mark whether you are currently actively working with this supplier
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-lime-400 hover:bg-lime-500 text-black font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Add Supplier"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
