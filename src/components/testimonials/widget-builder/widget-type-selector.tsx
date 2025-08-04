"use client"

import { ChevronRight, MessageSquare, Grid3X3, Star, Users, Sparkles } from "lucide-react"
import { WidgetType, widgetTypes } from "@/types/widget"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface WidgetTypeSelectorProps {
  selectedType: WidgetType
  onTypeChange: (type: WidgetType) => void
  testimonialCount: number
}

const iconMap = {
  ChevronRight,
  MessageSquare,
  Grid3X3,
  Star,
  Users,
  Sparkles
}

export function WidgetTypeSelector({ 
  selectedType, 
  onTypeChange, 
  testimonialCount 
}: WidgetTypeSelectorProps) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Widget Type</h3>
      <div className="space-y-2">
        {widgetTypes.map((widget) => {
          const Icon = iconMap[widget.icon as keyof typeof iconMap]
          const isDisabled = testimonialCount < widget.minTestimonials
          const isSelected = selectedType === widget.id
          
          return (
            <Button
              key={widget.id}
              variant={isSelected ? "default" : "outline"}
              onClick={() => !isDisabled && onTypeChange(widget.id)}
              disabled={isDisabled}
              className={`w-full justify-start h-auto p-3 ${
                isSelected ? 'border-primary' : ''
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center w-full">
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{widget.name}</div>
                    {isDisabled && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        Need {widget.minTestimonials}+
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {widget.description}
                  </div>
                </div>
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}