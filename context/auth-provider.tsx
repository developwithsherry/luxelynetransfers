"use client"

import { createClient } from "@/util/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, ReactNode } from "react"
import type { User } from "@supabase/supabase-js"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      // Skip auth check on /admin/login route
      if (pathname === "/admin/login") {
        setLoading(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/") // redirect if not logged in
      } else {
        setUser(user)
      }

      setLoading(false)
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (pathname === "/admin/login") return // skip again

      if (!session?.user) {
        router.replace("/")
      } else {
        setUser(session.user)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router, pathname])

  if (loading) return null // or a loader

  return <>{children}</>
}
