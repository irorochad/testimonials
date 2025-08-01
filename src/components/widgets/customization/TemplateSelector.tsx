'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from 'lucide-react';
import { WIDGET_TEMPLATES } from '@/lib/widget-templates';
import { WidgetTemplate } from '@/types/widget';

interface TemplateSelectorProps {
  selectedTemplate: WidgetTemplate;
  onTemplateChange: (template: WidgetTemplate) => void;
}

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="w-5 h-5" />
          Templates
        </CardTitle>
        <CardDescription>
          Choose a template for your widget
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {WIDGET_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedTemplate.id === template.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onTemplateChange(template)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {template.description}
                </p>
                <Badge variant="secondary" className="mt-2">
                  {template.category}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}