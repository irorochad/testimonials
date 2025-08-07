"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Building, User, Calendar, Users } from "lucide-react"
import Link from "next/link"

/**
 * PublicGroupView Component
 * 
 * Displays all testimonials in a group in a clean, public-facing format.
 * Used on the /groups/[slug] route for direct group sharing.
 * 
 * Features:
 * - Group header with name and description
 * - Grid of testimonials in the group
 * - Individual testimonial cards with customer info
 * - Links to individual testimonials
 * - Responsive design
 * - Professional styling
 */

interface PublicGroupViewProps {
  group: {
    id: string
    slug: string
    name: string
    description: string | null
    color: string | null
    projectName: string
    projectId: string
  }
  testimonials: Array<{
    id: string
    slug: string
    customerName: string
    customerCompany: string | null
    customerTitle: string | null
    customerImageUrl: string | null
    content: string
    rating: number | null
    createdAt: Date
  }>
}

export function PublicGroupView({ group, testimonials }: PublicGroupViewProps) {
  /**
   * Render star rating display
   */
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  /**
   * Truncate long testimonial content for card display
   */
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Group Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: group.color || '#3B82F6' }}
            />
            <h1 className="text-4xl font-bold text-gray-900">
              {group.name}
            </h1>
          </div>
          
          {group.description && (
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              {group.description}
            </p>
          )}

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}</span>
            </div>
            <div>
              From {group.projectName}
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {testimonials.map((testimonial) => (
              <Link 
                key={testimonial.id} 
                href={`/testimonials/${testimonial.slug}`}
                className="block transition-transform hover:scale-105"
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    {/* Customer Info */}
                    <div className="flex items-start gap-4 mb-4">
                      {/* Customer Avatar */}
                      <div className="flex-shrink-0">
                        {testimonial.customerImageUrl ? (
                          <img
                            src={testimonial.customerImageUrl}
                            alt={testimonial.customerName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                      </div>

                      {/* Customer Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {testimonial.customerName}
                        </h3>
                        {testimonial.customerCompany && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <Building className="w-3 h-3" />
                            <span className="truncate">{testimonial.customerCompany}</span>
                          </div>
                        )}
                        {testimonial.customerTitle && (
                          <p className="text-sm text-gray-500 truncate">
                            {testimonial.customerTitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    {testimonial.rating && (
                      <div className="flex items-center gap-2 mb-3">
                        {renderStars(testimonial.rating)}
                        <span className="text-xs text-gray-600">
                          {testimonial.rating}/5
                        </span>
                      </div>
                    )}

                    {/* Testimonial Content */}
                    <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                      "{truncateContent(testimonial.content)}"
                    </blockquote>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No testimonials yet
            </h3>
            <p className="text-gray-500">
              This group doesn't have any public testimonials yet.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Powered by {group.projectName}
          </p>
        </div>
      </div>
    </div>
  )
}