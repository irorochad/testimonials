"use client"

import { WidgetConfig } from "@/types/widget"
import { useState, useEffect } from "react"

interface LivePreviewProps {
  config: WidgetConfig
}

export function LivePreview({ config }: LivePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(config.behavior.autoPlay)

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || config.testimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % config.testimonials.length)
    }, config.behavior.slideInterval)

    return () => clearInterval(interval)
  }, [isPlaying, config.behavior.slideInterval, config.testimonials.length])

  // Reset index when testimonials change
  useEffect(() => {
    setCurrentIndex(0)
  }, [config.testimonials])

  if (!config.testimonials.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No testimonials to preview
      </div>
    )
  }

  const testimonial = config.testimonials[currentIndex]

  const themeColors = getThemeColors('light') // Always use light theme in preview

  const containerStyle = {
    '--primary-color': config.styling.primaryColor,
    '--background-color': config.styling.backgroundColor,
    '--text-color': config.styling.textColor,
    '--accent-color': config.styling.accentColor,
    '--border-radius': `${config.styling.borderRadius}px`,
    '--padding': `${config.styling.padding}px`,
    '--shadow': getShadowValue(config.styling.shadow),
    '--border-color': config.styling.borderColor,
    '--gap': `${config.styling.gap}px`,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: getFontSize(config.styling.fontSize),
    fontWeight: config.styling.fontWeight,
    color: 'var(--text-color)',
  } as React.CSSProperties

  return (
    <div style={containerStyle}>
      {config.type === 'carousel' && (
        <CarouselPreview 
          testimonial={testimonial}
          config={config}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
        />
      )}
      
      {config.type === 'grid' && (
        <GridPreview 
          testimonials={config.testimonials.slice(0, config.behavior.columns * 2)}
          config={config}
        />
      )}
      
      {config.type === 'popup' && (
        <PopupPreview 
          testimonial={testimonial}
          config={config}
        />
      )}
      
      {config.type === 'rating-bar' && (
        <RatingBarPreview 
          testimonials={config.testimonials}
          config={config}
        />
      )}
      
      {config.type === 'avatar-carousel' && (
        <AvatarCarouselPreview 
          testimonials={config.testimonials}
          config={config}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
        />
      )}
      
      {config.type === 'quote-spotlight' && (
        <QuoteSpotlightPreview 
          testimonial={testimonial}
          config={config}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
        />
      )}
    </div>
  )
}

function CarouselPreview({ 
  testimonial, 
  config, 
  currentIndex, 
  onIndexChange 
}: {
  testimonial: any
  config: WidgetConfig
  currentIndex: number
  onIndexChange: (index: number) => void
}) {
  return (
    <div className="max-w-md mx-auto">
      <div 
        className="widget-container"
        style={{
          backgroundColor: 'var(--background-color)',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--padding)',
          boxShadow: 'var(--shadow)',
          border: config.styling.border ? `1px solid var(--border-color)` : 'none',
        }}
      >
        <div className="flex items-center mb-4">
          {testimonial.customerImageUrl ? (
            <img 
              src={testimonial.customerImageUrl} 
              alt={testimonial.customerName}
              className="w-12 h-12 rounded-full object-cover mr-4"
              style={{ border: `2px solid var(--primary-color)` }}
            />
          ) : (
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold mr-4"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              {testimonial.customerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h4 className="font-semibold" style={{ color: 'var(--primary-color)' }}>
              {testimonial.customerName}
            </h4>
            {(testimonial.customerTitle || testimonial.customerCompany) && (
              <p className="text-sm opacity-80">
                {testimonial.customerTitle}
                {testimonial.customerTitle && testimonial.customerCompany ? ', ' : ''}
                {testimonial.customerCompany}
              </p>
            )}
          </div>
        </div>
        
        {testimonial.rating && (
          <div className="mb-3 text-lg">
            {generateStars(testimonial.rating)}
          </div>
        )}
        
        <blockquote className="italic mb-4 leading-relaxed">
          "{testimonial.content}"
        </blockquote>
        
        {config.testimonials.length > 1 && config.behavior.showDots && (
          <div className="flex justify-center gap-2">
            {config.testimonials.map((_, index) => (
              <button
                key={index}
                className="w-2 h-2 rounded-full transition-colors"
                style={{
                  backgroundColor: index === currentIndex 
                    ? 'var(--primary-color)' 
                    : '#d1d5db'
                }}
                onClick={() => onIndexChange(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function GridPreview({ testimonials, config }: { testimonials: any[], config: WidgetConfig }) {
  return (
    <div 
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${Math.min(config.behavior.columns, testimonials.length)}, 1fr)`,
        gap: 'var(--gap)',
      }}
    >
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="widget-container"
          style={{
            backgroundColor: 'var(--background-color)',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--padding)',
            boxShadow: 'var(--shadow)',
            border: config.styling.border ? `1px solid var(--border-color)` : 'none',
          }}
        >
          {testimonial.rating && (
            <div className="mb-2 text-sm">
              {generateStars(testimonial.rating)}
            </div>
          )}
          
          <p className="text-sm italic mb-3 line-clamp-3">
            "{testimonial.content}"
          </p>
          
          <div className="flex items-center">
            {testimonial.customerImageUrl ? (
              <img 
                src={testimonial.customerImageUrl} 
                alt={testimonial.customerName}
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
            ) : (
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                {testimonial.customerName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold">{testimonial.customerName}</p>
              {testimonial.customerCompany && (
                <p className="text-xs opacity-70">{testimonial.customerCompany}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PopupPreview({ testimonial, config }: { testimonial: any, config: WidgetConfig }) {
  return (
    <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
        Website Content Preview
      </div>
      
      <div 
        className="absolute max-w-xs"
        style={{
          [config.behavior.position.includes('bottom') ? 'bottom' : 'top']: '16px',
          [config.behavior.position.includes('right') ? 'right' : 'left']: '16px',
        }}
      >
        <div
          className="widget-container"
          style={{
            backgroundColor: 'var(--background-color)',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--padding)',
            boxShadow: 'var(--shadow)',
            borderLeft: `4px solid var(--primary-color)`,
          }}
        >
          {config.behavior.showCloseButton && (
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              ×
            </button>
          )}
          
          <div className="flex items-center mb-2">
            {testimonial.customerImageUrl ? (
              <img 
                src={testimonial.customerImageUrl} 
                alt={testimonial.customerName}
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
            ) : (
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                {testimonial.customerName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold">{testimonial.customerName}</p>
              {testimonial.rating && (
                <div className="text-xs">
                  {generateStars(testimonial.rating, 12)}
                </div>
              )}
            </div>
          </div>
          
          <p className="text-xs">
            "{testimonial.content.substring(0, 80)}..."
          </p>
        </div>
      </div>
    </div>
  )
}

function RatingBarPreview({ testimonials, config }: { testimonials: any[], config: WidgetConfig }) {
  const avgRating = testimonials.reduce((acc, t) => acc + (t.rating || 0), 0) / testimonials.length
  const maxAvatars = Math.min(5, testimonials.length)
  
  return (
    <div className="max-w-sm mx-auto">
      <div
        className="widget-container"
        style={{
          backgroundColor: 'var(--background-color)',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--padding)',
          boxShadow: 'var(--shadow)',
          border: config.styling.border ? `1px solid var(--border-color)` : 'none',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="text-lg mr-2">
              {generateStars(Math.round(avgRating), 20)}
            </div>
            <span className="font-bold text-lg">{avgRating.toFixed(1)}</span>
          </div>
          <span className="text-sm opacity-80">
            from {testimonials.length} reviews
          </span>
        </div>
        
        <div className="flex -space-x-1">
          {testimonials.slice(0, maxAvatars).map((testimonial, index) => (
            testimonial.customerImageUrl ? (
              <img
                key={index}
                src={testimonial.customerImageUrl}
                alt={testimonial.customerName}
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
            ) : (
              <div
                key={index}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                {testimonial.customerName.charAt(0).toUpperCase()}
              </div>
            )
          ))}
          {testimonials.length > maxAvatars && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold">
              +{testimonials.length - maxAvatars}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AvatarCarouselPreview({ 
  testimonials, 
  config, 
  currentIndex, 
  onIndexChange 
}: {
  testimonials: any[]
  config: WidgetConfig
  currentIndex: number
  onIndexChange: (index: number) => void
}) {
  const maxAvatars = Math.min(5, testimonials.length)
  const displayTestimonials = testimonials.slice(0, maxAvatars)
  
  return (
    <div className="text-center">
      <div className="flex justify-center gap-4 mb-4">
        {displayTestimonials.map((testimonial, index) => (
          <button
            key={index}
            className="transition-transform hover:scale-110"
            onClick={() => onIndexChange(index)}
          >
            {testimonial.customerImageUrl ? (
              <img
                src={testimonial.customerImageUrl}
                alt={testimonial.customerName}
                className="w-16 h-16 rounded-full object-cover"
                style={{ 
                  border: index === currentIndex 
                    ? `4px solid var(--primary-color)` 
                    : '4px solid #e5e7eb' 
                }}
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ 
                  backgroundColor: 'var(--primary-color)',
                  border: index === currentIndex 
                    ? `4px solid var(--primary-color)` 
                    : '4px solid #e5e7eb' 
                }}
              >
                {testimonial.customerName.charAt(0).toUpperCase()}
              </div>
            )}
          </button>
        ))}
      </div>
      
      <div
        className="widget-container min-h-[120px] flex flex-col justify-center"
        style={{
          backgroundColor: 'var(--background-color)',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--padding)',
          boxShadow: 'var(--shadow)',
          border: config.styling.border ? `1px solid var(--border-color)` : 'none',
        }}
      >
        {currentIndex < displayTestimonials.length ? (
          <>
            <p className="italic mb-3">
              "{displayTestimonials[currentIndex].content}"
            </p>
            <cite className="font-semibold">
              — {displayTestimonials[currentIndex].customerName}
            </cite>
          </>
        ) : (
          <p className="text-gray-500">
            Click on an avatar to see their testimonial
          </p>
        )}
      </div>
    </div>
  )
}

function QuoteSpotlightPreview({ 
  testimonial, 
  config, 
  currentIndex, 
  onIndexChange 
}: {
  testimonial: any
  config: WidgetConfig
  currentIndex: number
  onIndexChange: (index: number) => void
}) {
  return (
    <div className="max-w-lg mx-auto text-center">
      <div
        className="widget-container"
        style={{
          backgroundColor: 'var(--background-color)',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--padding)',
          boxShadow: 'var(--shadow)',
          border: config.styling.border ? `1px solid var(--border-color)` : 'none',
        }}
      >
        {testimonial.rating && (
          <div className="mb-4 text-xl">
            {generateStars(testimonial.rating)}
          </div>
        )}
        
        <blockquote className="text-xl font-semibold italic mb-6 leading-relaxed">
          "{testimonial.content}"
        </blockquote>
        
        <div className="flex items-center justify-center mb-4">
          {testimonial.customerImageUrl ? (
            <img 
              src={testimonial.customerImageUrl} 
              alt={testimonial.customerName}
              className="w-12 h-12 rounded-full object-cover mr-4"
              style={{ border: `2px solid var(--primary-color)` }}
            />
          ) : (
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold mr-4"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              {testimonial.customerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-left">
            <cite className="font-semibold block">{testimonial.customerName}</cite>
            {(testimonial.customerTitle || testimonial.customerCompany) && (
              <p className="text-sm opacity-80">
                {testimonial.customerTitle}
                {testimonial.customerTitle && testimonial.customerCompany ? ', ' : ''}
                {testimonial.customerCompany}
              </p>
            )}
          </div>
        </div>
        
        {config.testimonials.length > 1 && config.behavior.showDots && (
          <div className="flex justify-center gap-2">
            {config.testimonials.map((_, index) => (
              <button
                key={index}
                className="w-2 h-2 rounded-full transition-colors"
                style={{
                  backgroundColor: index === currentIndex 
                    ? 'var(--primary-color)' 
                    : '#d1d5db'
                }}
                onClick={() => onIndexChange(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function generateStars(rating: number, size: number = 16) {
  return Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      style={{ 
        color: i < rating ? 'var(--primary-color)' : '#e5e7eb',
        fontSize: `${size}px`
      }}
    >
      ★
    </span>
  ))
}

function getThemeColors(theme: string) {
  const isDark = theme === 'dark' || (theme === 'auto' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  
  return {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    textColor: isDark ? '#f9fafb' : '#374151',
    borderColor: isDark ? '#374151' : '#e5e7eb',
  }
}

function getFontSize(size: 'sm' | 'base' | 'lg') {
  const sizeMap = {
    'sm': '14px',
    'base': '16px',
    'lg': '18px'
  }
  return sizeMap[size]
}

function getShadowValue(shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl') {
  const shadowMap = {
    'none': 'none',
    'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  }
  return shadowMap[shadow]
}