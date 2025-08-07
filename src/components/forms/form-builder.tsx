"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import {
    Plus,
    Save,
    Trash2,
    GripVertical,
    Type,
    Mail,
    MessageSquare,
    Star,
    Upload
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { FormField, FormFieldType, FormFieldTypes } from "@/db/types"

// Available field types organized by categories
const FIELD_CATEGORIES = {
    "Text Elements": [
        { type: FormFieldTypes.TEXT, label: "Text Input", icon: Type },
        { type: FormFieldTypes.TEXTAREA, label: "Long Text", icon: MessageSquare },
        { type: FormFieldTypes.EMAIL, label: "Email", icon: Mail },
    ],
    "Multi Elements": [
        { type: FormFieldTypes.RATING, label: "Rating", icon: Star },
    ],
    "Media Elements": [
        { type: FormFieldTypes.FILE, label: "Profile Image", icon: Upload },
    ]
}

interface FormBuilderProps {
    formId?: string
}

export function FormBuilder({ formId }: FormBuilderProps) {
    const [formName, setFormName] = useState("New Testimonial Form")
    const [formDescription, setFormDescription] = useState("")
    const [loading, setLoading] = useState(!!formId) // Loading if editing existing form
    const [fields, setFields] = useState<FormField[]>([
        {
            id: "name",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
        },
        {
            id: "email",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
        },
        {
            id: "company",
            type: "text",
            label: "Company Name",
            placeholder: "Enter your company name",
            required: false,
        },
        {
            id: "position",
            type: "text",
            label: "Position",
            placeholder: "e.g. CEO, Marketing Manager, Developer",
            required: false,
        },
        {
            id: "testimonial",
            type: "textarea",
            label: "Your Testimonial",
            placeholder: "Share your experience with us...",
            required: true,
        },
        {
            id: "rating",
            type: "rating",
            label: "Rating",
            placeholder: "Rate your experience",
            required: false,
        },
        {
            id: "profile_image",
            type: "file",
            label: "Profile Image",
            placeholder: "Upload your profile picture (optional)",
            required: false,
        }
    ])
    const [selectedField, setSelectedField] = useState<FormField | null>(null)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'fields' | 'welcome' | 'styling'>('fields')

    // Welcome step configuration
    const [welcomeSettings, setWelcomeSettings] = useState({
        title: "Thank you for coming to help",
        message: "We appreciate you taking the time to share your experience with us. Your feedback helps us improve and serves as valuable social proof for others considering our services.",
        privacyNotice: "We promise to keep your information secure and will never sell your data to third parties.",
        buttonText: "Get Started"
    })

    // Form styling configuration
    const [formStyling, setFormStyling] = useState({
        theme: 'light' as 'light' | 'dark',
        primaryColor: '#3B82F6',
        fontFamily: 'Inter',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderRadius: 8
    })

    const router = useRouter()

    const fetchFormData = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/forms/${formId}`)

            if (response.ok) {
                const formData = await response.json()
                setFormName(formData.name)
                setFormDescription(formData.description || "")
                setFields(formData.fields || [])

                // Load welcome settings
                if (formData.settings) {
                    setWelcomeSettings({
                        title: formData.settings.title || "Thank you for coming to help",
                        message: formData.settings.message || "We appreciate you taking the time to share your experience with us. Your feedback helps us improve and serves as valuable social proof for others considering our services.",
                        privacyNotice: formData.settings.privacyNotice || "We promise to keep your information secure and will never sell your data to third parties.",
                        buttonText: formData.settings.buttonText || "Get Started"
                    })
                }

                // Load styling settings
                if (formData.styling) {
                    setFormStyling({
                        theme: formData.styling.theme || 'light',
                        primaryColor: formData.styling.primaryColor || '#3B82F6',
                        fontFamily: formData.styling.fontFamily || 'Inter',
                        backgroundColor: formData.styling.backgroundColor || '#ffffff',
                        textColor: formData.styling.textColor || '#1f2937',
                        borderRadius: formData.styling.borderRadius || 8
                    })
                }
            } else {
                toast.error("Failed to load form data")
                router.push('/forms')
            }
        } catch {
            toast.error("Failed to load form data")
            router.push('/forms')
        } finally {
            setLoading(false)
        }
    }, [formId, router])

    // Load existing form data when editing
    useEffect(() => {
        if (formId) {
            fetchFormData()
        }
    }, [formId, fetchFormData])

    // Generate unique field ID
    const generateFieldId = (type: string) => {
        const timestamp = Date.now()
        return `${type}_${timestamp}`
    }

    // Add new field to form
    const addField = (type: FormFieldType) => {
        const newField: FormField = {
            id: generateFieldId(type),
            type,
            label: `New ${type} field`,
            placeholder: "",
            required: false,
        }

        setFields([...fields, newField])
        setSelectedField(newField)
    }

    // Remove field from form
    const removeField = (fieldId: string) => {
        setFields(fields.filter(field => field.id !== fieldId))
        if (selectedField?.id === fieldId) {
            setSelectedField(null)
        }
    }

    // Update field properties
    const updateField = (fieldId: string, updates: Partial<FormField>) => {
        setFields(fields.map(field =>
            field.id === fieldId ? { ...field, ...updates } : field
        ))

        if (selectedField?.id === fieldId) {
            setSelectedField({ ...selectedField, ...updates })
        }
    }

    // Handle drag and drop reordering
    const handleDragEnd = (result: any) => {
        if (!result.destination) return

        const items = Array.from(fields)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setFields(items)
    }

    // Save form
    const handleSave = async () => {
        if (!formName.trim()) {
            toast.error("Form name is required")
            return
        }

        if (fields.length === 0) {
            toast.error("At least one field is required")
            return
        }

        setSaving(true)
        try {
            const url = formId ? `/api/forms/${formId}` : '/api/forms'
            const method = formId ? 'PATCH' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formName,
                    description: formDescription,
                    fields,
                    styling: formStyling,
                    settings: {
                        ...welcomeSettings,
                        allowMultipleSubmissions: false,
                        requireEmailVerification: false,
                        enableSpamProtection: true,
                        enableAnalytics: true,
                        autoApprove: false,
                        collectIpAddress: true,
                        enableFileUploads: true,
                        maxFileSize: 10,
                        allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
                    },
                    isActive: true, // Auto-publish forms when saved
                }),
            })

            if (response.ok) {
                toast.success(formId ? "Form updated successfully!" : "Form created successfully!")
                router.push('/forms')
            } else {
                const error = await response.json()
                toast.error(error.error || "Failed to save form")
            }
        } catch {
            toast.error("Failed to save form")
        } finally {
            setSaving(false)
        }
    }



    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading form data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex">
            {/* Left Panel - Field Types */}
            <div className="w-64 border-r bg-gray-50 dark:bg-gray-800 p-4">
                <div className="mb-4">
                    <Input
                        placeholder="Search Components"
                        className="mb-4 text-sm"
                    />
                </div>

                {Object.entries(FIELD_CATEGORIES).map(([category, fields]) => (
                    <div key={category} className="mb-6">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                            {category}
                        </h4>
                        <div className="space-y-1">
                            {fields.map((fieldType) => (
                                <Button
                                    key={fieldType.type}
                                    variant="ghost"
                                    className="w-full justify-start h-8 px-2 text-sm font-normal hover:bg-gray-100"
                                    onClick={() => addField(fieldType.type)}
                                >
                                    <fieldType.icon className="w-4 h-4 mr-2 text-gray-600" />
                                    {fieldType.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Center Panel - Form Builder */}
            <div className="flex-1 p-6">
                {/* Form Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1 max-w-md">
                            <Input
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                className="text-xl font-semibold border-none p-0 h-auto"
                                placeholder="Form name"
                            />
                            <Textarea
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                                placeholder="Form description (optional)"
                                className="mt-2 border-none p-0 resize-none"
                                rows={2}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? "Saving..." : "Save Form"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="form-fields">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-4"
                            >
                                {fields.map((field, index) => (
                                    <Draggable key={field.id} draggableId={field.id} index={index}>
                                        {(provided) => (
                                            <Card
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`cursor-pointer transition-colors ${selectedField?.id === field.id ? 'ring-2 ring-primary' : ''
                                                    }`}
                                                onClick={() => setSelectedField(field)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className="cursor-grab active:cursor-grabbing"
                                                        >
                                                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Label className="font-medium">{field.label}</Label>
                                                                {field.required && (
                                                                    <Badge variant="secondary" className="text-xs">Required</Badge>
                                                                )}
                                                            </div>
                                                            {field.type === 'textarea' ? (
                                                                <Textarea
                                                                    placeholder={field.placeholder}
                                                                    disabled
                                                                    className="resize-none"
                                                                    rows={3}
                                                                />
                                                            ) : field.type === 'select' ? (
                                                                <div className="border rounded-md p-2 bg-muted text-muted-foreground">
                                                                    {field.placeholder || "Select an option..."}
                                                                </div>
                                                            ) : field.type === 'rating' ? (
                                                                <div className="flex gap-1">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <Star key={star} className="w-5 h-5 text-muted-foreground" />
                                                                    ))}
                                                                </div>
                                                            ) : field.type === 'file' ? (
                                                                <div className="border-2 border-dashed rounded-md p-4 text-center text-muted-foreground">
                                                                    <Upload className="w-6 h-6 mx-auto mb-2" />
                                                                    Click to upload or drag and drop
                                                                </div>
                                                            ) : (
                                                                <Input
                                                                    placeholder={field.placeholder}
                                                                    disabled
                                                                    type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : field.type === 'url' ? 'url' : 'text'}
                                                                />
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                removeField(field.id)
                                                            }}
                                                            className="cursor-pointer text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                {fields.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No fields added yet. Click on a field type to get started.</p>
                    </div>
                )}
            </div>

            {/* Right Panel - Configuration */}
            <div className="w-80 border-l bg-muted/30 p-4">
                {/* Tab Navigation */}
                <div className="flex border-b mb-4">
                    <button
                        onClick={() => setActiveTab('fields')}
                        className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'fields'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Fields
                    </button>
                    <button
                        onClick={() => setActiveTab('welcome')}
                        className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'welcome'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Welcome
                    </button>
                    <button
                        onClick={() => setActiveTab('styling')}
                        className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'styling'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Styling
                    </button>
                </div>

                {/* Fields Tab */}
                {activeTab === 'fields' && (
                    <div>
                        <h3 className="font-semibold mb-4">Field Properties</h3>
                        {selectedField ? (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="field-label">Label</Label>
                                    <Input
                                        id="field-label"
                                        value={selectedField.label}
                                        onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                                        placeholder="Field label"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="field-placeholder">Placeholder</Label>
                                    <Input
                                        id="field-placeholder"
                                        value={selectedField.placeholder || ""}
                                        onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                                        placeholder="Placeholder text"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="field-description">Description</Label>
                                    <Textarea
                                        id="field-description"
                                        value={selectedField.description || ""}
                                        onChange={(e) => updateField(selectedField.id, { description: e.target.value })}
                                        placeholder="Help text for this field"
                                        rows={2}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="field-required">Required field</Label>
                                    <Switch
                                        id="field-required"
                                        checked={selectedField.required}
                                        onCheckedChange={(checked) => updateField(selectedField.id, { required: checked })}
                                    />
                                </div>

                                {selectedField.type === 'select' && (
                                    <div>
                                        <Label>Options</Label>
                                        <div className="space-y-2 mt-2">
                                            {(selectedField.options || []).map((option, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <Input
                                                        value={option}
                                                        onChange={(e) => {
                                                            const newOptions = [...(selectedField.options || [])]
                                                            newOptions[index] = e.target.value
                                                            updateField(selectedField.id, { options: newOptions })
                                                        }}
                                                        placeholder={`Option ${index + 1}`}
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            const newOptions = (selectedField.options || []).filter((_, i) => i !== index)
                                                            updateField(selectedField.id, { options: newOptions })
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const newOptions = [...(selectedField.options || []), ""]
                                                    updateField(selectedField.id, { options: newOptions })
                                                }}
                                                className="w-full cursor-pointer"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Option
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">Select a field to edit its properties</p>
                        )}
                    </div>
                )}

                {/* Welcome Tab */}
                {activeTab === 'welcome' && (
                    <div>
                        <h3 className="font-semibold mb-4">Welcome Step</h3>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="welcome-title">Welcome Title</Label>
                                <Input
                                    id="welcome-title"
                                    value={welcomeSettings.title}
                                    onChange={(e) => setWelcomeSettings(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Welcome title"
                                />
                            </div>

                            <div>
                                <Label htmlFor="welcome-message">Welcome Message</Label>
                                <Textarea
                                    id="welcome-message"
                                    value={welcomeSettings.message}
                                    onChange={(e) => setWelcomeSettings(prev => ({ ...prev, message: e.target.value }))}
                                    placeholder="Welcome message"
                                    rows={4}
                                />
                            </div>

                            <div>
                                <Label htmlFor="privacy-notice">Privacy Notice</Label>
                                <Textarea
                                    id="privacy-notice"
                                    value={welcomeSettings.privacyNotice}
                                    onChange={(e) => setWelcomeSettings(prev => ({ ...prev, privacyNotice: e.target.value }))}
                                    placeholder="Privacy notice"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="button-text">Button Text</Label>
                                <Input
                                    id="button-text"
                                    value={welcomeSettings.buttonText}
                                    onChange={(e) => setWelcomeSettings(prev => ({ ...prev, buttonText: e.target.value }))}
                                    placeholder="Button text"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Styling Tab */}
                {activeTab === 'styling' && (
                    <div>
                        <h3 className="font-semibold mb-4">Form Styling</h3>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="theme">Theme</Label>
                                <div className="flex gap-2 mt-2">
                                    <Button
                                        variant={formStyling.theme === 'light' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setFormStyling(prev => ({ ...prev, theme: 'light' }))}
                                        className="flex-1 cursor-pointer"
                                    >
                                        Light
                                    </Button>
                                    <Button
                                        variant={formStyling.theme === 'dark' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setFormStyling(prev => ({ ...prev, theme: 'dark' }))}
                                        className="flex-1 cursor-pointer"
                                    >
                                        Dark
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="primary-color">Primary Color</Label>
                                <div className="flex items-center gap-2 mt-2">
                                    <Input
                                        id="primary-color"
                                        type="color"
                                        value={formStyling.primaryColor}
                                        onChange={(e) => setFormStyling(prev => ({ ...prev, primaryColor: e.target.value }))}
                                        className="w-16 h-10"
                                    />
                                    <Input
                                        value={formStyling.primaryColor}
                                        onChange={(e) => setFormStyling(prev => ({ ...prev, primaryColor: e.target.value }))}
                                        placeholder="#3B82F6"
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="font-family">Font Family</Label>
                                <select
                                    id="font-family"
                                    value={formStyling.fontFamily}
                                    onChange={(e) => setFormStyling(prev => ({ ...prev, fontFamily: e.target.value }))}
                                    className="w-full mt-2 px-3 py-2 border border-input bg-background rounded-md text-sm"
                                >
                                    <option value="Inter">Inter</option>
                                    <option value="Arial">Arial</option>
                                    <option value="Helvetica">Helvetica</option>
                                    <option value="Georgia">Georgia</option>
                                    <option value="Times New Roman">Times New Roman</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="background-color">Background Color</Label>
                                <div className="flex items-center gap-2 mt-2">
                                    <Input
                                        id="background-color"
                                        type="color"
                                        value={formStyling.backgroundColor}
                                        onChange={(e) => setFormStyling(prev => ({ ...prev, backgroundColor: e.target.value }))}
                                        className="w-16 h-10"
                                    />
                                    <Input
                                        value={formStyling.backgroundColor}
                                        onChange={(e) => setFormStyling(prev => ({ ...prev, backgroundColor: e.target.value }))}
                                        placeholder="#ffffff"
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="text-color">Text Color</Label>
                                <div className="flex items-center gap-2 mt-2">
                                    <Input
                                        id="text-color"
                                        type="color"
                                        value={formStyling.textColor}
                                        onChange={(e) => setFormStyling(prev => ({ ...prev, textColor: e.target.value }))}
                                        className="w-16 h-10"
                                    />
                                    <Input
                                        value={formStyling.textColor}
                                        onChange={(e) => setFormStyling(prev => ({ ...prev, textColor: e.target.value }))}
                                        placeholder="#1f2937"
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="border-radius">Border Radius</Label>
                                <Input
                                    id="border-radius"
                                    type="number"
                                    value={formStyling.borderRadius}
                                    onChange={(e) => setFormStyling(prev => ({ ...prev, borderRadius: parseInt(e.target.value) || 0 }))}
                                    placeholder="8"
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}