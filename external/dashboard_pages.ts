// =============================================================================
// FILE: src/app/dashboard/widgets/page.tsx
// PURPOSE: Main widgets dashboard page - lists all widgets for a project
// =============================================================================

"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function WidgetsPage() {
  const { user } = useAuth();
  const [widgets, setWidgets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Fetch widgets from API
    // fetchWidgets();
    setLoading(false);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Testimonial Widgets</h1>
          <p className="text-gray-600 mt-2">
            Create and manage embeddable testimonial widgets for your website
          </p>
        </div>
        
        <Link href="/dashboard/widgets/create">
          <Button>Create New Widget</Button>
        </Link>
      </div>

      {widgets.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-4">No widgets yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first testimonial widget to start displaying social proof on your website.
            </p>
            <Link href="/dashboard/widgets/create">
              <Button>Create Your First Widget</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Widget cards will be rendered here */}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// FILE: src/app/dashboard/widgets/create/page.tsx
// PURPOSE: Template selection page - first step in widget creation
// =============================================================================

"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { TEMPLATES } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CreateWidgetPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null);

  const handleContinue = () => {
    if (selectedTemplate) {
      router.push(`/dashboard/widgets/create/configure?template=${selectedTemplate}`);
    }
  };

  const groupedTemplates = TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof TEMPLATES>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose a Template</h1>
          <p className="text-gray-600">
            Select a template that matches your website's style. You can customize colors and settings next.
          </p>
        </div>

        {Object.entries(groupedTemplates).map(([category, templates]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 capitalize">{category} Templates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      {/* Template preview thumbnail */}
                      <div className="text-gray-400 text-sm">Preview</div>
                    </div>
                    
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="capitalize">
                        {template.category}
                      </Badge>
                      
                      {selectedTemplate === template.id && (
                        <div className="text-blue-600 text-sm font-medium">
                          ✓ Selected
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/widgets')}
          >
            Back to Widgets
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={!selectedTemplate}
          >
            Continue to Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// FILE: src/app/dashboard/widgets/create/configure/page.tsx
// PURPOSE: Widget configuration page - customize settings and preview
// =============================================================================

"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTemplate } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { CleanCardWidget } from '@/components/widgets/CleanCardWidget';
import { QuoteStyleWidget } from '@/components/widgets/QuoteStyleWidget';
import { RatingBadgeWidget } from '@/components/widgets/RatingBadgeWidget';
import type { WidgetConfig, Testimonial } from '@/types/testimonial';

// Sample testimonials for preview
const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    content: "This product has completely transformed how we handle customer feedback. The AI-guided collection is brilliant!",
    author: "Sarah Johnson",
    title: "Product Manager",
    company: "TechCorp",
    avatar: "/avatars/sarah.jpg",
    rating: 5,
    tags: ["product", "feedback"],
    source: "email",
    createdAt: new Date(),
    projectId: "demo"
  },
  {
    id: '2',
    content: "Setup was incredibly easy and the testimonials look professional on our website.",
    author: "Mike Chen",
    title: "Marketing Director",
    company: "StartupXYZ",
    avatar: "/avatars/mike.jpg",
    rating: 5,
    tags: ["setup", "design"],
    source: "form",
    createdAt: new Date(),
    projectId: "demo"
  }
];

export default function ConfigureWidgetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  
  const template = templateId ? getTemplate(templateId) : null;
  
  const [config, setConfig] = React.useState<Partial<WidgetConfig>>(() => {
    if (!template) return {};
    
    return {
      templateId: template.id,
      settings: { ...template.defaultSettings },
      filters: {
        tags: [],
        minRating: 1,
        sources: [],
        limit: 10
      }
    };
  });

  const handleSettingChange = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: Save widget configuration to database
      console.log('Saving widget config:', config);
      
      // Redirect to widgets list
      router.push('/dashboard/widgets');
    } catch (error) {
      console.error('Error saving widget:', error);
    }
  };

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Template not found</h1>
          <Button onClick={() => router.push('/dashboard/widgets/create')}>
            Go back to template selection
          </Button>
        </div>
      </div>
    );
  }

  const renderPreview = () => {
    const widgetConfig = config as WidgetConfig;
    
    switch (template.component) {
      case 'CleanCardWidget':
        return <CleanCardWidget testimonials={SAMPLE_TESTIMONIALS} config={widgetConfig} />;
      case 'QuoteStyleWidget':
        return <QuoteStyleWidget testimonials={SAMPLE_TESTIMONIALS} config={widgetConfig} />;
      case 'RatingBadgeWidget':
        return <RatingBadgeWidget testimonials={SAMPLE_TESTIMONIALS} config={widgetConfig} />;
      default:
        return <div>Preview not available</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configure Your Widget</h1>
          <p className="text-gray-600">
            Customize the appearance and behavior of your {template.name} widget.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize colors and visual elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={config.settings?.primaryColor || template.defaultSettings.primaryColor}
                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    className="w-full h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={config.settings?.backgroundColor || template.defaultSettings.backgroundColor}
                    onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                    className="w-full h-10"
                  />
                </div>

                <div>
                  <Label>Border Radius: {config.settings?.borderRadius || template.defaultSettings.borderRadius}px</Label>
                  <Slider
                    value={[config.settings?.borderRadius || template.defaultSettings.borderRadius]}