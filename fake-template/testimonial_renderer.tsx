import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

// Sample testimonial data
const sampleTestimonials = [
  {
    id: 1,
    text: "This product has completely transformed our workflow. The results speak for themselves - we've seen a 40% increase in productivity.",
    author: {
      name: "Sarah Chen",
      title: "Product Manager, TechCorp",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    rating: 5
  },
  {
    id: 2,
    text: "Outstanding customer service and an intuitive interface. Our team was up and running within hours, not days.",
    author: {
      name: "Michael Rodriguez",
      title: "CTO, StartupXYZ",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    rating: 5
  },
  {
    id: 3,
    text: "The automation features alone have saved us 20 hours per week. Incredible value for the investment.",
    author: {
      name: "Emily Johnson",
      title: "Operations Director",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    rating: 5
  }
];

// Template definitions (using simplified versions for demo)
const templates = [
  {
    id: 'modern-carousel',
    name: 'Modern Carousel',
    category: 'carousel',
    container: {
      width: '100%',
      height: '300px',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    },
    layout: { type: 'carousel', itemsPerView: 1 },
    testimonialCard: {
      backgroundColor: 'transparent',
      padding: '40px',
      textAlign: 'center'
    },
    text: {
      fontSize: '18px',
      lineHeight: '1.7',
      color: '#2d3748',
      fontStyle: 'italic',
      marginBottom: '24px'
    },
    author: {
      name: { fontSize: '16px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' },
      title: { fontSize: '14px', color: '#718096' },
      avatar: { size: '60px', borderRadius: '50%', marginBottom: '16px' }
    },
    rating: { show: true, style: 'stars', color: '#f6ad55', size: '20px' },
    navigation: { arrows: true, dots: true, autoplay: false }
  },
  {
    id: 'minimal-single',
    name: 'Minimal Single',
    category: 'single',
    container: {
      width: '100%',
      height: 'auto',
      padding: '32px',
      backgroundColor: '#fafafa',
      borderRadius: '8px'
    },
    layout: { type: 'single', itemsPerView: 1 },
    testimonialCard: {
      backgroundColor: 'transparent',
      padding: '0px',
      textAlign: 'left'
    },
    text: {
      fontSize: '20px',
      lineHeight: '1.6',
      color: '#1a1a1a',
      fontWeight: '300',
      marginBottom: '20px'
    },
    author: {
      name: { fontSize: '14px', fontWeight: '500', color: '#333333' },
      title: { fontSize: '12px', color: '#888888' },
      avatar: { size: '40px', borderRadius: '50%', marginRight: '12px' }
    },
    rating: { show: true, style: 'stars', color: '#10b981', size: '14px' }
  },
  {
    id: 'card-grid',
    name: 'Card Grid',
    category: 'grid',
    container: {
      width: '100%',
      height: 'auto',
      padding: '16px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
    },
    layout: { type: 'grid', itemsPerView: 3, gap: '16px' },
    testimonialCard: {
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      textAlign: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    text: {
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#4a5568',
      marginBottom: '16px'
    },
    author: {
      name: { fontSize: '13px', fontWeight: '600', color: '#2d3748' },
      title: { fontSize: '11px', color: '#718096' },
      avatar: { size: '36px', marginBottom: '12px' }
    },
    rating: { show: true, style: 'stars', color: '#ed8936', size: '12px' }
  },
  {
    id: 'avatar-focus',
    name: 'Avatar Focus',
    category: 'carousel',
    container: {
      width: '100%',
      height: '200px',
      padding: '24px',
      backgroundColor: '#1a202c',
      borderRadius: '20px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
    },
    layout: { type: 'carousel', itemsPerView: 1 },
    testimonialCard: {
      backgroundColor: 'transparent',
      padding: '20px',
      textAlign: 'center'
    },
    text: {
      fontSize: '16px',
      color: '#e2e8f0',
      fontStyle: 'italic',
      marginBottom: '20px'
    },
    author: {
      name: { fontSize: '15px', fontWeight: '600', color: '#ffffff' },
      title: { fontSize: '13px', color: '#a0aec0' },
      avatar: { size: '70px', marginBottom: '16px', border: '3px solid #4a5568' }
    },
    rating: { show: true, style: 'stars', color: '#fbd38d', size: '18px' }
  },
  {
    id: 'compact-list',
    name: 'Compact List',
    category: 'list',
    container: {
      width: '100%',
      height: 'auto',
      padding: '20px',
      backgroundColor: '#f7fafc',
      borderRadius: '8px'
    },
    layout: { type: 'list', itemsPerView: 3, gap: '12px' },
    testimonialCard: {
      backgroundColor: '#ffffff',
      padding: '16px',
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      textAlign: 'left'
    },
    text: {
      fontSize: '14px',
      color: '#2d3748',
      marginBottom: '12px'
    },
    author: {
      name: { fontSize: '13px', fontWeight: '600', color: '#1a202c' },
      title: { fontSize: '12px', color: '#718096' },
      avatar: { size: '32px', marginRight: '10px' }
    },
    rating: { show: true, style: 'number', color: '#38a169', size: '13px' }
  }
];

// Rating component
const Rating = ({ rating, style, color, size }) => {
  if (style === 'stars') {
    return (
      <div className="flex items-center justify-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            style={{ width: size, height: size, color }}
            className={i < rating ? 'fill-current' : 'stroke-current'}
          />
        ))}
      </div>
    );
  }
  
  if (style === 'number') {
    return (
      <span style={{ color, fontSize: size, fontWeight: '600' }}>
        {rating}.0
      </span>
    );
  }
  
  return null;
};

// Individual testimonial card component
const TestimonialCard = ({ testimonial, template }) => {
  const cardStyle = {
    ...template.testimonialCard,
    flex: template.layout.type === 'grid' ? '1 1 calc(33.333% - 16px)' : 'none',
    minWidth: template.layout.type === 'grid' ? '200px' : 'auto'
  };

  const avatarInline = template.author.avatar.marginRight;

  return (
    <div style={cardStyle}>
      {template.rating.show && template.rating.position === 'top' && (
        <div className="mb-3">
          <Rating {...template.rating} rating={testimonial.rating} />
        </div>
      )}
      
      <div className="flex items-start">
        {avatarInline && (
          <img
            src={testimonial.author.avatar}
            alt={testimonial.author.name}
            style={{
              width: template.author.avatar.size,
              height: template.author.avatar.size,
              borderRadius: template.author.avatar.borderRadius,
              marginRight: template.author.avatar.marginRight,
              border: template.author.avatar.border,
              objectFit: 'cover'
            }}
          />
        )}
        
        <div className="flex-1">
          {!avatarInline && (
            <div className="flex justify-center mb-4">
              <img
                src={testimonial.author.avatar}
                alt={testimonial.author.name}
                style={{
                  width: template.author.avatar.size,
                  height: template.author.avatar.size,
                  borderRadius: template.author.avatar.borderRadius,
                  marginBottom: template.author.avatar.marginBottom,
                  border: template.author.avatar.border,
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
          
          <div style={template.text}>
            "{testimonial.text}"
          </div>
          
          <div className="author-info">
            <div style={template.author.name}>
              {testimonial.author.name}
            </div>
            <div style={template.author.title}>
              {testimonial.author.title}
            </div>
          </div>
          
          {template.rating.show && template.rating.position !== 'top' && (
            <div className="mt-3">
              <Rating {...template.rating} rating={testimonial.rating} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main testimonial renderer
const TestimonialRenderer = ({ template, testimonials = sampleTestimonials, scale = 1 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerStyle = {
    ...template.container,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: template.container.width,
    height: template.container.height
  };

  const renderLayout = () => {
    switch (template.layout.type) {
      case 'carousel':
        return (
          <div className="relative h-full">
            <div className="flex items-center justify-center h-full">
              <TestimonialCard 
                testimonial={testimonials[currentIndex]} 
                template={template} 
              />
            </div>
            
            {template.navigation?.arrows && testimonials.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentIndex(prev => prev === testimonials.length - 1 ? 0 : prev + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
            
            {template.navigation?.dots && testimonials.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        );
        
      case 'single':
        return (
          <TestimonialCard 
            testimonial={testimonials[0]} 
            template={template}
          />
        );
        
      case 'grid':
        return (
          <div 
            className="flex flex-wrap"
            style={{ gap: template.layout.gap }}
          >
            {testimonials.slice(0, template.layout.itemsPerView).map((testimonial) => (
              <TestimonialCard 
                key={testimonial.id}
                testimonial={testimonial} 
                template={template}
              />
            ))}
          </div>
        );
        
      case 'list':
        return (
          <div 
            className="flex flex-col"
            style={{ gap: template.layout.gap }}
          >
            {testimonials.slice(0, template.layout.itemsPerView).map((testimonial) => (
              <TestimonialCard 
                key={testimonial.id}
                testimonial={testimonial} 
                template={template}
              />
            ))}
          </div>
        );
        
      default:
        return <div>Unknown layout type</div>;
    }
  };

  return (
    <div style={containerStyle}>
      {renderLayout()}
    </div>
  );
};

// Demo component showing all templates
const TemplateShowcase = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Testimonial Templates</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {templates.map((template) => (
          <div key={template.id} className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
            <p className="text-gray-600 mb-4 capitalize">{template.category} layout</p>
            
            <div className="border-2 border-dashed border-gray-200 p-4 rounded-lg">
              <TestimonialRenderer 
                template={template}
                testimonials={sampleTestimonials}
                scale={0.8}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateShowcase;