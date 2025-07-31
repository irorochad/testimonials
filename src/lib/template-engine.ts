// Template Schema Types
export interface TemplateSchema {
  id: string;
  name: string;
  category: 'carousel' | 'single' | 'grid' | 'minimal' | 'list';
  
  container: {
    width: string;
    height: string;
    padding: string;
    backgroundColor: string;
    borderRadius: string;
    boxShadow?: string;
  };
  
  layout: {
    type: 'carousel' | 'grid' | 'single' | 'list';
    itemsPerView: number;
    gap: string;
    direction: 'horizontal' | 'vertical';
  };
  
  testimonialCard: {
    backgroundColor: string;
    padding: string;
    borderRadius: string;
    border: string;
    textAlign: 'center' | 'left' | 'right';
    boxShadow?: string;
  };
  
  text: {
    fontSize: string;
    lineHeight: string;
    color: string;
    fontWeight: string;
    marginBottom: string;
    fontStyle?: string;
  };
  
  author: {
    name: {
      fontSize: string;
      fontWeight: string;
      color: string;
      marginBottom: string;
    };
    title: {
      fontSize: string;
      color: string;
      fontStyle?: string;
    };
    avatar: {
      size: string;
      borderRadius: string;
      marginBottom: string;
      marginRight?: string;
      border?: string;
      float?: string;
    };
  };
  
  rating: {
    show: boolean;
    style: 'stars' | 'number' | 'both';
    color: string;
    size: string;
    position: 'top' | 'bottom' | 'inline';
  };
  
  navigation: {
    arrows: boolean;
    dots: boolean;
    autoplay: boolean;
    speed: number;
  };
}

export interface TestimonialData {
  id: string;
  text: string;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  rating: number;
}

// Sample testimonials for preview
export const sampleTestimonials: TestimonialData[] = [
  {
    id: '1',
    text: "This product has completely transformed our workflow. The results speak for themselves - we've seen a 40% increase in productivity.",
    author: {
      name: "Sarah Chen",
      title: "Product Manager, TechCorp",
      avatar: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    rating: 5
  },
  {
    id: '2',
    text: "Outstanding customer service and an intuitive interface. Our team was up and running within hours, not days.",
    author: {
      name: "Michael Rodriguez",
      title: "CTO, StartupXYZ",
      avatar: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    rating: 5
  },
  {
    id: '3',
    text: "The automation features alone have saved us 20 hours per week. Incredible value for the investment.",
    author: {
      name: "Emily Johnson",
      title: "Operations Director",
      avatar: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    rating: 5
  },
  {
    id: '4',
    text: "The best investment we've made for our business. ROI was visible within the first month.",
    author: {
      name: "David Kim",
      title: "CEO, InnovateCorp",
      avatar: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    rating: 5
  },
  {
    id: '5',
    text: "Seamless integration and fantastic support. Couldn't be happier with our choice.",
    author: {
      name: "Lisa Wang",
      title: "Head of Operations",
      avatar: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    rating: 4
  }
];

// Template definitions based on your schema
export const templates: TemplateSchema[] = [
  // 1. Modern Carousel - Clean and professional
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
    
    layout: {
      type: 'carousel',
      itemsPerView: 1,
      gap: '0px',
      direction: 'horizontal'
    },
    
    testimonialCard: {
      backgroundColor: 'transparent',
      padding: '40px',
      borderRadius: '0px',
      border: 'none',
      textAlign: 'center'
    },
    
    text: {
      fontSize: '18px',
      lineHeight: '1.7',
      color: '#2d3748',
      fontWeight: '400',
      marginBottom: '24px',
      fontStyle: 'italic'
    },
    
    author: {
      name: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a202c',
        marginBottom: '4px'
      },
      title: {
        fontSize: '14px',
        color: '#718096',
        fontStyle: 'normal'
      },
      avatar: {
        size: '60px',
        borderRadius: '50%',
        marginBottom: '16px'
      }
    },
    
    rating: {
      show: true,
      style: 'stars',
      color: '#f6ad55',
      size: '20px',
      position: 'bottom'
    },
    
    navigation: {
      arrows: true,
      dots: true,
      autoplay: true,
      speed: 4000
    }
  },

  // 2. Purple Gradient Hero - Bold and eye-catching
  {
    id: 'purple-hero',
    name: 'Purple Hero',
    category: 'single',
    
    container: {
      width: '100%',
      height: '280px',
      padding: '32px',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
    },
    
    layout: {
      type: 'single',
      itemsPerView: 1,
      gap: '0px',
      direction: 'vertical'
    },
    
    testimonialCard: {
      backgroundColor: 'transparent',
      padding: '0px',
      borderRadius: '0px',
      border: 'none',
      textAlign: 'center'
    },
    
    text: {
      fontSize: '22px',
      lineHeight: '1.6',
      color: '#ffffff',
      fontWeight: '500',
      marginBottom: '24px',
      fontStyle: 'normal'
    },
    
    author: {
      name: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '4px'
      },
      title: {
        fontSize: '14px',
        color: 'rgba(255,255,255,0.8)',
        fontStyle: 'normal'
      },
      avatar: {
        size: '64px',
        borderRadius: '50%',
        marginBottom: '20px',
        border: '3px solid rgba(255,255,255,0.3)'
      }
    },
    
    rating: {
      show: true,
      style: 'stars',
      color: '#ffd700',
      size: '22px',
      position: 'bottom'
    },
    
    navigation: {
      arrows: false,
      dots: false,
      autoplay: false,
      speed: 0
    }
  },

  // 3. Neon Card Grid - Modern and vibrant
  {
    id: 'neon-grid',
    name: 'Neon Grid',
    category: 'grid',
    
    container: {
      width: '100%',
      height: 'auto',
      padding: '20px',
      backgroundColor: '#0f0f23',
      borderRadius: '16px',
      boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)'
    },
    
    layout: {
      type: 'grid',
      itemsPerView: 2,
      gap: '20px',
      direction: 'horizontal'
    },
    
    testimonialCard: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid rgba(0, 255, 255, 0.3)',
      textAlign: 'left',
      boxShadow: '0 4px 20px rgba(0, 255, 255, 0.1)'
    },
    
    text: {
      fontSize: '15px',
      lineHeight: '1.6',
      color: '#e2e8f0',
      fontWeight: '400',
      marginBottom: '16px',
      fontStyle: 'normal'
    },
    
    author: {
      name: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#00ffff',
        marginBottom: '2px'
      },
      title: {
        fontSize: '12px',
        color: '#a0aec0',
        fontStyle: 'normal'
      },
      avatar: {
        size: '40px',
        borderRadius: '50%',
        marginBottom: '0px',
        marginRight: '12px',
        border: '2px solid #00ffff'
      }
    },
    
    rating: {
      show: true,
      style: 'stars',
      color: '#00ffff',
      size: '14px',
      position: 'inline'
    },
    
    navigation: {
      arrows: false,
      dots: false,
      autoplay: false,
      speed: 0
    }
  },

  // 4. Warm Orange Single - Friendly and approachable
  {
    id: 'warm-orange',
    name: 'Warm Orange',
    category: 'single',
    
    container: {
      width: '100%',
      height: '260px',
      padding: '28px',
      backgroundColor: '#ff6b35',
      borderRadius: '24px',
      boxShadow: '0 8px 32px rgba(255, 107, 53, 0.4)'
    },
    
    layout: {
      type: 'single',
      itemsPerView: 1,
      gap: '0px',
      direction: 'vertical'
    },
    
    testimonialCard: {
      backgroundColor: 'transparent',
      padding: '0px',
      borderRadius: '0px',
      border: 'none',
      textAlign: 'left'
    },
    
    text: {
      fontSize: '19px',
      lineHeight: '1.5',
      color: '#ffffff',
      fontWeight: '400',
      marginBottom: '20px',
      fontStyle: 'italic'
    },
    
    author: {
      name: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '2px'
      },
      title: {
        fontSize: '13px',
        color: 'rgba(255,255,255,0.8)',
        fontStyle: 'normal'
      },
      avatar: {
        size: '48px',
        borderRadius: '50%',
        marginBottom: '0px',
        marginRight: '16px',
        border: '2px solid rgba(255,255,255,0.3)'
      }
    },
    
    rating: {
      show: true,
      style: 'stars',
      color: '#fff3cd',
      size: '16px',
      position: 'inline'
    },
    
    navigation: {
      arrows: false,
      dots: false,
      autoplay: false,
      speed: 0
    }
  },

  // 5. Glassmorphism Cards - Trendy and modern
  {
    id: 'glass-cards',
    name: 'Glass Cards',
    category: 'grid',
    
    container: {
      width: '100%',
      height: 'auto',
      padding: '24px',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
    },
    
    layout: {
      type: 'grid',
      itemsPerView: 2,
      gap: '16px',
      direction: 'horizontal'
    },
    
    testimonialCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      padding: '20px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
    },
    
    text: {
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#ffffff',
      fontWeight: '400',
      marginBottom: '16px',
      fontStyle: 'normal'
    },
    
    author: {
      name: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '2px'
      },
      title: {
        fontSize: '11px',
        color: 'rgba(255,255,255,0.8)',
        fontStyle: 'normal'
      },
      avatar: {
        size: '36px',
        borderRadius: '50%',
        marginBottom: '12px',
        border: '2px solid rgba(255,255,255,0.3)'
      }
    },
    
    rating: {
      show: true,
      style: 'stars',
      color: '#ffd700',
      size: '12px',
      position: 'top'
    },
    
    navigation: {
      arrows: false,
      dots: false,
      autoplay: false,
      speed: 0
    }
  },

  // 6. Minimal Clean List - Simple and elegant
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    category: 'list',
    
    container: {
      width: '100%',
      height: 'auto',
      padding: '24px',
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      boxShadow: 'none'
    },
    
    layout: {
      type: 'list',
      itemsPerView: 3,
      gap: '16px',
      direction: 'vertical'
    },
    
    testimonialCard: {
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      textAlign: 'left',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    
    text: {
      fontSize: '15px',
      lineHeight: '1.6',
      color: '#2d3748',
      fontWeight: '400',
      marginBottom: '12px',
      fontStyle: 'normal'
    },
    
    author: {
      name: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1a202c',
        marginBottom: '0px'
      },
      title: {
        fontSize: '12px',
        color: '#718096',
        fontStyle: 'normal'
      },
      avatar: {
        size: '36px',
        borderRadius: '50%',
        marginBottom: '0px',
        marginRight: '12px'
      }
    },
    
    rating: {
      show: true,
      style: 'number',
      color: '#38a169',
      size: '14px',
      position: 'inline'
    },
    
    navigation: {
      arrows: false,
      dots: false,
      autoplay: false,
      speed: 0
    }
  },

  // 7. Dark Elegant Carousel - Sophisticated and premium
  {
    id: 'dark-elegant',
    name: 'Dark Elegant',
    category: 'carousel',
    
    container: {
      width: '100%',
      height: '320px',
      padding: '32px',
      backgroundColor: '#1a1a1a',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
    },
    
    layout: {
      type: 'carousel',
      itemsPerView: 1,
      gap: '0px',
      direction: 'horizontal'
    },
    
    testimonialCard: {
      backgroundColor: 'transparent',
      padding: '24px',
      borderRadius: '0px',
      border: 'none',
      textAlign: 'center'
    },
    
    text: {
      fontSize: '20px',
      lineHeight: '1.6',
      color: '#f7fafc',
      fontWeight: '300',
      marginBottom: '24px',
      fontStyle: 'italic'
    },
    
    author: {
      name: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '4px'
      },
      title: {
        fontSize: '14px',
        color: '#a0aec0',
        fontStyle: 'normal'
      },
      avatar: {
        size: '64px',
        borderRadius: '50%',
        marginBottom: '20px',
        border: '3px solid #4a5568'
      }
    },
    
    rating: {
      show: true,
      style: 'stars',
      color: '#ffd700',
      size: '20px',
      position: 'bottom'
    },
    
    navigation: {
      arrows: true,
      dots: true,
      autoplay: true,
      speed: 5000
    }
  },

  // 8. Bright Yellow Accent - Energetic and attention-grabbing
  {
    id: 'bright-yellow',
    name: 'Bright Yellow',
    category: 'single',
    
    container: {
      width: '100%',
      height: '240px',
      padding: '24px',
      backgroundColor: '#ffd60a',
      borderRadius: '12px',
      boxShadow: '0 6px 24px rgba(255, 214, 10, 0.4)'
    },
    
    layout: {
      type: 'single',
      itemsPerView: 1,
      gap: '0px',
      direction: 'vertical'
    },
    
    testimonialCard: {
      backgroundColor: 'transparent',
      padding: '16px',
      borderRadius: '0px',
      border: 'none',
      textAlign: 'center'
    },
    
    text: {
      fontSize: '17px',
      lineHeight: '1.5',
      color: '#1a1a1a',
      fontWeight: '500',
      marginBottom: '20px',
      fontStyle: 'normal'
    },
    
    author: {
      name: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '2px'
      },
      title: {
        fontSize: '13px',
        color: '#4a4a4a',
        fontStyle: 'normal'
      },
      avatar: {
        size: '50px',
        borderRadius: '50%',
        marginBottom: '16px',
        border: '3px solid #1a1a1a'
      }
    },
    
    rating: {
      show: true,
      style: 'stars',
      color: '#1a1a1a',
      size: '18px',
      position: 'bottom'
    },
    
    navigation: {
      arrows: false,
      dots: false,
      autoplay: false,
      speed: 0
    }
  },

  // 9. Soft Pink Grid - Gentle and welcoming
  {
    id: 'soft-pink',
    name: 'Soft Pink',
    category: 'grid',
    
    container: {
      width: '100%',
      height: 'auto',
      padding: '20px',
      backgroundColor: '#fdf2f8',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(251, 207, 232, 0.3)'
    },
    
    layout: {
      type: 'grid',
      itemsPerView: 2,
      gap: '16px',
      direction: 'horizontal'
    },
    
    testimonialCard: {
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '16px',
      border: '2px solid #fbcfe8',
      textAlign: 'center',
      boxShadow: '0 2px 10px rgba(251, 207, 232, 0.2)'
    },
    
    text: {
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#374151',
      fontWeight: '400',
      marginBottom: '16px',
      fontStyle: 'normal'
    },
    
    author: {
      name: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#be185d',
        marginBottom: '2px'
      },
      title: {
        fontSize: '11px',
        color: '#6b7280',
        fontStyle: 'normal'
      },
      avatar: {
        size: '40px',
        borderRadius: '50%',
        marginBottom: '12px',
        border: '2px solid #fbcfe8'
      }
    },
    
    rating: {
      show: true,
      style: 'stars',
      color: '#ec4899',
      size: '12px',
      position: 'top'
    },
    
    navigation: {
      arrows: false,
      dots: false,
      autoplay: false,
      speed: 0
    }
  },

  // 10. Blue Corporate - Professional and trustworthy
  {
    id: 'blue-corporate',
    name: 'Blue Corporate',
    category: 'list',
    
    container: {
      width: '100%',
      height: 'auto',
      padding: '24px',
      backgroundColor: '#1e40af',
      borderRadius: '12px',
      boxShadow: '0 8px 25px rgba(30, 64, 175, 0.3)'
    },
    
    layout: {
      type: 'list',
      itemsPerView: 2,
      gap: '16px',
      direction: 'vertical'
    },
    
    testimonialCard: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.2)',
      textAlign: 'left',
      boxShadow: 'none'
    },
    
    text: {
      fontSize: '15px',
      lineHeight: '1.5',
      color: '#f1f5f9',
      fontWeight: '400',
      marginBottom: '12px',
      fontStyle: 'normal'
    },
    
    author: {
      name: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '0px'
      },
      title: {
        fontSize: '12px',
        color: '#cbd5e1',
        fontStyle: 'normal'
      },
      avatar: {
        size: '36px',
        borderRadius: '50%',
        marginBottom: '0px',
        marginRight: '12px',
        border: '2px solid rgba(255,255,255,0.3)'
      }
    },
    
    rating: {
      show: true,
      style: 'stars',
      color: '#fbbf24',
      size: '14px',
      position: 'inline'
    },
    
    navigation: {
      arrows: false,
      dots: false,
      autoplay: false,
      speed: 0
    }
  }
];