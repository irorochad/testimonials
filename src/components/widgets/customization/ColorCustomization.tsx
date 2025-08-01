'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { WidgetSettings } from '@/types/widget';

interface ColorCustomizationProps {
  settings: WidgetSettings;
  onSettingChange: (key: keyof WidgetSettings, value: any) => void;
}

// Primary color presets for quick selection
const PRIMARY_COLOR_PRESETS = [
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Green', color: '#059669' },
  { name: 'Purple', color: '#7c3aed' },
  { name: 'Orange', color: '#ea580c' },
  { name: 'Pink', color: '#db2777' },
  { name: 'Red', color: '#dc2626' },
  { name: 'Indigo', color: '#6366f1' },
  { name: 'Yellow', color: '#f59e0b' },
];

export function ColorCustomization({ 
  settings, 
  onSettingChange
}: ColorCustomizationProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="theme">Theme</Label>
        <Select
          value={settings.theme}
          onValueChange={(value) => onSettingChange('theme', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto (System)</SelectItem>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Auto adapts to your visitors' system preference
        </p>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Primary Color Presets</Label>
        <div className="grid grid-cols-4 gap-2">
          {PRIMARY_COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              className={`p-2 rounded-lg border text-xs font-medium hover:border-primary transition-colors ${
                settings.primaryColor === preset.color ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => onSettingChange('primaryColor', preset.color)}
            >
              <div className="flex justify-center mb-1">
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: preset.color }}
                />
              </div>
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="primaryColor">Custom Primary Color</Label>
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
        <p className="text-xs text-muted-foreground mt-1">
          Used for stars, borders, and accent elements
        </p>
      </div>
    </div>
  );
}