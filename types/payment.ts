import { Booking } from "./booking"

export interface Payment{
    id?:string
    booking_id:string
    amount:number
    status:string
    payment_id:string
    booking?:Booking

}