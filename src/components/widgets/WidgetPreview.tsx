'use client';

import React from 'react';
import { WidgetTemplate, WidgetSettings } from '@/types/widget';
import { generateWidgetCSS } from '@/lib/widget-templates';

interface WidgetPreviewProps {
    template: WidgetTemplate;
    settings: WidgetSettings;
}

// Mock testimonial data for preview
const MOCK_TESTIMONIALS = [
    {
        id: '1',
        customerName: 'Sarah Johnson',
        customerCompany: 'TechCorp Inc.',
        customerTitle: 'Product Manager',
        content: 'This product has completely transformed how we handle customer feedback. The interface is intuitive and the results are amazing!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        createdAt: new Date('2024-01-15')
    },
    {
        id: '2',
        customerName: 'Michael Chen',
        customerCompany: 'StartupXYZ',
        customerTitle: 'CEO',
        content: 'Outstanding service and support. Highly recommend to anyone looking for a reliable solution.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        createdAt: new Date('2024-01-10')
    },
    {
        id: '3',
        customerName: 'Emily Rodriguez',
        customerCompany: 'Design Studio',
        customerTitle: 'Creative Director',
        content: 'The customization options are fantastic. We were able to match our brand perfectly.',
        rating: 4,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        createdAt: new Date('2024-01-08')
    }
];

export function WidgetPreview({ template, settings }: WidgetPreviewProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    // Auto-rotate testimonials if enabled
    React.useEffect(() => {
        if (!settings.autoRotate || MOCK_TESTIMONIALS.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % MOCK_TESTIMONIALS.length);
        }, settings.rotationInterval * 1000);

        return () => clearInterval(interval);
    }, [settings.autoRotate, settings.rotationInterval]);

    const testimonials = MOCK_TESTIMONIALS.slice(0, settings.maxTestimonials);

    // Generate CSS variables for the widget
    const cssVariables = {
        '--primary-color': settings.primaryColor,
        '--background-color': settings.backgroundColor,
        '--text-color': settings.textColor,
        '--border-color': settings.borderColor,
        '--border-radius': `${settings.borderRadius}px`,
        '--border-width': `${settings.borderWidth}px`,
        '--padding': `${settings.padding}px`,
        '--font-family': settings.fontFamily === 'system'
            ? '-apple-system, BlinkMacSystemFont, sans-serif'
            : settings.fontFamily,
        '--font-size': `${settings.fontSize}px`,
        '--font-weight': settings.fontWeight,
        '--max-width': `${settings.maxWidth}px`,
        '--shadow': getShadowValue(settings.shadow),
    } as React.CSSProperties;

    const renderWidget = () => {
        switch (template.id) {
            case 'clean-card':
                return <CleanCardPreview testimonials={testimonials} settings={settings} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />;
            case 'quote-style':
                return <QuoteStylePreview testimonials={testimonials} settings={settings} />;
            case 'featured-hero':
                return <FeaturedHeroPreview testimonials={testimonials} settings={settings} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />;
            case 'minimal-list':
                return <MinimalListPreview testimonials={testimonials} settings={settings} />;
            case 'rating-badge':
                return <RatingBadgePreview testimonials={testimonials} settings={settings} />;
            default:
                return <CleanCardPreview testimonials={testimonials} settings={settings} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />;
        }
    };

    return (
        <div
            className="testimonial-widget-preview"
            style={cssVariables}
        >
            {renderWidget()}

            <style jsx>{`
        .testimonial-widget-preview {
          font-family: var(--font-family);
          color: var(--text-color);
        }
        
        .widget-container {
          background: var(--background-color);
          border-radius: var(--border-radius);
          border: var(--border-width) solid var(--border-color);
          padding: var(--padding);
          box-shadow: var(--shadow);
          max-width: var(--max-width);
          margin: 0 auto;
        }
        
        .testimonial-content {
          font-size: var(--font-size);
          font-weight: var(--font-weight);
          line-height: 1.6;
        }
        
        .star-filled {
          color: var(--primary-color);
        }
        
        .star-empty {
          color: #e5e7eb;
        }
        
        .nav-dot {
          width: 8px;
          height: 8px;
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
      `}</style>
        </div>
    );
}

// Individual widget preview components
function CleanCardPreview({ testimonials, settings, currentIndex, setCurrentIndex }: any) {
    if (!testimonials.length) return <div>No testimonials</div>;

    const current = testimonials[currentIndex];

    return (
        <div className="widget-container">
            {settings.showRating && current.rating && (
                <div className="mb-4 text-lg">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < current.rating ? 'star-filled' : 'star-empty'}>
                            ★
                        </span>
                    ))}
                </div>
            )}

            <blockquote className="testimonial-content mb-5 italic">
                "{current.content}"
            </blockquote>

            <div className="flex items-center gap-3">
                {settings.showAvatar && current.avatar && (
                    <img
                        src={current.avatar}
                        alt={current.customerName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                )}

                <div>
                    <div className="font-semibold">{current.customerName}</div>
                    {settings.showCompany && (current.customerTitle || current.customerCompany) && (
                        <div className="text-sm opacity-75">
                            {current.customerTitle}{current.customerTitle && current.customerCompany && ', '}{current.customerCompany}
                        </div>
                    )}
                </div>
            </div>

            {testimonials.length > 1 && settings.autoRotate && (
                <div className="flex justify-center gap-2 mt-5">
                    {testimonials.map((_: any, index: number) => (
                        <button
                            key={index}
                            className={`nav-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function QuoteStylePreview({ testimonials, settings }: any) {
    if (!testimonials.length) return <div>No testimonials</div>;

    const testimonial = testimonials[0];

    return (
        <div className="widget-container text-center">
            <div className="text-6xl opacity-30 mb-4" style={{ color: settings.primaryColor }}>
                "
            </div>

            <blockquote className="testimonial-content mb-6 italic">
                {testimonial.content}
            </blockquote>

            <div>
                <div className="font-semibold">{testimonial.customerName}</div>
                {settings.showCompany && (testimonial.customerTitle || testimonial.customerCompany) && (
                    <div className="text-sm opacity-75 mt-1">
                        {testimonial.customerTitle}{testimonial.customerTitle && testimonial.customerCompany && ', '}{testimonial.customerCompany}
                    </div>
                )}
            </div>
        </div>
    );
}

function FeaturedHeroPreview({ testimonials, settings, currentIndex, setCurrentIndex }: any) {
    if (!testimonials.length) return <div>No testimonials</div>;

    const current = testimonials[currentIndex];

    return (
        <div className="widget-container">
            <div className="flex items-start gap-4">
                {settings.showAvatar && current.avatar && (
                    <img
                        src={current.avatar}
                        alt={current.customerName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                    />
                )}

                <div className="flex-1">
                    {settings.showRating && current.rating && (
                        <div className="mb-3 text-xl">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={i < current.rating ? 'star-filled' : 'star-empty'}>
                                    ★
                                </span>
                            ))}
                        </div>
                    )}

                    <blockquote className="testimonial-content mb-4 italic">
                        "{current.content}"
                    </blockquote>

                    <div>
                        <div className="font-semibold text-lg">{current.customerName}</div>
                        {settings.showCompany && (current.customerTitle || current.customerCompany) && (
                            <div className="opacity-75 mt-1">
                                {current.customerTitle}{current.customerTitle && current.customerCompany && ', '}{current.customerCompany}
                            </div>
                        )}
                        {settings.showDate && (
                            <div className="text-sm opacity-60 mt-1">
                                {current.createdAt.toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {testimonials.length > 1 && settings.autoRotate && (
                <div className="flex justify-center gap-2 mt-6">
                    {testimonials.map((_: any, index: number) => (
                        <button
                            key={index}
                            className={`nav-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function MinimalListPreview({ testimonials, settings }: any) {
    return (
        <div className="widget-container space-y-3">
            {testimonials.slice(0, 3).map((testimonial: any) => (
                <div key={testimonial.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex-1">
                        {settings.showRating && testimonial.rating && (
                            <div className="mb-1 text-sm">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={i < testimonial.rating ? 'star-filled' : 'star-empty'}>
                                        ★
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="testimonial-content text-sm mb-2">
                            "{testimonial.content.substring(0, 80)}..."
                        </div>

                        <div className="text-xs font-medium">{testimonial.customerName}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function RatingBadgePreview({ testimonials, settings }: any) {
    const ratingsOnly = testimonials.filter((t: any) => t.rating).map((t: any) => t.rating);
    const averageRating = ratingsOnly.length > 0
        ? ratingsOnly.reduce((sum: number, rating: number) => sum + rating, 0) / ratingsOnly.length
        : 0;

    return (
        <div className="widget-container flex items-center gap-3 w-fit">
            <div className="text-lg">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < Math.round(averageRating) ? 'star-filled' : 'star-empty'}>
                        ★
                    </span>
                ))}
            </div>

            <div>
                <div className="font-semibold text-lg leading-none">
                    {averageRating.toFixed(1)}
                </div>
                <div className="text-xs opacity-75 mt-1">
                    from {testimonials.length} reviews
                </div>
            </div>
        </div>
    );
}

function getShadowValue(shadow: string): string {
    switch (shadow) {
        case 'none': return 'none';
        case 'sm': return '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        case 'md': return '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        case 'lg': return '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        default: return '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }
}