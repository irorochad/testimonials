
export type WidgetType = 'carousel' | 'popup' | 'grid' | 'rating-bar' | 'avatar-carousel' | 'quote-spotlight'

export interface WidgetStyling {
  primaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
  fontSize: 'sm' | 'base' | 'lg'
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold'
  borderRadius: number
  padding: number
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  border: boolean
  borderColor: string
  gap: number
  margin: number
}

export interface WidgetBehavior {
  autoPlay: boolean
  slideInterval: number
  displayDuration: number
  animationType: 'slide' | 'fade' | 'zoom'
  showNavigation: boolean
  showDots: boolean
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  columns: number
  pauseOnHover: boolean
  clickToExpand: boolean
  showCloseButton: boolean
}

export interface WidgetConfig {
  id: string
  type: WidgetType
  testimonials: WidgetTestimonial[]
  styling: WidgetStyling
  behavior: WidgetBehavior
}

export interface WidgetTestimonial {
  id: string
  customerName: string
  customerCompany?: string | null
  customerTitle?: string | null
  customerImageUrl?: string | null
  content: string
  rating?: number | null
  createdAt: Date
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface ColorPreset {
  name: string
  primary: string
  secondary: string
}

export const defaultWidgetConfig: Omit<WidgetConfig, 'id' | 'testimonials'> = {
  type: 'carousel',
  styling: {
    primaryColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    accentColor: '#F59E0B',
    fontSize: 'base',
    fontWeight: 'normal',
    borderRadius: 8,
    padding: 16,
    shadow: 'md',
    border: false,
    borderColor: '#E5E7EB',
    gap: 16,
    margin: 0
  },
  behavior: {
    autoPlay: true,
    slideInterval: 4000,
    displayDuration: 5000,
    animationType: 'slide',
    showNavigation: true,
    showDots: true,
    position: 'bottom-right',
    columns: 3,
    pauseOnHover: true,
    clickToExpand: false,
    showCloseButton: true
  }
}

export const colorPresets: ColorPreset[] = [
  { name: 'Blue', primary: '#3B82F6', secondary: '#EFF6FF' },
  { name: 'Purple', primary: '#8B5CF6', secondary: '#F3E8FF' },
  { name: 'Green', primary: '#10B981', secondary: '#ECFDF5' },
  { name: 'Orange', primary: '#F59E0B', secondary: '#FFFBEB' },
  { name: 'Pink', primary: '#EC4899', secondary: '#FDF2F8' },
  { name: 'Dark', primary: '#1F2937', secondary: '#F9FAFB' }
]

export const widgetTypes = [
  {
    id: 'carousel' as WidgetType,
    name: 'Carousel/Slider',
    description: 'Auto-sliding testimonials with navigation',
    minTestimonials: 1,
    icon: 'ChevronRight'
  },
  {
    id: 'popup' as WidgetType,
    name: 'Popup Notifications',
    description: 'Timed popup testimonials on your site',
    minTestimonials: 1,
    icon: 'MessageSquare'
  },
  {
    id: 'grid' as WidgetType,
    name: 'Grid Layout',
    description: 'Masonry testimonial grid display',
    minTestimonials: 2,
    icon: 'Grid3X3'
  },
  {
    id: 'rating-bar' as WidgetType,
    name: 'Rating Bar',
    description: 'Compact rating display with avatars',
    minTestimonials: 1,
    icon: 'Star'
  },
  {
    id: 'avatar-carousel' as WidgetType,
    name: 'Avatar Carousel',
    description: 'Customer photos with hover quotes',
    minTestimonials: 3,
    icon: 'Users'
  },
  {
    id: 'quote-spotlight' as WidgetType,
    name: 'Quote Spotlight',
    description: 'Featured rotating testimonial',
    minTestimonials: 1,
    icon: 'Sparkles'
  }
]