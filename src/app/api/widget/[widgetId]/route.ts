import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { projects, testimonials, groups } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { format } from 'path'

interface RouteParams {
  params: {
    widgetId: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { widgetId } = params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'

    // For now, treat widgetId as project slug
    // Later we can implement proper widget storage
    const projectSlug = widgetId

    // Get project data
    const projectResult = await db
      .select()
      .from(projects)
      .where(eq(projects.publicSlug, projectSlug))
      .limit(1)

    if (!projectResult.length) {
      if (format === 'js') {
        return new NextResponse(
          `console.error('Boostfen Widget: Project not found');`,
          {
            headers: {
              'Content-Type': 'application/javascript',
              'Access-Control-Allow-Origin': '*',
            }
          }
        )
      }
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const project = projectResult[0]

    // Get approved testimonials
    const projectTestimonials = await db
      .select({
        id: testimonials.id,
        customerName: testimonials.customerName,
        customerCompany: testimonials.customerCompany,
        customerTitle: testimonials.customerTitle,
        customerImageUrl: testimonials.customerImageUrl,
        content: testimonials.content,
        rating: testimonials.rating,
        createdAt: testimonials.createdAt,
        groupName: groups.name,
        groupColor: groups.color,
      })
      .from(testimonials)
      .leftJoin(groups, eq(testimonials.groupId, groups.id))
      .where(
        and(
          eq(testimonials.projectId, project.id),
          eq(testimonials.status, 'approved')
        )
      )
      .orderBy(testimonials.createdAt)

    // Transform testimonials
    const widgetTestimonials = projectTestimonials.map(testimonial => ({
      id: testimonial.id,
      customerName: testimonial.customerName,
      customerCompany: testimonial.customerCompany,
      customerTitle: testimonial.customerTitle,
      avatar: testimonial.customerImageUrl,
      content: testimonial.content,
      rating: testimonial.rating,
      createdAt: testimonial.createdAt,
    }))

    const publicSettings = project.publicPageSettings as any || {}

    if (format === 'js') {
      // Return JavaScript widget loader
      const widgetScript = generateWidgetScript(widgetId, {
        testimonials: widgetTestimonials,
        settings: {
          theme: publicSettings.theme || 'light',
          primaryColor: publicSettings.primaryColor || '#3B82F6',
          showRatings: publicSettings.showRatings !== false,
          showCompany: publicSettings.showCompany !== false,
          showTitle: publicSettings.showTitle !== false,
          showImages: publicSettings.showImages !== false,
        }
      })

      return new NextResponse(widgetScript, {
        headers: {
          'Content-Type': 'application/javascript',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300',
        }
      })
    }

    // Return JSON data
    const response = {
      testimonials: widgetTestimonials,
      settings: {
        theme: publicSettings.theme || 'light',
        primaryColor: publicSettings.primaryColor || '#3B82F6',
        showRatings: publicSettings.showRatings !== false,
        showCompany: publicSettings.showCompany !== false,
        showTitle: publicSettings.showTitle !== false,
        showImages: publicSettings.showImages !== false,
      }
    }

    return NextResponse.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      }
    })

  } catch (error) {
    console.error('Widget API error:', error)
    
    if (format === 'js') {
      return new NextResponse(
        `console.error('Boostfen Widget: Internal server error');`,
        {
          headers: {
            'Content-Type': 'application/javascript',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateWidgetScript(widgetId: string, data: any): string {
  return `
(function() {
  'use strict';
  
  // Clear existing widget instance on reload
  if (window.BoostfenWidget_${widgetId}) {
    delete window.BoostfenWidget_${widgetId};
  }
  
  const widgetData = ${JSON.stringify(data, null, 2)};
  
  class BoostfenWidget {
    constructor(widgetId, data) {
      this.widgetId = widgetId;
      this.data = data;
      this.currentIndex = 0;
      this.autoRotateInterval = null;
      this.init();
    }
    
    init() {
      // Find all containers for this widget
      const containers = document.querySelectorAll(\`[data-boostfen-widget="\${this.widgetId}"]\`);
      console.log('Found containers:', containers.length);
      containers.forEach(container => {
        console.log('Container widget type:', container.getAttribute('data-widget-type'));
        this.renderWidget(container);
      });
      
      // Mark as loaded
      window.BoostfenWidget_${widgetId} = this;
    }
    
    renderWidget(container) {
      if (!this.data.testimonials.length) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #6b7280;">No testimonials available</div>';
        return;
      }
      
      // Get widget type from container or default to carousel
      const widgetType = container.getAttribute('data-widget-type') || 'carousel';
      console.log('Rendering widget type:', widgetType);
      const settings = this.parseSettings(container);
      
      // Render directly without shadow DOM for better compatibility
      this.renderDirect(container, widgetType, settings);
    }
    
    renderDirect(container, widgetType, settings) {
      // Add scoped CSS
      if (!document.getElementById('boostfen-widget-css-${widgetId}')) {
        const style = document.createElement('style');
        style.id = 'boostfen-widget-css-${widgetId}';
        style.textContent = this.getScopedCSS(settings);
        document.head.appendChild(style);
      }
      
      container.className = 'boostfen-widget-${widgetId}';
      container.innerHTML = this.getWidgetHTML(widgetType, settings);
      this.bindEvents(container, settings);
    }
    
    parseSettings(container) {
      const settings = { ...this.data.settings };
      
      // Override with data attributes
      if (container.hasAttribute('data-theme')) {
        settings.theme = container.getAttribute('data-theme');
      }
      if (container.hasAttribute('data-primary-color')) {
        settings.primaryColor = container.getAttribute('data-primary-color');
      }
      if (container.hasAttribute('data-max-testimonials')) {
        settings.maxTestimonials = parseInt(container.getAttribute('data-max-testimonials'));
      }
      if (container.hasAttribute('data-auto-rotate')) {
        settings.autoRotate = container.getAttribute('data-auto-rotate') === 'true';
      }
      if (container.hasAttribute('data-rotation-interval')) {
        settings.rotationInterval = parseInt(container.getAttribute('data-rotation-interval'));
      }
      
      return settings;
    }
    
    getScopedCSS(settings) {
      const themeColors = this.getThemeColors(settings.theme);
      
      return \`
        .boostfen-widget-${widgetId} {
          --primary-color: \${settings.primaryColor};
          --bg-color: \${themeColors.backgroundColor};
          --text-color: \${themeColors.textColor};
          --border-color: \${themeColors.borderColor};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .boostfen-widget-${widgetId} .widget-container {
          background: var(--bg-color);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          margin: 0 auto;
        }
        
        .boostfen-widget-${widgetId} .testimonial-content {
          font-style: italic;
          line-height: 1.6;
          margin: 0 0 16px 0;
        }
        
        .boostfen-widget-${widgetId} .author-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .boostfen-widget-${widgetId} .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary-color);
        }
        
        .boostfen-widget-${widgetId} .avatar-placeholder {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        
        .boostfen-widget-${widgetId} .author-name {
          font-weight: 600;
          color: var(--primary-color);
          margin: 0;
        }
        
        .boostfen-widget-${widgetId} .author-role {
          font-size: 14px;
          opacity: 0.8;
          margin: 2px 0 0 0;
        }
        
        .boostfen-widget-${widgetId} .rating {
          margin-bottom: 16px;
          font-size: 18px;
        }
        
        .boostfen-widget-${widgetId} .star-filled {
          color: var(--primary-color);
        }
        
        .boostfen-widget-${widgetId} .star-empty {
          color: #e5e7eb;
        }
        
        .boostfen-widget-${widgetId} .nav-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }
        
        .boostfen-widget-${widgetId} .nav-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .boostfen-widget-${widgetId} .nav-dot:hover {
          background: #9ca3af;
        }
        
        .boostfen-widget-${widgetId} .nav-dot.active {
          background: var(--primary-color);
        }
      \`;
    }
    
    getWidgetHTML(widgetType, settings) {
      const maxTestimonials = Math.min(
        this.data.testimonials.length, 
        settings.maxTestimonials || 5
      );
      const testimonials = this.data.testimonials.slice(0, maxTestimonials);
      
      switch (widgetType) {
        case 'carousel':
          return this.getCarouselHTML(testimonials, settings);
        case 'grid':
          return this.getGridHTML(testimonials, settings);
        case 'quote-spotlight':
          return this.getQuoteSpotlightHTML(testimonials, settings);
        case 'rating-bar':
          return this.getRatingBarHTML(testimonials, settings);
        case 'avatar-carousel':
          return this.getAvatarCarouselHTML(testimonials, settings);
        case 'popup':
          return this.getPopupHTML(testimonials, settings);
        case 'card':
        default:
          return this.getCardHTML(testimonials, settings);
      }
    }
    
    getCardHTML(testimonials, settings) {
      const testimonial = testimonials[this.currentIndex];
      
      return \`
        <div class="widget-container">
          \${settings.showRatings && testimonial.rating ? \`
            <div class="rating">
              \${this.generateStars(testimonial.rating)}
            </div>
          \` : ''}
          
          <blockquote class="testimonial-content">
            "\${testimonial.content}"
          </blockquote>
          
          <div class="author-info">
            \${settings.showImages && testimonial.avatar ? \`
              <img src="\${testimonial.avatar}" alt="\${testimonial.customerName}" class="avatar" />
            \` : \`
              <div class="avatar-placeholder">
                \${testimonial.customerName.charAt(0).toUpperCase()}
              </div>
            \`}
            
            <div>
              <div class="author-name">\${testimonial.customerName}</div>
              \${settings.showCompany && (testimonial.customerTitle || testimonial.customerCompany) ? \`
                <div class="author-role">
                  \${testimonial.customerTitle || ''}\${testimonial.customerTitle && testimonial.customerCompany ? ', ' : ''}\${testimonial.customerCompany || ''}
                </div>
              \` : ''}
            </div>
          </div>
          
          \${testimonials.length > 1 ? \`
            <div class="nav-dots">
              \${testimonials.map((_, index) => \`
                <button class="nav-dot \${index === this.currentIndex ? 'active' : ''}" data-index="\${index}"></button>
              \`).join('')}
            </div>
          \` : ''}
        </div>
      \`;
    }
    
    getCarouselHTML(testimonials, settings) {
      return this.getCardHTML(testimonials, settings);
    }
    
    getGridHTML(testimonials, settings) {
      return \`
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
          \${testimonials.map(testimonial => \`
            <div class="widget-container" style="margin: 0;">
              \${settings.showRatings && testimonial.rating ? \`
                <div class="rating" style="margin-bottom: 12px; font-size: 16px;">
                  \${this.generateStars(testimonial.rating)}
                </div>
              \` : ''}
              
              <blockquote class="testimonial-content" style="font-size: 14px; margin-bottom: 12px;">
                "\${testimonial.content.length > 120 ? testimonial.content.substring(0, 120) + '...' : testimonial.content}"
              </blockquote>
              
              <div class="author-info">
                \${settings.showImages && testimonial.avatar ? \`
                  <img src="\${testimonial.avatar}" alt="\${testimonial.customerName}" class="avatar" style="width: 32px; height: 32px;" />
                \` : \`
                  <div class="avatar-placeholder" style="width: 32px; height: 32px; font-size: 12px;">
                    \${testimonial.customerName.charAt(0).toUpperCase()}
                  </div>
                \`}
                
                <div>
                  <div class="author-name" style="font-size: 14px;">\${testimonial.customerName}</div>
                  \${settings.showCompany && (testimonial.customerTitle || testimonial.customerCompany) ? \`
                    <div class="author-role" style="font-size: 12px;">
                      \${testimonial.customerTitle || ''}\${testimonial.customerTitle && testimonial.customerCompany ? ', ' : ''}\${testimonial.customerCompany || ''}
                    </div>
                  \` : ''}
                </div>
              </div>
            </div>
          \`).join('')}
        </div>
      \`;
    }
    
    getQuoteSpotlightHTML(testimonials, settings) {
      const testimonial = testimonials[this.currentIndex];
      
      return \`
        <div class="widget-container" style="text-align: center; max-width: 600px;">
          \${settings.showRatings && testimonial.rating ? \`
            <div class="rating" style="margin-bottom: 20px; font-size: 20px;">
              \${this.generateStars(testimonial.rating)}
            </div>
          \` : ''}
          
          <blockquote class="testimonial-content" style="font-size: 20px; font-weight: 600; margin-bottom: 24px;">
            "\${testimonial.content}"
          </blockquote>
          
          <div class="author-info" style="justify-content: center; margin-bottom: 16px;">
            \${settings.showImages && testimonial.avatar ? \`
              <img src="\${testimonial.avatar}" alt="\${testimonial.customerName}" class="avatar" style="width: 56px; height: 56px;" />
            \` : \`
              <div class="avatar-placeholder" style="width: 56px; height: 56px; font-size: 20px;">
                \${testimonial.customerName.charAt(0).toUpperCase()}
              </div>
            \`}
            
            <div style="text-align: left;">
              <div class="author-name" style="font-size: 18px;">\${testimonial.customerName}</div>
              \${settings.showCompany && (testimonial.customerTitle || testimonial.customerCompany) ? \`
                <div class="author-role" style="font-size: 16px;">
                  \${testimonial.customerTitle || ''}\${testimonial.customerTitle && testimonial.customerCompany ? ', ' : ''}\${testimonial.customerCompany || ''}
                </div>
              \` : ''}
            </div>
          </div>
          
          \${testimonials.length > 1 ? \`
            <div class="nav-dots">
              \${testimonials.map((_, index) => \`
                <button class="nav-dot \${index === this.currentIndex ? 'active' : ''}" data-index="\${index}"></button>
              \`).join('')}
            </div>
          \` : ''}
        </div>
      \`;
    }
    
    getRatingBarHTML(testimonials, settings) {
      const avgRating = testimonials.reduce((acc, t) => acc + (t.rating || 0), 0) / testimonials.length;
      const maxAvatars = Math.min(5, testimonials.length);
      
      return \`
        <div class="widget-container" style="max-width: 320px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center;">
              <div style="font-size: 18px; margin-right: 8px;">
                \${this.generateStars(Math.round(avgRating))}
              </div>
              <span style="font-weight: 700; font-size: 18px;">\${avgRating.toFixed(1)}</span>
            </div>
            <span style="font-size: 14px; opacity: 0.8;">from \${testimonials.length} reviews</span>
          </div>
          
          <div style="display: flex; margin-left: -4px;">
            \${testimonials.slice(0, maxAvatars).map(testimonial => 
              testimonial.avatar ? \`
                <img src="\${testimonial.avatar}" alt="\${testimonial.customerName}" 
                     style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; margin-left: -4px; object-fit: cover;" />
              \` : \`
                <div style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; margin-left: -4px; 
                           background: var(--primary-color); color: white; display: flex; align-items: center; 
                           justify-content: center; font-size: 12px; font-weight: 600;">
                  \${testimonial.customerName.charAt(0).toUpperCase()}
                </div>
              \`
            ).join('')}
            \${testimonials.length > maxAvatars ? \`
              <div style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; margin-left: -4px; 
                         background: #e5e7eb; color: #374151; display: flex; align-items: center; 
                         justify-content: center; font-size: 12px; font-weight: 600;">
                +\${testimonials.length - maxAvatars}
              </div>
            \` : ''}
          </div>
        </div>
      \`;
    }
    
    getAvatarCarouselHTML(testimonials, settings) {
      const maxAvatars = Math.min(5, testimonials.length);
      const displayTestimonials = testimonials.slice(0, maxAvatars);
      
      return \`
        <div style="text-align: center;">
          <div style="display: flex; justify-content: center; gap: 16px; margin-bottom: 16px;">
            \${displayTestimonials.map((testimonial, index) => \`
              <button onclick="window.BoostfenWidget_${widgetId} && window.BoostfenWidget_${widgetId}.showQuote(\${index})" 
                      style="border: none; background: none; cursor: pointer; transition: transform 0.2s;">
                \${testimonial.avatar ? \`
                  <img src="\${testimonial.avatar}" alt="\${testimonial.customerName}" 
                       style="width: 64px; height: 64px; border-radius: 50%; border: 4px solid var(--primary-color); object-fit: cover;" />
                \` : \`
                  <div style="width: 64px; height: 64px; border-radius: 50%; border: 4px solid var(--primary-color); 
                             background: var(--primary-color); color: white; display: flex; align-items: center; 
                             justify-content: center; font-weight: 600; font-size: 20px;">
                    \${testimonial.customerName.charAt(0).toUpperCase()}
                  </div>
                \`}
              </button>
            \`).join('')}
          </div>
          
          <div class="widget-container" id="quote-display" style="min-height: 120px; display: flex; flex-direction: column; justify-content: center;">
            <div class="testimonial-content">Click on an avatar to see their testimonial</div>
          </div>
        </div>
      \`;
    }
    
    getPopupHTML(testimonials, settings) {
      const testimonial = testimonials[this.currentIndex];
      
      return \`
        <div style="position: relative; display: inline-block;">
          <button onclick="window.BoostfenWidget_${widgetId} && window.BoostfenWidget_${widgetId}.togglePopup()" 
                  style="background: var(--primary-color); color: white; border: none; border-radius: 50px; 
                         padding: 12px 24px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                         transition: all 0.2s ease;">
            💬 See what our customers say
          </button>
          
          <div id="popup-content-${widgetId}" style="display: none; position: absolute; bottom: 60px; left: 50%; 
                                                     transform: translateX(-50%); z-index: 1000; width: 320px;">
            <div class="widget-container" style="margin: 0; box-shadow: 0 8px 32px rgba(0,0,0,0.12);">
              <button onclick="window.BoostfenWidget_${widgetId} && window.BoostfenWidget_${widgetId}.togglePopup()" 
                      style="position: absolute; top: 8px; right: 8px; background: none; border: none; 
                             font-size: 18px; cursor: pointer; color: #6b7280;">×</button>
              
              \${settings.showRatings && testimonial.rating ? \`
                <div class="rating">
                  \${this.generateStars(testimonial.rating)}
                </div>
              \` : ''}
              
              <blockquote class="testimonial-content">
                "\${testimonial.content}"
              </blockquote>
              
              <div class="author-info">
                \${settings.showImages && testimonial.avatar ? \`
                  <img src="\${testimonial.avatar}" alt="\${testimonial.customerName}" class="avatar" />
                \` : \`
                  <div class="avatar-placeholder">
                    \${testimonial.customerName.charAt(0).toUpperCase()}
                  </div>
                \`}
                
                <div>
                  <div class="author-name">\${testimonial.customerName}</div>
                  \${settings.showCompany && (testimonial.customerTitle || testimonial.customerCompany) ? \`
                    <div class="author-role">
                      \${testimonial.customerTitle || ''}\${testimonial.customerTitle && testimonial.customerCompany ? ', ' : ''}\${testimonial.customerCompany || ''}
                    </div>
                  \` : ''}
                </div>
              </div>
              
              \${testimonials.length > 1 ? \`
                <div class="nav-dots">
                  \${testimonials.map((_, index) => \`
                    <button class="nav-dot \${index === this.currentIndex ? 'active' : ''}" data-index="\${index}"></button>
                  \`).join('')}
                </div>
              \` : ''}
            </div>
          </div>
        </div>
      \`;
    }
    
    generateStars(rating) {
      return Array.from({ length: 5 }, (_, i) => 
        \`<span class="\${i < rating ? 'star-filled' : 'star-empty'}">★</span>\`
      ).join('');
    }
    
    getThemeColors(theme) {
      const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      return {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        textColor: isDark ? '#f9fafb' : '#374151',
        borderColor: isDark ? '#374151' : '#e5e7eb',
      };
    }
    
    bindEvents(container, settings) {
      const dots = container.querySelectorAll('.nav-dot');
      dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          this.currentIndex = parseInt(dot.getAttribute('data-index'));
          this.renderWidget(container);
        });
      });
      
      // Auto-rotate if enabled
      if (settings.autoRotate !== false && this.data.testimonials.length > 1) {
        this.startAutoRotate(container, settings);
      }
    }
    
    startAutoRotate(container, settings) {
      if (this.autoRotateInterval) {
        clearInterval(this.autoRotateInterval);
      }
      
      this.autoRotateInterval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.data.testimonials.length;
        this.renderWidget(container);
      }, (settings.rotationInterval || 5) * 1000);
    }
    
    showQuote(index) {
      const testimonial = this.data.testimonials[index];
      const display = document.getElementById('quote-display');
      if (display && testimonial) {
        display.innerHTML = \`
          <div class="testimonial-content">"\${testimonial.content}"</div>
          <cite class="author-name">— \${testimonial.customerName}</cite>
        \`;
      }
    }
    
    togglePopup() {
      const popup = document.getElementById('popup-content-${widgetId}');
      if (popup) {
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
      }
    }
  }
  
  // Wait for DOM to be ready before initializing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new BoostfenWidget('${widgetId}', widgetData);
    });
  } else {
    // DOM is already ready
    new BoostfenWidget('${widgetId}', widgetData);
  }
})();
`
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}