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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  UserCheck,
  Phone,
  MapPin,
  Car,
  FileText,
  Shield,
  Loader2,
  FileCheck,
  User,
  Calendar,
} from "lucide-react"
import type { Driver } from "@/types/driver"
import { saveDriver } from "@/app/admin/drivers/action"
import { DriverFileDropzone, VehicleImagesDropzone } from "./driver-file-dropzone"
import { toast } from "sonner"

interface DriverDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  driver?: Driver | null
  onSuccess: (saved: Driver) => void
}

interface FormValues {
  name: string
  phone: string
  area_operates: string
  vehicle_model: string
  vehicle_reg: string
  notes: string
  is_active: boolean
}

export default function DriverDialog({
  open,
  setOpen,
  driver,
  onSuccess,
}: DriverDialogProps) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // Uploaded files state
  const [photoUrl, setPhotoUrl] = useState<string>("")
  const [drivingLicenseUrl, setDrivingLicenseUrl] = useState<string>("")
  const [phvLicenseUrl, setPhvLicenseUrl] = useState<string>("")
  const [logBookUrl, setLogBookUrl] = useState<string>("")
  const [insuranceUrl, setInsuranceUrl] = useState<string>("")
  const [motUrl, setMotUrl] = useState<string>("")
  const [vehicleImages, setVehicleImages] = useState<string[]>([])

  // Document expiry dates state (optional)
  const [drivingLicenseExpiry, setDrivingLicenseExpiry] = useState<string>("")
  const [phvLicenseExpiry, setPhvLicenseExpiry] = useState<string>("")
  const [logBookExpiry, setLogBookExpiry] = useState<string>("")
  const [insuranceExpiry, setInsuranceExpiry] = useState<string>("")
  const [motExpiry, setMotExpiry] = useState<string>("")

  const isEditing = Boolean(driver?.id)

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
      phone: "",
      area_operates: "",
      vehicle_model: "",
      vehicle_reg: "",
      notes: "",
      is_active: true,
    },
  })

  const isActive = watch("is_active")

  useEffect(() => {
    if (driver) {
      reset({
        name: driver.name || "",
        phone: driver.phone || "",
        area_operates: driver.area_operates || "",
        vehicle_model: driver.vehicle_model || "",
        vehicle_reg: driver.vehicle_reg || "",
        notes: driver.notes || "",
        is_active: driver.is_active ?? true,
      })
      setPhotoUrl(driver.photo_url || "")
      setDrivingLicenseUrl(driver.driving_license_url || "")
      setDrivingLicenseExpiry(driver.driving_license_expiry || "")
      setPhvLicenseUrl(driver.phv_license_url || "")
      setPhvLicenseExpiry(driver.phv_license_expiry || "")
      setLogBookUrl(driver.log_book_url || "")
      setLogBookExpiry(driver.log_book_expiry || "")
      setInsuranceUrl(driver.insurance_url || "")
      setInsuranceExpiry(driver.insurance_expiry || "")
      setMotUrl(driver.mot_url || "")
      setMotExpiry(driver.mot_expiry || "")
      setVehicleImages(Array.isArray(driver.vehicle_images) ? driver.vehicle_images : [])
    } else {
      reset({
        name: "",
        phone: "",
        area_operates: "",
        vehicle_model: "",
        vehicle_reg: "",
        notes: "",
        is_active: true,
      })
      setPhotoUrl("")
      setDrivingLicenseUrl("")
      setDrivingLicenseExpiry("")
      setPhvLicenseUrl("")
      setPhvLicenseExpiry("")
      setLogBookUrl("")
      setLogBookExpiry("")
      setInsuranceUrl("")
      setInsuranceExpiry("")
      setMotUrl("")
      setMotExpiry("")
      setVehicleImages([])
    }
    setActiveTab("profile")
  }, [driver, reset, open])

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      const res = await saveDriver({
        ...(driver?.id ? { id: driver.id } : {}),
        name: values.name,
        phone: values.phone,
        area_operates: values.area_operates || null,
        photo_url: photoUrl || null,
        driving_license_url: drivingLicenseUrl || null,
        driving_license_expiry: drivingLicenseExpiry || null,
        phv_license_url: phvLicenseUrl || null,
        phv_license_expiry: phvLicenseExpiry || null,
        vehicle_model: values.vehicle_model || null,
        vehicle_reg: values.vehicle_reg || null,
        vehicle_images: vehicleImages,
        log_book_url: logBookUrl || null,
        log_book_expiry: logBookExpiry || null,
        insurance_url: insuranceUrl || null,
        insurance_expiry: insuranceExpiry || null,
        mot_url: motUrl || null,
        mot_expiry: motExpiry || null,
        notes: values.notes || null,
        is_active: values.is_active,
      })

      if (!res.success || res.error) {
        throw new Error(res.error || "Failed to save driver")
      }

      toast.success(isEditing ? "Driver updated successfully" : "Driver added successfully")
      if (res.data) {
        onSuccess(res.data)
      }
      setOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to save driver")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-lime-100 text-lime-800 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                {isEditing ? "Edit Driver Profile" : "Register New Driver"}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-gray-500">
                {isEditing
                  ? "Update driver documents, licensing status, and vehicle compliance."
                  : "Add driver details, contact numbers, licenses, and vehicle documentation."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="profile" className="text-xs sm:text-sm font-medium">
                Profile & Licenses
              </TabsTrigger>
              <TabsTrigger value="vehicle" className="text-xs sm:text-sm font-medium">
                Vehicle & Documents
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-xs sm:text-sm font-medium">
                Notes & Status
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Profile & Driver Licenses */}
            <TabsContent value="profile" className="space-y-4 pt-3">
              {/* Name & Phone (Required) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="driver-name" className="text-xs font-semibold flex items-center gap-1">
                    Driver Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="driver-name"
                      type="text"
                      placeholder="e.g. Tariq Mahmood"
                      className="pl-9"
                      {...register("name", {
                        required: "Driver name is required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" },
                      })}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="driver-phone" className="text-xs font-semibold flex items-center gap-1">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="driver-phone"
                      type="tel"
                      placeholder="e.g. +44 7700 900123"
                      className="pl-9"
                      {...register("phone", {
                        required: "Phone number is required",
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 font-medium">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Area Operates */}
              <div className="space-y-1.5">
                <Label htmlFor="area-operates" className="text-xs font-semibold flex items-center gap-1">
                  Area Operates <span className="text-[11px] text-gray-400 font-normal">(Optional)</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="area-operates"
                    type="text"
                    placeholder="e.g. Heathrow Airport, Central London, Surrey, Slough"
                    className="pl-9"
                    {...register("area_operates")}
                  />
                </div>
              </div>

              {/* Driver Photo Upload */}
              <DriverFileDropzone
                label="Driver Photo"
                sublabel="JPEG, PNG or WEBP profile picture"
                value={photoUrl}
                onChange={setPhotoUrl}
                folder="photos"
                acceptPdf={false}
              />

              {/* Driver Licenses */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Driver Licenses & Expiry Dates
                  </p>
                  <span className="text-[11px] text-gray-400">Expiry dates are optional</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Driving License */}
                  <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                    <DriverFileDropzone
                      label="Driving License"
                      sublabel="PDF, JPEG or PNG"
                      value={drivingLicenseUrl}
                      onChange={setDrivingLicenseUrl}
                      folder="licenses"
                    />
                    <div className="pt-2 border-t border-gray-200/80">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <Label htmlFor="driving-license-expiry" className="text-[11px] font-semibold text-gray-700 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-lime-600" />
                          License Expiry Date
                        </Label>
                        {drivingLicenseExpiry && (
                          <button
                            type="button"
                            onClick={() => setDrivingLicenseExpiry("")}
                            className="text-[10px] text-gray-400 hover:text-red-500 font-medium"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <Input
                        id="driving-license-expiry"
                        type="date"
                        value={drivingLicenseExpiry}
                        onChange={(e) => setDrivingLicenseExpiry(e.target.value)}
                        className="h-8 text-xs bg-white border-gray-200 focus:border-lime-500"
                      />
                    </div>
                  </div>

                  {/* PHV License */}
                  <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                    <DriverFileDropzone
                      label="PHV License (PCO)"
                      sublabel="PDF, JPEG or PNG"
                      value={phvLicenseUrl}
                      onChange={setPhvLicenseUrl}
                      folder="phv"
                    />
                    <div className="pt-2 border-t border-gray-200/80">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <Label htmlFor="phv-license-expiry" className="text-[11px] font-semibold text-gray-700 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-lime-600" />
                          PHV Expiry Date
                        </Label>
                        {phvLicenseExpiry && (
                          <button
                            type="button"
                            onClick={() => setPhvLicenseExpiry("")}
                            className="text-[10px] text-gray-400 hover:text-red-500 font-medium"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <Input
                        id="phv-license-expiry"
                        type="date"
                        value={phvLicenseExpiry}
                        onChange={(e) => setPhvLicenseExpiry(e.target.value)}
                        className="h-8 text-xs bg-white border-gray-200 focus:border-lime-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: Vehicle & Compliance Documents */}
            <TabsContent value="vehicle" className="space-y-4 pt-3">
              {/* Vehicle Model & Registration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="vehicle-model" className="text-xs font-semibold">
                    Vehicle Make & Model <span className="text-[11px] text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <Car className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="vehicle-model"
                      type="text"
                      placeholder="e.g. Mercedes-Benz E-Class"
                      className="pl-9"
                      {...register("vehicle_model")}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vehicle-reg" className="text-xs font-semibold">
                    Vehicle Registration / Plate # <span className="text-[11px] text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="vehicle-reg"
                      type="text"
                      placeholder="e.g. LX22 ABC"
                      className="pl-9 uppercase"
                      {...register("vehicle_reg")}
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Images Dropzone (Max 5) */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <VehicleImagesDropzone
                  images={vehicleImages}
                  onChange={setVehicleImages}
                  maxImages={5}
                />
              </div>

              {/* Log Book, Insurance, MOT */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Compliance & Vehicle Certificates
                  </p>
                  <span className="text-[11px] text-gray-400">Optional expiry dates</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Log Book */}
                  <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2 flex flex-col justify-between">
                    <DriverFileDropzone
                      label="Log Book (V5C)"
                      sublabel="PDF, JPEG or PNG"
                      value={logBookUrl}
                      onChange={setLogBookUrl}
                      folder="logbooks"
                    />
                    <div className="pt-2 border-t border-gray-200/80">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <Label htmlFor="log-book-expiry" className="text-[10px] font-semibold text-gray-700 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-lime-600" />
                          Expiry Date
                        </Label>
                        {logBookExpiry && (
                          <button
                            type="button"
                            onClick={() => setLogBookExpiry("")}
                            className="text-[9px] text-gray-400 hover:text-red-500 font-medium"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <Input
                        id="log-book-expiry"
                        type="date"
                        value={logBookExpiry}
                        onChange={(e) => setLogBookExpiry(e.target.value)}
                        className="h-8 text-xs bg-white border-gray-200 focus:border-lime-500"
                      />
                    </div>
                  </div>

                  {/* Insurance */}
                  <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2 flex flex-col justify-between">
                    <DriverFileDropzone
                      label="Insurance Certificate"
                      sublabel="PDF, JPEG or PNG"
                      value={insuranceUrl}
                      onChange={setInsuranceUrl}
                      folder="insurance"
                    />
                    <div className="pt-2 border-t border-gray-200/80">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <Label htmlFor="insurance-expiry" className="text-[10px] font-semibold text-gray-700 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-lime-600" />
                          Insurance Expiry
                        </Label>
                        {insuranceExpiry && (
                          <button
                            type="button"
                            onClick={() => setInsuranceExpiry("")}
                            className="text-[9px] text-gray-400 hover:text-red-500 font-medium"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <Input
                        id="insurance-expiry"
                        type="date"
                        value={insuranceExpiry}
                        onChange={(e) => setInsuranceExpiry(e.target.value)}
                        className="h-8 text-xs bg-white border-gray-200 focus:border-lime-500"
                      />
                    </div>
                  </div>

                  {/* MOT */}
                  <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2 flex flex-col justify-between">
                    <DriverFileDropzone
                      label="MOT Certificate"
                      sublabel="PDF, JPEG or PNG"
                      value={motUrl}
                      onChange={setMotUrl}
                      folder="mot"
                    />
                    <div className="pt-2 border-t border-gray-200/80">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <Label htmlFor="mot-expiry" className="text-[10px] font-semibold text-gray-700 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-lime-600" />
                          MOT Expiry
                        </Label>
                        {motExpiry && (
                          <button
                            type="button"
                            onClick={() => setMotExpiry("")}
                            className="text-[9px] text-gray-400 hover:text-red-500 font-medium"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <Input
                        id="mot-expiry"
                        type="date"
                        value={motExpiry}
                        onChange={(e) => setMotExpiry(e.target.value)}
                        className="h-8 text-xs bg-white border-gray-200 focus:border-lime-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: Notes & Partnership Settings */}
            <TabsContent value="notes" className="space-y-4 pt-3">
              <div className="space-y-1.5">
                <Label htmlFor="driver-notes" className="text-xs font-semibold">
                  Internal Notes / Emergency Contact <span className="text-[11px] text-gray-400 font-normal">(Optional)</span>
                </Label>
                <Textarea
                  id="driver-notes"
                  rows={4}
                  placeholder="e.g. Reliable driver for Heathrow terminal pick-ups. Speaks English & Urdu. Child seat available on request."
                  {...register("notes")}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg border border-gray-200 bg-gray-50">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Active Driver</p>
                  <p className="text-xs text-gray-500">
                    Mark whether this driver is currently available and active for jobs
                  </p>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) => setValue("is_active", checked)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t">
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
                "Add Driver"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
