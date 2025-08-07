"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField, FormFieldTypes } from "@/db/types"
import { toast } from "sonner"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"

interface PublicFormViewProps {
  form: {
    id: string
    name: string
    description: string | null
    slug: string
    fields: FormField[]
    styling: Record<string, unknown>
    settings: Record<string, unknown>
    isActive: boolean
    projectName: string
    projectId: string
  }
}

type FormStep = 'welcome' | 'form' | 'success'

export function PublicFormView({ form }: PublicFormViewProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('welcome')
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)

  // Get styling with defaults
  const styling = {
    theme: 'light',
    primaryColor: '#3B82F6',
    fontFamily: 'Inter',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderRadius: 8,
    ...form.styling
  }

  // Get welcome settings with defaults
  const welcomeSettings = {
    title: "Thank you for coming to help",
    message: "We appreciate you taking the time to share your experience with us. Your feedback helps us improve and serves as valuable social proof for others considering our services.",
    privacyNotice: "We promise to keep your information secure and will never sell your data to third parties.",
    buttonText: "Get Started",
    ...form.settings
  }

  const handleInputChange = (fieldId: string, value: any) => {
    console.log('Form field updated:', fieldId, '=', value)
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const requiredFields = form.fields.filter(field => field.required)
    const missingFields = requiredFields.filter(field => !formData[field.id])

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`)
      return
    }

    setSubmitting(true)
    try {
      console.log('Submitting form data:', formData)
      const response = await fetch(`/api/forms/${form.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: formData,
        }),
      })

      if (response.ok) {
        setCurrentStep('success')
      } else {
        toast.error("Failed to submit form. Please try again.")
      }
    } catch (error) {
      toast.error("Failed to submit form. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h1 
          className="text-3xl font-bold"
          style={{ 
            color: styling.theme === 'dark' ? '#ffffff' : styling.textColor 
          }}
        >
          {welcomeSettings.title}
        </h1>
        <p 
          className="text-lg leading-relaxed"
          style={{ 
            color: styling.theme === 'dark' ? '#d1d5db' : '#6b7280' 
          }}
        >
          {welcomeSettings.message}
        </p>
        {welcomeSettings.privacyNotice && (
          <p 
            className="text-sm p-4 rounded-lg"
            style={{ 
              color: styling.theme === 'dark' ? '#9ca3af' : '#6b7280',
              backgroundColor: styling.theme === 'dark' ? '#374151' : '#f9fafb'
            }}
          >
            {welcomeSettings.privacyNotice}
          </p>
        )}
      </div>
      <Button
        onClick={() => setCurrentStep('form')}
        className="px-8 py-3 text-lg text-white hover:opacity-90"
        style={{ backgroundColor: styling.primaryColor }}
      >
        {welcomeSettings.buttonText}
      </Button>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div 
        className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
        style={{
          backgroundColor: styling.theme === 'dark' ? '#065f46' : '#dcfce7'
        }}
      >
        <Check className="w-10 h-10 text-green-600" />
      </div>
      <div className="space-y-4">
        <h1 
          className="text-3xl font-bold"
          style={{ 
            color: styling.theme === 'dark' ? '#ffffff' : '#111827' 
          }}
        >
          We&apos;ve received your testimonial!
        </h1>
        <p 
          className="text-lg"
          style={{ 
            color: styling.theme === 'dark' ? '#d1d5db' : '#6b7280' 
          }}
        >
          Thank you for taking the time to share your experience. Your review is important, and we'll constantly try to make your experience better.
        </p>
      </div>
    </div>
  )

  const renderField = (field: FormField) => {
    const value = formData[field.id] || ''
    
    const fieldStyle = {
      backgroundColor: styling.theme === 'dark' ? '#4b5563' : '#ffffff',
      borderColor: styling.theme === 'dark' ? '#6b7280' : '#d1d5db',
      color: styling.theme === 'dark' ? '#f3f4f6' : '#111827'
    }

    switch (field.type) {
      case FormFieldTypes.TEXT:
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            style={fieldStyle}
            className="border focus:ring-2 focus:ring-opacity-50"
          />
        )

      case FormFieldTypes.EMAIL:
        return (
          <Input
            id={field.id}
            type="email"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            style={fieldStyle}
            className="border focus:ring-2 focus:ring-opacity-50"
          />
        )

      case FormFieldTypes.TEXTAREA:
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            rows={4}
            style={fieldStyle}
            className="border focus:ring-2 focus:ring-opacity-50 resize-none"
          />
        )

      case FormFieldTypes.SELECT:
        return (
          <Select value={value} onValueChange={(val) => handleInputChange(field.id, val)}>
            <SelectTrigger 
              style={fieldStyle}
              className="border focus:ring-2 focus:ring-opacity-50"
            >
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case FormFieldTypes.RATING:
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleInputChange(field.id, rating)}
                className={`w-10 h-10 text-3xl transition-colors ${
                  value >= rating 
                    ? 'text-yellow-400' 
                    : styling.theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                } hover:text-yellow-400`}
              >
                ★
              </button>
            ))}
          </div>
        )

      case FormFieldTypes.FILE:
        return (
          <ImageUpload
            onImageUpload={(imageUrl) => handleInputChange(field.id, imageUrl)}
            onImageRemove={() => handleInputChange(field.id, '')}
            currentImage={value}
            theme={styling.theme}
            primaryColor={styling.primaryColor}
          />
        )

      default:
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            style={fieldStyle}
            className="border focus:ring-2 focus:ring-opacity-50"
          />
        )
    }
  }

  const renderFormStep = () => (
    <div className="space-y-6">
      {/* Progress Indicators */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
            <Check className="w-4 h-4" />
          </div>
          <span className="ml-2 text-sm font-medium text-green-600">Welcome</span>
        </div>
        <div className="w-12 h-0.5 bg-green-500"></div>
        <div className="flex items-center">
          <div 
            className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-medium"
            style={{ backgroundColor: styling.primaryColor }}
          >
            2
          </div>
          <span 
            className="ml-2 text-sm font-medium"
            style={{ color: styling.primaryColor }}
          >
            Details
          </span>
        </div>
        <div 
          className="w-12 h-0.5"
          style={{ 
            backgroundColor: styling.theme === 'dark' ? '#4b5563' : '#e5e7eb' 
          }}
        ></div>
        <div className="flex items-center">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            style={{ 
              backgroundColor: styling.theme === 'dark' ? '#4b5563' : '#e5e7eb',
              color: styling.theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}
          >
            3
          </div>
          <span 
            className="ml-2 text-sm"
            style={{ 
              color: styling.theme === 'dark' ? '#9ca3af' : '#6b7280' 
            }}
          >
            Complete
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label 
              htmlFor={field.id} 
              className="text-sm font-medium"
              style={{ 
                color: styling.theme === 'dark' ? '#f3f4f6' : '#374151' 
              }}
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
              {renderField(field)}
            </div>
            {field.description && (
              <p 
                className="text-sm"
                style={{ 
                  color: styling.theme === 'dark' ? '#9ca3af' : '#6b7280' 
                }}
              >
                {field.description}
              </p>
            )}
          </div>
        ))}

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep('welcome')}
            className="flex items-center"
            style={{
              borderColor: styling.theme === 'dark' ? '#4b5563' : '#d1d5db',
              color: styling.theme === 'dark' ? '#f3f4f6' : '#374151',
              backgroundColor: styling.theme === 'dark' ? '#374151' : '#ffffff'
            }}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="flex items-center px-6 text-white hover:opacity-90"
            style={{ backgroundColor: styling.primaryColor }}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                Submit Testimonial
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        backgroundColor: styling.theme === 'dark' ? '#1f2937' : styling.backgroundColor,
        fontFamily: styling.fontFamily
      }}
    >
      <div className="max-w-2xl mx-auto">
        <Card
          className="shadow-xl border-0"
          style={{
            backgroundColor: styling.theme === 'dark' ? '#374151' : '#ffffff',
            borderRadius: `${styling.borderRadius}px`
          }}
        >
          <CardContent className="p-8">
            {currentStep === 'welcome' && renderWelcomeStep()}
            {currentStep === 'form' && renderFormStep()}
            {currentStep === 'success' && renderSuccessStep()}
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-gray-500">
          Powered by {form.projectName}
        </div>
      </div>
    </div>
  )
}