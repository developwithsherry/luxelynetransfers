import { Payment } from "./payment"
import { Vehicle } from "./vehicle"
import { Addon } from "./addon"
import { Supplier } from "./supplier"
import { Driver } from "./driver"

export type JobStatus = "confirmed" | "covered" | "pob" | "completed" | "complaint" | "pending" | "cancelled"
export type PaymentStatus = "pending" | "paid" | "paid_to_driver" | "completed"

export interface Booking {
  id?: string
  created_at?: string
  pickup_location?: string | null
  drop_off_location?: string | null
  date?: string | null
  time?: string | null
  stops?: Record<string, any> | null
  total_distance?: number | null
  unit?: string | null

  // Statuses
  status?: JobStatus | string | null
  payment_status?: PaymentStatus | string | null

  // Financials
  total_amount?: number | null
  final_amount?: number | null

  // Vehicle
  vehicle_id?: string | null
  vehicle_type?: string | null
  vehicle?: Vehicle

  // Customer
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  email?: string
  no_passengers?: number
  no_laguage?: number
  no_hand_laguage?: number

  // Source & Supplier
  source?: "website" | "offline" | string | null
  supplier_id?: string | null
  supplier_reference?: string | null
  supplier?: Supplier | null

  // Driver Assignment
  driver_id?: string | null
  driver_price?: number | null
  driver_instructions?: string | null
  driver?: Driver | null

  // Flight details
  flight_no?: string | null
  arriving_from?: string | null
  intructions?: string | null

  // Return trip
  return_date?: string | null
  return_time?: string | null
  with_return?: boolean | null
  type?: string

  // Payment transaction
  payment_id?: string | null
  payments?: Payment[]

  // Addons
  add_on?: Addon | null
  addons?: Addon[] | null
  booking_addons?: any[]
}
