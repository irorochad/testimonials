// Template Schema Definition
const templateSchema = {
  id: 'unique-template-id',
  name: 'Template Name',
  category: 'carousel|single|grid|minimal',
  
  // Layout structure
  container: {
    width: '100%',
    height: 'auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  
  // How testimonials are arranged
  layout: {
    type: 'carousel', // carousel, grid, single, list
    itemsPerView: 1,
    gap: '16px',
    direction: 'horizontal'
  },
  
  // Individual testimonial card styling
  testimonialCard: {
    backgroundColor: '#f8f9fa',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e9ecef',
    textAlign: 'center'
  },
  
  // Text styling
  text: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#333333',
    fontWeight: '400',
    marginBottom: '16px'
  },
  
  // Author styling
  author: {
    name: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: '4px'
    },
    title: {
      fontSize: '12px',
      color: '#666666',
      fontStyle: 'italic'
    },
    avatar: {
      size: '48px',
      borderRadius: '50%',
      marginBottom: '12px'
    }
  },
  
  // Rating display
  rating: {
    show: true,
    style: 'stars', // stars, number, both
    color: '#ffd700',
    size: '16px',
    position: 'bottom' // top, bottom, inline
  },
  
  // Navigation (for carousels)
  navigation: {
    arrows: true,
    dots: true,
    autoplay: false,
    speed: 3000
  }
};

// 5 Complete Template Definitions
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
  
  {
    id: 'minimal-single',
    name: 'Minimal Single',
    category: 'single',
    
    container: {
      width: '100%',
      height: 'auto',
      padding: '32px',
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      boxShadow: 'none'
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
      fontSize: '20px',
      lineHeight: '1.6',
      color: '#1a1a1a',
      fontWeight: '300',
      marginBottom: '20px',
      fontStyle: 'normal'
    },
    
    author: {
      name: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#333333',
        marginBottom: '2px'
      },
      title: {
        fontSize: '12px',
        color: '#888888',
        fontStyle: 'normal'
      },
      avatar: {
        size: '40px',
        borderRadius: '50%',
        marginBottom: '0px',
        float: 'left',
        marginRight: '12px'
      }
    },
    
    rating: {
      show: true,
      style: 'stars',
      color: '#10b981',
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
    
    layout: {
      type: 'grid',
      itemsPerView: 3,
      gap: '16px',
      direction: 'horizontal'
    },
    
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
      fontWeight: '400',
      marginBottom: '16px',
      fontStyle: 'normal'
    },
    
    author: {
      name: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '2px'
      },
      title: {
        fontSize: '11px',
        color: '#718096',
        fontStyle: 'normal'
      },
      avatar: {
        size: '36px',
        borderRadius: '50%',
        marginBottom: '12px'
      }
    },
    
    rating: {
      show: true,
      style: 'stars',
      color: '#ed8936',
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
    
    layout: {
      type: 'carousel',
      itemsPerView: 1,
      gap: '0px',
      direction: 'horizontal'
    },
    
    testimonialCard: {
      backgroundColor: 'transparent',
      padding: '20px',
      borderRadius: '0px',
      border: 'none',
      textAlign: 'center'
    },
    
    text: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#e2e8f0',
      fontWeight: '400',
      marginBottom: '20px',
      fontStyle: 'italic'
    },
    
    author: {
      name: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '4px'
      },
      title: {
        fontSize: '13px',
        color: '#a0aec0',
        fontStyle: 'normal'
      },
      avatar: {
        size: '70px',
        borderRadius: '50%',
        marginBottom: '16px',
        border: '3px solid #4a5568'
      }
    },
    
    rating: {
      show: true,
      style: 'stars',
      color: '#fbd38d',
      size: '18px',
      position: 'bottom'
    },
    
    navigation: {
      arrows: true,
      dots: false,
      autoplay: true,
      speed: 5000
    }
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
      borderRadius: '8px',
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
    },
    
    layout: {
      type: 'list',
      itemsPerView: 3,
      gap: '12px',
      direction: 'vertical'
    },
    
    testimonialCard: {
      backgroundColor: '#ffffff',
      padding: '16px',
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      textAlign: 'left',
      boxShadow: 'none'
    },
    
    text: {
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#2d3748',
      fontWeight: '400',
      marginBottom: '12px',
      fontStyle: 'normal'
    },
    
    author: {
      name: {
        fontSize: '13px',
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
        size: '32px',
        borderRadius: '50%',
        marginBottom: '0px',
        float: 'left',
        marginRight: '10px'
      }
    },
    
    rating: {
      show: true,
      style: 'number',
      color: '#38a169',
      size: '13px',
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

export { templateSchema, templates };