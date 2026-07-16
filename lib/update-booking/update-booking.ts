"use server"

import { Booking } from "@/types/booking";
import { createClient } from "@/util/supabase/server"
import { payment } from "paypal-rest-sdk";

interface Props{
    booking_id:string;
    payment_id:string;
    booking_status:string;
    payment_status:string
}
export async function UpdateBookingStatus({booking_id,payment_id,payment_status,booking_status}:Props){
    try {
          const supabase=await createClient();

          const {data,error}=await supabase
          .from("booking")
          .update({
            status:booking_status,
            updated_at:new Date().toISOString(),
            payment_status:payment_status,
            payment_id:payment_id
          })
          .eq("id",booking_id)
          .select("*")
          .single();
          if(error){
             console.log("unable to update the booking",error)
             throw error.message
          }
          return {success:true,data:data as Booking}
    } catch (error) {
         return {error}
    }
}