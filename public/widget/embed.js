(function() {
  'use strict';
  
  // Prevent multiple loads
  if (window.TestimonialWidget) return;
  
  const API_BASE = window.location.origin;
  
  class TestimonialWidget {
    constructor() {
      this.widgets = new Map();
      this.loadedCSS = false;
      this.init();
    }
    
    init() {
      // Load CSS once
      if (!this.loadedCSS) {
        this.loadCSS();
        this.loadedCSS = true;
      }
      
      // Find all widget scripts and initialize them
      const scripts = document.querySelectorAll('script[data-project-id]');
      scripts.forEach(script => {
        const projectId = script.getAttribute('data-project-id');
        const templateId = script.getAttribute('data-template-id');
        const configStr = script.getAttribute('data-config');
        
        if (projectId && !this.widgets.has(projectId)) {
          let config = {};
          try {
            config = configStr ? JSON.parse(configStr.replace(/&quot;/g, '"')) : {};
          } catch (e) {
            console.warn('Failed to parse widget config:', e);
          }
          
          this.loadWidget(projectId, templateId, config, script);
        }
      });
    }
    
    loadCSS() {
      if (document.getElementById('testimonial-widget-css')) return;
      
      const css = `
        .testimonial-widget {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-sizing: border-box;
          line-height: 1.6;
        }
        .testimonial-widget * {
          box-sizing: border-box;
        }
        .testimonial-widget-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: #6b7280;
          font-size: 14px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        .testimonial-widget-error {
          padding: 20px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          color: #dc2626;
          font-size: 14px;
        }
        .widget-container {
          margin: 0 auto;
          position: relative;
        }
        .testimonial-content {
          margin: 0;
        }
        .star-filled {
          color: var(--primary-color, #3b82f6);
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
          margin: 0 4px;
        }
        .nav-dot:hover {
          background: #9ca3af;
        }
        .nav-dot.active {
          background: var(--primary-color, #3b82f6);
        }
        .testimonial-nav {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 16px;
        }
      `;
      
      const style = document.createElement('style');
      style.id = 'testimonial-widget-css';
      style.textContent = css;
      document.head.appendChild(style);
    }
    
    async loadWidget(projectId, templateId, config, scriptElement) {
      try {
        // Create container
        const container = document.createElement('div');
        container.id = `testimonial-widget-${projectId}`;
        container.className = 'testimonial-widget-loading';
        container.innerHTML = 'Loading testimonials...';
        
        // Insert container after script
        scriptElement.parentNode.insertBefore(container, scriptElement.nextSibling);
        
        // Fetch widget data
        const response = await fetch(`${API_BASE}/api/widget/config?projectId=${projectId}&domain=${window.location.hostname}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load widget: ${response.status}`);
        }
        
        const data = await response.json();
        this.renderWidget(container, data, templateId || 'clean-card', config);
        this.widgets.set(projectId, { container, data, config });
        
      } catch (error) {
        console.error('TestimonialWidget error:', error);
        this.renderError(container, 'Failed to load testimonials');
      }
    }
    
    renderWidget(container, { testimonials }, templateId, settings) {
      container.className = 'testimonial-widget';
      
      // Apply CSS variables
      const cssVars = this.generateCSSVariables(settings);
      Object.keys(cssVars).forEach(key => {
        container.style.setProperty(key, cssVars[key]);
      });
      
      switch (templateId) {
        case 'clean-card':
          this.renderCleanCard(container, testimonials, settings);
          break;
        case 'quote-style':
          this.renderQuoteStyle(container, testimonials, settings);
          break;
        case 'featured-hero':
          this.renderFeaturedHero(container, testimonials, settings);
          break;
        case 'minimal-list':
          this.renderMinimalList(container, testimonials, settings);
          break;
        case 'rating-badge':
          this.renderRatingBadge(container, testimonials, settings);
          break;
        default:
          this.renderCleanCard(container, testimonials, settings);
      }
    }
    
    generateCSSVariables(settings) {
      // Get theme-based colors
      const themeColors = this.getThemeColors(settings.theme || 'auto');
      
      return {
        '--primary-color': settings.primaryColor || '#3b82f6',
        '--background-color': themeColors.backgroundColor,
        '--text-color': themeColors.textColor,
        '--border-color': themeColors.borderColor,
        '--border-radius': `${settings.borderRadius || 8}px`,
        '--border-width': `${settings.borderWidth || 1}px`,
        '--padding': `${settings.padding || 24}px`,
        '--font-family': settings.fontFamily === 'system' ? '-apple-system, BlinkMacSystemFont, sans-serif' : settings.fontFamily || '-apple-system, BlinkMacSystemFont, sans-serif',
        '--font-size': `${settings.fontSize || 16}px`,
        '--font-weight': settings.fontWeight || 'normal',
        '--max-width': `${settings.maxWidth || 400}px`,
        '--shadow': this.getShadowValue(settings.shadow || 'md'),
      };
    }
    
    getThemeColors(theme) {
      const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      return {
        backgroundColor: isDark ? '#1f2937' : '#f9fafb', // gray-800 : gray-50
        textColor: isDark ? '#f9fafb' : '#374151', // gray-50 : gray-700
        borderColor: isDark ? '#374151' : '#e5e7eb', // gray-700 : gray-200
      };
    }
    
    getShadowValue(shadow) {
      switch (shadow) {
        case 'none': return 'none';
        case 'sm': return '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        case 'md': return '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        case 'lg': return '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        default: return '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      }
    }
    
    renderCleanCard(container, testimonials, settings) {
      if (!testimonials.length) {
        container.innerHTML = '<div class="testimonial-widget-error">No testimonials available</div>';
        return;
      }
      
      let currentIndex = 0;
      const maxTestimonials = Math.min(testimonials.length, settings.maxTestimonials || 5);
      const displayTestimonials = testimonials.slice(0, maxTestimonials);
      
      const render = () => {
        const testimonial = displayTestimonials[currentIndex];
        
        container.innerHTML = `
          <div class="widget-container" style="
            background: var(--background-color);
            border-radius: var(--border-radius);
            border: var(--border-width) solid var(--border-color);
            padding: var(--padding);
            box-shadow: var(--shadow);
            max-width: var(--max-width);
            font-family: var(--font-family);
            color: var(--text-color);
          ">
            ${settings.showRating !== false && testimonial.rating ? `
              <div style="margin-bottom: 16px; font-size: 18px;">
                <span style="color: var(--primary-color);">${'★'.repeat(testimonial.rating)}</span><span style="color: #e5e7eb;">${'★'.repeat(5 - testimonial.rating)}</span>
              </div>
            ` : ''}
            
            <blockquote class="testimonial-content" style="
              font-size: var(--font-size);
              font-weight: var(--font-weight);
              line-height: 1.6;
              margin: 0 0 20px 0;
              font-style: italic;
            ">
              "${testimonial.content}"
            </blockquote>
            
            <div style="display: flex; align-items: center; gap: 12px;">
              ${settings.showAvatar !== false && testimonial.avatar ? `
                <img 
                  src="${testimonial.avatar}" 
                  alt="${testimonial.customerName}"
                  style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary-color);"
                />
              ` : ''}
              
              <div>
                <div style="font-weight: 600; font-size: 15px; color: var(--primary-color);">${testimonial.customerName}</div>
                ${settings.showCompany !== false && (testimonial.customerTitle || testimonial.customerCompany) ? `
                  <div style="font-size: 13px; color: #6B7280; margin-top: 2px;">
                    ${testimonial.customerTitle || ''}${testimonial.customerTitle && testimonial.customerCompany ? ', ' : ''}${testimonial.customerCompany || ''}
                  </div>
                ` : ''}
              </div>
            </div>
            
            ${displayTestimonials.length > 1 && settings.autoRotate !== false ? `
              <div class="testimonial-nav">
                ${displayTestimonials.map((_, index) => `
                  <button class="nav-dot ${index === currentIndex ? 'active' : ''}" data-index="${index}"></button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `;
        
        // Add click handlers for navigation dots
        const dots = container.querySelectorAll('.nav-dot');
        dots.forEach(dot => {
          dot.addEventListener('click', () => {
            currentIndex = parseInt(dot.getAttribute('data-index'));
            render();
          });
        });
      };
      
      render();
      
      // Auto-rotate if enabled
      if (settings.autoRotate !== false && displayTestimonials.length > 1) {
        setInterval(() => {
          currentIndex = (currentIndex + 1) % displayTestimonials.length;
          render();
        }, (settings.rotationInterval || 5) * 1000);
      }
    }
    
    renderQuoteStyle(container, testimonials, settings) {
      if (!testimonials.length) {
        container.innerHTML = '<div class="testimonial-widget-error">No testimonials available</div>';
        return;
      }
      
      const testimonial = testimonials[0];
      
      container.innerHTML = `
        <div class="widget-container" style="
          background: var(--background-color);
          border-radius: var(--border-radius);
          border-left: var(--border-width) solid var(--primary-color);
          padding: var(--padding);
          text-align: center;
          max-width: var(--max-width);
          font-family: var(--font-family);
          color: var(--text-color);
        ">
          <div style="font-size: 64px; color: var(--primary-color); line-height: 1; margin-bottom: 16px; font-family: Georgia, serif; opacity: 0.3;">
            "
          </div>
          
          <blockquote class="testimonial-content" style="
            font-size: var(--font-size);
            font-weight: var(--font-weight);
            line-height: 1.6;
            margin: 0 0 24px 0;
            font-style: italic;
          ">
            ${testimonial.content}
          </blockquote>
          
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <div style="font-weight: 600; font-size: 16px;">${testimonial.customerName}</div>
            ${settings.showCompany !== false && (testimonial.customerTitle || testimonial.customerCompany) ? `
              <div style="font-size: 14px; color: #6B7280;">
                ${testimonial.customerTitle || ''}${testimonial.customerTitle && testimonial.customerCompany ? ', ' : ''}${testimonial.customerCompany || ''}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }
    
    renderRatingBadge(container, testimonials, settings) {
      if (!testimonials.length) {
        container.innerHTML = '<div class="testimonial-widget-error">No testimonials available</div>';
        return;
      }
      
      const ratingsOnly = testimonials.filter(t => t.rating).map(t => t.rating);
      const averageRating = ratingsOnly.length > 0 
        ? ratingsOnly.reduce((sum, rating) => sum + rating, 0) / ratingsOnly.length 
        : 0;
      
      container.innerHTML = `
        <div class="widget-container" style="
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--background-color);
          border-radius: var(--border-radius);
          border: var(--border-width) solid var(--border-color);
          padding: var(--padding);
          box-shadow: var(--shadow);
          font-family: var(--font-family);
          color: var(--text-color);
          max-width: fit-content;
        ">
          <div style="font-size: 16px; display: flex; gap: 2px;">
            ${'★'.repeat(Math.round(averageRating))}<span style="color: #e5e7eb;">${'★'.repeat(5 - Math.round(averageRating))}</span>
          </div>
          
          <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <div style="font-weight: 600; font-size: 18px; line-height: 1;">
              ${averageRating.toFixed(1)}
            </div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">
              from ${testimonials.length} reviews
            </div>
          </div>
        </div>
      `;
    }
    
    renderMinimalList(container, testimonials, settings) {
      if (!testimonials.length) {
        container.innerHTML = '<div class="testimonial-widget-error">No testimonials available</div>';
        return;
      }
      
      const displayTestimonials = testimonials.slice(0, Math.min(3, settings.maxTestimonials || 10));
      
      container.innerHTML = `
        <div class="widget-container" style="
          background: var(--background-color);
          border-radius: var(--border-radius);
          border: var(--border-width) solid var(--border-color);
          padding: var(--padding);
          max-width: var(--max-width);
          font-family: var(--font-family);
          color: var(--text-color);
        ">
          ${displayTestimonials.map((testimonial, index) => `
            <div style="
              display: flex;
              align-items: start;
              gap: 12px;
              padding-bottom: 12px;
              ${index < displayTestimonials.length - 1 ? 'border-bottom: 1px solid #e5e7eb; margin-bottom: 12px;' : ''}
            ">
              <div style="flex: 1;">
                ${settings.showRating !== false && testimonial.rating ? `
                  <div style="margin-bottom: 4px; font-size: 14px;">
                    ${'★'.repeat(testimonial.rating)}<span style="color: #e5e7eb;">${'★'.repeat(5 - testimonial.rating)}</span>
                  </div>
                ` : ''}
                
                <div style="font-size: var(--font-size); margin-bottom: 8px;">
                  "${testimonial.content.substring(0, 80)}${testimonial.content.length > 80 ? '...' : ''}"
                </div>
                
                <div style="font-size: 12px; font-weight: 600;">${testimonial.customerName}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    renderFeaturedHero(container, testimonials, settings) {
      if (!testimonials.length) {
        container.innerHTML = '<div class="testimonial-widget-error">No testimonials available</div>';
        return;
      }
      
      let currentIndex = 0;
      const maxTestimonials = Math.min(testimonials.length, settings.maxTestimonials || 3);
      const displayTestimonials = testimonials.slice(0, maxTestimonials);
      
      const render = () => {
        const testimonial = displayTestimonials[currentIndex];
        
        container.innerHTML = `
          <div class="widget-container" style="
            background: var(--background-color);
            border-radius: var(--border-radius);
            border: var(--border-width) solid var(--border-color);
            padding: var(--padding);
            box-shadow: var(--shadow);
            max-width: var(--max-width);
            font-family: var(--font-family);
            color: var(--text-color);
          ">
            <div style="display: flex; align-items: start; gap: 16px;">
              ${settings.showAvatar !== false && testimonial.avatar ? `
                <img 
                  src="${testimonial.avatar}" 
                  alt="${testimonial.customerName}"
                  style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid #f3f4f6; flex-shrink: 0;"
                />
              ` : ''}
              
              <div style="flex: 1;">
                ${settings.showRating !== false && testimonial.rating ? `
                  <div style="margin-bottom: 12px; font-size: 20px;">
                    ${'★'.repeat(testimonial.rating)}<span style="color: #e5e7eb;">${'★'.repeat(5 - testimonial.rating)}</span>
                  </div>
                ` : ''}
                
                <blockquote class="testimonial-content" style="
                  font-size: var(--font-size);
                  font-weight: var(--font-weight);
                  line-height: 1.6;
                  margin: 0 0 16px 0;
                  font-style: italic;
                ">
                  "${testimonial.content}"
                </blockquote>
                
                <div>
                  <div style="font-weight: 600; font-size: 18px;">${testimonial.customerName}</div>
                  ${settings.showCompany !== false && (testimonial.customerTitle || testimonial.customerCompany) ? `
                    <div style="color: #6B7280; margin-top: 4px;">
                      ${testimonial.customerTitle || ''}${testimonial.customerTitle && testimonial.customerCompany ? ', ' : ''}${testimonial.customerCompany || ''}
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
            
            ${displayTestimonials.length > 1 && settings.autoRotate !== false ? `
              <div class="testimonial-nav" style="margin-top: 24px;">
                ${displayTestimonials.map((_, index) => `
                  <button class="nav-dot ${index === currentIndex ? 'active' : ''}" data-index="${index}"></button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `;
        
        // Add click handlers for navigation dots
        const dots = container.querySelectorAll('.nav-dot');
        dots.forEach(dot => {
          dot.addEventListener('click', () => {
            currentIndex = parseInt(dot.getAttribute('data-index'));
            render();
          });
        });
      };
      
      render();
      
      // Auto-rotate if enabled
      if (settings.autoRotate !== false && displayTestimonials.length > 1) {
        setInterval(() => {
          currentIndex = (currentIndex + 1) % displayTestimonials.length;
          render();
        }, (settings.rotationInterval || 8) * 1000);
      }
    }
    
    renderError(container, message) {
      container.className = 'testimonial-widget-error';
      container.innerHTML = message;
    }
  }
  
  // Initialize widget system
  window.TestimonialWidget = new TestimonialWidget();
  
  // Re-initialize if DOM changes (for SPAs)
  if (window.MutationObserver) {
    const observer = new MutationObserver(() => {
      if (window.TestimonialWidget) {
        window.TestimonialWidget.init();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();