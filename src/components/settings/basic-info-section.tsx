'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload, Save, Loader2 } from 'lucide-react'
import { Project } from '@/db/types'
import { toast } from 'sonner'

interface BasicInfoSectionProps {
  project: Project
  onUpdate: (updates: Partial<Project>) => void
  onUnsavedChanges: (hasChanges: boolean) => void
}

interface FormData {
  name: string
  description: string
  websiteUrl: string
}

export function BasicInfoSection({ project, onUpdate, onUnsavedChanges }: BasicInfoSectionProps) {
  const [formData, setFormData] = useState<FormData>({
    name: project.name || '',
    description: project.description || '',
    websiteUrl: project.websiteUrl || '',
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = 
      formData.name !== (project.name || '') ||
      formData.description !== (project.description || '') ||
      formData.websiteUrl !== (project.websiteUrl || '')

    onUnsavedChanges(hasChanges)
  }, [formData, project, onUnsavedChanges])

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required'
    }

    if (formData.websiteUrl && !isValidUrl(formData.websiteUrl)) {
      newErrors.websiteUrl = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      const response = await fetch('/api/projects/basic-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedProject = await response.json()
        onUpdate(updatedProject)
        toast.success('Basic info updated successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update basic info')
      }
    } catch (error) {
      toast.error('Failed to update basic info')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (file: File) => {
    // TODO: Implement logo upload functionality
    toast.info('Logo upload functionality coming soon!')
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Project Details</h3>
          <p className="text-sm text-muted-foreground">
            Basic project information and settings.
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Project Logo</Label>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={undefined} alt={project.name} />
                <AvatarFallback className="text-lg">
                  {project.name?.charAt(0)?.toUpperCase() || 'P'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) handleLogoUpload(file)
                    }
                    input.click()
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or SVG. Max size 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="project-name">
              Project Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="project-name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your project name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your project or company"
              rows={3}
            />
          </div>



          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="website-url">Website URL</Label>
            <Input
              id="website-url"
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
              placeholder="https://yourwebsite.com"
              className={errors.websiteUrl ? 'border-red-500' : ''}
            />
            {errors.websiteUrl && (
              <p className="text-sm text-red-500">{errors.websiteUrl}</p>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={saving} className="btnSecondary">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Section Divider */}
        <hr className="border-border" />
      </div>
    </div>
  )
}