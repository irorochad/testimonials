"use client"

import { WidgetType, widgetTypes } from "@/types/widget"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronRight,
  MessageSquare,
  Grid3X3,
  Star,
  Users,
  Sparkles
} from "lucide-react"

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
    <div className="space-y-3">
      <div>
        <h3 className="font-medium text-sm">Widget Type</h3>
        <p className="text-xs text-muted-foreground">
          Choose how your testimonials will be displayed
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {widgetTypes.map((widgetType) => {
          const IconComponent = iconMap[widgetType.icon as keyof typeof iconMap]
          const isSelected = selectedType === widgetType.id
          const hasEnoughTestimonials = testimonialCount >= widgetType.minTestimonials

          return (
            <Card
              key={widgetType.id}
              className={`cursor-pointer transition-all duration-200 ${isSelected
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
                } ${!hasEnoughTestimonials
                  ? 'opacity-60 cursor-not-allowed'
                  : ''
                }`}
              onClick={() => {
                if (hasEnoughTestimonials) {
                  onTypeChange(widgetType.id)
                }
              }}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-md ${isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                    }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm truncate">
                        {widgetType.name}
                      </h4>
                      {!hasEnoughTestimonials && (
                        <Badge variant="outline" className="text-xs">
                          Need {widgetType.minTestimonials}+
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {widgetType.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}