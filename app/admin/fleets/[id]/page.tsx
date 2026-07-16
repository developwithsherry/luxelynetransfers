"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { getVehicleById } from "../actions"
import { toast } from "sonner"
import VehicleForm from "@/components/admin/fleets/add-vehicle-form"
import type { Vehicle } from "@/types/vehicle"

export default function EditVehiclePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadVehicle() {
      try {
        setLoading(true)
        const result = await getVehicleById(params.id)

        if (result.success) {
          setVehicle(result.data)
        } else {
          toast.error(`Failed to load vehicle: ${result.error}`)
          // Redirect back to vehicles list if vehicle not found
          setTimeout(() => router.push("/admin/fleets"), 2000)
        }
      } catch (error) {
        console.error("Error loading vehicle:", error)
        toast.error("An unexpected error occurred while loading the vehicle")
        // Redirect back to vehicles list
        setTimeout(() => router.push("/admin/fleets"), 2000)
      } finally {
        setLoading(false)
      }
    }

    loadVehicle()
  }, [params.id, router])

  const handleSuccess = () => {
    // Redirect to vehicles list after successful update
    router.push("/admin/fleets")
  }

  return (
    <div className="container mx-auto  py-4">
      <div className="mb-8">
        <Link href="/admin/fleets" className="flex items-center text-gray-600 hover:text-black">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vehicles
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Edit Vehicle</h1>
        <p className="text-gray-600 mb-8">Update vehicle details and fare spots</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading vehicle data...</span>
          </div>
        ) : vehicle ? (
          <VehicleForm defaultValues={vehicle} onSuccess={handleSuccess} isEditing={true} vehicleId={params.id} />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Vehicle not found</h3>
            <p className="mt-1 text-gray-500">The vehicle you're looking for doesn't exist or has been deleted.</p>
          </div>
        )}
      </div>
    </div>
  )
}
