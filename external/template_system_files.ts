// =============================================================================
// FILE: src/types/testimonial.ts
// PURPOSE: Core type definitions for testimonials and widgets
// =============================================================================

export interface Testimonial {
  id: string;
  content: string;
  author: string;
  title?: string;
  company?: string;
  avatar?: string;
  rating?: number;
  tags?: string[];
  source?: 'email' | 'form' | 'import' | 'scrape';
  createdAt: Date;
  projectId: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  component: string;
  category: 'card' | 'quote' | 'hero' | 'minimal';
  defaultSettings: {
    primaryColor: string;
    backgroundColor: string;
    borderRadius: number;
    showAvatar: boolean;
    showRating: boolean;
    showCompany: boolean;
    layout: 'card' | 'quote' | 'minimal' | 'featured';
    maxTestimonials: number;
    autoRotate: boolean;
    rotationInterval: number; // seconds
  };
}

export interface WidgetConfig {
  id: string;
  projectId: string;
  templateId: string;
  settings: TemplateConfig['defaultSettings'];
  filters: {
    tags?: string[];
    minRating?: number;
    sources?: string[];
    limit?: number;
  };
  embedCode: string;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// FILE: src/lib/templates.ts
// PURPOSE: Template definitions and utility functions
// =============================================================================

import { TemplateConfig } from '@/types/testimonial';

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'clean-card',
    name: 'Clean Card',
    description: 'Simple card layout with avatar and company info',
    thumbnail: '/templates/clean-card.png',
    component: 'CleanCardWidget',
    category: 'card',
    defaultSettings: {
      primaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      borderRadius: 8,
      showAvatar: true,
      showRating: true,
      showCompany: true,
      layout: 'card',
      maxTestimonials: 5,
      autoRotate: true,
      rotationInterval: 5
    }
  },
  {
    id: 'quote-style',
    name: 'Quote Style',
    description: 'Large quote with minimal design',
    thumbnail: '/templates/quote-style.png',
    component: 'QuoteStyleWidget',
    category: 'quote',
    defaultSettings: {
      primaryColor: '#6366f1',
      backgroundColor: '#f8fafc',
      borderRadius: 0,
      showAvatar: false,
      showRating: false,
      showCompany: true,
      layout: 'quote',
      maxTestimonials: 1,
      autoRotate: false,
      rotationInterval: 5
    }
  },
  {
    id: 'featured-hero',
    name: 'Featured Hero',
    description: 'Large format perfect for hero sections',
    thumbnail: '/templates/featured-hero.png',
    component: 'FeaturedHeroWidget',
    category: 'hero',
    defaultSettings: {
      primaryColor: '#059669',
      backgroundColor: '#ffffff',
      borderRadius: 12,
      showAvatar: true,
      showRating: true,
      showCompany: true,
      layout: 'featured',
      maxTestimonials: 3,
      autoRotate: true,
      rotationInterval: 8
    }
  },
  {
    id: 'minimal-list',
    name: 'Minimal List',
    description: 'Simple list format for sidebars',
    thumbnail: '/templates/minimal-list.png',
    component: 'MinimalListWidget',
    category: 'minimal',
    defaultSettings: {
      primaryColor: '#f59e0b',
      backgroundColor: 'transparent',
      borderRadius: 4,
      showAvatar: false,
      showRating: true,
      showCompany: false,
      layout: 'minimal',
      maxTestimonials: 10,
      autoRotate: false,
      rotationInterval: 5
    }
  },
  {
    id: 'rating-badge',
    name: 'Rating Badge',
    description: 'Compact rating display with count',
    thumbnail: '/templates/rating-badge.png',
    component: 'RatingBadgeWidget',
    category: 'minimal',
    defaultSettings: {
      primaryColor: '#dc2626',
      backgroundColor: '#ffffff',
      borderRadius: 20,
      showAvatar: false,
      showRating: true,
      showCompany: false,
      layout: 'minimal',
      maxTestimonials: 50,
      autoRotate: false,
      rotationInterval: 5
    }
  }
];

export function getTemplate(id: string): TemplateConfig | undefined {
  return TEMPLATES.find(template => template.id === id);
}

export function generateWidgetCSS(config: WidgetConfig): string {
  const template = getTemplate(config.templateId);
  if (!template) return '';
  
  return `
    .testimonial-widget-${config.id} {
      --primary-color: ${config.settings.primaryColor};
      --background-color: ${config.settings.backgroundColor};
      --border-radius: ${config.settings.borderRadius}px;
    }
  `;
}

// =============================================================================
// FILE: src/components/widgets/CleanCardWidget.tsx
// PURPOSE: Clean card style testimonial widget component
// =============================================================================

import React from 'react';
import { Testimonial, WidgetConfig } from '@/types/testimonial';

interface CleanCardWidgetProps {
  testimonials: Testimonial[];
  config: WidgetConfig;
  className?: string;
}

export function CleanCardWidget({ testimonials, config, className = '' }: CleanCardWidgetProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const { settings } = config;
  
  // Auto-rotate testimonials if enabled
  React.useEffect(() => {
    if (!settings.autoRotate || testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, settings.rotationInterval * 1000);
    
    return () => clearInterval(interval);
  }, [testimonials.length, settings.autoRotate, settings.rotationInterval]);
  
  if (!testimonials.length) {
    return (
      <div className={`testimonial-widget-placeholder ${className}`}>
        <p>No testimonials to display</p>
      </div>
    );
  }
  
  const current = testimonials[currentIndex];
  
  return (
    <div 
      className={`testimonial-widget testimonial-card ${className}`}
      style={{
        '--primary-color': settings.primaryColor,
        '--background-color': settings.backgroundColor,
        '--border-radius': `${settings.borderRadius}px`,
      } as React.CSSProperties}
    >
      <div className="testimonial-content">
        {settings.showRating && current.rating && (
          <div className="testimonial-rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <span 
                key={i} 
                className={i < current.rating! ? 'star-filled' : 'star-empty'}
              >
                ★
              </span>
            ))}
          </div>
        )}
        
        <blockquote className="testimonial-text">
          "{current.content}"
        </blockquote>
        
        <div className="testimonial-author">
          {settings.showAvatar && current.avatar && (
            <img 
              src={current.avatar} 
              alt={current.author}
              className="author-avatar"
            />
          )}
          
          <div className="author-info">
            <div className="author-name">{current.author}</div>
            {settings.showCompany && (current.title || current.company) && (
              <div className="author-details">
                {current.title}{current.title && current.company && ', '}{current.company}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {testimonials.length > 1 && settings.autoRotate && (
        <div className="testimonial-nav">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      <style jsx>{`
        .testimonial-widget {
          background: var(--background-color);
          border-radius: var(--border-radius);
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-width: 400px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          border: 1px solid #e5e7eb;
        }
        
        .testimonial-rating {
          margin-bottom: 16px;
          font-size: 18px;
        }
        
        .star-filled {
          color: var(--primary-color);
        }
        
        .star-empty {
          color: #e5e7eb;
        }
        
        .testimonial-text {
          font-size: 16px;
          line-height: 1.6;
          margin: 0 0 20px 0;
          font-style: italic;
          color: #374151;
        }
        
        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .author-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #f3f4f6;
        }
        
        .author-name {
          font-weight: 600;
          color: #111827;
          font-size: 15px;
        }
        
        .author-details {
          font-size: 13px;
          color: #6B7280;
          margin-top: 2px;
        }
        
        .testimonial-nav {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
        }
        
        .nav-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .nav-dot:hover {
          background: #9ca3af;
        }
        
        .nav-dot.active {
          background: var(--primary-color);
        }
        
        .testimonial-widget-placeholder {
          padding: 40px;
          text-align: center;
          color: #6b7280;
          background: #f9fafb;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// FILE: src/components/widgets/QuoteStyleWidget.tsx
// PURPOSE: Quote style testimonial widget component
// =============================================================================

import React from 'react';
import { Testimonial, WidgetConfig } from '@/types/testimonial';

interface QuoteStyleWidgetProps {
  testimonials: Testimonial[];
  config: WidgetConfig;
  className?: string;
}

export function QuoteStyleWidget({ testimonials, config, className = '' }: QuoteStyleWidgetProps) {
  const { settings } = config;
  
  if (!testimonials.length) {
    return (
      <div className={`testimonial-widget-placeholder ${className}`}>
        <p>No testimonials to display</p>
      </div>
    );
  }
  
  const testimonial = testimonials[0]; // Quote style typically shows one
  
  return (
    <div 
      className={`testimonial-quote ${className}`}
      style={{
        '--primary-color': settings.primaryColor,
        '--background-color': settings.backgroundColor,
        '--border-radius': `${settings.borderRadius}px`,
      } as React.CSSProperties}
    >
      <div className="quote-mark">"</div>
      
      <blockquote className="quote-text">
        {testimonial.content}
      </blockquote>
      
      <div className="quote-author">
        <span className="author-name">{testimonial.author}</span>
        {settings.showCompany && (testimonial.title || testimonial.company) && (
          <span className="author-details">
            {testimonial.title}{testimonial.title && testimonial.company && ', '}{testimonial.company}
          </span>
        )}
      </div>
      
      <style jsx>{`
        .testimonial-quote {
          background: var(--background-color);
          border-radius: var(--border-radius);
          padding: 40px 32px;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          position: relative;
          border-left: 4px solid var(--primary-color);
        }
        
        .quote-mark {
          font-size: 64px;
          color: var(--primary-color);
          line-height: 1;
          margin-bottom: 16px;
          font-family: Georgia, serif;
          opacity: 0.3;
        }
        
        .quote-text {
          font-size: 20px;
          line-height: 1.6;
          margin: 0 0 24px 0;
          font-style: italic;
          color: #374151;
          font-weight: 400;
        }
        
        .quote-author {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .author-name {
          font-weight: 600;
          color: #111827;
          font-size: 16px;
        }
        
        .author-details {
          font-size: 14px;
          color: #6B7280;
        }
        
        .testimonial-widget-placeholder {
          padding: 40px;
          text-align: center;
          color: #6b7280;
          background: #f9fafb;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// FILE: src/components/widgets/RatingBadgeWidget.tsx  
// PURPOSE: Compact rating badge widget component
// =============================================================================

import React from 'react';
import { Testimonial, WidgetConfig } from '@/types/testimonial';

interface RatingBadgeWidgetProps {
  testimonials: Testimonial[];
  config: WidgetConfig;
  className?: string;
}

export function RatingBadgeWidget({ testimonials, config, className = '' }: RatingBadgeWidgetProps) {
  const { settings } = config;
  
  if (!testimonials.length) return null;
  
  // Calculate average rating
  const ratingsOnly = testimonials.filter(t => t.rating).map(t => t.rating!);
  const averageRating = ratingsOnly.length > 0 
    ? ratingsOnly.reduce((sum, rating) => sum + rating, 0) / ratingsOnly.length 
    : 0;
  
  const totalCount = testimonials.length;
  
  return (
    <div 
      className={`rating-badge ${className}`}
      style={{
        '--primary-color': settings.primaryColor,
        '--background-color': settings.backgroundColor,
        '--border-radius': `${settings.borderRadius}px`,
      } as React.CSSProperties}
    >
      <div className="rating-stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <span 
            key={i} 
            className={i < Math.round(averageRating) ? 'star-filled' : 'star-empty'}
          >
            ★
          </span>
        ))}
      </div>
      
      <div className="rating-info">
        <span className="rating-score">{averageRating.toFixed(1)}</span>
        <span className="rating-count">from {totalCount} reviews</span>
      </div>
      
      <style jsx>{`
        .rating-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--background-color);
          border-radius: var(--border-radius);
          padding: 12px 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          max-width: fit-content;
        }
        
        .rating-stars {
          font-size: 16px;
          display: flex;
          gap: 2px;
        }
        
        .star-filled {
          color: var(--primary-color);
        }
        
        .star-empty {
          color: #e5e7eb;
        }
        
        .rating-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        
        .rating-score {
          font-weight: 600;
          color: #111827;
          font-size: 18px;
          line-height: 1;
        }
        
        .rating-count {
          font-size: 12px;
          color: #6b7280;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}