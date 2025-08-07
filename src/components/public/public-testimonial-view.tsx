"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Building, User, Calendar } from "lucide-react"
import { PublicPageSettings } from "@/db/types"

/**
 * PublicTestimonialView Component
 * 
 * Displays a single testimonial in a clean, public-facing format.
 * Used on the /testimonials/[slug] route for direct testimonial sharing.
 * 
 * Features:
 * - Clean, focused testimonial display
 * - Customer information with avatar
 * - Star rating display
 * - Company and title information
 * - Responsive design
 * - Professional styling
 */

interface PublicTestimonialViewProps {
  testimonial: {
    id: string
    slug: string
    customerName: string
    customerCompany: string | null
    customerTitle: string | null
    customerImageUrl: string | null
    content: string
    rating: number | null
    createdAt: Date
    projectName: string
    projectId: string
    groupName: string | null
    groupColor: string | null
    projectPublicPageSettings: unknown
  }
}

export function PublicTestimonialView({ testimonial }: PublicTestimonialViewProps) {
  // Parse theme settings from project public page settings
  const settings = (testimonial.projectPublicPageSettings as PublicPageSettings) || {
    theme: 'light',
    primaryColor: '#3B82F6',
    layout: 'grid',
    showRatings: true,
    showCompany: true,
    showTitle: true,
    showImages: true,
  }

  // Determine if we should use dark theme
  const isDark = settings.theme === 'dark'
  
  // Theme-based CSS classes
  const themeClasses = {
    background: isDark ? 'bg-gray-900' : 'bg-gray-50',
    cardBackground: isDark ? 'bg-gray-800' : 'bg-white',
    textPrimary: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
    border: isDark ? 'border-gray-700' : 'border-gray-100',
    avatarBg: isDark ? 'bg-gray-700' : 'bg-gray-200',
    avatarBorder: isDark ? 'border-gray-600' : 'border-gray-100',
  }

  /**
   * Render star rating display with theme support
   */
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : isDark ? 'text-gray-600' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} py-12 px-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-3xl font-bold ${themeClasses.textPrimary} mb-4`}>
            Customer Testimonial
          </h1>
          <p className={`text-lg ${themeClasses.textSecondary}`}>
            From {testimonial.projectName}
          </p>
        </div>

        {/* Main Testimonial Card */}
        <Card className={`shadow-xl border-0 mb-8 ${themeClasses.cardBackground}`}>
          <CardContent className="p-8 md:p-12">
            {/* Customer Info Header */}
            <div className="flex items-start gap-6 mb-8">
              {/* Customer Avatar */}
              <div className="flex-shrink-0">
                {testimonial.customerImageUrl ? (
                  <img
                    src={testimonial.customerImageUrl}
                    alt={testimonial.customerName}
                    className={`w-16 h-16 rounded-full object-cover border-4 ${themeClasses.avatarBorder}`}
                  />
                ) : (
                  <div className={`w-16 h-16 rounded-full ${themeClasses.avatarBg} flex items-center justify-center border-4 ${themeClasses.avatarBorder}`}>
                    <User className={`w-8 h-8 ${themeClasses.textMuted}`} />
                  </div>
                )}
              </div>

              {/* Customer Details */}
              <div className="flex-1">
                <h2 className={`text-2xl font-semibold ${themeClasses.textPrimary} mb-2`}>
                  {testimonial.customerName}
                </h2>
                
                {/* Company and Title */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {testimonial.customerCompany && (
                    <div className={`flex items-center gap-2 ${themeClasses.textSecondary}`}>
                      <Building className="w-4 h-4" />
                      <span className="font-medium">{testimonial.customerCompany}</span>
                    </div>
                  )}
                  {testimonial.customerTitle && (
                    <div className={themeClasses.textSecondary}>
                      <span>{testimonial.customerTitle}</span>
                    </div>
                  )}
                </div>

                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex items-center gap-3">
                    {renderStars(testimonial.rating)}
                    <span className={`text-sm ${themeClasses.textSecondary} font-medium`}>
                      {testimonial.rating}/5 stars
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="mb-8">
              <blockquote className={`text-xl leading-relaxed ${themeClasses.textPrimary} italic`}>
                "{testimonial.content}"
              </blockquote>
            </div>

            {/* Footer Info */}
            <div className={`flex flex-wrap items-center justify-between pt-6 border-t ${themeClasses.border}`}>
              {/* Group Badge */}
              {testimonial.groupName && (
                <Badge 
                  variant="outline" 
                  className="mb-2 md:mb-0"
                  style={{ 
                    borderColor: testimonial.groupColor || '#3B82F6',
                    color: testimonial.groupColor || '#3B82F6'
                  }}
                >
                  {testimonial.groupName}
                </Badge>
              )}

              {/* Date */}
              <div className={`flex items-center gap-2 text-sm ${themeClasses.textMuted}`}>
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className={`text-sm ${themeClasses.textMuted}`}>
            Powered by {testimonial.projectName}
          </p>
        </div>
      </div>
    </div>
  )
}