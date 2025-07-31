(function () {
    'use strict';

    // Prevent multiple initializations
    if (window.ProofFlowWidget) {
        return;
    }

    class ProofFlowWidget {
        constructor() {
            this.widgets = new Map();
            this.init();
        }

        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.findAndInitWidgets());
            } else {
                this.findAndInitWidgets();
            }
        }

        findAndInitWidgets() {
            const widgetElements = document.querySelectorAll('[id^="proofflow-widget"]');
            widgetElements.forEach(element => this.initWidget(element));
        }

        async initWidget(element) {
            const projectId = element.getAttribute('data-project-id');
            const configStr = element.getAttribute('data-config');
            const tags = element.getAttribute('data-tags');

            if (!projectId) {
                console.error('ProofFlow Widget: data-project-id is required');
                return;
            }

            try {
                // Parse configuration
                const config = configStr ? JSON.parse(decodeURIComponent(configStr)) : {};

                // Default configuration
                const defaultConfig = {
                    theme: 'auto',
                    primaryColor: '#3b82f6',
                    layout: 'carousel',
                    showRatings: true,
                    showCompany: true,
                    showTitle: true,
                    maxTestimonials: 10,
                    widgetType: 'basic'
                };

                const finalConfig = { ...defaultConfig, ...config };

                // Fetch testimonials
                const domain = window.location.hostname;
                const url = new URL('/api/widget/config', window.location.origin);
                url.searchParams.set('projectId', projectId);
                url.searchParams.set('domain', domain);

                if (tags) {
                    url.searchParams.set('tags', tags);
                }

                const response = await fetch(url.toString());
                const data = await response.json();

                if (!data.success) {
                    console.error('ProofFlow Widget:', data.error);
                    return;
                }

                // Render widget
                this.renderWidget(element, data.testimonials, finalConfig);

            } catch (error) {
                console.error('ProofFlow Widget Error:', error);
            }
        }

        renderWidget(element, testimonials, config) {
            // Create shadow DOM for style isolation
            const shadow = element.attachShadow({ mode: 'open' });

            // Add styles
            const styles = this.generateStyles(config);
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            shadow.appendChild(styleSheet);

            // Create widget container
            const container = document.createElement('div');
            container.className = 'proofflow-widget';

            if (testimonials.length === 0) {
                container.innerHTML = '<div class="no-testimonials">No testimonials available</div>';
                shadow.appendChild(container);
                return;
            }

            // Limit testimonials
            const displayTestimonials = testimonials.slice(0, config.maxTestimonials);

            // Render based on layout
            switch (config.layout) {
                case 'carousel':
                    this.renderCarousel(container, displayTestimonials, config);
                    break;
                case 'grid':
                    this.renderGrid(container, displayTestimonials, config);
                    break;
                case 'list':
                    this.renderList(container, displayTestimonials, config);
                    break;
            }

            shadow.appendChild(container);
        }

        renderCarousel(container, testimonials, config) {
            let currentIndex = 0;

            const carouselHTML = `
        <div class="carousel-container">
          <div class="testimonial-slide">
            ${this.renderTestimonial(testimonials[0], config)}
          </div>
          ${testimonials.length > 1 ? `
            <div class="carousel-controls">
              <button class="carousel-btn prev-btn">‹</button>
              <div class="carousel-dots">
                ${testimonials.map((_, i) => `<button class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`).join('')}
              </div>
              <button class="carousel-btn next-btn">›</button>
            </div>
          ` : ''}
        </div>
      `;

            container.innerHTML = carouselHTML;

            if (testimonials.length > 1) {
                const slide = container.querySelector('.testimonial-slide');
                const dots = container.querySelectorAll('.dot');
                const prevBtn = container.querySelector('.prev-btn');
                const nextBtn = container.querySelector('.next-btn');

                const updateSlide = (index) => {
                    currentIndex = index;
                    slide.innerHTML = this.renderTestimonial(testimonials[index], config);
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                };

                prevBtn.addEventListener('click', () => {
                    const newIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
                    updateSlide(newIndex);
                });

                nextBtn.addEventListener('click', () => {
                    const newIndex = (currentIndex + 1) % testimonials.length;
                    updateSlide(newIndex);
                });

                dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => updateSlide(index));
                });
            }
        }

        renderGrid(container, testimonials, config) {
            const gridHTML = `
        <div class="grid-container">
          ${testimonials.map(testimonial => this.renderTestimonial(testimonial, config)).join('')}
        </div>
      `;
            container.innerHTML = gridHTML;
        }

        renderList(container, testimonials, config) {
            const listHTML = `
        <div class="list-container">
          ${testimonials.map(testimonial => this.renderTestimonial(testimonial, config)).join('')}
        </div>
      `;
            container.innerHTML = listHTML;
        }

        renderTestimonial(testimonial, config) {
            const stars = config.showRatings && testimonial.rating ?
                Array.from({ length: 5 }, (_, i) =>
                    `<span class="star ${i < testimonial.rating ? 'filled' : ''}">${i < testimonial.rating ? '★' : '☆'}</span>`
                ).join('') : '';

            const company = config.showCompany && testimonial.customerCompany ?
                `<span class="company">${testimonial.customerCompany}</span>` : '';

            const title = config.showTitle && testimonial.customerTitle ?
                `<span class="title">${testimonial.customerTitle}</span>` : '';

            const separator = (company && title) ? '<span class="separator">•</span>' : '';

            return `
        <div class="testimonial">
          ${stars ? `<div class="rating">${stars}</div>` : ''}
          <div class="content">"${testimonial.content}"</div>
          <div class="author">
            <span class="name">${testimonial.customerName}</span>
            ${title ? `<span class="separator">•</span>${title}` : ''}
            ${company ? `<span class="separator">•</span>${company}` : ''}
          </div>
        </div>
      `;
        }

        generateStyles(config) {
            const isDark = config.theme === 'dark' ||
                (config.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

            return `
        .proofflow-widget {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 100%;
        }

        .testimonial {
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid ${isDark ? '#374151' : '#e5e7eb'};
          background: ${isDark ? '#1f2937' : '#ffffff'};
          color: ${isDark ? '#f9fafb' : '#111827'};
          margin-bottom: 1rem;
        }

        .rating {
          margin-bottom: 0.75rem;
        }

        .star {
          color: #fbbf24;
          margin-right: 0.125rem;
        }

        .star:not(.filled) {
          color: ${isDark ? '#4b5563' : '#d1d5db'};
        }

        .content {
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }

        .author {
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .name {
          font-weight: 600;
          color: ${config.primaryColor};
        }

        .separator {
          color: ${isDark ? '#6b7280' : '#9ca3af'};
        }

        .title, .company {
          color: ${isDark ? '#9ca3af' : '#6b7280'};
        }

        /* Carousel Styles */
        .carousel-container {
          position: relative;
        }

        .carousel-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
        }

        .carousel-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: ${config.primaryColor};
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background-color 0.2s;
        }

        .carousel-btn:hover {
          background: ${isDark ? '#374151' : '#f3f4f6'};
        }

        .carousel-dots {
          display: flex;
          gap: 0.5rem;
        }

        .dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          border: none;
          background: ${config.primaryColor};
          opacity: 0.3;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .dot.active {
          opacity: 1;
        }

        /* Grid Styles */
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .grid-container .testimonial {
          margin-bottom: 0;
        }

        /* List Styles */
        .list-container .testimonial:last-child {
          margin-bottom: 0;
        }

        /* No testimonials */
        .no-testimonials {
          text-align: center;
          padding: 2rem;
          color: ${isDark ? '#9ca3af' : '#6b7280'};
          font-size: 0.875rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .grid-container {
            grid-template-columns: 1fr;
          }
          
          .testimonial {
            padding: 0.75rem;
          }
        }
      `;
        }
    }

    // Initialize widget
    window.ProofFlowWidget = new ProofFlowWidget();
})();