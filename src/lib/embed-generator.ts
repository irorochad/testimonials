import { WidgetConfig } from "@/types/widget"

export function generateEmbedCode(config: WidgetConfig, baseUrl?: string, projectSlug?: string): string {
  return generateSelfContainedEmbedCode(config, baseUrl, projectSlug)
}

export function generateSelfContainedEmbedCode(config: WidgetConfig, baseUrl?: string, projectSlug?: string): string {
  const siteUrl = baseUrl || process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com')
  
  // For group-based or individual testimonial widgets, use the selected testimonials to determine the widget ID
  let widgetId: string
  
  if (config.testimonials && config.testimonials.length > 0) {
    // If we have selected testimonials, we need to create a widget ID based on them
    // This could be a group slug or individual testimonial slugs
    // For now, we'll use the projectSlug as the fallback
    widgetId = projectSlug || config.id
  } else {
    widgetId = projectSlug || config.id
  }

  return `<!-- Boostfen Testimonial Widget -->
<script 
  src="${siteUrl}/widget/embed-v2.js" 
  data-widget-id="${widgetId}" 
  data-widget-type="${config.type}"
  data-base-url="${siteUrl}"
  data-config='${JSON.stringify(config).replace(/'/g, '&apos;')}'
  async>
</script>`
}

export function generateShadowDOMEmbedCode(config: WidgetConfig, baseUrl?: string, projectSlug?: string): string {
  const siteUrl = baseUrl || process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com')
  // Use project slug if provided, otherwise fall back to config.id
  const widgetId = projectSlug || config.id

  // Convert config to URL parameters for customization
  const params = new URLSearchParams({
    type: config.type,
    theme: config.styling.primaryColor ? 'custom' : 'auto',
    primaryColor: config.styling.primaryColor,
    maxTestimonials: '5',
    autoRotate: config.behavior.autoPlay ? 'true' : 'false',
    rotationInterval: (config.behavior.slideInterval / 1000).toString(),
  })

  return `<!-- Boostfen Testimonial Widget -->
<script src="${siteUrl}/api/widget/${widgetId}?format=js&${params}" async></script>
<div data-boostfen-widget="${widgetId}" data-widget-type="${config.type}"></div>`
}

// Legacy function for backward compatibility
export function generateLegacyEmbedCode(config: WidgetConfig): string {
  const widgetId = `testimonial-widget-${config.id}`

  const css = generateWidgetCSS(config, widgetId)
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

function generateWidgetCSS(config: WidgetConfig, widgetId: string): string {
  const { styling } = config

  const shadowMap = {
    'none': 'none',
    'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  }

  const fontSizeMap = {
    'sm': '14px',
    'base': '16px',
    'lg': '18px'
  }

  const fontWeightMap = {
    'normal': '400',
    'medium': '500',
    'semibold': '600',
    'bold': '700'
  }

  return `
#${widgetId} {
  --primary-color: ${styling.primaryColor};
  --background-color: ${styling.backgroundColor};
  --text-color: ${styling.textColor};
  --accent-color: ${styling.accentColor};
  --border-radius: ${styling.borderRadius}px;
  --padding: ${styling.padding}px;
  --shadow: ${shadowMap[styling.shadow as keyof typeof shadowMap]};
  --font-size: ${fontSizeMap[styling.fontSize as keyof typeof fontSizeMap]};
  --font-weight: ${fontWeightMap[styling.fontWeight as keyof typeof fontWeightMap]};
  --border-color: ${styling.borderColor};
  --gap: ${styling.gap}px;
  
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.5;
  font-size: var(--font-size);
  font-weight: var(--font-weight);
  color: var(--text-color);
}

#${widgetId} * {
  box-sizing: border-box;
}

#${widgetId} .widget-container {
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  padding: var(--padding);
  box-shadow: var(--shadow);
  ${styling.border ? `border: 1px solid var(--border-color);` : ''}
}

#${widgetId} .star {
  width: 16px;
  height: 16px;
  display: inline-block;
  margin-right: 2px;
}

#${widgetId} .star.filled {
  color: #fbbf24;
}

#${widgetId} .star.empty {
  color: #d1d5db;
}

#${widgetId} .avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 16px;
}

#${widgetId} .avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 16px;
}

#${widgetId} .testimonial-content {
  font-style: italic;
  margin: 12px 0;
  line-height: 1.6;
}

#${widgetId} .author-name {
  font-weight: 600;
  margin: 0;
}

#${widgetId} .author-role {
  font-size: 14px;
  opacity: 0.8;
  margin: 2px 0 0 0;
}

#${widgetId} .controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

#${widgetId} .dots {
  display: flex;
  gap: 8px;
}

#${widgetId} .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--primary-color);
  cursor: pointer;
  transition: opacity 0.2s;
}

#${widgetId} .dot.inactive {
  opacity: 0.5;
}

#${widgetId} .nav-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: var(--primary-color);
  transition: background-color 0.2s;
}

#${widgetId} .nav-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

${getWidgetSpecificCSS(config, widgetId)}
`
}

function getWidgetSpecificCSS(config: WidgetConfig, widgetId: string): string {
  switch (config.type) {
    case 'carousel':
      return `
#${widgetId} .carousel-container {
  max-width: 400px;
  margin: 0 auto;
}
`
    case 'popup':
      const positionMap = {
        'bottom-right': 'bottom: 16px; right: 16px;',
        'bottom-left': 'bottom: 16px; left: 16px;',
        'top-right': 'top: 16px; right: 16px;',
        'top-left': 'top: 16px; left: 16px;'
      }
      return `
#${widgetId} .popup-container {
  position: fixed;
  ${positionMap[config.behavior.position as keyof typeof positionMap]}
  max-width: 320px;
  z-index: 1000;
  transition: all 0.3s ease;
}

#${widgetId} .popup-container.hidden {
  opacity: 0;
  transform: translateY(8px);
}

#${widgetId} .close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: var(--text-color);
  opacity: 0.6;
}

#${widgetId} .close-button:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05);
}
`
    case 'grid':
      const gridCols = {
        1: '1fr',
        2: 'repeat(2, 1fr)',
        3: 'repeat(3, 1fr)',
        4: 'repeat(4, 1fr)'
      }
      return `
#${widgetId} .grid-container {
  display: grid;
  grid-template-columns: ${gridCols[config.behavior.columns as keyof typeof gridCols]};
  gap: var(--gap);
}

#${widgetId} .grid-item {
  transition: transform 0.2s, box-shadow 0.2s;
}

#${widgetId} .grid-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  #${widgetId} .grid-container {
    grid-template-columns: 1fr;
  }
}
`
    case 'rating-bar':
      return `
#${widgetId} .rating-bar {
  max-width: 320px;
  margin: 0 auto;
}

#${widgetId} .rating-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

#${widgetId} .rating-stars {
  display: flex;
  align-items: center;
  gap: 4px;
}

#${widgetId} .rating-value {
  font-size: 18px;
  font-weight: 700;
  margin-left: 8px;
}

#${widgetId} .avatars-row {
  display: flex;
  margin-left: -4px;
}

#${widgetId} .avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--background-color);
  margin-left: -4px;
  object-fit: cover;
}

#${widgetId} .avatar-small-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--background-color);
  margin-left: -4px;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

#${widgetId} .more-count {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--background-color);
  margin-left: -4px;
  background-color: var(--accent-color);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}
`
    case 'avatar-carousel':
      return `
#${widgetId} .avatar-carousel {
  text-align: center;
}

#${widgetId} .avatars-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

#${widgetId} .avatar-large {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 4px solid var(--primary-color);
  cursor: pointer;
  transition: transform 0.2s;
  object-fit: cover;
}

#${widgetId} .avatar-large:hover {
  transform: scale(1.1);
}

#${widgetId} .avatar-large-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 4px solid var(--primary-color);
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

#${widgetId} .avatar-large-placeholder:hover {
  transform: scale(1.1);
}

#${widgetId} .quote-display {
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
`
    case 'quote-spotlight':
      return `
#${widgetId} .quote-spotlight {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

#${widgetId} .spotlight-quote {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.6;
  margin: 24px 0;
}

#${widgetId} .spotlight-author {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

#${widgetId} .spotlight-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}
`
    default:
      return ''
  }
}

function generateWidgetHTML(config: WidgetConfig, widgetId: string): string {
  return `<div id="${widgetId}"></div>`
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
      if (this.isPlaying && this.config.testimonials.length > 1) {
        this.startAutoPlay();
      }
    }
    
    render() {
      this.container.innerHTML = this.generateHTML();
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
        case 'avatar-carousel':
          return this.generateAvatarCarouselHTML();
        case 'quote-spotlight':
          return this.generateQuoteSpotlightHTML();
        default:
          return this.generateCarouselHTML();
      }
    }
    
    generateCarouselHTML() {
      const testimonial = this.config.testimonials[this.currentIndex];
      if (!testimonial) return '';
      
      return \`
        <div class="carousel-container">
          <div class="widget-container">
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              \${this.generateAvatar(testimonial)}
              <div>
                <h4 class="author-name">\${testimonial.customerName}</h4>
                \${testimonial.customerTitle || testimonial.customerCompany ? \`
                  <p class="author-role">
                    \${testimonial.customerTitle || ''}\${testimonial.customerTitle && testimonial.customerCompany ? ' at ' : ''}\${testimonial.customerCompany || ''}
                  </p>
                \` : ''}
              </div>
            </div>
            \${testimonial.rating ? this.generateStars(testimonial.rating) : ''}
            <div class="testimonial-content">"\${testimonial.content}"</div>
            \${this.config.testimonials.length > 1 ? this.generateCarouselControls() : ''}
          </div>
        </div>
      \`;
    }
    
    generatePopupHTML() {
      const testimonial = this.config.testimonials[this.currentIndex];
      if (!testimonial) return '';
      
      return \`
        <div class="popup-container" id="popup-\${this.config.id}">
          <div class="widget-container" style="border-left: 4px solid var(--primary-color);">
            \${this.config.behavior.showCloseButton ? '<button class="close-button" onclick="this.parentElement.parentElement.style.display=\\'none\\'">&times;</button>' : ''}
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              \${this.generateAvatar(testimonial, 32)}
              <div>
                <h5 class="author-name" style="font-size: 14px;">\${testimonial.customerName}</h5>
                \${testimonial.rating ? this.generateStars(testimonial.rating, 12) : ''}
              </div>
            </div>
            <p style="font-size: 12px; margin: 0;">"\${testimonial.content.substring(0, 80)}..."</p>
          </div>
        </div>
      \`;
    }
    
    generateGridHTML() {
      const maxItems = Math.min(this.config.behavior.maxItems, this.config.testimonials.length);
      const testimonials = this.config.testimonials.slice(0, maxItems);
      
      return \`
        <div class="grid-container">
          \${testimonials.map(testimonial => \`
            <div class="grid-item widget-container">
              \${testimonial.rating ? this.generateStars(testimonial.rating) : ''}
              <div class="testimonial-content">"\${testimonial.content}"</div>
              <div style="display: flex; align-items: center;">
                \${this.generateAvatar(testimonial, 32)}
                <div>
                  <h5 class="author-name" style="font-size: 12px;">\${testimonial.customerName}</h5>
                  \${testimonial.customerCompany ? \`<p class="author-role" style="font-size: 10px;">\${testimonial.customerCompany}</p>\` : ''}
                </div>
              </div>
            </div>
          \`).join('')}
        </div>
      \`;
    }
    
    generateRatingBarHTML() {
      const avgRating = this.config.testimonials.reduce((acc, t) => acc + (t.rating || 0), 0) / this.config.testimonials.length;
      const maxItems = Math.min(this.config.behavior.maxItems, this.config.testimonials.length);
      const testimonials = this.config.testimonials.slice(0, maxItems);
      
      return \`
        <div class="rating-bar">
          <div class="widget-container">
            <div class="rating-display">
              <div class="rating-stars">
                \${this.generateStars(Math.round(avgRating), 20)}
                <span class="rating-value">\${avgRating.toFixed(1)}</span>
              </div>
              <span style="font-size: 14px; opacity: 0.8;">from \${this.config.testimonials.length} reviews</span>
            </div>
            <div class="avatars-row">
              \${testimonials.map(testimonial => this.generateAvatar(testimonial, 32, 'avatar-small')).join('')}
              \${this.config.testimonials.length > maxItems ? \`
                <div class="more-count">+\${this.config.testimonials.length - maxItems}</div>
              \` : ''}
            </div>
          </div>
        </div>
      \`;
    }
    
    generateAvatarCarouselHTML() {
      const maxItems = Math.min(this.config.behavior.maxItems, this.config.testimonials.length);
      const testimonials = this.config.testimonials.slice(0, maxItems);
      
      return \`
        <div class="avatar-carousel">
          <div class="avatars-container">
            \${testimonials.map((testimonial, index) => \`
              <div onclick="window.testimonialWidget.showQuote(\${index})" style="cursor: pointer;">
                \${this.generateAvatar(testimonial, 64, 'avatar-large')}
              </div>
            \`).join('')}
          </div>
          <div class="quote-display widget-container" id="quote-display-\${this.config.id}">
            <div class="testimonial-content">Hover over an avatar to see their testimonial</div>
          </div>
        </div>
      \`;
    }
    
    generateQuoteSpotlightHTML() {
      const testimonial = this.config.testimonials[this.currentIndex];
      if (!testimonial) return '';
      
      return \`
        <div class="quote-spotlight">
          <div class="widget-container">
            \${testimonial.rating ? \`<div style="text-align: center; margin-bottom: 16px;">\${this.generateStars(testimonial.rating)}</div>\` : ''}
            <div class="spotlight-quote">"\${testimonial.content}"</div>
            <div class="spotlight-author">
              \${this.generateAvatar(testimonial)}
              <div style="text-align: left;">
                <cite class="author-name">\${testimonial.customerName}</cite>
                \${testimonial.customerTitle || testimonial.customerCompany ? \`
                  <p class="author-role">
                    \${testimonial.customerTitle || ''}\${testimonial.customerTitle && testimonial.customerCompany ? ' at ' : ''}\${testimonial.customerCompany || ''}
                  </p>
                \` : ''}
              </div>
            </div>
            \${this.config.testimonials.length > 1 ? \`
              <div class="spotlight-dots">
                \${this.config.testimonials.map((_, i) => \`
                  <div class="dot \${i === this.currentIndex ? '' : 'inactive'}" onclick="window.testimonialWidget.goToSlide(\${i})"></div>
                \`).join('')}
              </div>
            \` : ''}
          </div>
        </div>
      \`;
    }
    
    generateAvatar(testimonial, size = 48, className = '') {
      const sizeStyle = \`width: \${size}px; height: \${size}px;\`;
      
      if (testimonial.customerImageUrl) {
        return \`<img src="\${testimonial.customerImageUrl}" alt="\${testimonial.customerName}" class="avatar \${className}" style="\${sizeStyle}" />\`;
      } else {
        return \`
          <div class="avatar-placeholder \${className}" style="\${sizeStyle} font-size: \${size * 0.4}px;">
            \${testimonial.customerName.charAt(0).toUpperCase()}
          </div>
        \`;
      }
    }
    
    generateStars(rating, size = 16) {
      return Array.from({ length: 5 }, (_, i) => 
        \`<span class="star \${i < rating ? 'filled' : 'empty'}" style="width: \${size}px; height: \${size}px;">★</span>\`
      ).join('');
    }
    
    generateCarouselControls() {
      return \`
        <div class="controls">
          <div class="dots">
            \${this.config.testimonials.map((_, i) => \`
              <div class="dot \${i === this.currentIndex ? '' : 'inactive'}" onclick="window.testimonialWidget.goToSlide(\${i})"></div>
            \`).join('')}
          </div>
          \${this.config.behavior.showNavigation ? \`
            <div style="display: flex; gap: 8px;">
              <button class="nav-button" onclick="window.testimonialWidget.prevSlide()">‹</button>
              <button class="nav-button" onclick="window.testimonialWidget.togglePlay()">\${this.isPlaying ? '⏸' : '▶'}</button>
              <button class="nav-button" onclick="window.testimonialWidget.nextSlide()">›</button>
            </div>
          \` : ''}
        </div>
      \`;
    }
    
    bindEvents() {
      // Expose methods globally for onclick handlers
      window.testimonialWidget = this;
      
      // Popup auto-cycle
      if (this.config.type === 'popup') {
        this.startPopupCycle();
      }
      
      // Avatar carousel hover events
      if (this.config.type === 'avatar-carousel') {
        this.bindAvatarEvents();
      }
    }
    
    startPopupCycle() {
      setInterval(() => {
        const popup = document.getElementById(\`popup-\${this.config.id}\`);
        if (popup) {
          popup.classList.add('hidden');
          setTimeout(() => {
            this.nextSlide();
            popup.classList.remove('hidden');
          }, 300);
        }
      }, this.config.behavior.displayDuration);
    }
    
    bindAvatarEvents() {
      // This would be implemented with proper event delegation
      // For now, using onclick handlers in HTML
    }
    
    goToSlide(index) {
      this.currentIndex = index;
      this.render();
    }
    
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.config.testimonials.length;
      this.render();
    }
    
    prevSlide() {
      this.currentIndex = this.currentIndex === 0 ? this.config.testimonials.length - 1 : this.currentIndex - 1;
      this.render();
    }
    
    togglePlay() {
      if (this.isPlaying) {
        this.stopAutoPlay();
      } else {
        this.startAutoPlay();
      }
      this.render();
    }
    
    showQuote(index) {
      const testimonial = this.config.testimonials[index];
      const display = document.getElementById(\`quote-display-\${this.config.id}\`);
      if (display && testimonial) {
        display.innerHTML = \`
          <div class="testimonial-content">"\${testimonial.content}"</div>
          <cite class="author-name">— \${testimonial.customerName}</cite>
        \`;
      }
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
    
    destroy() {
      this.stopAutoPlay();
      if (this.container) {
        this.container.innerHTML = '';
      }
      if (window.testimonialWidget === this) {
        delete window.testimonialWidget;
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