"use client"

import { useState, useCallback, useMemo } from "react"
import { X, Copy, Download, Share2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import {
  WidgetConfig,
  WidgetType,
  WidgetTestimonial,
  defaultWidgetConfig,
  widgetTypes,
  ValidationResult
} from "@/types/widget"
import { TestimonialWithProjectAndGroup } from "@/lib/testimonials"
import { WidgetTypeSelector } from "./widget-builder/widget-type-selector"
import { ConfigurationPanel } from "./widget-builder/configuration-panel"
import { LivePreview } from "./widget-builder/live-preview"
import { generateEmbedCode } from "@/lib/embed-generator"

interface WidgetBuilderProps {
  isOpen: boolean
  onClose: () => void
  testimonials: TestimonialWithProjectAndGroup[]
  selectedTestimonials?: TestimonialWithProjectAndGroup[]
  groupName?: string
}

// Convert testimonial to widget format
function convertToWidgetTestimonial(testimonial: TestimonialWithProjectAndGroup): WidgetTestimonial {
  return {
    id: testimonial.id,
    customerName: testimonial.customerName,
    customerCompany: testimonial.customerCompany,
    customerTitle: testimonial.customerTitle,
    customerImageUrl: testimonial.customerImageUrl,
    content: testimonial.content,
    rating: testimonial.rating,
    createdAt: testimonial.createdAt
  }
}

// Validate widget configuration
function validateWidgetConfig(
  widgetType: WidgetType,
  testimonials: WidgetTestimonial[]
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Find widget type info
  const widgetInfo = widgetTypes.find(w => w.id === widgetType)
  const minTestimonials = widgetInfo?.minTestimonials || 1

  // Check minimum testimonials
  if (testimonials.length < minTestimonials) {
    errors.push(`${widgetInfo?.name || widgetType} requires at least ${minTestimonials} testimonial${minTestimonials > 1 ? 's' : ''}`)
  }

  // Widget-specific validations
  switch (widgetType) {
    case 'carousel':
      if (testimonials.length === 1) {
        warnings.push('Single testimonial carousels work better with static display widgets')
      }
      break
    case 'grid':
      if (testimonials.length < 4) {
        warnings.push('Grid layouts work best with 4 or more testimonials')
      }
      break
    case 'avatar-carousel':
      const testimonialsWithImages = testimonials.filter(t => t.customerImageUrl)
      if (testimonialsWithImages.length < testimonials.length * 0.5) {
        warnings.push('Avatar carousel works best when most testimonials have customer images')
      }
      break
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function WidgetBuilder({
  isOpen,
  onClose,
  testimonials,
  selectedTestimonials,
  groupName
}: WidgetBuilderProps) {
  // Convert testimonials to widget format
  const widgetTestimonials = useMemo(() => {
    // Always prioritize selectedTestimonials if provided
    const testimonialsToUse = selectedTestimonials && selectedTestimonials.length > 0 ? selectedTestimonials : testimonials
    return testimonialsToUse.map(convertToWidgetTestimonial)
  }, [testimonials, selectedTestimonials])

  // Widget configuration state
  const [config, setConfig] = useState<WidgetConfig>(() => ({
    ...defaultWidgetConfig,
    id: `widget-${Date.now()}`,
    testimonials: widgetTestimonials
  }))

  // Update testimonials when props change
  useMemo(() => {
    setConfig(prev => ({
      ...prev,
      testimonials: widgetTestimonials
    }))
  }, [widgetTestimonials])

  // Validation
  const validation = useMemo(() => {
    return validateWidgetConfig(config.type, config.testimonials)
  }, [config.type, config.testimonials])

  // Update widget type
  const handleWidgetTypeChange = useCallback((type: WidgetType) => {
    setConfig(prev => ({ ...prev, type }))
  }, [])

  // Update styling
  const handleStylingChange = useCallback((updates: Partial<WidgetConfig['styling']>) => {
    setConfig(prev => ({
      ...prev,
      styling: { ...prev.styling, ...updates }
    }))
  }, [])

  // Update behavior
  const handleBehaviorChange = useCallback((updates: Partial<WidgetConfig['behavior']>) => {
    setConfig(prev => ({
      ...prev,
      behavior: { ...prev.behavior, ...updates }
    }))
  }, [])

  // Generate and copy embed code
  const handleCopyEmbedCode = useCallback(async () => {
    if (!validation.isValid) {
      toast.error("Please fix validation errors before generating embed code")
      return
    }

    try {
      // Get the current site URL and project slug
      const baseUrl = window.location.origin
      const testimonialsToUse = selectedTestimonials && selectedTestimonials.length > 0 ? selectedTestimonials : testimonials
      const projectSlug = testimonialsToUse.length > 0 ? testimonialsToUse[0].projectPublicSlug : null

      if (!projectSlug) {
        toast.error("Project public slug not found. Please enable public sharing in Settings.")
        return
      }

      const embedCode = generateEmbedCode(config, baseUrl, projectSlug)
      await navigator.clipboard.writeText(embedCode)
      toast.success("Embed code copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy embed code")
    }
  }, [config, validation.isValid, testimonials])

  // Download widget as HTML file
  const handleDownloadWidget = useCallback(() => {
    if (!validation.isValid) {
      toast.error("Please fix validation errors before downloading")
      return
    }

    try {
      const baseUrl = window.location.origin
      const testimonialsToUse = selectedTestimonials && selectedTestimonials.length > 0 ? selectedTestimonials : testimonials
      const projectSlug = testimonialsToUse.length > 0 ? testimonialsToUse[0].projectPublicSlug : null

      if (!projectSlug) {
        toast.error("Project public slug not found. Please enable public sharing in Settings.")
        return
      }

      const embedCode = generateEmbedCode(config, baseUrl, projectSlug)
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testimonial Widget</title>
</head>
<body>
    <div style="padding: 20px;">
        ${embedCode}
    </div>
</body>
</html>`

      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `testimonial-widget-${config.type}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Widget downloaded successfully!")
    } catch (error) {
      toast.error("Failed to download widget")
    }
  }, [config, validation.isValid, testimonials])

  // Share preview (placeholder)
  const handleSharePreview = useCallback(() => {
    toast.info("Share preview feature coming soon!")
  }, [])

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-hidden p-0">
        <div className="flex h-[90vh]">
          {/* Left Panel - Configuration */}
          <div className="w-1/3 border-r flex flex-col max-h-full">
            <DialogHeader className="p-6 border-b">
              <DialogTitle className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Widget Builder</h2>
                  {groupName && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Exporting from: {groupName}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Widget Type Selection */}
              <WidgetTypeSelector
                selectedType={config.type}
                onTypeChange={handleWidgetTypeChange}
                testimonialCount={config.testimonials.length}
              />

              {/* Validation Messages */}
              {(!validation.isValid || validation.warnings.length > 0) && (
                <div className="space-y-2">
                  {validation.errors.map((error, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm text-red-700">{error}</span>
                    </div>
                  ))}
                  {validation.warnings.map((warning, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-sm text-yellow-700">{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Configuration Tabs */}
              <Tabs defaultValue="styling" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="styling">Styling</TabsTrigger>
                  <TabsTrigger value="behavior">Behavior</TabsTrigger>
                </TabsList>

                <TabsContent value="styling" className="space-y-4 mt-4">
                  <ConfigurationPanel
                    type="styling"
                    config={config}
                    onStylingChange={handleStylingChange}
                    onBehaviorChange={handleBehaviorChange}
                  />
                </TabsContent>

                <TabsContent value="behavior" className="space-y-4 mt-4">
                  <ConfigurationPanel
                    type="behavior"
                    config={config}
                    onStylingChange={handleStylingChange}
                    onBehaviorChange={handleBehaviorChange}
                  />
                </TabsContent>
              </Tabs>

              {/* Export Actions */}
              <div className="space-y-3 pt-4 border-t">
                <Button
                  onClick={handleCopyEmbedCode}
                  disabled={!validation.isValid}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Embed Code
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDownloadWidget}
                  disabled={!validation.isValid}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Widget
                </Button>

                <Button
                  variant="outline"
                  onClick={handleSharePreview}
                  className="w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Preview
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Live Preview</h3>
                <Badge variant="outline" className="text-xs">
                  {config.testimonials.length} testimonial{config.testimonials.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 min-h-[500px]">
                <LivePreview config={config} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}