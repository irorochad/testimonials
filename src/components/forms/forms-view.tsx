"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Settings, Eye, Copy, Trash2, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Form } from "@/db/types"

export function FormsView() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/forms')
      if (response.ok) {
        const data = await response.json()
        setForms(data)
      } else {
        toast.error('Failed to fetch forms')
      }
    } catch (error) {
      toast.error('Failed to fetch forms')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateForm = () => {
    router.push('/forms/builder')
  }

  const handleEditForm = (formId: string) => {
    router.push(`/forms/builder/${formId}`)
  }

  const handleViewForm = (slug: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    const formUrl = `${baseUrl}/collect/${slug}`
    window.open(formUrl, '_blank')
  }

  const handleCopyLink = (slug: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    const formUrl = `${baseUrl}/collect/${slug}`
    navigator.clipboard.writeText(formUrl)
    toast.success('Form link copied to clipboard!')
  }

  const handleDeleteForm = async (formId: string, formName: string) => {
    if (!confirm(`Are you sure you want to delete "${formName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setForms(forms.filter(form => form.id !== formId))
        toast.success('Form deleted successfully')
      } else {
        toast.error('Failed to delete form')
      }
    } catch (error) {
      toast.error('Failed to delete form')
    }
  }

  const handleToggleStatus = async (formId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        const updatedForm = await response.json()
        setForms(forms.map(form => 
          form.id === formId ? updatedForm : form
        ))
        toast.success(`Form ${!currentStatus ? 'activated' : 'deactivated'}`)
      } else {
        toast.error('Failed to update form status')
      }
    } catch (error) {
      toast.error('Failed to update form status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Forms</h1>
          <p className="text-muted-foreground">
            Create and manage testimonial collection forms
          </p>
        </div>
        <Button onClick={handleCreateForm} className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Create Form
        </Button>
      </div>

      {/* Forms Grid */}
      {forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No forms yet</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Create your first testimonial collection form to start gathering feedback from your customers.
            </p>
            <Button onClick={handleCreateForm} className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Form
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg truncate">{form.name}</CardTitle>
                    {form.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {form.description}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleEditForm(form.id)}
                        className="cursor-pointer"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Form
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleViewForm(form.slug)}
                        className="cursor-pointer"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleCopyLink(form.slug)}
                        className="cursor-pointer"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleToggleStatus(form.id, form.isActive)}
                        className="cursor-pointer"
                      >
                        {form.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteForm(form.id, form.name)}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={form.isActive ? "default" : "secondary"}>
                      {form.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {Array.isArray(form.fields) ? form.fields.length : 0} fields
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(form.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditForm(form.id)}
                    className="flex-1 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewForm(form.slug)}
                    className="flex-1 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}