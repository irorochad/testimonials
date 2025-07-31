"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Grid3X3, Sparkles, Award, Zap, Palette, Star, Heart, Sun, Moon, Gem, Shield, Flame, Lightbulb } from "lucide-react";
import { CreateWidgetModal } from "./create-widget-modal";
import { WidgetPreview } from "./widget-preview";
import { templates, sampleTestimonials } from "@/lib/template-engine";
import type { TemplateSchema } from "@/lib/template-engine";

// Icon mapping for templates
const iconMap: Record<string, React.ComponentType<any>> = {
  'modern-carousel': Sparkles,
  'purple-hero': Gem,
  'neon-grid': Lightbulb,
  'warm-orange': Sun,
  'glass-cards': Palette,
  'minimal-clean': Award,
  'dark-elegant': Moon,
  'bright-yellow': Star,
  'soft-pink': Heart,
  'blue-corporate': Shield,
};

// Category mapping for templates
const categoryMap: Record<string, string> = {
  'modern-carousel': 'Popular',
  'purple-hero': 'Bold',
  'neon-grid': 'Creative',
  'warm-orange': 'Friendly',
  'glass-cards': 'Modern',
  'minimal-clean': 'Minimal',
  'dark-elegant': 'Premium',
  'bright-yellow': 'Energetic',
  'soft-pink': 'Gentle',
  'blue-corporate': 'Professional',
};

// Features mapping for templates
const featuresMap: Record<string, string[]> = {
  'modern-carousel': ['Auto-slide', 'Navigation dots', 'Smooth transitions'],
  'purple-hero': ['Gradient background', 'Large text', 'Eye-catching'],
  'neon-grid': ['Dark theme', 'Neon accents', 'Modern design'],
  'warm-orange': ['Warm colors', 'Friendly feel', 'Inline avatars'],
  'glass-cards': ['Glassmorphism', 'Gradient background', 'Trendy design'],
  'minimal-clean': ['Clean design', 'Simple layout', 'Professional'],
  'dark-elegant': ['Dark theme', 'Premium feel', 'Sophisticated'],
  'bright-yellow': ['Bold colors', 'High contrast', 'Attention-grabbing'],
  'soft-pink': ['Gentle colors', 'Welcoming feel', 'Rounded design'],
  'blue-corporate': ['Professional', 'Corporate style', 'Trustworthy'],
};

// Description mapping for templates
const descriptionMap: Record<string, string> = {
  'modern-carousel': 'Sleek sliding testimonials with smooth transitions',
  'purple-hero': 'Bold gradient design that commands attention',
  'neon-grid': 'Futuristic dark theme with neon accents',
  'warm-orange': 'Friendly and approachable orange design',
  'glass-cards': 'Trendy glassmorphism effect with gradients',
  'minimal-clean': 'Clean and simple design for any brand',
  'dark-elegant': 'Sophisticated dark theme for premium brands',
  'bright-yellow': 'Energetic yellow design that stands out',
  'soft-pink': 'Gentle and welcoming pink aesthetic',
  'blue-corporate': 'Professional blue design for business',
};

const categories = ['All', 'Popular', 'Bold', 'Creative', 'Modern', 'Minimal', 'Premium', 'Friendly', 'Energetic', 'Gentle', 'Professional'];

export function WidgetTemplates() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSchema | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(template => categoryMap[template.id] === selectedCategory);

  const handleTemplateSelect = (template: TemplateSchema) => {
    setSelectedTemplate(template);
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Choose a Template</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Start with a beautiful template and customize it to match your brand
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = iconMap[template.id] || Sparkles;
          const category = categoryMap[template.id] || 'Template';
          const features = featuresMap[template.id] || [];
          const description = descriptionMap[template.id] || template.name;
          
          return (
            <Card 
              key={template.id} 
              className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              onClick={() => handleTemplateSelect(template)}
            >
              <CardContent className="p-0">
                {/* Live Preview using your template engine */}
                <div className="h-48 p-4 overflow-hidden">
                  <WidgetPreview 
                    template={template}
                    testimonials={sampleTestimonials.slice(0, template.layout.itemsPerView)}
                    scale={0.7}
                  />
                </div>
                
                {/* Details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {template.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {description}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  </div>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {features.slice(0, 2).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{features.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Use Template Button */}
                  <Button 
                    className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                    size="sm"
                  >
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Widget Modal */}
      {showCreateModal && selectedTemplate && (
        <CreateWidgetModal
          template={selectedTemplate}
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedTemplate(null);
          }}
        />
      )}
    </div>
  );
}