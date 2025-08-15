(function() {
  'use strict';
  
  console.log('Boostfen Widget: Script loaded');
  
  // Get the current script element to extract configuration
  const currentScript = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  
  // Extract configuration from script attributes
  const widgetId = currentScript.getAttribute('data-widget-id');
  const widgetType = currentScript.getAttribute('data-widget-type') || 'carousel';
  const baseUrl = currentScript.getAttribute('data-base-url') || currentScript.src.split('/widget/')[0];
  const configData = currentScript.getAttribute('data-config');
  
  console.log('Boostfen Widget: Configuration', { widgetId, widgetType, baseUrl, hasConfig: !!configData });
  
  if (!widgetId) {
    console.error('Boostfen Widget: data-widget-id attribute is required');
    return;
  }
  
  // Create container div immediately after the script
  const container = document.createElement('div');
  container.id = `boostfen-widget-${widgetId}`;
  container.setAttribute('data-boostfen-widget', widgetId);
  container.setAttribute('data-widget-type', widgetType);
  
  // Insert container right after the current script
  currentScript.parentNode.insertBefore(container, currentScript.nextSibling);
  
  console.log('Boostfen Widget: Container created', container.id);
  
  // Widget class
  class BoostfenWidget {
    constructor(containerId, config) {
      this.container = document.getElementById(containerId);
      this.config = config;
      this.currentIndex = 0;
      this.isPlaying = config.behavior?.autoPlay || false;
      this.intervals = [];
      
      if (!this.container) {
        console.error('Boostfen widget container not found:', containerId);
        return;
      }
      
      this.init();
    }
    
    async init() {
      try {
        // Load widget configuration and testimonials
        await this.loadConfig();
        
        // Inject styles
        this.injectStyles();
        
        // Render widget
        this.render();
        
        // Bind events
        this.bindEvents();
        
        // Start auto-play if enabled
        if (this.isPlaying && this.config.testimonials?.length > 1) {
          this.startAutoPlay();
        }
      } catch (error) {
        console.error('Boostfen Widget initialization failed:', error);
        this.renderError(`Failed to load widget: ${error.message}`);
      }
    }
    
    async loadConfig() {
      // Check if config is passed directly in the script tag
      if (configData) {
        try {
          this.config = JSON.parse(configData.replace(/&apos;/g, "'"));
          console.log('Boostfen Widget: Config loaded from data-config attribute', this.config);
          return;
        } catch (error) {
          console.error('Boostfen Widget: Failed to parse data-config', error);
        }
      }
      
      // Fallback to API call for group/individual testimonial widgets
      console.log('Boostfen Widget: Loading config from API', `${baseUrl}/api/widget/${widgetId}`);
      const response = await fetch(`${baseUrl}/api/widget/${widgetId}`);
      console.log('Boostfen Widget: API response status', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Boostfen Widget: API error', errorText);
        throw new Error(`Failed to load widget config: ${response.status} - ${errorText}`);
      }
      
      this.config = await response.json();
      console.log('Boostfen Widget: Config loaded from API', this.config);
    }
    
    injectStyles() {
      // Check if styles already injected
      if (document.getElementById(`boostfen-widget-styles-${widgetId}`)) {
        return;
      }
      
      const style = document.createElement('style');
      style.id = `boostfen-widget-styles-${widgetId}`;
      style.textContent = this.generateCSS();
      document.head.appendChild(style);
    }
    
    generateCSS() {
      const containerId = `boostfen-widget-${widgetId}`;
      const { styling = {} } = this.config;
      
      return `
        #${containerId} {
          --primary-color: ${styling.primaryColor || '#3b82f6'};
          --background-color: ${styling.backgroundColor || '#ffffff'};
          --text-color: ${styling.textColor || '#1f2937'};
          --border-radius: ${styling.borderRadius || 8}px;
          --padding: ${styling.padding || 20}px;
          --font-size: ${styling.fontSize === 'sm' ? '14px' : styling.fontSize === 'lg' ? '18px' : '16px'};
          
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          font-size: var(--font-size);
          color: var(--text-color);
          max-width: 100%;
        }
        
        #${containerId} * {
          box-sizing: border-box;
        }
        
        #${containerId} .widget-container {
          background-color: var(--background-color);
          border-radius: var(--border-radius);
          padding: var(--padding);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        #${containerId} .testimonial-content {
          font-style: italic;
          margin: 12px 0;
          line-height: 1.6;
        }
        
        #${containerId} .author-name {
          font-weight: 600;
          margin: 0;
        }
        
        #${containerId} .author-role {
          font-size: 14px;
          opacity: 0.8;
          margin: 2px 0 0 0;
        }
        
        #${containerId} .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 16px;
        }
        
        #${containerId} .avatar-placeholder {
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
        
        #${containerId} .star {
          color: #fbbf24;
          margin-right: 2px;
        }
        
        #${containerId} .star.empty {
          color: #d1d5db;
        }
        
        #${containerId} .loading {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }
        
        #${containerId} .error {
          text-align: center;
          padding: 40px;
          color: #dc2626;
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: var(--border-radius);
        }
        
        /* Carousel specific styles */
        #${containerId} .carousel-container {
          max-width: 500px;
          margin: 0 auto;
        }
        
        #${containerId} .controls {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 16px;
          gap: 12px;
        }
        
        #${containerId} .nav-button {
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
        }
        
        #${containerId} .nav-button:hover {
          opacity: 0.8;
        }
        
        #${containerId} .dots {
          display: flex;
          gap: 8px;
        }
        
        #${containerId} .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--primary-color);
          cursor: pointer;
          transition: opacity 0.2s;
        }
        
        #${containerId} .dot.inactive {
          opacity: 0.3;
        }
      `;
    }
    
    render() {
      if (!this.config.testimonials || this.config.testimonials.length === 0) {
        this.container.innerHTML = '<div class="error">No testimonials available</div>';
        return;
      }
      
      this.container.innerHTML = this.generateHTML();
    }
    
    generateHTML() {
      switch (this.config.type) {
        case 'carousel':
          return this.generateCarouselHTML();
        case 'grid':
          return this.generateGridHTML();
        default:
          return this.generateCarouselHTML();
      }
    }
    
    generateCarouselHTML() {
      const testimonial = this.config.testimonials[this.currentIndex];
      if (!testimonial) return '';
      
      return `
        <div class="carousel-container">
          <div class="widget-container">
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              ${this.generateAvatar(testimonial)}
              <div>
                <h4 class="author-name">${this.escapeHtml(testimonial.customerName)}</h4>
                ${testimonial.customerTitle || testimonial.customerCompany ? `
                  <p class="author-role">
                    ${this.escapeHtml(testimonial.customerTitle || '')}${testimonial.customerTitle && testimonial.customerCompany ? ' at ' : ''}${this.escapeHtml(testimonial.customerCompany || '')}
                  </p>
                ` : ''}
              </div>
            </div>
            ${testimonial.rating ? this.generateStars(testimonial.rating) : ''}
            <div class="testimonial-content">"${this.escapeHtml(testimonial.content)}"</div>
            ${this.config.testimonials.length > 1 ? this.generateCarouselControls() : ''}
          </div>
        </div>
      `;
    }
    
    generateGridHTML() {
      const testimonials = this.config.testimonials.slice(0, 6); // Limit to 6 for grid
      
      return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
          ${testimonials.map(testimonial => `
            <div class="widget-container">
              ${testimonial.rating ? this.generateStars(testimonial.rating) : ''}
              <div class="testimonial-content">"${this.escapeHtml(testimonial.content)}"</div>
              <div style="display: flex; align-items: center; margin-top: 12px;">
                ${this.generateAvatar(testimonial, 32)}
                <div>
                  <h5 class="author-name" style="font-size: 14px;">${this.escapeHtml(testimonial.customerName)}</h5>
                  ${testimonial.customerCompany ? `<p class="author-role" style="font-size: 12px;">${this.escapeHtml(testimonial.customerCompany)}</p>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    generateAvatar(testimonial, size = 48) {
      const sizeStyle = `width: ${size}px; height: ${size}px;`;
      
      if (testimonial.customerImageUrl) {
        return `<img src="${this.escapeHtml(testimonial.customerImageUrl)}" alt="${this.escapeHtml(testimonial.customerName)}" class="avatar" style="${sizeStyle}" />`;
      } else {
        return `
          <div class="avatar-placeholder" style="${sizeStyle} font-size: ${size * 0.4}px;">
            ${testimonial.customerName.charAt(0).toUpperCase()}
          </div>
        `;
      }
    }
    
    generateStars(rating) {
      return `<div style="margin-bottom: 8px;">${Array.from({ length: 5 }, (_, i) => 
        `<span class="star ${i < rating ? '' : 'empty'}">★</span>`
      ).join('')}</div>`;
    }
    
    generateCarouselControls() {
      return `
        <div class="controls">
          <button class="nav-button" onclick="window.boostfenWidget_${widgetId}.prevSlide()">‹</button>
          <div class="dots">
            ${this.config.testimonials.map((_, i) => `
              <div class="dot ${i === this.currentIndex ? '' : 'inactive'}" onclick="window.boostfenWidget_${widgetId}.goToSlide(${i})"></div>
            `).join('')}
          </div>
          <button class="nav-button" onclick="window.boostfenWidget_${widgetId}.nextSlide()">›</button>
        </div>
      `;
    }
    
    bindEvents() {
      // Expose methods globally for onclick handlers
      window[`boostfenWidget_${widgetId}`] = this;
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
    
    startAutoPlay() {
      this.stopAutoPlay();
      this.isPlaying = true;
      const interval = setInterval(() => {
        this.nextSlide();
      }, this.config.behavior?.slideInterval || 4000);
      this.intervals.push(interval);
    }
    
    stopAutoPlay() {
      this.isPlaying = false;
      this.intervals.forEach(clearInterval);
      this.intervals = [];
    }
    
    renderError(message = 'Failed to load testimonial widget') {
      this.container.innerHTML = `<div class="error">${message}</div>`;
    }
    

    
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    destroy() {
      this.stopAutoPlay();
      if (this.container) {
        this.container.innerHTML = '';
      }
      const styleEl = document.getElementById(`boostfen-widget-styles-${widgetId}`);
      if (styleEl) {
        styleEl.remove();
      }
      delete window[`boostfenWidget_${widgetId}`];
    }
  }
  
  // Show loading state immediately
  container.innerHTML = '<div class="loading">Loading testimonials...</div>';
  
  // Initialize the widget
  const widget = new BoostfenWidget(`boostfen-widget-${widgetId}`, {});
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    widget.destroy();
  });
})();