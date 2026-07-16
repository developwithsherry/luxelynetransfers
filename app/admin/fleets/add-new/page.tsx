"use client"

import { useRouter } from "next/navigation"
import VehicleForm from "@/components/admin/fleets/add-vehicle-form"
import Link from "next/link"
import { Toaster } from "@/components/ui/sonner"

export default function NewVehiclePage() {
  const router = useRouter()

  const handleSuccess = () => {
    // Redirect to vehicles list after successful submission
    router.push("/admin/fleets")
  }

  return (
    <div className="container mx-auto">

     

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Add New Vehicle</h1>
        <p className="text-gray-600 mb-8">Create a new vehicle in your fleet</p>

        <VehicleForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
