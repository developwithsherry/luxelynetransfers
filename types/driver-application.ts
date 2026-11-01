export const DRIVER_VEHICLE_CATEGORIES = [
  "Saloon",
  "Estate",
  "People Carrier",
  "Minibus",
  "Executive Minibus",
  "Executive Saloon",
] as const

export type DriverVehicleCategory = (typeof DRIVER_VEHICLE_CATEGORIES)[number]

export type DriverApplicationStatus =
  | "new"
  | "contacted"
  | "shortlisted"
  | "hired"
  | "rejected"

export interface DriverApplication {
  id: string
  full_name: string
  phone: string
  email: string
  city_area: string
  vehicle_category: DriverVehicleCategory
  vehicle_make_model?: string | null
  experience_years?: string | null
  availability?: string | null
  message?: string | null
  status: DriverApplicationStatus
  admin_notes?: string | null
  created_at: string
  updated_at?: string | null
}

