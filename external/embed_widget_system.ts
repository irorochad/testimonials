// =============================================================================
// FILE: public/embed/widget.js
// PURPOSE: Embeddable widget script that customers add to their websites
// PLACE THIS FILE IN: public/embed/widget.js
// =============================================================================

(function() {
  'use strict';
  
  // Prevent multiple loads
  if (window.TestimonialWidget) return;
  
  const API_BASE = 'https://your-domain.com/api';
  
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
      const scripts = document.querySelectorAll('script[data-widget-id]');
      scripts.forEach(script => {
        const widgetId = script.getAttribute('data-widget-id');
        if (widgetId && !this.widgets.has(widgetId)) {
          this.loadWidget(widgetId, script);
        }
      });
    }
    
    loadCSS() {
      if (document.getElementById('testimonial-widget-css')) return;
      
      const css = `
        .testimonial-widget {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-sizing: border-box;
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
        }
        .testimonial-widget-error {
          padding: 20px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          color: #dc2626;
          font-size: 14px;
        }
      `;
      
      const style = document.createElement('style');
      style.id = 'testimonial-widget-css';
      style.textContent = css;
      document.head.appendChild(style);
    }
    
    async loadWidget(widgetId, scriptElement) {
      try {
        // Create container
        const container = document.createElement('div');
        container.id = `testimonial-widget-${widgetId}`;
        container.className = 'testimonial-widget-loading';
        container.innerHTML = 'Loading testimonials...';
        
        // Insert container after script
        scriptElement.parentNode.insertBefore(container, scriptElement.nextSibling);
        
        // Fetch widget configuration and testimonials
        const response = await fetch(`${API_BASE}/embed/widget/${widgetId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load widget: ${response.status}`);
        }
        
        const data = await response.json();
        this.renderWidget(container, data);
        this.widgets.set(widgetId, { container, data });
        
      } catch (error) {
        console.error('TestimonialWidget error:', error);
        this.renderError(container, 'Failed to load testimonials');
      }
    }
    
    renderWidget(container, { config, testimonials }) {
      container.className = 'testimonial-widget';
      
      switch (config.templateId) {
        case 'clean-card':
          this.renderCleanCard(container, config, testimonials);
          break;
        case 'quote-style':
          this.renderQuoteStyle(container, config, testimonials);
          break;
        case 'rating-badge':
          this.renderRatingBadge(container, config, testimonials);
          break;
        default:
          this.renderError(container, 'Unknown widget template');
      }
    }
    
    renderCleanCard(container, config, testimonials) {
      if (!testimonials.length) return;
      
      let currentIndex = 0;
      const settings = config.settings;
      
      const render = () => {
        const testimonial = testimonials[currentIndex];
        
        container.innerHTML = `
          <div class="testimonial-card" style="
            background: ${settings.backgroundColor};
            border-radius: ${settings.borderRadius}px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            max-width: 400px;
            border: 1px solid #e5e7eb;
          ">
            ${settings.showRating && testimonial.rating ? `
              <div style="margin-bottom: 16px; font-size: 18px;">
                ${'★'.repeat(testimonial.rating)}<span style="color: #e5e7eb;">${'★'.repeat(5 - testimonial.rating)}</span>
              </div>
            ` : ''}
            
            <blockquote style="
              font-size: 16px;
              line-height: 1.6;
              margin: 0 0 20px 0;
              font-style: italic