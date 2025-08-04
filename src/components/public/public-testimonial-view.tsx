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
      className={`min-h-screen ${
        settings.theme === 'dark' ? 'dark' : 
        settings.theme === 'light' ? '' : 
        '' // auto/system default
      }`}
      style={{
        '--primary-color': settings.primaryColor,
        backgroundColor: settings.theme === 'dark' ? '#0f172a' : 
                        settings.theme === 'light' ? '#ffffff' : 
                        'var(--background)', // system default
        color: settings.theme === 'dark' ? '#f8fafc' : 
               settings.theme === 'light' ? '#0f172a' : 
               'var(--foreground)', // system default
      } as React.CSSProperties}
    >
      {/* Header */}
      <div 
        className="border-b"
        style={{
          backgroundColor: settings.theme === 'dark' ? '#1e293b' : '#ffffff',
          borderColor: settings.theme === 'dark' ? '#374151' : '#e5e7eb'
        }}
      >
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <Link href={`/p/${slug}`}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                style={{
                  color: settings.theme === 'dark' ? '#f8fafc' : '#0f172a',
                  backgroundColor: 'transparent'
                }}
              >
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  style={{
                    borderColor: settings.primaryColor,
                    color: settings.primaryColor,
                    backgroundColor: 'transparent'
                  }}
                >
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
        <Card 
          className="mx-auto max-w-2xl"
          style={{
            backgroundColor: settings.theme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: settings.theme === 'dark' ? '#374151' : '#e5e7eb'
          }}
        >
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Rating */}
              {settings.showRatings && testimonial.rating && (
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6"
                      style={{
                        fill: i < testimonial.rating! ? settings.primaryColor : 'transparent',
                        color: i < testimonial.rating! ? settings.primaryColor : '#d1d5db'
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <blockquote 
                className="text-xl leading-relaxed text-center"
                style={{
                  color: settings.theme === 'dark' ? '#f9fafb' : '#111827'
                }}
              >
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              {/* Customer Info */}
              <div 
                className="flex flex-col items-center gap-4 pt-6 border-t"
                style={{
                  borderColor: settings.theme === 'dark' ? '#374151' : '#e5e7eb'
                }}
              >
                {settings.showImages && (
                  <Avatar className="w-16 h-16">
                    <AvatarImage 
                      src={testimonial.customerImageUrl} 
                      alt={testimonial.customerName} 
                    />
                    <AvatarFallback 
                      className="text-lg"
                      style={{
                        backgroundColor: settings.primaryColor,
                        color: '#ffffff'
                      }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className="text-center">
                  <p 
                    className="font-semibold text-lg"
                    style={{
                      color: settings.theme === 'dark' ? '#f9fafb' : '#111827'
                    }}
                  >
                    {testimonial.customerName}
                  </p>
                  
                  {(settings.showTitle || settings.showCompany) && (
                    <div 
                      style={{
                        color: settings.theme === 'dark' ? '#9ca3af' : '#6b7280'
                      }}
                    >
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
                <div 
                  className="text-sm"
                  style={{
                    color: settings.theme === 'dark' ? '#9ca3af' : '#6b7280'
                  }}
                >
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
      <div 
        className="border-t mt-12"
        style={{
          backgroundColor: settings.theme === 'dark' ? '#0f172a' : '#f9fafb',
          borderColor: settings.theme === 'dark' ? '#374151' : '#e5e7eb'
        }}
      >
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div 
            className="text-center text-sm"
            style={{
              color: settings.theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}
          >
            <p>Powered by {brandName}</p>
            {project.websiteUrl && (
              <Link
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{
                  color: settings.primaryColor
                }}
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