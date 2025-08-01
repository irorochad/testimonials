import { WidgetTemplate } from '@/types/widget';

export const WIDGET_TEMPLATES: WidgetTemplate[] = [
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
      textColor: '#374151',
      borderColor: '#e5e7eb',
      fontFamily: 'system',
      fontSize: 16,
      fontWeight: 'normal',
      borderRadius: 8,
      borderWidth: 1,
      padding: 24,
      maxWidth: 400,
      showAvatar: true,
      showRating: true,
      showCompany: true,
      showDate: false,
      layout: 'card',
      maxTestimonials: 5,
      autoRotate: true,
      rotationInterval: 5,
      theme: 'light',
      shadow: 'md'
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
      textColor: '#374151',
      borderColor: '#6366f1',
      fontFamily: 'system',
      fontSize: 20,
      fontWeight: 'normal',
      borderRadius: 0,
      borderWidth: 4,
      padding: 40,
      maxWidth: 600,
      showAvatar: false,
      showRating: false,
      showCompany: true,
      showDate: false,
      layout: 'quote',
      maxTestimonials: 1,
      autoRotate: false,
      rotationInterval: 5,
      theme: 'light',
      shadow: 'none'
    }
  },
  {
    id: 'featured-hero',
    name: 'Featured Hero',
    description: 'Large format perfect for hero sections',
    thumbnail: 'https://plus.unsplash.com/premium_photo-1752801716800-3d936e5e4a72?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    component: 'FeaturedHeroWidget',
    category: 'hero',
    defaultSettings: {
      primaryColor: '#059669',
      backgroundColor: '#ffffff',
      textColor: '#374151',
      borderColor: '#e5e7eb',
      fontFamily: 'system',
      fontSize: 18,
      fontWeight: 'medium',
      borderRadius: 12,
      borderWidth: 1,
      padding: 32,
      maxWidth: 800,
      showAvatar: true,
      showRating: true,
      showCompany: true,
      showDate: true,
      layout: 'featured',
      maxTestimonials: 3,
      autoRotate: true,
      rotationInterval: 8,
      theme: 'light',
      shadow: 'lg'
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
      textColor: '#374151',
      borderColor: '#e5e7eb',
      fontFamily: 'system',
      fontSize: 14,
      fontWeight: 'normal',
      borderRadius: 4,
      borderWidth: 0,
      padding: 16,
      maxWidth: 300,
      showAvatar: false,
      showRating: true,
      showCompany: false,
      showDate: false,
      layout: 'minimal',
      maxTestimonials: 10,
      autoRotate: false,
      rotationInterval: 5,
      theme: 'light',
      shadow: 'none'
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
      textColor: '#374151',
      borderColor: '#e5e7eb',
      fontFamily: 'system',
      fontSize: 16,
      fontWeight: 'semibold',
      borderRadius: 20,
      borderWidth: 1,
      padding: 12,
      maxWidth: 200,
      showAvatar: false,
      showRating: true,
      showCompany: false,
      showDate: false,
      layout: 'minimal',
      maxTestimonials: 50,
      autoRotate: false,
      rotationInterval: 5,
      theme: 'light',
      shadow: 'sm'
    }
  }
];

export function getTemplate(id: string): WidgetTemplate | undefined {
  return WIDGET_TEMPLATES.find(template => template.id === id);
}

export function generateWidgetCSS(settings: any): string {
  const fontFamily = settings.fontFamily === 'system' 
    ? '-apple-system, BlinkMacSystemFont, sans-serif'
    : settings.fontFamily;

  return `
    .testimonial-widget {
      --primary-color: ${settings.primaryColor};
      --background-color: ${settings.backgroundColor};
      --text-color: ${settings.textColor};
      --border-color: ${settings.borderColor};
      --border-radius: ${settings.borderRadius}px;
      --border-width: ${settings.borderWidth}px;
      --padding: ${settings.padding}px;
      --font-family: ${fontFamily};
      --font-size: ${settings.fontSize}px;
      --font-weight: ${settings.fontWeight};
      --max-width: ${settings.maxWidth}px;
      --shadow: ${getShadowValue(settings.shadow)};
    }
  `;
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