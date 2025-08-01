'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FONT_OPTIONS, WidgetSettings } from '@/types/widget';

interface TypographyCustomizationProps {
  settings: WidgetSettings;
  onSettingChange: (key: keyof WidgetSettings, value: any) => void;
}

export function TypographyCustomization({ 
  settings, 
  onSettingChange 
}: TypographyCustomizationProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fontFamily">Font Family</Label>
        <Select
          value={settings.fontFamily}
          onValueChange={(value) => onSettingChange('fontFamily', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                <span style={{ fontFamily: font.family }}>
                  {font.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="fontSize">Font Size</Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            id="fontSize"
            type="number"
            min="12"
            max="24"
            value={settings.fontSize}
            onChange={(e) => onSettingChange('fontSize', parseInt(e.target.value))}
          />
          <span className="text-sm text-muted-foreground">px</span>
        </div>
      </div>

      <div>
        <Label htmlFor="fontWeight">Font Weight</Label>
        <Select
          value={settings.fontWeight}
          onValueChange={(value) => onSettingChange('fontWeight', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="semibold">Semi Bold</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}