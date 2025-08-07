"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  MessageSquare, 
  Users, 
  FileText, 
  Settings,
  ArrowRight
} from "lucide-react"
import { ReusableModal } from "@/components/ui/reusable-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

/**
 * GlobalCreateModal Component
 * 
 * A modal that appears when users click the global "Create" button in the header.
 * Provides quick access to create different types of content throughout the app.
 * 
 * Features:
 * - Beautiful grid layout with icons
 * - Navigation to different creation flows
 * - Responsive design
 * - Keyboard navigation support
 */

interface GlobalCreateModalProps {
  /** Controls whether the modal is open or closed */
  isOpen: boolean
  /** Callback function called when the modal should be closed */
  onClose: () => void
}

/**
 * Configuration for different creation options
 * Each option defines the display information and navigation behavior
 */
const createOptions = [
  {
    id: 'testimonial',
    title: 'Testimonial',
    description: 'Add a new customer testimonial',
    icon: MessageSquare,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
    action: 'navigate',
    path: '/testimonials'
  },
  {
    id: 'group',
    title: 'Group',
    description: 'Create a testimonial group',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100',
    action: 'navigate',
    path: '/testimonials/groups'
  },
  {
    id: 'form',
    title: 'Form',
    description: 'Build a testimonial collection form',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100',
    action: 'navigate',
    path: '/forms/builder'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure project settings',
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    hoverColor: 'hover:bg-gray-100',
    action: 'navigate',
    path: '/settings'
  }
]

export function GlobalCreateModal({ isOpen, onClose }: GlobalCreateModalProps) {
  const router = useRouter()

  /**
   * Handle option selection
   * Navigates to the appropriate page and closes the modal
   */
  const handleOptionSelect = (option: typeof createOptions[0]) => {
    // Close the modal first for better UX
    onClose()
    
    // Navigate to the specified path
    if (option.action === 'navigate' && option.path) {
      router.push(option.path)
    }
  }

  /**
   * Handle keyboard navigation
   * Allows users to navigate options using arrow keys and select with Enter
   */
  const handleKeyDown = (event: React.KeyboardEvent, option: typeof createOptions[0]) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOptionSelect(option)
    }
  }

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title="What would you like to create?"
      description="Choose from the options below to get started"
      size="lg"
    >
      {/* Create Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {createOptions.map((option) => {
          const IconComponent = option.icon
          
          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 hover:border-primary/20 ${option.hoverColor}`}
              onClick={() => handleOptionSelect(option)}
              onKeyDown={(e) => handleKeyDown(e, option)}
              tabIndex={0}
              role="button"
              aria-label={`Create ${option.title}: ${option.description}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Option Icon */}
                  <div className={`p-3 rounded-lg ${option.bgColor} flex-shrink-0`}>
                    <IconComponent className={`w-6 h-6 ${option.color}`} />
                  </div>
                  
                  {/* Option Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-foreground">
                        {option.title}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions Footer */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Need help getting started?
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose()
              // Could navigate to help/documentation page
              console.log('Help clicked')
            }}
          >
            View Guide
          </Button>
        </div>
      </div>
    </ReusableModal>
  )
}