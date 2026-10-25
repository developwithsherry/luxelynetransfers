import { createClient } from "@/util/supabase/client"

/**
 * Uploads a file (photo or document: PDF, JPEG, PNG, WEBP) to Supabase Storage.
 * Attempts to upload to 'drivers' bucket; falls back to 'images' bucket if needed.
 */
export async function uploadDriverFile(file: File, folder: string = "general"): Promise<string> {
  const supabase = createClient()

  // Clean filename and create unique timestamped path
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "bin"
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
  const filePath = `drivers/${folder}/${fileName}`

  // Try uploading to 'drivers' bucket first
  let { error: uploadError } = await supabase.storage
    .from("drivers")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    })

  let bucketName = "drivers"

  // If 'drivers' bucket does not exist or has error, fallback to 'images' bucket
  if (uploadError) {
    console.warn("Attempting fallback upload to 'images' bucket:", uploadError.message)
    const fallbackPath = `drivers/${folder}/${fileName}`
    const { error: fallbackError } = await supabase.storage
      .from("images")
      .upload(fallbackPath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      })

    if (fallbackError) {
      console.error("Storage upload failed on both buckets:", fallbackError)
      throw new Error(`Failed to upload file: ${fallbackError.message}`)
    }

    bucketName = "images"
  }

  // Get and return the public URL
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
  return data.publicUrl
}
