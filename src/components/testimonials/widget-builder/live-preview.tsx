"use client"

import { useState, useEffect } from "react"
import { Star, Play, Pause, ChevronLeft, ChevronRight, X } from "lucide-react"
import { WidgetConfig } from "@/types/widget"

interface LivePreviewProps {
  config: WidgetConfig
}

// Helper function to get shadow class
function getShadowClass(shadow: string) {
  const shadowMap = {
    'none': '',
    'sm': 'shadow-sm',
    'md': 'shadow-md',
    'lg': 'shadow-lg',
    'xl': 'shadow-xl'
  }
  return shadowMap[shadow as keyof typeof shadowMap] || 'shadow-md'
}

// Helper function to get font size class
function getFontSizeClass(fontSize: string) {
  const fontSizeMap = {
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg'
  }
  return fontSizeMap[fontSize as keyof typeof fontSizeMap] || 'text-base'
}

// Helper function to get font weight class
function getFontWeightClass(fontWeight: string) {
  const fontWeightMap = {
    'normal': 'font-normal',
    'medium': 'font-medium',
    'semibold': 'font-semibold',
    'bold': 'font-bold'
  }
  return fontWeightMap[fontWeight as keyof typeof fontWeightMap] || 'font-normal'
}

// Star rating component
function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
        />
      ))}
    </div>
  )
}

// Carousel Widget Preview
function CarouselPreview({ config }: { config: WidgetConfig }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(config.behavior.autoPlay)

  useEffect(() => {
    if (!isPlaying || config.testimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % config.testimonials.length)
    }, config.behavior.slideInterval)

    return () => clearInterval(interval)
  }, [isPlaying, config.testimonials.length, config.behavior.slideInterval])

  const currentTestimonial = config.testimonials[currentIndex]
  if (!currentTestimonial) return null

  const shadowClass = getShadowClass(config.styling.shadow)
  const fontSizeClass = getFontSizeClass(config.styling.fontSize)
  const fontWeightClass = getFontWeightClass(config.styling.fontWeight)

  return (
    <div className="max-w-md mx-auto">
      <div
        className={`rounded-lg ${shadowClass} ${config.styling.border ? 'border-2' : ''}`}
        style={{
          backgroundColor: config.styling.backgroundColor,
          borderRadius: `${config.styling.borderRadius}px`,
          padding: `${config.styling.padding}px`,
          borderColor: config.styling.border ? config.styling.borderColor : 'transparent'
        }}
      >
        {/* Header */}
        <div className="flex items-center mb-4">
          {currentTestimonial.customerImageUrl ? (
            <img
              src={currentTestimonial.customerImageUrl}
              alt={currentTestimonial.customerName}
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full mr-4 flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: config.styling.primaryColor }}
            >
              {currentTestimonial.customerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h4 className={`${fontWeightClass} ${fontSizeClass}`} style={{ color: config.styling.textColor }}>
              {currentTestimonial.customerName}
            </h4>
            {(currentTestimonial.customerTitle || currentTestimonial.customerCompany) && (
              <p className="text-sm opacity-75" style={{ color: config.styling.textColor }}>
                {currentTestimonial.customerTitle}
                {currentTestimonial.customerTitle && currentTestimonial.customerCompany && ' at '}
                {currentTestimonial.customerCompany}
              </p>
            )}
          </div>
        </div>

        {/* Rating */}
        {currentTestimonial.rating && (
          <div className="mb-3">
            <StarRating rating={currentTestimonial.rating} />
          </div>
        )}

        {/* Content */}
        <blockquote className={`mb-4 ${fontSizeClass}`} style={{ color: config.styling.textColor }}>
          "{currentTestimonial.content}"
        </blockquote>

        {/* Controls */}
        {config.testimonials.length > 1 && (
          <div className="flex justify-between items-center">
            {config.behavior.showDots && (
              <div className="flex space-x-2">
                {config.testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'opacity-100' : 'opacity-50'
                      }`}
                    style={{ backgroundColor: config.styling.primaryColor }}
                  />
                ))}
              </div>
            )}

            {config.behavior.showNavigation && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentIndex((prev) =>
                    prev === 0 ? config.testimonials.length - 1 : prev - 1
                  )}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4" style={{ color: config.styling.primaryColor }} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" style={{ color: config.styling.primaryColor }} />
                  ) : (
                    <Play className="w-4 h-4" style={{ color: config.styling.primaryColor }} />
                  )}
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % config.testimonials.length)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <ChevronRight className="w-4 h-4" style={{ color: config.styling.primaryColor }} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Popup Widget Preview
function PopupPreview({ config }: { config: WidgetConfig }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % config.testimonials.length)
        setIsVisible(true)
      }, 300)
    }, config.behavior.displayDuration)

    return () => clearInterval(interval)
  }, [config.testimonials.length, config.behavior.displayDuration])

  const currentTestimonial = config.testimonials[currentIndex]
  if (!currentTestimonial) return null

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  }

  return (
    <div className="relative">
      {/* Mock website background */}
      <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-500 text-sm">
        Your Website Content
      </div>

      {/* Popup */}
      <div className={`absolute ${positionClasses[config.behavior.position]} transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
        <div
          className={`max-w-sm ${getShadowClass(config.styling.shadow)} ${config.styling.border ? 'border-2' : ''}`}
          style={{
            backgroundColor: config.styling.backgroundColor,
            borderRadius: `${config.styling.borderRadius}px`,
            padding: `${config.styling.padding}px`,
            borderColor: config.styling.border ? config.styling.borderColor : 'transparent',
            borderLeftWidth: '4px',
            borderLeftColor: config.styling.primaryColor
          }}
        >
          {config.behavior.showCloseButton && (
            <button className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded">
              <X className="w-3 h-3" style={{ color: config.styling.textColor }} />
            </button>
          )}

          <div className="flex items-center mb-2">
            {currentTestimonial.customerImageUrl ? (
              <img
                src={currentTestimonial.customerImageUrl}
                alt={currentTestimonial.customerName}
                className="w-8 h-8 rounded-full mr-2 object-cover"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white text-xs font-semibold"
                style={{ backgroundColor: config.styling.primaryColor }}
              >
                {currentTestimonial.customerName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h5 className="font-medium text-sm" style={{ color: config.styling.textColor }}>
                {currentTestimonial.customerName}
              </h5>
              {currentTestimonial.rating && (
                <div className="flex">
                  <StarRating rating={currentTestimonial.rating} />
                </div>
              )}
            </div>
          </div>

          <p className="text-xs" style={{ color: config.styling.textColor }}>
            {currentTestimonial.content.substring(0, 80)}...
          </p>
        </div>
      </div>
    </div>
  )
}

// Grid Widget Preview
function GridPreview({ config }: { config: WidgetConfig }) {
  const displayTestimonials = config.testimonials

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }

  const shadowClass = getShadowClass(config.styling.shadow)
  const fontSizeClass = getFontSizeClass(config.styling.fontSize)
  const fontWeightClass = getFontWeightClass(config.styling.fontWeight)

  return (
    <div className={`grid ${gridCols[config.behavior.columns as keyof typeof gridCols]} gap-4`}>
      {displayTestimonials.map((testimonial) => (
        <div
          key={testimonial.id}
          className={`${shadowClass} hover:shadow-lg transition-shadow cursor-pointer ${config.styling.border ? 'border' : ''}`}
          style={{
            backgroundColor: config.styling.backgroundColor,
            borderRadius: `${config.styling.borderRadius}px`,
            padding: `${config.styling.padding}px`,
            borderColor: config.styling.border ? config.styling.borderColor : 'transparent'
          }}
        >
          {testimonial.rating && (
            <div className="mb-2">
              <StarRating rating={testimonial.rating} />
            </div>
          )}

          <blockquote className={`mb-3 ${fontSizeClass}`} style={{ color: config.styling.textColor }}>
            "{testimonial.content}"
          </blockquote>

          <div className="flex items-center">
            {testimonial.customerImageUrl ? (
              <img
                src={testimonial.customerImageUrl}
                alt={testimonial.customerName}
                className="w-8 h-8 rounded-full mr-2 object-cover"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white text-xs font-semibold"
                style={{ backgroundColor: config.styling.primaryColor }}
              >
                {testimonial.customerName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h5 className={`${fontWeightClass} text-xs`} style={{ color: config.styling.textColor }}>
                {testimonial.customerName}
              </h5>
              {testimonial.customerCompany && (
                <p className="text-xs opacity-75" style={{ color: config.styling.textColor }}>
                  {testimonial.customerCompany}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Rating Bar Widget Preview
function RatingBarPreview({ config }: { config: WidgetConfig }) {
  const avgRating = config.testimonials.reduce((acc, t) => acc + (t.rating || 0), 0) / config.testimonials.length
  const displayTestimonials = config.testimonials

  const shadowClass = getShadowClass(config.styling.shadow)

  return (
    <div className="max-w-sm mx-auto">
      <div
        className={`${shadowClass} ${config.styling.border ? 'border' : ''}`}
        style={{
          backgroundColor: config.styling.backgroundColor,
          borderRadius: `${config.styling.borderRadius}px`,
          padding: `${config.styling.padding}px`,
          borderColor: config.styling.border ? config.styling.borderColor : 'transparent'
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className="font-bold text-lg" style={{ color: config.styling.textColor }}>
              {avgRating.toFixed(1)}
            </span>
          </div>
          <span className="text-sm opacity-75" style={{ color: config.styling.textColor }}>
            from {config.testimonials.length} reviews
          </span>
        </div>

        <div className="flex -space-x-2">
          {displayTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="relative">
              {testimonial.customerImageUrl ? (
                <img
                  src={testimonial.customerImageUrl}
                  alt={testimonial.customerName}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                  style={{ backgroundColor: config.styling.primaryColor }}
                >
                  {testimonial.customerName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}

// Avatar Carousel Widget Preview
function AvatarCarouselPreview({ config }: { config: WidgetConfig }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const displayTestimonials = config.testimonials

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-center space-x-4 mb-4">
        {displayTestimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="relative cursor-pointer transform transition-transform hover:scale-110"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {testimonial.customerImageUrl ? (
              <img
                src={testimonial.customerImageUrl}
                alt={testimonial.customerName}
                className="w-16 h-16 rounded-full object-cover border-4"
                style={{ borderColor: config.styling.primaryColor }}
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold border-4"
                style={{
                  backgroundColor: config.styling.primaryColor,
                  borderColor: config.styling.primaryColor
                }}
              >
                {testimonial.customerName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>

      {hoveredIndex !== null && (
        <div
          className={`text-center ${getShadowClass(config.styling.shadow)} ${config.styling.border ? 'border' : ''}`}
          style={{
            backgroundColor: config.styling.backgroundColor,
            borderRadius: `${config.styling.borderRadius}px`,
            padding: `${config.styling.padding}px`,
            borderColor: config.styling.border ? config.styling.borderColor : 'transparent'
          }}
        >
          <blockquote className="text-sm mb-2" style={{ color: config.styling.textColor }}>
            "{displayTestimonials[hoveredIndex].content}"
          </blockquote>
          <cite className="text-xs font-medium" style={{ color: config.styling.primaryColor }}>
            — {displayTestimonials[hoveredIndex].customerName}
          </cite>
        </div>
      )}
    </div>
  )
}

// Quote Spotlight Widget Preview
function QuoteSpotlightPreview({ config }: { config: WidgetConfig }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!config.behavior.autoPlay || config.testimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % config.testimonials.length)
    }, config.behavior.slideInterval)

    return () => clearInterval(interval)
  }, [config.behavior.autoPlay, config.testimonials.length, config.behavior.slideInterval])

  const currentTestimonial = config.testimonials[currentIndex]
  if (!currentTestimonial) return null

  const shadowClass = getShadowClass(config.styling.shadow)
  const fontSizeClass = getFontSizeClass(config.styling.fontSize)
  const fontWeightClass = getFontWeightClass(config.styling.fontWeight)

  return (
    <div className="max-w-lg mx-auto text-center">
      <div
        className={`${shadowClass} ${config.styling.border ? 'border' : ''}`}
        style={{
          backgroundColor: config.styling.backgroundColor,
          borderRadius: `${config.styling.borderRadius}px`,
          padding: `${config.styling.padding * 1.5}px`,
          borderColor: config.styling.border ? config.styling.borderColor : 'transparent'
        }}
      >
        {currentTestimonial.rating && (
          <div className="flex justify-center mb-4">
            <StarRating rating={currentTestimonial.rating} />
          </div>
        )}

        <blockquote className={`text-xl ${fontWeightClass} mb-6 leading-relaxed`} style={{ color: config.styling.textColor }}>
          "{currentTestimonial.content}"
        </blockquote>

        <div className="flex items-center justify-center">
          {currentTestimonial.customerImageUrl ? (
            <img
              src={currentTestimonial.customerImageUrl}
              alt={currentTestimonial.customerName}
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full mr-4 flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: config.styling.primaryColor }}
            >
              {currentTestimonial.customerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-left">
            <cite className={`${fontWeightClass} ${fontSizeClass}`} style={{ color: config.styling.textColor }}>
              {currentTestimonial.customerName}
            </cite>
            {(currentTestimonial.customerTitle || currentTestimonial.customerCompany) && (
              <p className="text-sm opacity-75" style={{ color: config.styling.textColor }}>
                {currentTestimonial.customerTitle}
                {currentTestimonial.customerTitle && currentTestimonial.customerCompany && ' at '}
                {currentTestimonial.customerCompany}
              </p>
            )}
          </div>
        </div>

        {config.testimonials.length > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {config.testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'opacity-100' : 'opacity-50'
                  }`}
                style={{ backgroundColor: config.styling.primaryColor }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function LivePreview({ config }: LivePreviewProps) {
  if (config.testimonials.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No testimonials selected</p>
          <p className="text-sm">Please select testimonials to preview the widget</p>
        </div>
      </div>
    )
  }

  switch (config.type) {
    case 'carousel':
      return <CarouselPreview config={config} />
    case 'popup':
      return <PopupPreview config={config} />
    case 'grid':
      return <GridPreview config={config} />
    case 'rating-bar':
      return <RatingBarPreview config={config} />
    case 'avatar-carousel':
      return <AvatarCarouselPreview config={config} />
    case 'quote-spotlight':
      return <QuoteSpotlightPreview config={config} />
    default:
      return <CarouselPreview config={config} />
  }
}