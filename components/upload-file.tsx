"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface FileUploadProps {
  value?: string
  onChange: (url: string) => void
  onUpload: (file: File) => Promise<string>
  className?: string
  maxSize?: number // in bytes
  accept?: Record<string, string[]>
}

export function FileUpload({
  value,
  onChange,
  onUpload,
  className,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".webp"],
  },
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0]
        if (!file) return

        setIsUploading(true)
        setError(null)

        const url = await onUpload(file)
        onChange(url)
      } catch (err) {
        console.error("Upload error:", err)
        setError(err instanceof Error ? err.message : "Failed to upload file")
      } finally {
        setIsUploading(false)
      }
    },
    [onChange, onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept,
    multiple: false,
  })

  const removeImage = () => {
    onChange("")
  }

  return (
    <div className="space-y-2">
      {!value ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-md p-6 cursor-pointer transition-colors",
            isDragActive ? "border-black bg-gray-50" : "border-gray-300 hover:border-gray-400",
            isUploading && "opacity-50 cursor-not-allowed",
            className,
          )}
        >
          <input {...getInputProps()} disabled={isUploading} />
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Upload className="h-10 w-10 text-gray-400" />
            <div className="space-y-1">
              <p className="text-sm font-medium">{isDragActive ? "Drop the file here" : "Drag & drop an image here"}</p>
              <p className="text-xs text-gray-500">or click to browse (max {(maxSize / (1024 * 1024)).toFixed(0)}MB)</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-md overflow-hidden border border-gray-200">
          <div className="aspect-[3/2] py-14 relative">
            <Image
              src={value || "/placeholder.svg"}
              alt="Uploaded image"
              fill
              className="object-cover max-h[400px]"
             
            />
          </div>
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove image</span>
          </button>
        </div>
      )}
      {isUploading && <p className="text-sm text-gray-500">Uploading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
