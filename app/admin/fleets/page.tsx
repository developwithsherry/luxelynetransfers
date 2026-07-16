"use client"
export const dynamic="force-dynamic";

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { getVehicles, deleteVehicle } from "./actions"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Vehicle } from "@/types/vehicle"
import {capitalizeFirstLetter} from "@/lib/capatilze-firstletter"
import { sortVehiclesByType } from "@/lib/sort-by-type"
import { useVehicles } from "@/context/vehicle-context"
export default function VehiclesPage() {
  const router = useRouter()
  const{vehicles,loading,error}=useVehicles()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)


  const handleDeleteClick = (id: string) => {
    setVehicleToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return

    try {
      setIsDeleting(true)
      const result = await deleteVehicle(vehicleToDelete)

      if (result.success) {
        toast.success("Vehicle deleted successfully")
        // Remove the deleted vehicle from the state
        setVehicles(vehicles.filter((v) => v.id !== vehicleToDelete))
      } else {
        toast.error(`Failed to delete vehicle: ${result.error}`)
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error)
      toast.error("An unexpected error occurred while deleting the vehicle")
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setVehicleToDelete(null)
    }
  }

  const formatGBP = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  } 
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold">Vehicles</h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Manage your fleet of vehicles</p>
            <div className="hidden md:block">
              <Link href="/admin/fleets/add-new">
                <Button className="bg-lime-400 hover:bg-lime-500 text-black">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="md:hidden mt-2 flex justify-end">
          <Link href="/admin/fleets/add-new">
            <Button className="bg-lime-400 hover:bg-lime-500 text-black">
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading vehicles...</span>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">No vehicles found</h3>
          <p className="mt-1 text-gray-500">Get started by adding your first vehicle.</p>
          <div className="mt-6">
            <Link href="/admin/vehicles/new">
              <Button className="bg-black hover:bg-gray-800 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortVehiclesByType(vehicles).map((vehicle) => (
            <Card
              key={vehicle.id}
              className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/admin/fleets/${vehicle.id}`)}
            >
              <div className="aspect-[3/2] w-full overflow-hidden">
                <img
                  src={vehicle.imageUrl || "/placeholder.svg?height=200&width=300"}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle>{vehicle.name}</CardTitle>
                <p className="text-sm text-gray-500">{capitalizeFirstLetter(vehicle.type)}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div className="text-gray-500">Capacity:</div>
                  <div>{vehicle.sittingCapacity} passengers</div>
                  <div className="text-gray-500">Luggage:</div>
                  <div>{vehicle.laguageCapacity}</div>
                  <div className="text-gray-500">Min Fare:</div>
                  <div>{formatGBP(vehicle.minFare)}</div>
                  <div className="text-gray-500">Fare Spots:</div>
                  <div>{vehicle.fareSpots?.length || 0}</div>
                </div>
                <div className="flex justify-end gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                  <Link href={`/admin/fleets/${vehicle.id}`}>
                    <Button variant="outline" size="sm" className="border-gray-300 hover:border-black">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick(vehicle.id.toString())
                    }}
                    className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vehicle and all associated fare spots.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
