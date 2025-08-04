"use client"

import { useState } from "react"
import { Download, Share2, Code } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WidgetBuilder } from "./widget-builder"
import { TestimonialWithProjectAndGroup } from "@/lib/testimonials"

interface ExportDropdownProps {
  testimonials: TestimonialWithProjectAndGroup[]
  groupName?: string
  triggerClassName?: string
  triggerVariant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link"
  triggerSize?: "default" | "sm" | "lg" | "icon"
  children?: React.ReactNode // Custom trigger content
}

export function ExportDropdown({
  testimonials,
  groupName,
  triggerClassName = "",
  triggerVariant = "outline",
  triggerSize = "sm",
  children
}: ExportDropdownProps) {
  const [isWidgetBuilderOpen, setIsWidgetBuilderOpen] = useState(false)

  // Generate CSV content
  const generateCSV = (data: TestimonialWithProjectAndGroup[]) => {
    const headers = [
      'Name',
      'Email',
      'Company',
      'Title',
      'Content',
      'Rating',
      'Status',
      'Group',
      'Created At'
    ]

    const rows = data.map(testimonial => [
      testimonial.customerName,
      testimonial.customerEmail,
      testimonial.customerCompany || '',
      testimonial.customerTitle || '',
      `"${testimonial.content.replace(/"/g, '""')}"`,
      testimonial.rating || '',
      testimonial.status,
      testimonial.groupName || 'Uncategorized',
      new Date(testimonial.createdAt).toLocaleDateString()
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  // Download file helper
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportCSV = () => {
    if (testimonials.length === 0) {
      toast.error('No testimonials to export')
      return
    }

    const csvContent = generateCSV(testimonials)
    const filename = groupName 
      ? `testimonials-${groupName.toLowerCase().replace(/\s+/g, '-')}.csv`
      : 'testimonials.csv'
    
    downloadFile(csvContent, filename, 'text/csv')
    toast.success('CSV downloaded successfully!')
  }

  const handleEmbedWidget = () => {
    if (testimonials.length === 0) {
      toast.error('No testimonials to export')
      return
    }

    setIsWidgetBuilderOpen(true)
  }

  const handleSharePublic = () => {
    if (testimonials.length === 0) {
      toast.error('No testimonials to export')
      return
    }

    // Get the first testimonial to access project info
    const firstTestimonial = testimonials[0]
    
    // Check if public sharing is enabled
    if (!firstTestimonial.projectIsPublic || !firstTestimonial.projectPublicSlug) {
      toast.info('Enable public sharing in Settings first')
      window.location.href = '/settings?tab=public-sharing'
      return
    }

    // Generate public URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
    const publicUrl = `${baseUrl}/p/${firstTestimonial.projectPublicSlug}`
    
    // Copy URL to clipboard and show success message
    navigator.clipboard.writeText(publicUrl)
    toast.success('Public URL copied to clipboard!')
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {children || (
            <Button 
              variant={triggerVariant} 
              size={triggerSize}
              className={triggerClassName}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEmbedWidget}>
            <Code className="w-4 h-4 mr-2" />
            Embed Widget
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSharePublic}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Public URL
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Widget Builder Modal */}
      <WidgetBuilder
        isOpen={isWidgetBuilderOpen}
        onClose={() => setIsWidgetBuilderOpen(false)}
        testimonials={testimonials}
        selectedTestimonials={testimonials}
        groupName={groupName}
      />
    </>
  )
}