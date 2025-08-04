'use client'

import { PublicTestimonial, PublicPageSettings } from '@/db/types'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Star, ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface PublicTestimonialViewProps {
  project: {
    id: string
    name: string
    description: string | null
    brandName: string | null
    websiteUrl: string | null
    settings: PublicPageSettings
  }
  testimonial: PublicTestimonial
  slug: string
}

export function PublicTestimonialView({ project, testimonial, slug }: PublicTestimonialViewProps) {
  const { settings } = project
  const brandName = project.brandName || project.name

  const initials = testimonial.customerName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div 
      className="min-h-screen bg-background"
      style={{
        '--primary-color': settings.primaryColor,
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <Link href={`/p/${slug}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to all testimonials
              </Button>
            </Link>

            {project.websiteUrl && (
              <Link
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  Visit {brandName}
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Rating */}
              {settings.showRatings && testimonial.rating && (
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < testimonial.rating!
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <blockquote className="text-xl leading-relaxed text-center text-foreground">
                "{testimonial.content}"
              </blockquote>

              {/* Customer Info */}
              <div className="flex flex-col items-center gap-4 pt-6 border-t">
                {settings.showImages && (
                  <Avatar className="w-16 h-16">
                    <AvatarImage 
                      src={testimonial.customerImageUrl} 
                      alt={testimonial.customerName} 
                    />
                    <AvatarFallback className="text-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className="text-center">
                  <p className="font-semibold text-lg text-foreground">
                    {testimonial.customerName}
                  </p>
                  
                  {(settings.showTitle || settings.showCompany) && (
                    <div className="text-muted-foreground">
                      {settings.showTitle && testimonial.customerTitle && (
                        <span>{testimonial.customerTitle}</span>
                      )}
                      {settings.showTitle && testimonial.customerTitle && 
                       settings.showCompany && testimonial.customerCompany && (
                        <span> at </span>
                      )}
                      {settings.showCompany && testimonial.customerCompany && (
                        <span>{testimonial.customerCompany}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Date */}
                <div className="text-sm text-muted-foreground">
                  {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
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