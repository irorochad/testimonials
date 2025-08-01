'use client';

import { useState, useEffect } from 'react';
import { WIDGET_TEMPLATES } from '@/lib/widget-templates';
import { type WidgetSettings, type WidgetTemplate } from '@/types/widget';
import { type Project } from '@/db/types';
import { TemplateSelector } from '@/components/widgets/customization/TemplateSelector';
import { CustomizationPanel } from '@/components/widgets/customization/CustomizationPanel';
import { EmbedCodeSection } from '@/components/widgets/customization/EmbedCodeSection';

export default function WidgetCustomizationPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<WidgetTemplate>(WIDGET_TEMPLATES[0]);
    const [settings, setSettings] = useState<WidgetSettings>(WIDGET_TEMPLATES[0].defaultSettings);
    const [embedCode, setEmbedCode] = useState('');
    const [project, setProject] = useState<Project | null>(null);
    const [isLoadingProject, setIsLoadingProject] = useState(true);
    const [projectError, setProjectError] = useState<string | null>(null);

    // Fetch user's project on component mount
    useEffect(() => {
        fetchProject();
    }, []);

    // Generate embed code when template, settings, or project changes
    useEffect(() => {
        if (project) {
            generateEmbedCode();
        }
    }, [selectedTemplate, settings, project]);

    const fetchProject = async () => {
        try {
            setIsLoadingProject(true);
            setProjectError(null);

            const response = await fetch('/api/user/project');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch project');
            }

            const data = await response.json();
            setProject(data.project);
        } catch (error) {
            // console.error('Error fetching project:', error);
            setProjectError(error instanceof Error ? error.message : 'Failed to load project');
        } finally {
            setIsLoadingProject(false);
        }
    };

    const handleTemplateChange = (template: WidgetTemplate) => {
        setSelectedTemplate(template);
        setSettings(template.defaultSettings);
    };

    const handleSettingChange = (key: keyof WidgetSettings, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };



    const generateEmbedCode = () => {
        if (!project) return;

        const code = `<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${window.location.origin}/widget/embed.js';
    script.setAttribute('data-project-id', '${project.id}');
    script.setAttribute('data-template-id', '${selectedTemplate.id}');
    script.setAttribute('data-config', '${JSON.stringify(settings)}');
    document.head.appendChild(script);
  })();
</script>`;

        setEmbedCode(code);
    };

    // Show loading state while fetching project
    if (isLoadingProject) {
        return (
            <div className="container ml-4 py-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading your project...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state if project fetch failed
    if (projectError) {
        return (
            <div className="container ml-4 py-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-destructive mb-4">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Failed to Load Project Configurations</h3>
                        <p className="text-muted-foreground mb-4">{projectError}</p>
                        <button
                            onClick={fetchProject}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show main content when project is loaded
    return (
        <div className="container ml-4 py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Widget Customization</h1>
                    <p className="text-muted-foreground">
                        Customize your testimonial widget and generate embed code
                        {project && (
                            <span className="block text-sm mt-1">
                                Project: <span className="font-medium">{project.name}</span>
                            </span>
                        )}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Template Selection */}
                <div className="lg:col-span-1 space-y-6">
                    <TemplateSelector
                        selectedTemplate={selectedTemplate}
                        onTemplateChange={handleTemplateChange}
                    />
                </div>

                {/* Customization Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <CustomizationPanel
                        settings={settings}
                        onSettingChange={handleSettingChange}
                    />
                </div>

                {/* Preview and Embed Code */}
                <div className="lg:col-span-1">
                    <EmbedCodeSection
                        selectedTemplate={selectedTemplate}
                        settings={settings}
                        embedCode={embedCode}
                    />
                </div>
            </div>
        </div>
    );
}