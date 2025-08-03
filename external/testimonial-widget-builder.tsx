import React, { useState, useEffect } from 'react';
import { X, Copy, Download, Share2, Play, Pause, ChevronLeft, ChevronRight, Star, Users, Grid3X3, MessageSquare, Building2, Sparkles } from 'lucide-react';

// Mock testimonial data
const mockTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp Inc.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "This product has completely transformed how we handle customer feedback. The interface is intuitive and the results are amazing!",
    companyLogo: "https://via.placeholder.com/120x40/4F46E5/white?text=TechCorp"
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "CEO",
    company: "StartupXYZ",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Outstanding service and support. Our conversion rates increased by 40% after implementation.",
    companyLogo: "https://via.placeholder.com/120x40/059669/white?text=StartupXYZ"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "GrowthCo",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4,
    text: "Game-changer for our team. The analytics and insights have been invaluable for our growth strategy.",
    companyLogo: "https://via.placeholder.com/120x40/DC2626/white?text=GrowthCo"
  }
];

const widgetTypes = [
  { id: 'carousel', name: 'Carousel/Slider', icon: ChevronRight, description: 'Auto-sliding testimonials' },
  { id: 'popup', name: 'Popup Notifications', icon: MessageSquare, description: 'Timed popup testimonials' },
  { id: 'grid', name: 'Grid Layout', icon: Grid3X3, description: 'Masonry testimonial grid' },
  { id: 'rating-bar', name: 'Rating Bar', icon: Star, description: 'Compact rating display' },
  { id: 'avatar-carousel', name: 'Avatar Carousel', icon: Users, description: 'Customer photos with quotes' },
  { id: 'quote-spotlight', name: 'Quote Spotlight', icon: Sparkles, description: 'Featured rotating quote' }
];

const colorPresets = [
  { name: 'Blue', primary: '#3B82F6', secondary: '#EFF6FF' },
  { name: 'Purple', primary: '#8B5CF6', secondary: '#F3E8FF' },
  { name: 'Green', primary: '#10B981', secondary: '#ECFDF5' },
  { name: 'Orange', primary: '#F59E0B', secondary: '#FFFBEB' },
  { name: 'Pink', primary: '#EC4899', secondary: '#FDF2F8' },
  { name: 'Dark', primary: '#1F2937', secondary: '#F9FAFB' }
];

// Widget Preview Components
const CarouselPreview = ({ testimonials, config }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(config.autoPlay);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, config.slideInterval || 4000);
    return () => clearInterval(interval);
  }, [isPlaying, testimonials.length, config.slideInterval]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto" style={{ borderColor: config.primaryColor }}>
      <div className="flex items-center mb-4">
        <img src={currentTestimonial.avatar} alt={currentTestimonial.name} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <h4 className="font-semibold text-gray-900">{currentTestimonial.name}</h4>
          <p className="text-sm text-gray-600">{currentTestimonial.role} at {currentTestimonial.company}</p>
        </div>
      </div>
      
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < currentTestimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
      </div>
      
      <p className="text-gray-700 mb-4">{currentTestimonial.text}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {testimonials.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`} />
          ))}
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-1 hover:bg-gray-100 rounded">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

const PopupPreview = ({ testimonials, config }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setIsVisible(true);
      }, 300);
    }, config.displayDuration || 5000);
    return () => clearInterval(interval);
  }, [testimonials.length, config.displayDuration]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative">
      <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-500">
        Your Website Content
      </div>
      <div className={`absolute ${config.position || 'bottom-4 right-4'} transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="bg-white rounded-lg shadow-xl p-4 max-w-sm border-l-4" style={{ borderLeftColor: config.primaryColor }}>
          <div className="flex items-center mb-2">
            <img src={currentTestimonial.avatar} alt={currentTestimonial.name} className="w-8 h-8 rounded-full mr-2" />
            <div>
              <h5 className="font-medium text-sm">{currentTestimonial.name}</h5>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < currentTestimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600">{currentTestimonial.text.substring(0, 80)}...</p>
        </div>
      </div>
    </div>
  );
};

const GridPreview = ({ testimonials, config }) => {
  return (
    <div className={`grid ${config.columns === 1 ? 'grid-cols-1' : config.columns === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
      {testimonials.slice(0, config.maxItems || 6).map((testimonial) => (
        <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <p className="text-gray-700 text-sm mb-3">{testimonial.text}</p>
          <div className="flex items-center">
            <img src={testimonial.avatar} alt={testimonial.name} className="w-8 h-8 rounded-full mr-2" />
            <div>
              <h5 className="font-medium text-xs">{testimonial.name}</h5>
              <p className="text-xs text-gray-600">{testimonial.company}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const RatingBarPreview = ({ testimonials, config }) => {
  const avgRating = testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto" style={{ borderColor: config.primaryColor }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex mr-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="font-bold text-lg">{avgRating.toFixed(1)}</span>
        </div>
        <span className="text-sm text-gray-600">from {testimonials.length} reviews</span>
      </div>
      <div className="flex -space-x-2 mt-3">
        {testimonials.slice(0, 5).map((testimonial) => (
          <img key={testimonial.id} src={testimonial.avatar} alt={testimonial.name} className="w-8 h-8 rounded-full border-2 border-white" />
        ))}
        {testimonials.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
            +{testimonials.length - 5}
          </div>
        )}
      </div>
    </div>
  );
};

export default function TestimonialWidgetBuilder() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedWidget, setSelectedWidget] = useState('carousel');
  const [selectedTestimonials, setSelectedTestimonials] = useState(mockTestimonials);
  const [config, setConfig] = useState({
    primaryColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    maxItems: 3,
    autoPlay: true,
    slideInterval: 4000,
    displayDuration: 5000,
    position: 'bottom-4 right-4',
    columns: 3,
    borderRadius: 8,
    shadow: 'md'
  });

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const generateEmbedCode = () => {
    return `<script>
(function() {
  // Testimonial Widget - Generated Code
  const widgetConfig = ${JSON.stringify({ ...config, testimonials: selectedTestimonials, widgetType: selectedWidget }, null, 2)};
  
  // Widget rendering logic would go here
  console.log('Widget config:', widgetConfig);
})();
</script>`;
  };

  const renderPreview = () => {
    switch (selectedWidget) {
      case 'carousel':
        return <CarouselPreview testimonials={selectedTestimonials} config={config} />;
      case 'popup':
        return <PopupPreview testimonials={selectedTestimonials} config={config} />;
      case 'grid':
        return <GridPreview testimonials={selectedTestimonials} config={config} />;
      case 'rating-bar':
        return <RatingBarPreview testimonials={selectedTestimonials} config={config} />;
      default:
        return <CarouselPreview testimonials={selectedTestimonials} config={config} />;
    }
  };

  const renderConfigPanel = () => {
    switch (selectedWidget) {
      case 'carousel':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Max Items to Show</label>
              <input
                type="number"
                min="1"
                max="10"
                value={config.maxItems}
                onChange={(e) => handleConfigChange('maxItems', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto Play</label>
              <input
                type="checkbox"
                checked={config.autoPlay}
                onChange={(e) => handleConfigChange('autoPlay', e.target.checked)}
                className="h-4 w-4 text-blue-600"
              />
            </div>
            {config.autoPlay && (
              <div>
                <label className="block text-sm font-medium mb-2">Slide Interval (ms)</label>
                <input
                  type="number"
                  min="1000"
                  max="10000"
                  step="500"
                  value={config.slideInterval}
                  onChange={(e) => handleConfigChange('slideInterval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )}
          </div>
        );
      case 'popup':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Display Duration (ms)</label>
              <input
                type="number"
                min="2000"
                max="15000"
                step="500"
                value={config.displayDuration}
                onChange={(e) => handleConfigChange('displayDuration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <select
                value={config.position}
                onChange={(e) => handleConfigChange('position', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="bottom-4 right-4">Bottom Right</option>
                <option value="bottom-4 left-4">Bottom Left</option>
                <option value="top-4 right-4">Top Right</option>
                <option value="top-4 left-4">Top Left</option>
              </select>
            </div>
          </div>
        );
      case 'grid':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Columns</label>
              <select
                value={config.columns}
                onChange={(e) => handleConfigChange('columns', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Items</label>
              <input
                type="number"
                min="1"
                max="12"
                value={config.maxItems || 6}
                onChange={(e) => handleConfigChange('maxItems', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex h-full">
          {/* Left Panel - Configuration */}
          <div className="w-1/3 p-6 border-r overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Widget Builder</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Widget Type Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Widget Type</h3>
              <div className="space-y-2">
                {widgetTypes.map((widget) => (
                  <button
                    key={widget.id}
                    onClick={() => setSelectedWidget(widget.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedWidget === widget.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <widget.icon className="w-5 h-5 mr-3" />
                      <div>
                        <div className="font-medium">{widget.name}</div>
                        <div className="text-sm text-gray-600">{widget.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Customization */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Colors</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleConfigChange('primaryColor', preset.primary)}
                    className="p-2 rounded-md border text-center text-xs"
                    style={{ backgroundColor: preset.secondary, borderColor: preset.primary }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Custom Color</label>
                <input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                  className="w-full h-10 border rounded-md"
                />
              </div>
            </div>

            {/* Widget-specific Configuration */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Configuration</h3>
              {renderConfigPanel()}
            </div>

            {/* Export Actions */}
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Copy className="w-4 h-4 mr-2" />
                Copy Embed Code
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Download Widget
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Share2 className="w-4 h-4 mr-2" />
                Share Preview
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 p-6">
            <h3 className="font-semibold mb-4">Live Preview</h3>
            <div className="bg-gray-50 rounded-lg p-6 h-full overflow-auto">
              {renderPreview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}