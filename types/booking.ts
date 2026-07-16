import { Payment } from "./payment"
import { Vehicle } from "./vehicle"
import { Addon } from "./addon"
export interface Booking {
  created_at: string
  pickup_location: string | null
  drop_off_location: string | null
  date: string | null
  time: string | null
  stops: Record<string, any> | null
  total_distance: number | null
  unit: string | null
  status: string | null
  total_amount: number | null
  vehicle_id: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  payment_id: string | null
  payment_status: string | null
  id?:string
  payments:Payment[]
  vehicle:Vehicle
  email:string
  return_date:string | null
  return_time:string | null
  with_return:boolean | null
  type:string
  no_passengers:number
  no_laguage:number
  no_hand_laguage:number
  flight_no:string
  arriving_from:string
  intructions:string
  add_on:Addon | null
}
