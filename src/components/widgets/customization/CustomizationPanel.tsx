'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Palette, Type, Layout } from 'lucide-react';
import { WidgetSettings } from '@/types/widget';
import { ColorCustomization } from './ColorCustomization';
import { TypographyCustomization } from './TypographyCustomization';
import { LayoutCustomization } from './LayoutCustomization';

interface CustomizationPanelProps {
  settings: WidgetSettings;
  onSettingChange: (key: keyof WidgetSettings, value: any) => void;
}

export function CustomizationPanel({ 
  settings, 
  onSettingChange
}: CustomizationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Customization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors">
              <Palette className="w-4 h-4 mr-1" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="w-4 h-4 mr-1" />
              Text
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="w-4 h-4 mr-1" />
              Layout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="mt-4">
            <ColorCustomization
              settings={settings}
              onSettingChange={onSettingChange}
            />
          </TabsContent>

          <TabsContent value="typography" className="mt-4">
            <TypographyCustomization
              settings={settings}
              onSettingChange={onSettingChange}
            />
          </TabsContent>

          <TabsContent value="layout" className="mt-4">
            <LayoutCustomization
              settings={settings}
              onSettingChange={onSettingChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}