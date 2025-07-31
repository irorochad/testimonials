"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Copy, Check, Eye } from "lucide-react";
import { WidgetPreview } from "./widget-preview";
import type { Project } from "@/db/types";
import type { WidgetDisplaySettings } from "@/db/types";

interface WidgetCustomizerProps {
  projects: Project[];
}

export function WidgetCustomizer({ projects }: WidgetCustomizerProps) {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [settings, setSettings] = useState<WidgetDisplaySettings>({
    theme: 'auto',
    primaryColor: '#3b82f6',
    layout: 'carousel',
    showRatings: true,
    showCompany: true,
    showTitle: true,
    maxTestimonials: 10,
    widgetType: 'basic',
  });
  const [copied, setCopied] = useState(false);

  const updateSetting = <K extends keyof WidgetDisplaySettings>(
    key: K,
    value: WidgetDisplaySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const generateEmbedCode = () => {
    const config = encodeURIComponent(JSON.stringify(settings));
    return `<div id="proofflow-widget" data-project-id="${selectedProject.id}" data-config="${config}"></div>
<script src="${window.location.origin}/widget/embed.js"></script>`;
  };

  const copyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Configuration Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Selection</CardTitle>
            <CardDescription>Choose which project's testimonials to display</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedProject.id}
              onValueChange={(value) => {
                const project = projects.find(p => p.id === value);
                if (project) setSelectedProject(project);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name} ({new URL(project.websiteUrl).hostname})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Widget Configuration</CardTitle>
            <CardDescription>Customize how your testimonials are displayed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="appearance" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
              </TabsList>

              <TabsContent value="appearance" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value: 'light' | 'dark' | 'auto') => updateSetting('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="layout">Layout Style</Label>
                  <Select value={settings.layout} onValueChange={(value: 'carousel' | 'grid' | 'list') => updateSetting('layout', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carousel">Carousel</SelectItem>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="widgetType">Widget Type</Label>
                  <Select value={settings.widgetType} onValueChange={(value: 'basic' | 'custom') => updateSetting('widgetType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (All testimonials)</SelectItem>
                      <SelectItem value="custom">Custom (Tag-based targeting)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    {settings.widgetType === 'basic' 
                      ? 'Shows all approved testimonials in one widget'
                      : 'Shows specific testimonials based on page context and tags'
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTestimonials">Max Testimonials</Label>
                  <Input
                    id="maxTestimonials"
                    type="number"
                    min="1"
                    max="50"
                    value={settings.maxTestimonials}
                    onChange={(e) => updateSetting('maxTestimonials', parseInt(e.target.value) || 10)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showRatings">Show Ratings</Label>
                  <Switch
                    id="showRatings"
                    checked={settings.showRatings}
                    onCheckedChange={(checked) => updateSetting('showRatings', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showCompany">Show Company</Label>
                  <Switch
                    id="showCompany"
                    checked={settings.showCompany}
                    onCheckedChange={(checked) => updateSetting('showCompany', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showTitle">Show Job Title</Label>
                  <Switch
                    id="showTitle"
                    checked={settings.showTitle}
                    onCheckedChange={(checked) => updateSetting('showTitle', checked)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Embed Code</CardTitle>
            <CardDescription>Copy this code to your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{generateEmbedCode()}</pre>
              </div>
              <Button onClick={copyEmbedCode} className="w-full">
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Embed Code'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Live Preview
            </CardTitle>
            <CardDescription>See how your widget will look on your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <div className="text-center text-gray-500 py-8">
                <p>Widget preview will be available once testimonials are loaded</p>
                <p className="text-sm mt-2">Selected project: {selectedProject.name}</p>
                <p className="text-xs mt-1">Layout: {settings.layout}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}