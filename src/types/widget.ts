// Widget configuration and customization types

export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  component: string;
  category: 'card' | 'quote' | 'hero' | 'minimal';
  defaultSettings: WidgetSettings;
}

export interface WidgetSettings {
  // Colors
  primaryColor: string;
  
  // Typography
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  
  // Layout
  borderRadius: number;
  borderWidth: number;
  padding: number;
  maxWidth: number;
  
  // Display options
  showAvatar: boolean;
  showRating: boolean;
  showCompany: boolean;
  showDate: boolean;
  
  // Behavior
  layout: 'card' | 'quote' | 'minimal' | 'featured';
  maxTestimonials: number;
  autoRotate: boolean;
  rotationInterval: number; // seconds
  
  // Theme
  theme: 'light' | 'dark' | 'auto';
  shadow: 'none' | 'sm' | 'md' | 'lg';
}

// Helper function to get theme colors based on theme setting
export function getThemeColors(theme: 'light' | 'dark' | 'auto') {
  const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  return {
    backgroundColor: isDark ? '#1f2937' : '#f9fafb', // gray-800 : gray-50
    textColor: isDark ? '#f9fafb' : '#374151', // gray-50 : gray-700
    borderColor: isDark ? '#374151' : '#e5e7eb', // gray-700 : gray-200
  };
}

export interface WidgetConfig {
  id: string;
  projectId: string;
  templateId: string;
  settings: WidgetSettings;
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

export interface WidgetPreviewData {
  testimonials: Array<{
    id: string;
    customerName: string;
    customerCompany?: string;
    customerTitle?: string;
    content: string;
    rating?: number;
    avatar?: string;
    createdAt: Date;
  }>;
  config: WidgetConfig;
}

// Font options for customization
export const FONT_OPTIONS = [
  { value: 'system', label: 'System Default', family: '-apple-system, BlinkMacSystemFont, sans-serif' },
  { value: 'inter', label: 'Inter', family: 'Inter, sans-serif' },
  { value: 'roboto', label: 'Roboto', family: 'Roboto, sans-serif' },
  { value: 'open-sans', label: 'Open Sans', family: 'Open Sans, sans-serif' },
  { value: 'lato', label: 'Lato', family: 'Lato, sans-serif' },
  { value: 'poppins', label: 'Poppins', family: 'Poppins, sans-serif' },
  { value: 'montserrat', label: 'Montserrat', family: 'Montserrat, sans-serif' },
  { value: 'source-sans', label: 'Source Sans Pro', family: 'Source Sans Pro, sans-serif' },
] as const;

// Color presets for quick selection
export const COLOR_PRESETS = [
  { name: 'Blue', primary: '#3b82f6', background: '#ffffff', text: '#374151' },
  { name: 'Green', primary: '#059669', background: '#ffffff', text: '#374151' },
  { name: 'Purple', primary: '#7c3aed', background: '#ffffff', text: '#374151' },
  { name: 'Orange', primary: '#ea580c', background: '#ffffff', text: '#374151' },
  { name: 'Pink', primary: '#db2777', background: '#ffffff', text: '#374151' },
  { name: 'Dark', primary: '#6366f1', background: '#1f2937', text: '#f9fafb' },
  { name: 'Minimal', primary: '#6b7280', background: '#f9fafb', text: '#374151' },
] as const;