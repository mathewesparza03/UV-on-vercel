"use client"

import { useCallback, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Upload, X, Image as ImageIcon } from "lucide-react"

interface ImageUploadProps {
  onImageSelect: (imageData: string | null) => void
  selectedImage: string | null
  disabled?: boolean
}

export function ImageUpload({ onImageSelect, selectedImage, disabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onImageSelect(result)
      }
      reader.readAsDataURL(file)
    },
    [onImageSelect]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return

      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile, disabled]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click()
  }, [disabled])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const clearImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onImageSelect(null)
      if (inputRef.current) inputRef.current.value = ""
    },
    [onImageSelect]
  )

  if (selectedImage) {
    return (
      <div className="relative inline-block">
        <img
          src={selectedImage}
          alt="Selected"
          className="max-h-24 rounded-lg border border-border object-contain"
        />
        <button
          onClick={clearImage}
          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/80 transition-colors"
          disabled={disabled}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed cursor-pointer transition-all",
        isDragging
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary/50 hover:bg-card",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      <ImageIcon className="w-4 h-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">Upload image</span>
    </div>
  )
}
