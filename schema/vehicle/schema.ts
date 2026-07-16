import { z } from "zod"

// Schema for fareSpot
export const fareSpotSchema = z.object({
  id: z.string().min(1, "ID is required"),
  position: z.number().min(0, "Position must be a positive number"),
  fareFactor: z.number().min(0, "Fare factor must be a positive number"),
  distance: z.number().min(0, "Distance must be a positive number"),
})

// Schema for Vehicle
export const vehicleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sittingCapacity: z.number().int().min(1, "Sitting capacity must be at least 1"),
  type: z.string().optional(),
  laguageCapacity: z.string().min(1, "Luggage capacity is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Please enter a valid URL"),
  id: z.union([z.string(), z.number()]).optional(),
  minFare: z.number().min(0, "Minimum fare must be a positive number"),
  fareSpots: z.array(fareSpotSchema).min(1, "At least one fare spot is required"),
  hand_laguage:z.string()
})

export type FareSpot = z.infer<typeof fareSpotSchema>
export type VehicleFormValues = z.infer<typeof vehicleSchema>
export type Vehicle = VehicleFormValues & { id: string }