"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, FileText, CheckCircle, Loader2, Eye, ExternalLink, Image as ImageIcon } from "lucide-react"
import { uploadDriverFile } from "@/lib/driver-file-upload"
import { toast } from "sonner"
import Image from "next/image"

interface DriverFileDropzoneProps {
  label: string
  sublabel?: string
  value?: string | null
  onChange: (url: string) => void
  folder?: string
  acceptPdf?: boolean
  className?: string
}

export function DriverFileDropzone({
  label,
  sublabel = "PDF, JPEG or PNG (max 10MB)",
  value,
  onChange,
  folder = "documents",
  acceptPdf = true,
  className,
}: DriverFileDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false)

  const acceptConfig: Record<string, string[]> = acceptPdf
    ? {
        "application/pdf": [".pdf"],
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/webp": [".webp"],
      }
    : {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/webp": [".webp"],
      }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      try {
        setIsUploading(true)
        const url = await uploadDriverFile(file, folder)
        onChange(url)
        toast.success(`${label} uploaded successfully!`)
      } catch (err: any) {
        toast.error(err.message || "Upload failed")
      } finally {
        setIsUploading(false)
      }
    },
    [folder, label, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024,
    accept: acceptConfig,
    multiple: false,
    disabled: isUploading,
  })

  const isPdf = value?.toLowerCase().endsWith(".pdf") || value?.includes(".pdf?")

  return (
    <div className={`space-y-1.5 ${className || ""}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-800">{label}</label>
        {value && (
          <span className="inline-flex items-center text-[10px] text-emerald-600 font-medium">
            <CheckCircle className="w-3 h-3 mr-1" /> Uploaded
          </span>
        )}
      </div>

      {!value ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-3.5 text-center cursor-pointer transition-all bg-gray-50/60 hover:bg-lime-50/40 hover:border-lime-500 ${
            isDragActive ? "border-lime-600 bg-lime-50" : "border-gray-200"
          } ${isUploading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-1.5 py-1">
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-lime-600 animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-gray-400 group-hover:text-lime-600" />
            )}
            <div className="text-xs">
              <span className="font-semibold text-lime-700 hover:underline">Click to upload</span> or drag and drop
            </div>
            <p className="text-[11px] text-gray-500">{sublabel}</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg border border-gray-200 bg-white p-2.5 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            {isPdf ? (
              <div className="w-10 h-10 rounded-md bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200 font-bold text-xs">
                <FileText className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0 relative border border-gray-200">
                <img src={value} alt={label} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="min-w-0 text-xs">
              <p className="font-semibold text-gray-900 truncate max-w-[170px] sm:max-w-[220px]">
                {label}
              </p>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-lime-700 hover:underline inline-flex items-center gap-1 font-medium mt-0.5"
              >
                <span>View Document</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Dropzone for uploading multiple vehicle images (up to 5 images)
 */
interface VehicleImagesDropzoneProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function VehicleImagesDropzone({
  images,
  onChange,
  maxImages = 5,
}: VehicleImagesDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remainingSlots = maxImages - images.length
      if (remainingSlots <= 0) {
        toast.error(`Maximum ${maxImages} vehicle images allowed`)
        return
      }

      const filesToUpload = acceptedFiles.slice(0, remainingSlots)

      try {
        setIsUploading(true)
        const uploadedUrls: string[] = []

        for (const file of filesToUpload) {
          const url = await uploadDriverFile(file, "vehicles")
          uploadedUrls.push(url)
        }

        onChange([...images, ...uploadedUrls])
        toast.success(`Uploaded ${uploadedUrls.length} vehicle image(s)`)
      } catch (err: any) {
        toast.error(err.message || "Failed to upload vehicle images")
      } finally {
        setIsUploading(false)
      }
    },
    [images, maxImages, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    disabled: isUploading || images.length >= maxImages,
  })

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-800">
          Vehicle Images ({images.length}/{maxImages})
        </label>
        <span className="text-[11px] text-gray-500">Max {maxImages} images (PNG, JPG, WEBP)</span>
      </div>

      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-all bg-gray-50/60 hover:bg-lime-50/40 hover:border-lime-500 ${
            isDragActive ? "border-lime-600 bg-lime-50" : "border-gray-200"
          } ${isUploading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex items-center justify-center gap-2 py-1 text-xs">
            {isUploading ? (
              <Loader2 className="w-5 h-5 text-lime-600 animate-spin" />
            ) : (
              <ImageIcon className="w-5 h-5 text-gray-400" />
            )}
            <span className="font-semibold text-lime-700 hover:underline">Click or drag & drop</span>
            <span className="text-gray-500">vehicle photos</span>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-2 pt-1">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-md overflow-hidden border border-gray-200 bg-gray-100 group"
            >
              <img src={url} alt={`Vehicle ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full p-1 opacity-90 transition-all shadow"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
