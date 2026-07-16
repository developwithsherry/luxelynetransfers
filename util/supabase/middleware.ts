import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export async function updateSession(request: NextRequest) {
  // Create a response object
  const response = NextResponse.next()

  // Create the Supabase client using the newer SSR approach
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          // This is needed for setting cookies during the middleware execution
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          // This is needed for removing cookies during the middleware execution
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    },
  )

  // Refresh the session
  const { error } = await supabase.auth.getSession()

  if (error) {
    console.error("Error refreshing session:", error)
  }

  return response
}
