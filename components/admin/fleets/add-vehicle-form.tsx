"use client"

import { useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { vehicleSchema, type VehicleFormValues } from "@/schema/vehicle/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { FileUpload } from "@/components/upload-file"
import { uploadVehicleImage } from "@/lib/img-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { addVehicle } from "@/lib/admin/vehicle/add-vehicle"
import { updateVehicle } from "@/app/admin/fleets/actions"
import { uuidv4 } from "@/lib/uuid"
import { Loader2 } from "lucide-react"

const vehicleTypes = [
  { value: "Economy", label: "Economy" },
  { value: "People Carrier", label: "People Carrier" },
  { value: "Executive", label: "Executive" },
  { value: "Executive Minibus", label: "Executive Minibus" },
  { value: "Minibus", label: "Minibus" },
]

interface VehicleFormProps {
  defaultValues?: Partial<VehicleFormValues>
  onSuccess?: () => void
  isEditing?: boolean
  vehicleId?: string
}

export default function VehicleForm({ defaultValues, onSuccess, isEditing = false, vehicleId }: VehicleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: "",
      sittingCapacity: 4,
      type: "",
      laguageCapacity: "",
      description: "",
      imageUrl: "",
      minFare: 0,
      fareSpots: [{ id: uuidv4(), position: 0, fareFactor: 1, distance: 0 }],
      ...defaultValues,
    },
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fareSpots",
  })

  const imageUrl = watch("imageUrl")

  const addFareSpot = () => {
    append({
      id: uuidv4(),
      position: fields.length,
      fareFactor: 1,
      distance: 0,
    })
  }

  const onSubmit = async (data: VehicleFormValues) => {
    try {
      setIsSubmitting(true)

      const updatedFareSpots = data.fareSpots.map((spot, index) => ({
        ...spot,
        position: index,
      }))
      const finalData = { ...data, fareSpots: updatedFareSpots }

      let result

      if (isEditing && vehicleId) {
        result = await updateVehicle(vehicleId, finalData as any)
        if (result.success) {
          toast.success("Vehicle updated successfully")
        }
      } else {
        result = await addVehicle(data as any)
        if (result.success) {
          toast.success("Vehicle added successfully")
        }
      }

      if (result.success) {
        if (onSuccess) onSuccess()
      } else {
        toast.error(`Failed to ${isEditing ? "update" : "add"} vehicle: ${result.error}`)
      }
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "submitting"} form:`, error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card className="border border-black/10 shadow-lg">
        <CardHeader className="bg-lime-50 border-b border-black/5">
          <CardTitle className="text-xl font-bold text-black">Vehicle Information</CardTitle>
          <CardDescription className="text-black/60">Enter the basic details of the vehicle</CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className={cn("font-bold text-black", errors.name && "text-black")}>
                Vehicle Name*
              </Label>
              <Input
                id="name"
                {...register("name")}
                className={cn(
                  "border-black/20 focus:border-lime-600 focus:ring-lime-600 font-medium",
                  errors.name && "border-black focus:border-black focus:ring-black",
                )}
              />
              {errors.name && <p className="text-black text-sm font-medium">{errors.name.message}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="type" className={cn("font-bold text-black", errors.type && "text-black")}>
                Vehicle Type
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={cn(
                        "border-black/20 focus:border-lime-600 focus:ring-lime-600 font-medium",
                        errors.type && "border-black focus:border-black focus:ring-black",
                      )}
                    >
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <p className="text-black text-sm font-medium">{errors.type.message}</p>}
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="sittingCapacity"
                className={cn("font-bold text-black", errors.sittingCapacity && "text-black")}
              >
                Sitting Capacity*
              </Label>
              <Controller
                name="sittingCapacity"
                control={control}
                render={({ field }) => (
                  <Input
                    id="sittingCapacity"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                    className={cn(
                      "border-black/20 focus:border-lime-600 focus:ring-lime-600 font-medium",
                      errors.sittingCapacity && "border-black focus:border-black focus:ring-black",
                    )}
                  />
                )}
              />
              {errors.sittingCapacity && (
                <p className="text-black text-sm font-medium">{errors.sittingCapacity.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="laguageCapacity"
                className={cn("font-bold text-black", errors.laguageCapacity && "text-black")}
              >
                Suitcases *
              </Label>
              <Input
                id="laguageCapacity"
                {...register("laguageCapacity")}
                placeholder="e.g., 2 suitcases"
                className={cn(
                  "border-black/20 focus:border-lime-600 focus:ring-lime-600 font-medium",
                  errors.laguageCapacity && "border-black focus:border-black focus:ring-black",
                )}
              />
              {errors.laguageCapacity && (
                <p className="text-black text-sm font-medium">{errors.laguageCapacity.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="hand_laguage" className={cn("font-bold text-black", errors.hand_laguage && "text-black")}>
                Hand luggage*
              </Label>
              <Input
                id="hand_laguage"
                {...register("hand_laguage")}
                placeholder="e.g., 2 hand trolley"
                className={cn(
                  "border-black/20 focus:border-lime-600 focus:ring-lime-600 font-medium",
                  errors.hand_laguage && "border-black focus:border-black focus:ring-black",
                )}
              />
              {errors.hand_laguage && <p className="text-black text-sm font-medium">{errors.hand_laguage.message}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="minFare" className={cn("font-bold text-black", errors.minFare && "text-black")}>
                Minimum Fare (£)*
              </Label>
              <Controller
                name="minFare"
                control={control}
                render={({ field }) => (
                  <Input
                    id="minFare"
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                    className={cn(
                      "border-black/20 focus:border-lime-600 focus:ring-lime-600 font-medium",
                      errors.minFare && "border-black focus:border-black focus:ring-black",
                    )}
                  />
                )}
              />
              {errors.minFare && <p className="text-black text-sm font-medium">{errors.minFare.message}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className={cn("font-bold text-black", errors.description && "text-black")}>
              Description*
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={4}
              className={cn(
                "border-black/20 focus:border-lime-600 focus:ring-lime-600 font-medium",
                errors.description && "border-black focus:border-black focus:ring-black",
              )}
            />
            {errors.description && <p className="text-black text-sm font-medium">{errors.description.message}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="imageUrl" className={cn("font-bold text-black", errors.imageUrl && "text-black")}>
              Vehicle Image*
            </Label>
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <FileUpload value={field.value} onChange={field.onChange} onUpload={uploadVehicleImage} />
              )}
            />
            {errors.imageUrl && <p className="text-black text-sm font-medium">{errors.imageUrl.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-black/10 shadow-lg">
        <CardHeader className="bg-lime-50 border-b border-black/5">
          <CardTitle className="text-xl font-bold text-black">Fare Spots</CardTitle>
          <CardDescription className="text-black/60">Define fare spots for distance-based pricing</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-6 border border-black/10 rounded-xl bg-lime-50">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-black text-lg">Fare Spot {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="text-black hover:text-white hover:bg-black"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove fare spot</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor={`fareSpots.${index}.fareFactor`}
                      className={cn("font-bold text-black", errors.fareSpots?.[index]?.fareFactor && "text-black")}
                    >
                      Fare Factor*
                    </Label>
                    <Controller
                      name={`fareSpots.${index}.fareFactor`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          id={`fareSpots.${index}.fareFactor`}
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                          className={cn(
                            "border-black/20 focus:border-lime-600 focus:ring-lime-600 font-medium",
                            errors.fareSpots?.[index]?.fareFactor && "border-black focus:border-black focus:ring-black",
                          )}
                        />
                      )}
                    />
                    {errors.fareSpots?.[index]?.fareFactor && (
                      <p className="text-black text-sm font-medium">{errors.fareSpots[index]?.fareFactor?.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor={`fareSpots.${index}.distance`}
                      className={cn("font-bold text-black", errors.fareSpots?.[index]?.distance && "text-black")}
                    >
                      Distance (miles)*
                    </Label>
                    <Controller
                      name={`fareSpots.${index}.distance`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          id={`fareSpots.${index}.distance`}
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                          className={cn(
                            "border-black/20 focus:border-lime-600 focus:ring-lime-600 font-medium",
                            errors.fareSpots?.[index]?.distance && "border-black focus:border-black focus:ring-black",
                          )}
                        />
                      )}
                    />
                    {errors.fareSpots?.[index]?.distance && (
                      <p className="text-black text-sm font-medium">{errors.fareSpots[index]?.distance?.message}</p>
                    )}
                  </div>

                  <input type="hidden" {...register(`fareSpots.${index}.id`)} />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addFareSpot}
              className="w-full mt-4 border-dashed border-2 border-lime-400 hover:border-lime-600 hover:bg-lime-50 text-lime-600 hover:text-lime-700 font-bold py-4 bg-transparent"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Fare Spot
            </Button>

            {errors.fareSpots && typeof errors.fareSpots.message === "string" && (
              <p className="text-black text-sm font-medium">{errors.fareSpots.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-lime-50 border-t border-black/5 flex justify-end mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-lime-600 hover:bg-lime-700 text-white font-bold px-8 py-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update Vehicle" : "Save Vehicle"}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
