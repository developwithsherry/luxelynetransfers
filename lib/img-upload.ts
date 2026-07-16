import { createClient } from "@/util/supabase/client"

export async function uploadVehicleImage(file: File): Promise<string> {
  const supabase = createClient()

  // Create a unique file name
  const fileExt = file.name.split(".").pop()
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
  const filePath = `vehicles/${fileName}`

  // Upload the file
  const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (uploadError) {
    console.error("Error uploading file:", uploadError)
    throw new Error(`Error uploading file: ${uploadError.message}`)
  }

  // Get the public URL
  const { data } = supabase.storage.from("images").getPublicUrl(filePath)

  return data.publicUrl
}
