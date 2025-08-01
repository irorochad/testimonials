'use client';

import { useState, useEffect } from 'react';
import { WIDGET_TEMPLATES } from '@/lib/widget-templates';
import { COLOR_PRESETS, type WidgetSettings, type WidgetTemplate } from '@/types/widget';
import { TemplateSelector } from '@/components/widgets/customization/TemplateSelector';
import { CustomizationPanel } from '@/components/widgets/customization/CustomizationPanel';
import { EmbedCodeSection } from '@/components/widgets/customization/EmbedCodeSection';

export default function WidgetCustomizationPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<WidgetTemplate>(WIDGET_TEMPLATES[0]);
    const [settings, setSettings] = useState<WidgetSettings>(WIDGET_TEMPLATES[0].defaultSettings);
    const [embedCode, setEmbedCode] = useState('');

    // Mock project data - in real app this would come from props/context
    const projectId = 'demo-project';

    useEffect(() => {
        generateEmbedCode();
    }, [selectedTemplate, settings]);

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

    const applyColorPreset = (preset: typeof COLOR_PRESETS[number]) => {
        setSettings(prev => ({
            ...prev,
            primaryColor: preset.primary,
            backgroundColor: preset.background,
            textColor: preset.text
        }));
    };

    const generateEmbedCode = () => {
        const code = `<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${window.location.origin}/widget/embed.js';
    script.setAttribute('data-project-id', '${projectId}');
    script.setAttribute('data-template-id', '${selectedTemplate.id}');
    script.setAttribute('data-config', '${JSON.stringify(settings)}');
    document.head.appendChild(script);
  })();
</script>`;

        setEmbedCode(code);
    };

    return (
        <div className="container ml-4 py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Widget Customization</h1>
                    <p className="text-muted-foreground">
                        Customize your testimonial widget and generate embed code
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
                        onApplyColorPreset={applyColorPreset}
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