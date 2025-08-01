'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { WidgetSettings } from '@/types/widget';

interface LayoutCustomizationProps {
  settings: WidgetSettings;
  onSettingChange: (key: keyof WidgetSettings, value: any) => void;
}

export function LayoutCustomization({ 
  settings, 
  onSettingChange 
}: LayoutCustomizationProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="borderRadius">Border Radius</Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            id="borderRadius"
            type="number"
            min="0"
            max="50"
            value={settings.borderRadius}
            onChange={(e) => onSettingChange('borderRadius', parseInt(e.target.value))}
          />
          <span className="text-sm text-muted-foreground">px</span>
        </div>
      </div>

      <div>
        <Label htmlFor="padding">Padding</Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            id="padding"
            type="number"
            min="8"
            max="64"
            value={settings.padding}
            onChange={(e) => onSettingChange('padding', parseInt(e.target.value))}
          />
          <span className="text-sm text-muted-foreground">px</span>
        </div>
      </div>

      <div>
        <Label htmlFor="shadow">Shadow</Label>
        <Select
          value={settings.shadow}
          onValueChange={(value) => onSettingChange('shadow', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="showAvatar">Show Avatar</Label>
          <Switch
            id="showAvatar"
            checked={settings.showAvatar}
            onCheckedChange={(checked) => onSettingChange('showAvatar', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="showRating">Show Rating</Label>
          <Switch
            id="showRating"
            checked={settings.showRating}
            onCheckedChange={(checked) => onSettingChange('showRating', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="showCompany">Show Company</Label>
          <Switch
            id="showCompany"
            checked={settings.showCompany}
            onCheckedChange={(checked) => onSettingChange('showCompany', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autoRotate">Auto Rotate</Label>
          <Switch
            id="autoRotate"
            checked={settings.autoRotate}
            onCheckedChange={(checked) => onSettingChange('autoRotate', checked)}
          />
        </div>
      </div>
    </div>
  );
}