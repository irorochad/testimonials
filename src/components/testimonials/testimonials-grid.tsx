"use client"

import * as React from "react"
import { TestimonialCard } from "./testimonial-card"
import { TestimonialWithProjectAndGroup } from "@/lib/testimonials"

interface Group {
  id: string
  name: string
  color: string
}

interface TestimonialsGridProps {
  data: TestimonialWithProjectAndGroup[]
  groups?: Group[]
  onStatusUpdate: (id: string, status: string) => void
  onGroupUpdate?: (id: string, groupId: string | null, groupName: string | null, groupColor: string | null) => void
}

export function TestimonialsGrid({ data, groups, onStatusUpdate, onGroupUpdate }: TestimonialsGridProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No testimonials found
          </h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            groups={groups}
            onStatusUpdate={onStatusUpdate}
            onGroupUpdate={onGroupUpdate}
          />
        ))}
      </div>
    </div>
  )
}