'use client'

import { PublicTestimonial, PublicPageSettings } from '@/db/types'
import { PublicTestimonialCard } from './public-testimonial-card'
import { Star, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface PublicTestimonialsViewProps {
  project: {
    name: string
    description: string | null
    brandName: string | null
    websiteUrl: string | null
    settings: PublicPageSettings
  }
  testimonials: PublicTestimonial[]
  slug: string
}

export function PublicTestimonialsView({ project, testimonials, slug }: PublicTestimonialsViewProps) {
  const { settings } = project
  const brandName = project.brandName || project.name

  // Calculate average rating
  const ratingsWithValues = testimonials.filter(t => t.rating).map(t => t.rating!)
  const averageRating = ratingsWithValues.length > 0 
    ? ratingsWithValues.reduce((sum, rating) => sum + rating, 0) / ratingsWithValues.length
    : 0

  const layoutClass = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    masonry: 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6',
    list: 'flex flex-col gap-4'
  }[settings.layout] || 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'

  return (
    <div 
      className="min-h-screen bg-background"
      style={{
        '--primary-color': settings.primaryColor,
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {settings.headerTitle || `${brandName} Customer Testimonials`}
            </h1>
            
            {(settings.headerDescription || project.description) && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {settings.headerDescription || project.description}
              </p>
            )}

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              {settings.showRatings && averageRating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">
                    {averageRating.toFixed(1)} ({ratingsWithValues.length} reviews)
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <span>{testimonials.length} testimonials</span>
              </div>

              {project.websiteUrl && (
                <Link
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Visit website
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No testimonials available yet.
            </p>
          </div>
        ) : (
          <div className={layoutClass}>
            {testimonials.map((testimonial) => (
              <PublicTestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                settings={settings}
                slug={slug}
                layout={settings.layout}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="text-center text-sm text-muted-foreground">
            <p>Powered by {brandName}</p>
            {project.websiteUrl && (
              <Link
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                {project.websiteUrl.replace(/^https?:\/\//, '')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      {settings.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: settings.customCSS }} />
      )}
    </div>
  )
}