"use client"

import { WidgetConfig, colorPresets } from "@/types/widget"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

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
    return (
      <div className="space-y-6">
        {/* Color Presets */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Color Presets</Label>
          <div className="grid grid-cols-3 gap-2">
            {colorPresets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => onStylingChange({ primaryColor: preset.primary })}
                className="h-8 text-xs"
                style={{ 
                  backgroundColor: preset.secondary, 
                  borderColor: preset.primary,
                  color: preset.primary
                }}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Primary Color */}
        <div>
          <Label htmlFor="primaryColor" className="text-sm font-medium mb-2 block">
            Primary Color
          </Label>
          <div className="flex gap-2">
            <Input
              id="primaryColor"
              type="color"
              value={config.styling.primaryColor}
              onChange={(e) => onStylingChange({ primaryColor: e.target.value })}
              className="w-16 h-10 p-1 border rounded"
            />
            <Input
              type="text"
              value={config.styling.primaryColor}
              onChange={(e) => onStylingChange({ primaryColor: e.target.value })}
              className="flex-1"
              placeholder="#3B82F6"
            />
          </div>
        </div>

        {/* Background Color */}
        <div>
          <Label htmlFor="backgroundColor" className="text-sm font-medium mb-2 block">
            Background Color
          </Label>
          <div className="flex gap-2">
            <Input
              id="backgroundColor"
              type="color"
              value={config.styling.backgroundColor}
              onChange={(e) => onStylingChange({ backgroundColor: e.target.value })}
              className="w-16 h-10 p-1 border rounded"
            />
            <Input
              type="text"
              value={config.styling.backgroundColor}
              onChange={(e) => onStylingChange({ backgroundColor: e.target.value })}
              className="flex-1"
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        {/* Text Color */}
        <div>
          <Label htmlFor="textColor" className="text-sm font-medium mb-2 block">
            Text Color
          </Label>
          <div className="flex gap-2">
            <Input
              id="textColor"
              type="color"
              value={config.styling.textColor}
              onChange={(e) => onStylingChange({ textColor: e.target.value })}
              className="w-16 h-10 p-1 border rounded"
            />
            <Input
              type="text"
              value={config.styling.textColor}
              onChange={(e) => onStylingChange({ textColor: e.target.value })}
              className="flex-1"
              placeholder="#1F2937"
            />
          </div>
        </div>

        {/* Font Size */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Font Size</Label>
          <Select
            value={config.styling.fontSize}
            onValueChange={(value: 'sm' | 'base' | 'lg') => onStylingChange({ fontSize: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="base">Base</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Font Weight */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Font Weight</Label>
          <Select
            value={config.styling.fontWeight}
            onValueChange={(value: 'normal' | 'medium' | 'semibold' | 'bold') => onStylingChange({ fontWeight: value })}
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
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Border Radius: {config.styling.borderRadius}px
          </Label>
          <Slider
            value={[config.styling.borderRadius]}
            onValueChange={([value]) => onStylingChange({ borderRadius: value })}
            max={20}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        {/* Padding */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Padding: {config.styling.padding}px
          </Label>
          <Slider
            value={[config.styling.padding]}
            onValueChange={([value]) => onStylingChange({ padding: value })}
            max={32}
            min={8}
            step={4}
            className="w-full"
          />
        </div>

        {/* Shadow */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Shadow</Label>
          <Select
            value={config.styling.shadow}
            onValueChange={(value: 'none' | 'sm' | 'md' | 'lg' | 'xl') => onStylingChange({ shadow: value })}
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
          <Label className="text-sm font-medium">Show Border</Label>
          <Switch
            checked={config.styling.border}
            onCheckedChange={(checked) => onStylingChange({ border: checked })}
          />
        </div>
      </div>
    )
  }

  // Behavior configuration
  return (
    <div className="space-y-6">
      {/* Widget-specific behavior settings */}
      {config.type === 'carousel' && (
        <>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Auto Play</Label>
            <Switch
              checked={config.behavior.autoPlay}
              onCheckedChange={(checked) => onBehaviorChange({ autoPlay: checked })}
            />
          </div>

          {config.behavior.autoPlay && (
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Slide Interval: {config.behavior.slideInterval}ms
              </Label>
              <Slider
                value={[config.behavior.slideInterval]}
                onValueChange={([value]) => onBehaviorChange({ slideInterval: value })}
                max={10000}
                min={1000}
                step={500}
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Show Navigation</Label>
            <Switch
              checked={config.behavior.showNavigation}
              onCheckedChange={(checked) => onBehaviorChange({ showNavigation: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Show Dots</Label>
            <Switch
              checked={config.behavior.showDots}
              onCheckedChange={(checked) => onBehaviorChange({ showDots: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Pause on Hover</Label>
            <Switch
              checked={config.behavior.pauseOnHover}
              onCheckedChange={(checked) => onBehaviorChange({ pauseOnHover: checked })}
            />
          </div>
        </>
      )}

      {config.type === 'popup' && (
        <>
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Display Duration: {config.behavior.displayDuration}ms
            </Label>
            <Slider
              value={[config.behavior.displayDuration]}
              onValueChange={([value]) => onBehaviorChange({ displayDuration: value })}
              max={15000}
              min={2000}
              step={500}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Position</Label>
            <Select
              value={config.behavior.position}
              onValueChange={(value: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') => 
                onBehaviorChange({ position: value })
              }
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

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Show Close Button</Label>
            <Switch
              checked={config.behavior.showCloseButton}
              onCheckedChange={(checked) => onBehaviorChange({ showCloseButton: checked })}
            />
          </div>
        </>
      )}

      {config.type === 'grid' && (
        <>
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Columns: {config.behavior.columns}
            </Label>
            <Slider
              value={[config.behavior.columns]}
              onValueChange={([value]) => onBehaviorChange({ columns: value })}
              max={4}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Click to Expand</Label>
            <Switch
              checked={config.behavior.clickToExpand}
              onCheckedChange={(checked) => onBehaviorChange({ clickToExpand: checked })}
            />
          </div>
        </>
      )}

      {(config.type === 'rating-bar' || config.type === 'avatar-carousel' || config.type === 'quote-spotlight') && (
        <>
          {config.type === 'quote-spotlight' && (
            <>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Auto Rotate</Label>
                <Switch
                  checked={config.behavior.autoPlay}
                  onCheckedChange={(checked) => onBehaviorChange({ autoPlay: checked })}
                />
              </div>

              {config.behavior.autoPlay && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Rotation Interval: {config.behavior.slideInterval}ms
                  </Label>
                  <Slider
                    value={[config.behavior.slideInterval]}
                    onValueChange={([value]) => onBehaviorChange({ slideInterval: value })}
                    max={10000}
                    min={2000}
                    step={500}
                    className="w-full"
                  />
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Animation Type */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Animation</Label>
        <Select
          value={config.behavior.animationType}
          onValueChange={(value: 'slide' | 'fade' | 'zoom') => onBehaviorChange({ animationType: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="slide">Slide</SelectItem>
            <SelectItem value="fade">Fade</SelectItem>
            <SelectItem value="zoom">Zoom</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}