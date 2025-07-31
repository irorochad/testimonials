"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { TemplateSchema } from "@/lib/template-engine";

interface CreateWidgetModalProps {
  template: TemplateSchema;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWidgetModal({ template, isOpen, onClose }: CreateWidgetModalProps) {
  const [widgetName, setWidgetName] = useState(`${template.name} Widget`);
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('general');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For now, just open in new tab with template data
    const widgetData = {
      templateId: template.id,
      name: widgetName,
      description,
      targetAudience,
      template: template
    };
    
    // Store in sessionStorage to pass to customization page
    sessionStorage.setItem('newWidget', JSON.stringify(widgetData));
    
    // Open customization page in new tab
    window.open('/dashboard/widget/customize', '_blank');
    
    setIsCreating(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500"
            >
              <span className="text-white text-sm font-bold">
                {template.name.charAt(0)}
              </span>
            </div>
            <span>Create Widget from {template.name}</span>
          </DialogTitle>
          <DialogDescription>
            Customize your widget details before starting the design process.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Widget Name */}
          <div className="space-y-2">
            <Label htmlFor="widgetName">Widget Name</Label>
            <Input
              id="widgetName"
              value={widgetName}
              onChange={(e) => setWidgetName(e.target.value)}
              placeholder="My Awesome Testimonials"
            />
            <p className="text-xs text-gray-500">
              This helps you identify the widget in your dashboard
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe where you'll use this widget..."
              rows={3}
            />
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Select value={targetAudience} onValueChange={setTargetAudience}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Customers</SelectItem>
                <SelectItem value="enterprise">Enterprise Clients</SelectItem>
                <SelectItem value="startups">Startups & SMBs</SelectItem>
                <SelectItem value="ecommerce">E-commerce Shoppers</SelectItem>
                <SelectItem value="saas">SaaS Users</SelectItem>
                <SelectItem value="service">Service Clients</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              This helps us suggest relevant testimonials and styling
            </p>
          </div>

          {/* Template Preview */}
          <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
            <div className="text-sm font-medium mb-2">Template Details:</div>
            <div className="space-y-2">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Layout:</strong> {template.layout.type} 
                {template.layout.itemsPerView > 1 && ` (${template.layout.itemsPerView} items)`}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Features:</strong> {template.rating.show ? 'Ratings' : 'No ratings'}, 
                {template.navigation.arrows ? ' Navigation arrows' : ''}, 
                {template.navigation.dots ? ' Dots indicator' : ''}
                {template.navigation.autoplay ? ', Auto-play' : ''}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={!widgetName.trim() || isCreating}
            className="min-w-[120px]"
          >
            {isCreating ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </div>
            ) : (
              'Create Widget'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}