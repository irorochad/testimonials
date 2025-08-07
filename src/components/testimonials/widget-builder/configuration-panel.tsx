"use client"

import { WidgetConfig } from "@/types/widget"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ConfigurationPanelProps {
  type: 'styling' | 'behavior'
  config: WidgetConfig
  onStylingChange: (updates: Partial<WidgetConfig['styling']>) => void
  onBehaviorChange: (updates: Partial<WidgetConfig['behavior']>) => void
}

export function ConfigurationPanel({
  type,
  config,
  onStylingChange,
  onBehaviorChange
}: ConfigurationPanelProps) {
  if (type === 'styling') {
    return <StylingPanel config={config} onChange={onStylingChange} />
  }
  
  return <BehaviorPanel config={config} onChange={onBehaviorChange} />
}

function StylingPanel({ 
  config, 
  onChange 
}: { 
  config: WidgetConfig
  onChange: (updates: Partial<WidgetConfig['styling']>) => void 
}) {
  const { styling } = config

  const colorPresets = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
  ]

  return (
    <div className="space-y-4">
      {/* Primary Color */}
      <div className="space-y-2">
        <Label className="text-sm">Primary Color</Label>
        <div className="flex items-center gap-2 flex-wrap">
          {colorPresets.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border-2 ${
                styling.primaryColor === color
                  ? 'border-gray-900 dark:border-gray-100'
                  : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onChange({ primaryColor: color })}
            />
          ))}
          <Input
            type="color"
            value={styling.primaryColor}
            onChange={(e) => onChange({ primaryColor: e.target.value })}
            className="w-12 h-8 p-0 border-0"
          />
        </div>
      </div>

      {/* Background Color */}
      <div className="space-y-2">
        <Label className="text-sm">Background Color</Label>
        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={styling.backgroundColor}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
            className="w-12 h-8 p-0 border-0"
          />
          <Input
            type="text"
            value={styling.backgroundColor}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
            className="flex-1 text-xs"
            placeholder="#FFFFFF"
          />
        </div>
      </div>

      {/* Text Color */}
      <div className="space-y-2">
        <Label className="text-sm">Text Color</Label>
        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={styling.textColor}
            onChange={(e) => onChange({ textColor: e.target.value })}
            className="w-12 h-8 p-0 border-0"
          />
          <Input
            type="text"
            value={styling.textColor}
            onChange={(e) => onChange({ textColor: e.target.value })}
            className="flex-1 text-xs"
            placeholder="#1F2937"
          />
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <Label className="text-sm">Font Size</Label>
        <Select 
          value={styling.fontSize} 
          onValueChange={(value: 'sm' | 'base' | 'lg') => onChange({ fontSize: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small (14px)</SelectItem>
            <SelectItem value="base">Base (16px)</SelectItem>
            <SelectItem value="lg">Large (18px)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Font Weight */}
      <div className="space-y-2">
        <Label className="text-sm">Font Weight</Label>
        <Select 
          value={styling.fontWeight} 
          onValueChange={(value: 'normal' | 'medium' | 'semibold' | 'bold') => onChange({ fontWeight: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="semibold">Semibold</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Border Radius */}
      <div className="space-y-2">
        <Label className="text-sm">Border Radius: {styling.borderRadius}px</Label>
        <Slider
          value={[styling.borderRadius]}
          onValueChange={([value]) => onChange({ borderRadius: value })}
          max={24}
          min={0}
          step={1}
          className="w-full"
        />
      </div>

      {/* Padding */}
      <div className="space-y-2">
        <Label className="text-sm">Padding: {styling.padding}px</Label>
        <Slider
          value={[styling.padding]}
          onValueChange={([value]) => onChange({ padding: value })}
          max={48}
          min={8}
          step={4}
          className="w-full"
        />
      </div>

      {/* Shadow */}
      <div className="space-y-2">
        <Label className="text-sm">Shadow</Label>
        <Select 
          value={styling.shadow} 
          onValueChange={(value: 'none' | 'sm' | 'md' | 'lg' | 'xl') => onChange({ shadow: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Extra Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Border */}
      <div className="flex items-center justify-between">
        <Label className="text-sm">Show Border</Label>
        <Switch
          checked={styling.border}
          onCheckedChange={(checked) => onChange({ border: checked })}
        />
      </div>

      {styling.border && (
        <div className="space-y-2">
          <Label className="text-sm">Border Color</Label>
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={styling.borderColor}
              onChange={(e) => onChange({ borderColor: e.target.value })}
              className="w-12 h-8 p-0 border-0"
            />
            <Input
              type="text"
              value={styling.borderColor}
              onChange={(e) => onChange({ borderColor: e.target.value })}
              className="flex-1 text-xs"
              placeholder="#E5E7EB"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function BehaviorPanel({ 
  config, 
  onChange 
}: { 
  config: WidgetConfig
  onChange: (updates: Partial<WidgetConfig['behavior']>) => void 
}) {
  const { behavior } = config

  return (
    <div className="space-y-4">
      {/* Auto Play */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm">Auto Play</Label>
          <p className="text-xs text-muted-foreground">
            Automatically cycle through testimonials
          </p>
        </div>
        <Switch
          checked={behavior.autoPlay}
          onCheckedChange={(checked) => onChange({ autoPlay: checked })}
        />
      </div>

      {behavior.autoPlay && (
        <div className="space-y-2">
          <Label className="text-sm">
            Slide Interval: {(behavior.slideInterval / 1000).toFixed(1)}s
          </Label>
          <Slider
            value={[behavior.slideInterval]}
            onValueChange={([value]) => onChange({ slideInterval: value })}
            max={10000}
            min={1000}
            step={500}
            className="w-full"
          />
        </div>
      )}

      {/* Show Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm">Show Navigation</Label>
          <p className="text-xs text-muted-foreground">
            Display navigation arrows
          </p>
        </div>
        <Switch
          checked={behavior.showNavigation}
          onCheckedChange={(checked) => onChange({ showNavigation: checked })}
        />
      </div>

      {/* Show Dots */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm">Show Dots</Label>
          <p className="text-xs text-muted-foreground">
            Display pagination dots
          </p>
        </div>
        <Switch
          checked={behavior.showDots}
          onCheckedChange={(checked) => onChange({ showDots: checked })}
        />
      </div>

      {/* Pause on Hover */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm">Pause on Hover</Label>
          <p className="text-xs text-muted-foreground">
            Pause auto-play when hovering
          </p>
        </div>
        <Switch
          checked={behavior.pauseOnHover}
          onCheckedChange={(checked) => onChange({ pauseOnHover: checked })}
        />
      </div>

      {/* Widget-specific settings */}
      {config.type === 'grid' && (
        <div className="space-y-2">
          <Label className="text-sm">Columns: {behavior.columns}</Label>
          <Slider
            value={[behavior.columns]}
            onValueChange={([value]) => onChange({ columns: value })}
            max={4}
            min={1}
            step={1}
            className="w-full"
          />
        </div>
      )}

      {config.type === 'popup' && (
        <>
          <div className="space-y-2">
            <Label className="text-sm">Position</Label>
            <Select 
              value={behavior.position} 
              onValueChange={(value: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') => onChange({ position: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
                <SelectItem value="top-left">Top Left</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">
              Display Duration: {(behavior.displayDuration / 1000).toFixed(1)}s
            </Label>
            <Slider
              value={[behavior.displayDuration]}
              onValueChange={([value]) => onChange({ displayDuration: value })}
              max={15000}
              min={2000}
              step={1000}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">Show Close Button</Label>
            <Switch
              checked={behavior.showCloseButton}
              onCheckedChange={(checked) => onChange({ showCloseButton: checked })}
            />
          </div>
        </>
      )}
    </div>
  )
}