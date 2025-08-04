'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Copy, ExternalLink, Settings, Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PublicPageSettings } from '@/db/types'

interface PublicShareModalProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
}

interface ProjectPublicSettings {
  id: string
  name: string
  publicSlug: string | null
  isPublic: boolean
  settings: PublicPageSettings
  publicUrl: string | null
}

export function PublicShareModal({ isOpen, onClose, projectName }: PublicShareModalProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [projectSettings, setProjectSettings] = useState<ProjectPublicSettings | null>(null)
  const [customSlug, setCustomSlug] = useState('')
  const [settings, setSettings] = useState<PublicPageSettings>({
    theme: 'light',
    primaryColor: '#3B82F6',
    layout: 'grid',
    showRatings: true,
    showCompany: true,
    showTitle: true,
    showImages: true,
  })

  // Load current settings when modal opens
  useEffect(() => {
    if (isOpen) {
      loadProjectSettings()
    }
  }, [isOpen])

  const loadProjectSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/projects/public-settings')
      if (response.ok) {
        const data = await response.json()
        setProjectSettings(data)
        setCustomSlug(data.publicSlug || '')
        setSettings(data.settings)
      } else {
        toast.error('Failed to load project settings')
      }
    } catch (error) {
      toast.error('Failed to load project settings')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!projectSettings) return

    setSaving(true)
    try {
      const response = await fetch('/api/projects/public-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublic: projectSettings.isPublic,
          publicSlug: customSlug || null,
          settings,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setProjectSettings(prev => prev ? {
          ...prev,
          publicSlug: data.publicSlug,
          publicUrl: data.publicUrl,
          settings,
        } : null)
        toast.success('Settings saved successfully!')
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

  const togglePublic = async () => {
    if (!projectSettings) return

    const newIsPublic = !projectSettings.isPublic
    setSaving(true)

    try {
      const response = await fetch('/api/projects/public-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublic: newIsPublic,
          publicSlug: newIsPublic ? (customSlug || null) : null,
          settings,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setProjectSettings(prev => prev ? {
          ...prev,
          isPublic: newIsPublic,
          publicSlug: data.publicSlug,
          publicUrl: data.publicUrl,
        } : null)
        
        if (newIsPublic) {
          setCustomSlug(data.publicSlug || '')
        }
        
        toast.success(newIsPublic ? 'Public sharing enabled!' : 'Public sharing disabled!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update settings')
      }
    } catch (error) {
      toast.error('Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  if (loading || !projectSettings) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Public Testimonials</DialogTitle>
          <DialogDescription>
            Create a public page to showcase your testimonials
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Public Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {projectSettings.isPublic ? (
                  <Eye className="w-5 h-5 text-green-600" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                )}
                Public Sharing
              </CardTitle>
              <CardDescription>
                {projectSettings.isPublic 
                  ? 'Your testimonials are publicly visible'
                  : 'Enable public sharing to create a shareable link'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="public-toggle">Enable public sharing</Label>
                <Switch
                  id="public-toggle"
                  checked={projectSettings.isPublic}
                  onCheckedChange={togglePublic}
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>

          {projectSettings.isPublic && (
            <>
              {/* URL Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Public URL</CardTitle>
                  <CardDescription>
                    Customize your public testimonials page URL
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-slug">Custom URL slug</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {process.env.NEXT_PUBLIC_APP_URL || 'yoursite.com'}/p/
                      </span>
                      <Input
                        id="custom-slug"
                        value={customSlug}
                        onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="company-name"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Only lowercase letters, numbers, and hyphens allowed
                    </p>
                  </div>

                  {projectSettings.publicUrl && (
                    <div className="space-y-2">
                      <Label>Public URL</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={projectSettings.publicUrl}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(projectSettings.publicUrl!)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(projectSettings.publicUrl!, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Page Customization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Page Customization
                  </CardTitle>
                  <CardDescription>
                    Customize how your testimonials are displayed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={settings.theme}
                        onValueChange={(value: 'light' | 'dark' | 'auto') => 
                          setSettings(prev => ({ ...prev, theme: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="layout">Layout</Label>
                      <Select
                        value={settings.layout}
                        onValueChange={(value: 'grid' | 'masonry' | 'list') => 
                          setSettings(prev => ({ ...prev, layout: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid</SelectItem>
                          <SelectItem value="masonry">Masonry</SelectItem>
                          <SelectItem value="list">List</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <Input
                      id="primary-color"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-20 h-10"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Display Options</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-ratings" className="text-sm">Show ratings</Label>
                        <Switch
                          id="show-ratings"
                          checked={settings.showRatings}
                          onCheckedChange={(checked) => 
                            setSettings(prev => ({ ...prev, showRatings: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-company" className="text-sm">Show company</Label>
                        <Switch
                          id="show-company"
                          checked={settings.showCompany}
                          onCheckedChange={(checked) => 
                            setSettings(prev => ({ ...prev, showCompany: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-title" className="text-sm">Show job title</Label>
                        <Switch
                          id="show-title"
                          checked={settings.showTitle}
                          onCheckedChange={(checked) => 
                            setSettings(prev => ({ ...prev, showTitle: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-images" className="text-sm">Show images</Label>
                        <Switch
                          id="show-images"
                          checked={settings.showImages}
                          onCheckedChange={(checked) => 
                            setSettings(prev => ({ ...prev, showImages: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="header-title">Custom Header Title (optional)</Label>
                    <Input
                      id="header-title"
                      value={settings.headerTitle || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, headerTitle: e.target.value }))}
                      placeholder={`${projectName} Customer Testimonials`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="header-description">Custom Header Description (optional)</Label>
                    <Textarea
                      id="header-description"
                      value={settings.headerDescription || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, headerDescription: e.target.value }))}
                      placeholder="What our customers are saying..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {projectSettings.isPublic && (
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}