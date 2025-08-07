"use client"

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadImage, generateImageFileName } from "@/lib/supabase-client"
import { toast } from "sonner"

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  onImageRemove: () => void
  currentImage?: string
  theme?: 'light' | 'dark'
  primaryColor?: string
}

export function ImageUpload({ 
  onImageUpload, 
  onImageRemove, 
  currentImage, 
  theme = 'light',
  primaryColor = '#3B82F6'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, or WebP)')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setUploading(true)
    try {
      const fileName = generateImageFileName(file.name)
      const imageUrl = await uploadImage(file, fileName)
      
      if (imageUrl) {
        console.log('Image upload successful, calling onImageUpload with:', imageUrl)
        onImageUpload(imageUrl)
        toast.success('Image uploaded successfully!')
      } else {
        console.error('Image upload failed - no URL returned')
        toast.error('Failed to upload image. Please try again.')
      }
    } catch (error) {
      toast.error('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemoveImage = () => {
    onImageRemove()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
    borderColor: dragActive 
      ? primaryColor 
      : theme === 'dark' ? '#4b5563' : '#d1d5db',
    color: theme === 'dark' ? '#f3f4f6' : '#374151'
  }

  if (currentImage) {
    return (
      <div className="relative">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-200">
          <img 
            src={currentImage} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRemoveImage}
          className="absolute -top-2 -right-2 w-8 h-8 p-0 rounded-full bg-red-500 text-white border-red-500 hover:bg-red-600"
        >
          <X className="w-4 h-4" />
        </Button>
        <div className="text-center mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
              color: theme === 'dark' ? '#f3f4f6' : '#374151',
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff'
            }}
          >
            Change Image
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        dragActive ? 'border-opacity-100' : 'border-opacity-50'
      }`}
      style={containerStyle}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          {uploading ? (
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-400" />
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">
            {uploading ? 'Uploading...' : 'Upload your profile picture'}
          </p>
          <p className="text-xs opacity-75">
            Drag and drop or click to browse
          </p>
          <p className="text-xs opacity-60 mt-1">
            JPG, PNG or WebP (max 5MB)
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            borderColor: primaryColor,
            color: primaryColor,
            backgroundColor: 'transparent'
          }}
          className="hover:opacity-80"
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose File
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  )
}