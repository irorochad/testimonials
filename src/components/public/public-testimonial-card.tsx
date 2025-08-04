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
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Rating */}
          {settings.showRatings && testimonial.rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < testimonial.rating!
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Content */}
          <blockquote className="text-foreground leading-relaxed">
            "{testimonial.content}"
          </blockquote>

          {/* Customer Info */}
          <div className="flex items-center gap-3 pt-2">
            {settings.showImages && (
              <Avatar className="w-10 h-10">
                <AvatarImage 
                  src={testimonial.customerImageUrl} 
                  alt={testimonial.customerName} 
                />
                <AvatarFallback className="text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {testimonial.customerName}
              </p>
              
              {(settings.showTitle || settings.showCompany) && (
                <div className="text-sm text-muted-foreground">
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
          <div className="text-xs text-muted-foreground pt-2 border-t">
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