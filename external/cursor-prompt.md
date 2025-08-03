# Testimonial Widget Builder - Cursor Prompt

## Project Overview
Build a comprehensive testimonial widget builder for a Senja-like tool. Users can export testimonials as embeddable widgets with extensive customization options. The system generates clean HTML/CSS/JS embed codes that work on any website.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI or Radix UI (optional)
- **Icons**: Lucide React
- **State Management**: React useState/useReducer 
- **TypeScript**: Preferred for type safety

## Core Features Required



### 2. Widget Types Implementation

#### A. Carousel/Slider Widget
- Auto-sliding testimonials with navigation dots
- Configurable slide interval (2-10 seconds)
- Max items display (1-10 testimonials)
- Navigation arrows (optional)
- Pause on hover functionality
- Mobile responsive (1 item on mobile, configurable on desktop)

#### B. Popup Notification Widget
- Timed popups appearing at intervals
- Configurable position (bottom-right, bottom-left, top-right, top-left)
- Display duration (2-15 seconds)
- Smooth fade in/out animations
- Close button option
- Multiple testimonials cycling through

#### C. Grid Layout Widget
- Masonry or uniform grid display
- Configurable columns (1-4 columns)
- Max items limit (1-20 testimonials)
- Hover effects and animations
- Responsive breakpoints

#### D. Rating Bar Widget
- Compact horizontal display
- Average rating calculation
- Customer avatars with count
- Click to expand functionality
- Trust indicators (review count, average rating)

#### E. Avatar Carousel Widget
- Customer photos as primary focus
- Mini testimonial on hover/click
- Continuous scroll animation
- Company logos integration

#### F. Quote Spotlight Widget
- Single rotating featured testimonial
- Large typography emphasis
- Background patterns/gradients
- Author attribution styling

### 3. Real-time Preview System
- Live preview updates as users customize
- Device preview modes (desktop, tablet, mobile)
- Interactive preview (users can interact with widget)
- Preview background options (light, dark, custom website mockup)

### 4. Customization Panel Features

#### Visual Styling
```typescript
interface StylingOptions {
  // Color system
  primaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
  
  // Typography
  fontSize: 'sm' | 'base' | 'lg'
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold'
  
  // Layout
  borderRadius: number // 0-20px
  padding: number // 8-32px
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  border: boolean
  borderColor: string
  
  // Spacing
  gap: number // for grid layouts
  margin: number
}
```

#### Behavioral Options
```typescript
interface BehaviorOptions {
  // Animation
  autoPlay: boolean
  slideInterval: number // 1000-10000ms
  displayDuration: number // for popups, 2000-15000ms
  animationType: 'slide' | 'fade' | 'zoom'
  
  // Display
  maxItems: number
  showNavigation: boolean
  showDots: boolean
  position: string // for popups
  columns: number // for grids
  
  // Interaction
  pauseOnHover: boolean
  clickToExpand: boolean
  showCloseButton: boolean
}
```

### 5. Embed Code Generation Engine

#### HTML/CSS/JS Output
```javascript
// Generate clean, production-ready embed code
function generateEmbedCode(config: WidgetConfig): string {
  return `
<!-- Testimonial Widget -->
<div id="testimonial-widget-${config.id}"></div>
<script>
(function() {
  // Widget configuration
  const config = ${JSON.stringify(config, null, 2)};
  
  // Widget renderer
  class TestimonialWidget {
    constructor(config) {
      this.config = config;
      this.container = document.getElementById('testimonial-widget-${config.id}');
      this.currentIndex = 0;
      this.init();
    }
    
    init() {
      this.render();
      this.bindEvents();
      if (this.config.behavior.autoPlay) {
        this.startAutoPlay();
      }
    }
    
    render() {
      // Widget-specific rendering logic
      this.container.innerHTML = this.generateHTML();
      this.applyStyles();
    }
    
    generateHTML() {
      // Generate HTML based on widget type
    }
    
    applyStyles() {
      // Apply custom CSS
    }
    
    bindEvents() {
      // Event listeners
    }
  }
  
  // Initialize widget
  new TestimonialWidget(config);
})();
</script>
<style>
/* Widget-specific CSS */
</style>
  `;
}
```

### 6. Validation & Error Handling

#### User Input Validation
- Minimum testimonials required for different widget types
- Color value validation (hex, rgb, named colors)
- Numeric range validation for timing/sizing options
- Required field checks

#### Error Messages & Guidance
```typescript
const validationRules = {
  carousel: {
    minTestimonials: 1,
    message: "Carousel requires at least 1 testimonial"
  },
  popup: {
    minTestimonials: 1,
    message: "Popup widget requires at least 1 testimonial"
  },
  grid: {
    minTestimonials: 2,
    message: "Grid layout requires at least 2 testimonials"
  },
  // ... other rules
};
```

### 7. Export Options Implementation

#### Copy to Clipboard
- One-click copy embed code
- Success toast notification
- Code formatting and syntax highlighting

#### Download Widget
- Generate HTML file with complete widget
- Include CDN links for external dependencies
- Standalone file that works offline

#### Share Preview
- Generate temporary preview URL
- Shareable link with widget demo
- Optional password protection

### 8. Responsive Design Requirements

#### Mobile-First Approach
```css
/* Example responsive breakpoints */
.testimonial-widget {
  /* Mobile: 1 column/item */
  @media (min-width: 640px) {
    /* Tablet: 2 columns/items */
  }
  
  @media (min-width: 1024px) {
    /* Desktop: 3+ columns/items */
  }
}
```

#### Touch-Friendly Interactions
- Swipe gestures for carousels
- Tap targets minimum 44px
- Touch feedback animations

### 9. Performance Considerations

#### Code Optimization
- Lazy loading for images
- Minimal CSS/JS footprint
- CDN-ready assets
- No external dependencies in generated code

#### Loading States
- Skeleton loading for preview
- Progressive image loading
- Smooth transitions

### 10. File Structure
```
/components/
  /testimonial-builder/
    WidgetBuilder.tsx (main component)
    WidgetTypeSelector.tsx
    ConfigurationPanel.tsx
    LivePreview.tsx
    /widgets/
      CarouselWidget.tsx
      PopupWidget.tsx
      GridWidget.tsx
      RatingBarWidget.tsx
      AvatarCarouselWidget.tsx
      QuoteSpotlightWidget.tsx
    /utils/
      embedCodeGenerator.ts
      validation.ts
      colorUtils.ts
/types/
  testimonial.ts
  widget.ts
/hooks/
  useWidgetBuilder.ts
  useEmbedGenerator.ts
```

## Implementation Instructions

### Phase 1: Core Structure
1. Create the main WidgetBuilder component with modal/full-page layout
2. Implement widget type selection with visual cards and descriptions
3. Build the basic configuration panel with tabs (Styling, Behavior, Content)
4. Set up the live preview container with device switching

### Phase 2: Widget Components
1. Build each widget type as separate React components
2. Implement real-time prop updates from configuration
3. Add smooth animations and transitions
4. Ensure mobile responsiveness for all widgets

### Phase 3: Customization System
1. Create color picker with presets and custom input
2. Build typography and spacing controls
3. Implement behavior settings (auto-play, timing, positioning)
4. Add validation with helpful error messages

### Phase 4: Embed Code Generation
1. Create the JavaScript widget renderer class
2. Build CSS generation system with custom properties
3. Implement HTML template system for each widget type
4. Add minification and optimization

### Phase 5: Export Features
1. Implement clipboard copy with syntax highlighting
2. Create downloadable HTML file generation
3. Build shareable preview URL system
4. Add export analytics/tracking

## Code Examples & Patterns

### Main Widget Builder Component
```tsx
'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Download, Share2 } from 'lucide-react'

interface WidgetBuilderProps {
  isOpen: boolean
  onClose: () => void
  testimonials: Testimonial[]
  selectedTestimonials?: Testimonial[]
}

export function WidgetBuilder({ isOpen, onClose, testimonials, selectedTestimonials }: WidgetBuilderProps) {
  const [selectedWidget, setSelectedWidget] = useState<WidgetType>('carousel')
  const [config, setConfig] = useState<WidgetConfig>(defaultConfig)
  const [activeTab, setActiveTab] = useState<'style' | 'behavior' | 'content'>('style')

  const handleConfigUpdate = useCallback((updates: Partial<WidgetConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }, [])

  const handleExport = useCallback(() => {
    const embedCode = generateEmbedCode(config)
    navigator.clipboard.writeText(embedCode)
    // Show success toast
  }, [config])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Component content */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### Embed Code Generator
```typescript
export function generateEmbedCode(config: WidgetConfig): string {
  const widgetId = `testimonial-widget-${Date.now()}`
  
  const css = generateWidgetCSS(config)
  const html = generateWidgetHTML(config, widgetId)
  const javascript = generateWidgetJS(config, widgetId)
  
  return `<!-- Testimonial Widget - Auto-generated -->
<div id="${widgetId}"></div>
<script>
${javascript}
</script>
<style>
${css}
</style>`
}

function generateWidgetCSS(config: WidgetConfig): string {
  const { styling } = config
  
  return `
.testimonial-widget {
  --primary-color: ${styling.primaryColor};
  --background-color: ${styling.backgroundColor};
  --text-color: ${styling.textColor};
  --border-radius: ${styling.borderRadius}px;
  --padding: ${styling.padding}px;
  
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
}

.testimonial-widget * {
  box-sizing: border-box;
}

/* Widget-specific styles based on type */
${getWidgetSpecificCSS(config.type, styling)}
`
}

function generateWidgetJS(config: WidgetConfig, widgetId: string): string {
  return `
(function() {
  'use strict';
  
  const config = ${JSON.stringify(config, null, 2)};
  
  class TestimonialWidget {
    constructor(containerId, config) {
      this.container = document.getElementById(containerId);
      this.config = config;
      this.currentIndex = 0;
      this.isPlaying = config.behavior.autoPlay || false;
      this.intervals = [];
      
      if (!this.container) {
        console.error('Testimonial widget container not found:', containerId);
        return;
      }
      
      this.init();
    }
    
    init() {
      this.render();
      this.bindEvents();
      if (this.isPlaying) {
        this.startAutoPlay();
      }
    }
    
    render() {
      this.container.className = 'testimonial-widget testimonial-widget--' + this.config.type;
      this.container.innerHTML = this.generateHTML();
      this.applyCustomStyles();
    }
    
    generateHTML() {
      switch (this.config.type) {
        case 'carousel':
          return this.generateCarouselHTML();
        case 'popup':
          return this.generatePopupHTML();
        case 'grid':
          return this.generateGridHTML();
        case 'rating-bar':
          return this.generateRatingBarHTML();
        default:
          return '';
      }
    }
    
    generateCarouselHTML() {
      const testimonials = this.config.testimonials;
      const current = testimonials[this.currentIndex] || testimonials[0];
      
      return \`
        <div class="carousel-container">
          <div class="testimonial-card">
            <div class="testimonial-header">
              <img src="\${current.avatar}" alt="\${current.name}" class="avatar" />
              <div class="author-info">
                <h4 class="author-name">\${current.name}</h4>
                <p class="author-role">\${current.role} at \${current.company}</p>
              </div>
            </div>
            <div class="rating">
              \${this.generateStars(current.rating)}
            </div>
            <p class="testimonial-text">\${current.text}</p>
          </div>
          <div class="carousel-controls">
            <div class="dots">
              \${testimonials.map((_, i) => \`<span class="dot \${i === this.currentIndex ? 'active' : ''}" data-index="\${i}"></span>\`).join('')}
            </div>
            <button class="play-pause" data-action="toggle-play">
              \${this.isPlaying ? '⏸️' : '▶️'}
            </button>
          </div>
        </div>
      \`;
    }
    
    generateStars(rating) {
      return Array.from({ length: 5 }, (_, i) => 
        \`<span class="star \${i < rating ? 'filled' : ''}">★</span>\`
      ).join('');
    }
    
    bindEvents() {
      // Dot navigation
      this.container.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.index);
          this.goToSlide(index);
        });
      });
      
      // Play/pause toggle
      const playPauseBtn = this.container.querySelector('.play-pause');
      if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
          this.toggleAutoPlay();
        });
      }
      
      // Pause on hover
      if (this.config.behavior.pauseOnHover) {
        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.container.addEventListener('mouseleave', () => this.resumeAutoPlay());
      }
    }
    
    goToSlide(index) {
      this.currentIndex = index;
      this.render();
    }
    
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.config.testimonials.length;
      this.render();
    }
    
    startAutoPlay() {
      this.stopAutoPlay();
      this.isPlaying = true;
      const interval = setInterval(() => {
        this.nextSlide();
      }, this.config.behavior.slideInterval || 4000);
      this.intervals.push(interval);
    }
    
    stopAutoPlay() {
      this.isPlaying = false;
      this.intervals.forEach(clearInterval);
      this.intervals = [];
    }
    
    toggleAutoPlay() {
      if (this.isPlaying) {
        this.stopAutoPlay();
      } else {
        this.startAutoPlay();
      }
      this.render();
    }
    
    pauseAutoPlay() {
      if (this.isPlaying) {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
      }
    }
    
    resumeAutoPlay() {
      if (this.isPlaying && this.intervals.length === 0) {
        this.startAutoPlay();
      }
    }
    
    applyCustomStyles() {
      // Apply any additional custom styling
      const style = document.createElement('style');
      style.textContent = this.generateCustomCSS();
      document.head.appendChild(style);
    }
    
    generateCustomCSS() {
      return \`
        #${widgetId} {
          /* Custom CSS based on configuration */
        }
      \`;
    }
    
    destroy() {
      this.stopAutoPlay();
      if (this.container) {
        this.container.innerHTML = '';
      }
    }
  }
  
  // Initialize the widget
  const widget = new TestimonialWidget('${widgetId}', config);
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    widget.destroy();
  });
})();
`
}
```

### Custom Hook for Widget Builder
```typescript
import { useState, useCallback, useMemo } from 'react'

export function useWidgetBuilder(initialTestimonials: Testimonial[]) {
  const [selectedWidget, setSelectedWidget] = useState<WidgetType>('carousel')
  const [config, setConfig] = useState<WidgetConfig>(() => getDefaultConfig())
  const [selectedTestimonials, setSelectedTestimonials] = useState<Testimonial[]>(initialTestimonials)

  const updateConfig = useCallback((updates: Partial<WidgetConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }, [])

  const updateStyling = useCallback((updates: Partial<WidgetConfig['styling']>) => {
    setConfig(prev => ({
      ...prev,
      styling: { ...prev.styling, ...updates }
    }))
  }, [])

  const updateBehavior = useCallback((updates: Partial<WidgetConfig['behavior']>) => {
    setConfig(prev => ({
      ...prev,
      behavior: { ...prev.behavior, ...updates }
    }))
  }, [])

  const validation = useMemo(() => {
    return validateWidgetConfig(selectedWidget, selectedTestimonials, config)
  }, [selectedWidget, selectedTestimonials, config])

  const embedCode = useMemo(() => {
    if (!validation.isValid) return ''
    return generateEmbedCode({
      ...config,
      type: selectedWidget,
      testimonials: selectedTestimonials
    })
  }, [config, selectedWidget, selectedTestimonials, validation.isValid])

  return {
    selectedWidget,
    setSelectedWidget,
    config,
    selectedTestimonials,
    setSelectedTestimonials,
    updateConfig,
    updateStyling,
    updateBehavior,
    validation,
    embedCode
  }
}
```

### Validation System
```typescript
interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function validateWidgetConfig(
  widgetType: WidgetType,
  testimonials: Testimonial[],
  config: WidgetConfig
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check minimum testimonials
  const minTestimonials = getMinTestimonialsForWidget(widgetType)
  if (testimonials.length < minTestimonials) {
    errors.push(`${widgetType} requires at least ${minTestimonials} testimonial${minTestimonials > 1 ? 's' : ''}`)
  }

  // Validate colors
  if (!isValidColor(config.styling.primaryColor)) {
    errors.push('Primary color must be a valid hex, rgb, or named color')
  }

  // Validate timing settings
  if (config.behavior.slideInterval && config.behavior.slideInterval < 1000) {
    warnings.push('Slide interval less than 1 second may cause poor user experience')
  }

  // Widget-specific validations
  switch (widgetType) {
    case 'carousel':
      if (config.behavior.maxItems && config.behavior.maxItems > testimonials.length) {
        warnings.push('Max items exceeds available testimonials')
      }
      break
    case 'grid':
      if (config.behavior.columns && config.behavior.columns > 4) {
        warnings.push('More than 4 columns may not display well on smaller screens')
      }
      break
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}
```

## Additional Requirements

### Accessibility
- Full keyboard navigation support
- ARIA labels and roles
- Screen reader compatibility
- Color contrast compliance (WCAG 2.1 AA)
- Focus management

### Browser Support
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

### Testing Strategy
- Unit tests for utility functions
- Integration tests for widget rendering
- Visual regression tests for different configurations
- Cross-browser testing for embed code
- Performance testing for large testimonial sets

### Documentation
- Inline code comments
- Component prop documentation
- Usage examples
- Troubleshooting guide
- Embed code examples

## Success Criteria
1. ✅ Users can create widgets in under 2 minutes
2. ✅ Generated embed code works on 95% of websites
3. ✅ Live preview updates in real-time without lag
4. ✅ Mobile responsive widgets work perfectly
5. ✅ Clean, production-ready code output
6. ✅ Comprehensive customization options
7. ✅ Intuitive, user-friendly interface

## Notes for Implementation
- Use TypeScript for better developer experience
- Implement proper error boundaries
- Add loading states for better UX
- Consider using React Query for data fetching
- Implement proper SEO for generated widgets
- Add analytics tracking for widget usage
- Consider A/B testing different widget styles
- Plan for future widget types and extensions