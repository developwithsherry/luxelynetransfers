"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Addon } from "@/types/addon"
import { getAddons } from "@/app/admin/addons/action"


type AddonContextType = {
  addons: Addon[]
  loading: boolean
  error: string | null
  selectAddon: (addon: Addon) => void
  selectedAddon: Addon | null
}

const AddonContext = createContext<AddonContextType | undefined>(undefined)

export function AddonProvider({ children }: { children: ReactNode }) {
  const [addons, setAddons] = useState<Addon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null)

  const selectAddon = (addon: Addon) => {
    setSelectedAddon(addon)
  }

  useEffect(() => {
    const fetchAddon = async () => {
      try {
        setLoading(true)
        const res = await getAddons()
        if (res.data) {
          setAddons(res.data)
          setError(null)
        } else {
          setError(res.error ?? "Failed to fetch addons")
        }
      } catch (err: any) {
        console.error("Error fetching addons:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAddon()
  }, [])

  return (
    <AddonContext.Provider
      value={{
        addons,
        loading,
        error,
        selectedAddon,
        selectAddon,
      }}
    >
      {children}
    </AddonContext.Provider>
  )
}

export function useAddons() {
  const context = useContext(AddonContext)
  if (context === undefined) {
    throw new Error("useAddons must be used within an AddonProvider")
  }
  return context
}
