import { CircleAlert } from "lucide-react";
import { getBookings,getVehicles } from "./action";
import DashboardPage from "./client";

export default async function Page(){
  const {data:bookings,error:bookingsError}=await getBookings();
  
  if(bookingsError){
    return(
    <div className="w-screen min-h-screen flex justify-center items-center">
      <div className="flex flex-col space-y-5">
        <CircleAlert className="text-red-500 w-6 h-6"/>
        <p className="text-muted-foreground">Something went wrong please try again</p>
      </div>
    </div>
    )
  }
  return(
    <DashboardPage bookings={bookings || []}/>
  )
}