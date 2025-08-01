'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { COLOR_PRESETS, WidgetSettings } from '@/types/widget';

interface ColorCustomizationProps {
  settings: WidgetSettings;
  onSettingChange: (key: keyof WidgetSettings, value: any) => void;
  onApplyColorPreset: (preset: typeof COLOR_PRESETS[number]) => void;
}

export function ColorCustomization({ 
  settings, 
  onSettingChange, 
  onApplyColorPreset 
}: ColorCustomizationProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label>Color Presets</Label>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              className="p-2 rounded-lg border text-xs font-medium hover:border-primary transition-colors"
              onClick={() => onApplyColorPreset(preset)}
            >
              <div className="flex gap-1 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: preset.primary }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: preset.background }}
                />
              </div>
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div>
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="primaryColor"
              type="color"
              value={settings.primaryColor}
              onChange={(e) => onSettingChange('primaryColor', e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              value={settings.primaryColor}
              onChange={(e) => onSettingChange('primaryColor', e.target.value)}
              placeholder="#3b82f6"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="backgroundColor">Background Color</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="backgroundColor"
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => onSettingChange('backgroundColor', e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              value={settings.backgroundColor}
              onChange={(e) => onSettingChange('backgroundColor', e.target.value)}
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="textColor">Text Color</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="textColor"
              type="color"
              value={settings.textColor}
              onChange={(e) => onSettingChange('textColor', e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              value={settings.textColor}
              onChange={(e) => onSettingChange('textColor', e.target.value)}
              placeholder="#374151"
            />
          </div>
        </div>
      </div>
    </div>
  );
}