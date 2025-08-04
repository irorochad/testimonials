'use client'

import { PublicTestimonial, PublicPageSettings } from '@/db/types'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'
import Link from 'next/link'

interface PublicTestimonialCardProps {
  testimonial: PublicTestimonial
  settings: PublicPageSettings
  slug: string
  layout: 'grid' | 'masonry' | 'list'
}

export function PublicTestimonialCard({ 
  testimonial, 
  settings, 
  slug, 
  layout 
}: PublicTestimonialCardProps) {
  const initials = testimonial.customerName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  const cardContent = (
    <Card 
      className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      style={{
        borderColor: settings.theme === 'dark' ? '#374151' : '#e5e7eb',
        backgroundColor: settings.theme === 'dark' ? '#1f2937' : '#ffffff',
        color: settings.theme === 'dark' ? '#f9fafb' : '#111827',
      }}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Rating */}
          {settings.showRatings && testimonial.rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4"
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
            className="leading-relaxed"
            style={{
              color: settings.theme === 'dark' ? '#f9fafb' : '#111827'
            }}
          >
            &ldquo;{testimonial.content}&rdquo;
          </blockquote>

          {/* Customer Info */}
          <div className="flex items-center gap-3 pt-2">
            {settings.showImages && (
              <Avatar className="w-10 h-10">
                <AvatarImage 
                  src={testimonial.customerImageUrl} 
                  alt={testimonial.customerName} 
                />
                <AvatarFallback 
                  className="text-sm"
                  style={{
                    backgroundColor: settings.primaryColor,
                    color: '#ffffff'
                  }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className="flex-1 min-w-0">
              <p 
                className="font-medium truncate"
                style={{
                  color: settings.theme === 'dark' ? '#f9fafb' : '#111827'
                }}
              >
                {testimonial.customerName}
              </p>
              
              {(settings.showTitle || settings.showCompany) && (
                <div 
                  className="text-sm"
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
          </div>

          {/* Date */}
          <div 
            className="text-xs pt-2 border-t"
            style={{
              color: settings.theme === 'dark' ? '#9ca3af' : '#6b7280',
              borderColor: settings.theme === 'dark' ? '#374151' : '#e5e7eb'
            }}
          >
            {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Link 
      href={`/p/${slug}/t/${testimonial.id}`}
      className={layout === 'masonry' ? 'block break-inside-avoid' : 'block'}
    >
      {cardContent}
    </Link>
  )
}