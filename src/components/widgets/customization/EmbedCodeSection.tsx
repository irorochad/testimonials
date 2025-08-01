'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { WidgetTemplate, WidgetSettings } from '@/types/widget';
import { WidgetPreview } from '@/components/widgets/WidgetPreview';
import { toast } from 'sonner';

interface EmbedCodeSectionProps {
  selectedTemplate: WidgetTemplate;
  settings: WidgetSettings;
  embedCode: string;
}

export function EmbedCodeSection({ 
  selectedTemplate, 
  settings, 
  embedCode 
}: EmbedCodeSectionProps) {
  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success('Embed code copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            See how your widget will look
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-gray-50">
            <WidgetPreview
              template={selectedTemplate}
              settings={settings}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Embed Code</CardTitle>
          <CardDescription>
            Copy this code to your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <pre className="bg-gray-100 dark:bg-gray-600 p-4 rounded-lg text-sm overflow-x-auto">
              <code>{embedCode}</code>
            </pre>
            <Button
              size="sm"
              className="absolute top-2 right-2"
              onClick={copyEmbedCode}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Add this code to your website where you want the testimonial widget to appear.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}