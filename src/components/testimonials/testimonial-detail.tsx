"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  IconArrowLeft,
  IconCheck,
  IconX,
  IconFlag,
  IconEdit,
  IconStar,
  IconStarFilled,
  IconCalendar,
  IconUser,
  IconBuilding,
  IconMail,
  IconTag,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface TestimonialDetailProps {
  testimonial: {
    id: string
    customerName: string
    customerEmail: string
    customerCompany: string | null
    customerTitle: string | null
    content: string
    rating: number | null
    status: string
    source: string
    sourceMetadata: any
    moderationScore: string | null
    moderationFlags: any
    tags: string[] | null
    createdAt: Date
    approvedAt: Date | null
    projectId: string
    projectName: string
  }
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return { 
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: IconCheck
        }
      case 'rejected':
        return { 
          className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          icon: IconX
        }
      case 'flagged':
        return { 
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          icon: IconFlag
        }
      default: // pending
        return { 
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
          icon: IconCalendar
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge variant="outline" className={`${config.className} flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

// Rating display component
function RatingDisplay({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-muted-foreground">No rating</span>

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star}>
          {star <= rating ? (
            <IconStarFilled className="w-5 h-5 text-yellow-400" />
          ) : (
            <IconStar className="w-5 h-5 text-gray-300" />
          )}
        </div>
      ))}
      <span className="ml-2 text-sm font-medium">({rating}/5)</span>
    </div>
  )
}

// Source badge component
function SourceBadge({ source }: { source: string }) {
  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'manual':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'email_invite':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'scraped':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'integration':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'imported':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  return (
    <Badge variant="outline" className={getSourceColor(source)}>
      {source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </Badge>
  )
}

// Update testimonial status function
async function updateTestimonialStatus(id: string, status: string) {
  try {
    const response = await fetch(`/api/testimonials/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error('Failed to update status')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating testimonial status:', error)
    throw error
  }
}

export function TestimonialDetail({ testimonial: initialTestimonial }: TestimonialDetailProps) {
  const [testimonial, setTestimonial] = useState(initialTestimonial)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await toast.promise(
        updateTestimonialStatus(testimonial.id, newStatus),
        {
          loading: `${newStatus === 'approved' ? 'Approving' : newStatus === 'rejected' ? 'Rejecting' : 'Flagging'} testimonial...`,
          success: `Testimonial ${newStatus}!`,
          error: `Failed to ${newStatus} testimonial`,
        }
      )
      
      // Update local state
      setTestimonial(prev => ({
        ...prev,
        status: newStatus,
        approvedAt: newStatus === 'approved' ? new Date() : null
      }))
    } catch (error) {
      // Error is already handled by toast.promise
    }
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/testimonials')}
        className="flex items-center gap-2"
      >
        <IconArrowLeft className="w-4 h-4" />
        Back to Testimonials
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Testimonial content */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">Testimonial Content</CardTitle>
                <div className="flex items-center gap-2">
                  <StatusBadge status={testimonial.status} />
                  <SourceBadge source={testimonial.source} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Rating */}
              {testimonial.rating && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Rating</h4>
                  <RatingDisplay rating={testimonial.rating} />
                </div>
              )}

              {/* Content */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Testimonial</h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <blockquote className="text-lg leading-relaxed italic">
                    "{testimonial.content}"
                  </blockquote>
                </div>
              </div>

              {/* Tags */}
              {testimonial.tags && testimonial.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {testimonial.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <IconTag className="w-3 h-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <IconUser className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{testimonial.customerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <IconMail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{testimonial.customerEmail}</p>
                  </div>
                </div>

                {testimonial.customerCompany && (
                  <div className="flex items-center gap-3">
                    <IconBuilding className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{testimonial.customerCompany}</p>
                    </div>
                  </div>
                )}

                {testimonial.customerTitle && (
                  <div className="flex items-center gap-3">
                    <IconUser className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Title</p>
                      <p className="font-medium">{testimonial.customerTitle}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleStatusUpdate('approved')}
                disabled={testimonial.status === 'approved'}
                className="w-full flex items-center gap-2"
                variant={testimonial.status === 'approved' ? 'secondary' : 'default'}
              >
                <IconCheck className="w-4 h-4" />
                {testimonial.status === 'approved' ? 'Approved' : 'Approve'}
              </Button>

              <Button
                onClick={() => handleStatusUpdate('rejected')}
                disabled={testimonial.status === 'rejected'}
                className="w-full flex items-center gap-2"
                variant={testimonial.status === 'rejected' ? 'secondary' : 'destructive'}
              >
                <IconX className="w-4 h-4" />
                {testimonial.status === 'rejected' ? 'Rejected' : 'Reject'}
              </Button>

              <Button
                onClick={() => handleStatusUpdate('flagged')}
                disabled={testimonial.status === 'flagged'}
                className="w-full flex items-center gap-2"
                variant={testimonial.status === 'flagged' ? 'secondary' : 'outline'}
              >
                <IconFlag className="w-4 h-4" />
                {testimonial.status === 'flagged' ? 'Flagged' : 'Flag'}
              </Button>

              <Separator />

              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <IconEdit className="w-4 h-4" />
                {isEditing ? 'Cancel Edit' : 'Edit'}
              </Button>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">
                  {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {testimonial.approvedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="font-medium">
                    {new Date(testimonial.approvedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Source</p>
                <SourceBadge source={testimonial.source} />
              </div>

              {testimonial.moderationScore && (
                <div>
                  <p className="text-sm text-muted-foreground">Moderation Score</p>
                  <p className="font-medium">{testimonial.moderationScore}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}