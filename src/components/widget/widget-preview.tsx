"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { TemplateSchema, TestimonialData } from "@/lib/template-engine";

interface WidgetPreviewProps {
  template: TemplateSchema;
  testimonials?: TestimonialData[];
  scale?: number;
}

// Rating component
const Rating = ({ rating, style, color, size }: { rating: number; style: string; color: string; size: string }) => {
  if (style === 'stars') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            style={{
              width: size,
              height: size,
              color: color,
              fill: i < rating ? color : 'none',
              stroke: color,
              strokeWidth: '1.5'
            }}
          />
        ))}
      </div>
    );
  }

  if (style === 'number') {
    return (
      <span style={{ color, fontSize: size, fontWeight: '600' }}>
        {rating}.0
      </span>
    );
  }

  return null;
};

// Individual testimonial card component
const TestimonialCard = ({ testimonial, template }: { testimonial: TestimonialData; template: TemplateSchema }) => {
  const cardStyle = {
    ...template.testimonialCard,
    flex: template.layout.type === 'grid' ? '1 1 calc(33.333% - 16px)' : 'none',
    minWidth: template.layout.type === 'grid' ? '200px' : 'auto',
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%'
  };

  const avatarInline = template.author.avatar.marginRight;
  const isInlineRating = template.rating.show && template.rating.position === 'inline';

  return (
    <div style={cardStyle}>
      {template.rating.show && template.rating.position === 'top' && (
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: template.testimonialCard.textAlign }}>
          <Rating {...template.rating} rating={testimonial.rating} />
        </div>
      )}

      {/* Avatar - centered when not inline */}
      {!avatarInline && (
        <div style={{
          display: 'flex',
          justifyContent: template.testimonialCard.textAlign,
          marginBottom: template.author.avatar.marginBottom
        }}>
          <img
            src={testimonial.author.avatar}
            alt={testimonial.author.name}
            style={{
              width: template.author.avatar.size,
              height: template.author.avatar.size,
              borderRadius: template.author.avatar.borderRadius,
              border: template.author.avatar.border || 'none',
              objectFit: 'cover' as const
            }}
          />
        </div>
      )}

      {/* Content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: avatarInline ? 'row' : 'column' }}>
        {/* Inline avatar */}
        {avatarInline && (
          <img
            src={testimonial.author.avatar}
            alt={testimonial.author.name}
            style={{
              width: template.author.avatar.size,
              height: template.author.avatar.size,
              borderRadius: template.author.avatar.borderRadius,
              marginRight: template.author.avatar.marginRight,
              border: template.author.avatar.border || 'none',
              objectFit: 'cover' as const,
              flexShrink: 0
            }}
          />
        )}

        <div style={{ flex: 1 }}>
          {/* Testimonial text */}
          <div style={{
            ...template.text,
            marginBottom: template.text.marginBottom
          }}>
            "{testimonial.text}"
          </div>

          {/* Author info */}
          <div style={{
            display: 'flex',
            flexDirection: isInlineRating ? 'row' : 'column',
            alignItems: isInlineRating ? 'center' : 'flex-start',
            gap: isInlineRating ? '8px' : '0'
          }}>
            <div>
              <div style={template.author.name}>
                {testimonial.author.name}
              </div>
              <div style={template.author.title}>
                {testimonial.author.title}
              </div>
            </div>

            {/* Inline rating */}
            {isInlineRating && (
              <Rating {...template.rating} rating={testimonial.rating} />
            )}
          </div>

          {/* Bottom rating */}
          {template.rating.show && template.rating.position === 'bottom' && (
            <div style={{
              marginTop: '12px',
              display: 'flex',
              justifyContent: template.testimonialCard.textAlign
            }}>
              <Rating {...template.rating} rating={testimonial.rating} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function WidgetPreview({ template, testimonials = [], scale = 1 }: WidgetPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerStyle = {
    ...template.container,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: template.container.width,
    height: template.container.height
  };

  const renderLayout = () => {
    if (testimonials.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p>No testimonials available</p>
            <p className="text-xs mt-1">Add testimonials to see the preview</p>
          </div>
        </div>
      );
    }

    switch (template.layout.type) {
      case 'carousel':
        return (
          <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%'
            }}>
              <TestimonialCard
                testimonial={testimonials[currentIndex]}
                template={template}
              />
            </div>

            {template.navigation?.arrows && testimonials.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
                  style={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}
                >
                  <ChevronLeft style={{ width: '16px', height: '16px' }} />
                </button>
                <button
                  onClick={() => setCurrentIndex(prev => prev === testimonials.length - 1 ? 0 : prev + 1)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}
                >
                  <ChevronRight style={{ width: '16px', height: '16px' }} />
                </button>
              </>
            )}

            {template.navigation?.dots && testimonials.length > 1 && (
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                zIndex: 10
              }}>
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: index === currentIndex ? '#374151' : '#d1d5db',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'single':
        return (
          <TestimonialCard
            testimonial={testimonials[0]}
            template={template}
          />
        );

      case 'grid':
        const gridCols = Math.min(template.layout.itemsPerView, testimonials.length);
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gap: template.layout.gap,
              width: '100%'
            }}
          >
            {testimonials.slice(0, template.layout.itemsPerView).map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                template={template}
              />
            ))}
          </div>
        );

      case 'list':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: template.layout.gap,
              width: '100%'
            }}
          >
            {testimonials.slice(0, template.layout.itemsPerView).map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                template={template}
              />
            ))}
          </div>
        );

      default:
        return <div>Unknown layout type</div>;
    }
  };

  return (
    <div style={containerStyle}>
      {renderLayout()}
    </div>
  );
}