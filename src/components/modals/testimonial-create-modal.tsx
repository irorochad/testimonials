"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Upload, 
  FileText, 
  PlusCircle, 
  Globe,
  ArrowRight,
  Import
} from "lucide-react"
import { ReusableModal } from "@/components/ui/reusable-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

/**
 * TestimonialCreateModal Component
 * 
 * A modal that appears when users click "Add Testimonial" button on the testimonials page.
 * Provides different methods for creating/collecting testimonials.
 * 
 * Features:
 * - 4 different creation methods
 * - Beautiful card-based layout with icons
 * - Status badges for different options
 * - Responsive design
 */

interface TestimonialCreateModalProps {
  /** Controls whether the modal is open or closed */
  isOpen: boolean
  /** Callback function called when the modal should be closed */
  onClose: () => void
}

/**
 * Configuration for different testimonial creation methods
 * Each method defines the display information and action behavior
 */
const creationMethods = [
  {
    id: 'form',
    title: 'Collection Form',
    description: 'Create a form to collect testimonials from customers',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
    badge: 'Recommended',
    badgeVariant: 'default' as const,
    action: 'navigate',
    path: '/forms/builder'
  },
  {
    id: 'manual',
    title: 'Manual Entry',
    description: 'Add a testimonial manually by typing it in',
    icon: PlusCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100',
    badge: 'Quick',
    badgeVariant: 'secondary' as const,
    action: 'modal',
    // This would open a manual entry modal
  },
  {
    id: 'import',
    title: 'Import CSV',
    description: 'Upload testimonials from a CSV file',
    icon: Upload,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100',
    badge: 'Bulk',
    badgeVariant: 'outline' as const,
    action: 'modal',
    // This would open an import modal
  },
  {
    id: 'scrape',
    title: 'Web Scraping',
    description: 'Extract testimonials from review websites',
    icon: Globe,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    hoverColor: 'hover:bg-orange-100',
    badge: 'Coming Soon',
    badgeVariant: 'outline' as const,
    action: 'disabled',
    disabled: true
  }
]

export function TestimonialCreateModal({ isOpen, onClose }: TestimonialCreateModalProps) {
  const router = useRouter()

  /**
   * Handle method selection
   * Performs the appropriate action based on the selected method
   */
  const handleMethodSelect = (method: typeof creationMethods[0]) => {
    // Don't proceed if the method is disabled
    if (method.disabled) {
      return
    }

    // Close the modal first for better UX
    onClose()
    
    // Perform the appropriate action
    switch (method.action) {
      case 'navigate':
        if (method.path) {
          router.push(method.path)
        }
        break
      case 'modal':
        // For now, we'll just log the action
        // In the future, these would open specific modals
        console.log(`Opening ${method.id} modal`)
        break
      default:
        break
    }
  }

  /**
   * Handle keyboard navigation
   * Allows users to navigate methods using arrow keys and select with Enter
   */
  const handleKeyDown = (event: React.KeyboardEvent, method: typeof creationMethods[0]) => {
    if ((event.key === 'Enter' || event.key === ' ') && !method.disabled) {
      event.preventDefault()
      handleMethodSelect(method)
    }
  }

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title="How would you like to add testimonials?"
      description="Choose the method that works best for your workflow"
      size="xl"
    >
      {/* Creation Methods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {creationMethods.map((method) => {
          const IconComponent = method.icon
          
          return (
            <Card
              key={method.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 hover:border-primary/20 ${
                method.disabled 
                  ? 'opacity-60 cursor-not-allowed' 
                  : method.hoverColor
              }`}
              onClick={() => handleMethodSelect(method)}
              onKeyDown={(e) => handleKeyDown(e, method)}
              tabIndex={method.disabled ? -1 : 0}
              role="button"
              aria-label={`${method.title}: ${method.description}`}
              aria-disabled={method.disabled}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Method Icon */}
                  <div className={`p-3 rounded-lg ${method.bgColor} flex-shrink-0`}>
                    <IconComponent className={`w-6 h-6 ${method.color}`} />
                  </div>
                  
                  {/* Method Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg text-foreground">
                          {method.title}
                        </h3>
                        <Badge variant={method.badgeVariant} className="text-xs">
                          {method.badge}
                        </Badge>
                      </div>
                      {!method.disabled && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Help Section */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Import className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm text-foreground mb-1">
              Not sure which method to choose?
            </h4>
            <p className="text-xs text-muted-foreground">
              Collection forms are great for ongoing testimonial gathering, while manual entry is perfect for adding existing testimonials quickly.
            </p>
          </div>
        </div>
      </div>
    </ReusableModal>
  )
}