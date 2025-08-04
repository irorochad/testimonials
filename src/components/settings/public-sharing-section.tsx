'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, ExternalLink, Save, Loader2, Eye, EyeOff, Palette } from 'lucide-react'
import { Project, PublicPageSettings } from '@/db/types'
import { toast } from 'sonner'

interface PublicSharingSectionProps {
  project: Project
  onUpdate: (updates: Partial<Project>) => void
  onUnsavedChanges: (hasChanges: boolean) => void
}

interface FormData {
  isPublic: boolean
  publicSlug: string
  settings: PublicPageSettings
}

const defaultSettings: PublicPageSettings = {
  theme: 'light',
  primaryColor: '#3B82F6',
  layout: 'grid', // Always grid, not user-configurable
  showRatings: true,
  showCompany: true,
  showTitle: true,
  showImages: true,
}

export function PublicSharingSection({ project, onUpdate, onUnsavedChanges }: PublicSharingSectionProps) {
  const [formData, setFormData] = useState<FormData>({
    isPublic: project.isPublic || true, // Default to enabled
    publicSlug: project.publicSlug || '',
    settings: (project.publicPageSettings as PublicPageSettings) || defaultSettings,
  })
  const [saving, setSaving] = useState(false)
  const [publicUrl, setPublicUrl] = useState<string | null>(null)

  // Generate public URL
  useEffect(() => {
    if (formData.isPublic && formData.publicSlug) {
      setPublicUrl(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/p/${formData.publicSlug}`)
    } else {
      setPublicUrl(null)
    }
  }, [formData.isPublic, formData.publicSlug])

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = 
      formData.isPublic !== (project.isPublic || false) ||
      formData.publicSlug !== (project.publicSlug || '') ||
      JSON.stringify(formData.settings) !== JSON.stringify(project.publicPageSettings || defaultSettings)

    onUnsavedChanges(hasChanges)
  }, [formData, project, onUnsavedChanges])

  // Generate slug from project name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // Auto-generate slug when enabling public sharing
  useEffect(() => {
    if (formData.isPublic && !formData.publicSlug && project.name) {
      const generatedSlug = generateSlug(project.name)
      setFormData(prev => ({ ...prev, publicSlug: generatedSlug }))
    }
  }, [formData.isPublic, formData.publicSlug, project.name])

  const handleTogglePublic = (enabled: boolean) => {
    setFormData(prev => ({ ...prev, isPublic: enabled }))
  }

  const handleSlugChange = (value: string) => {
    const cleanSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setFormData(prev => ({ ...prev, publicSlug: cleanSlug }))
  }

  const handleSettingsChange = (key: keyof PublicPageSettings, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, [key]: value }
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/projects/public-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        onUpdate({
          isPublic: formData.isPublic,
          publicSlug: result.publicSlug,
          publicPageSettings: formData.settings,
        })
        toast.success('Public sharing settings saved!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save settings')
      }
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const presetColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
  ]

  return (
    <div className="max-w-2xl space-y-8">
      {/* Public Sharing Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {formData.isPublic ? (
              <Eye className="w-5 h-5 text-green-600" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400" />
            )}
            Public Sharing
          </h3>
          <p className="text-sm text-muted-foreground">
            {formData.isPublic 
              ? 'Your testimonials are publicly visible'
              : 'Enable public sharing to create a shareable link'
            }
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="public-toggle">Enable public sharing</Label>
          <Switch
            id="public-toggle"
            checked={formData.isPublic}
            onCheckedChange={handleTogglePublic}
          />
        </div>
      </div>
      
      <hr className="border-border" />

      {formData.isPublic && (
        <>
          {/* URL Configuration Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Public URL</h3>
              <p className="text-sm text-muted-foreground">
                Customize your public testimonials page URL
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-slug">Custom URL slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {process.env.NEXT_PUBLIC_APP_URL || 'yoursite.com'}/p/
                  </span>
                  <Input
                    id="custom-slug"
                    value={formData.publicSlug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="company-name"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Only lowercase letters, numbers, and hyphens allowed
                </p>
              </div>

              {publicUrl && (
                <div className="space-y-2">
                  <Label>Public URL</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={publicUrl}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(publicUrl)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(publicUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <hr className="border-border" />

          {/* Page Customization Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Page Customization
              </h3>
              <p className="text-sm text-muted-foreground">
                Customize how your testimonials are displayed
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Select your default theme</p>
                <div className="grid grid-cols-3 gap-4">
                  {/* Dark Theme */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSettingsChange('theme', 'dark')}
                      className={`w-full border-2 rounded-lg p-3 bg-gray-900 transition-colors ${
                        formData.settings.theme === 'dark'
                          ? 'border-blue-500'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-700 rounded"></div>
                        <div className="h-2 bg-gray-800 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-800 rounded w-1/2"></div>
                      </div>
                    </button>
                    <p className="text-sm text-center font-medium">Dark</p>
                  </div>

                  {/* System Default Theme */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSettingsChange('theme', 'auto')}
                      className={`w-full border-2 rounded-lg p-3 bg-gradient-to-r from-white to-gray-900 transition-colors ${
                        formData.settings.theme === 'auto'
                          ? 'border-blue-500'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-400 rounded"></div>
                        <div className="h-2 bg-gray-500 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-500 rounded w-1/2"></div>
                      </div>
                    </button>
                    <p className="text-sm text-center">System Default</p>
                  </div>

                  {/* Light Theme */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSettingsChange('theme', 'light')}
                      className={`w-full border-2 rounded-lg p-3 bg-white transition-colors ${
                        formData.settings.theme === 'light'
                          ? 'border-blue-500'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded"></div>
                        <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                      </div>
                    </button>
                    <p className="text-sm text-center">Light</p>
                  </div>
                </div>
              </div>

              {/* Brand Color */}
              <div className="space-y-3">
                <Label>Brand Color</Label>
                <p className="text-sm text-muted-foreground">Highlight color for main objects, e.g buttons</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.settings.primaryColor === color
                          ? 'border-gray-900 dark:border-gray-100'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleSettingsChange('primaryColor', color)}
                    />
                  ))}
                  <Input
                    type="color"
                    value={formData.settings.primaryColor}
                    onChange={(e) => handleSettingsChange('primaryColor', e.target.value)}
                    className="w-12 h-8 p-0 border-0"
                  />
                </div>
              </div>

              {/* Display Options */}
              <div className="space-y-4">
                <Label>Display Options</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-ratings" className="text-sm">Show ratings</Label>
                    <Switch
                      id="show-ratings"
                      checked={formData.settings.showRatings}
                      onCheckedChange={(checked) => 
                        handleSettingsChange('showRatings', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-company" className="text-sm">Show company</Label>
                    <Switch
                      id="show-company"
                      checked={formData.settings.showCompany}
                      onCheckedChange={(checked) => 
                        handleSettingsChange('showCompany', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-title" className="text-sm">Show job title</Label>
                    <Switch
                      id="show-title"
                      checked={formData.settings.showTitle}
                      onCheckedChange={(checked) => 
                        handleSettingsChange('showTitle', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-images" className="text-sm">Show images</Label>
                    <Switch
                      id="show-images"
                      checked={formData.settings.showImages}
                      onCheckedChange={(checked) => 
                        handleSettingsChange('showImages', checked)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Custom Headers */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="header-title">Custom Header Title (optional)</Label>
                  <Input
                    id="header-title"
                    value={formData.settings.headerTitle || ''}
                    onChange={(e) => handleSettingsChange('headerTitle', e.target.value)}
                    placeholder={`${project.brandName || project.name} Customer Testimonials`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="header-description">Custom Header Description (optional)</Label>
                  <Textarea
                    id="header-description"
                    value={formData.settings.headerDescription || ''}
                    onChange={(e) => handleSettingsChange('headerDescription', e.target.value)}
                    placeholder="What our customers are saying..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <hr className="border-border" />
          </>
        )}

      {/* Custom Domain Section - Always show */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Custom Domain</h3>
          <p className="text-sm text-muted-foreground">
            Use your own domain for testimonials page
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="custom-domain">Custom Domain</Label>
          <Input
            id="custom-domain"
            placeholder="testimonials.yourcompany.com"
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Coming soon - Use your own domain for testimonials
          </p>
        </div>
      </div>
      
      <hr className="border-border" />

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="btnSecondary">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
    </div>
  )
}