"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  IconCheck,
  IconX,
  IconFlag,
  IconStar,
  IconStarFilled,
  IconCalendar,
  IconUser,
  IconMail,
  IconTag,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ExportDropdown } from "./export-dropdown"
import { TestimonialWithProjectAndGroup } from "@/lib/testimonials"

interface TestimonialDetailProps {
  testimonial: TestimonialWithProjectAndGroup
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


  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const result = await toast.promise(
        updateTestimonialStatus(testimonial.id, newStatus),
        {
          loading: `${newStatus === 'approved' ? 'Approving' : newStatus === 'rejected' ? 'Rejecting' : 'Flagging'} testimonial...`,
          success: `Testimonial ${newStatus}!`,
          error: `Failed to ${newStatus} testimonial`,
        }
      )

      // Update local state only if the API call was successful
      if (result) {
        setTestimonial(prev => ({
          ...prev,
          status: newStatus,
          approvedAt: newStatus === 'approved' ? new Date() : null
        }))
      }
    } catch (error) {
      // Error is already handled by toast.promise
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Back button - positioned absolutely, lower to avoid header conflict */}

      {/* <Button
        onClick={() => router.push('/testimonials')}
        className="absolute top-34 left-6  btnSecondary"
      >
        Back to Testimonials
      </Button> */}

      {/* Single Beautiful Card */}
      <Card
        className="w-full max-w-2xl border border-white/20 backdrop-blur-md bg-white/10 dark:bg-black/10 shadow-2xl dark:bg-none"

      >
        <CardContent className="p-8">
          {/* Header with customer info and status */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Customer Image */}
              <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                {testimonial.customerImageUrl ? (
                  <img
                    src={testimonial.customerImageUrl}
                    alt={testimonial.customerName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">${testimonial.customerName.charAt(0).toUpperCase()}</div>`
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                    {testimonial.customerName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Customer Details */}
              <div>
                <h2 className="text-xl font-bold">{testimonial.customerName}</h2>
                {(testimonial.customerTitle || testimonial.customerCompany) && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <IconUser className="w-4 h-4" />
                    <span>
                      {testimonial.customerTitle}
                      {testimonial.customerTitle && testimonial.customerCompany && ' at '}
                      {testimonial.customerCompany}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <IconMail className="w-4 h-4" />
                  <span>{testimonial.customerEmail}</span>
                </div>
              </div>
            </div>

            {/* Status and Source */}
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={testimonial.status} />
              <SourceBadge source={testimonial.source} />
            </div>
          </div>

          {/* Rating */}
          {testimonial.rating && (
            <div className="mb-6 flex justify-center">
              <RatingDisplay rating={testimonial.rating} />
            </div>
          )}

          {/* Testimonial Content */}
          <div className="mb-6">
            <blockquote className="text-lg leading-relaxed italic text-center py-4">
              "{testimonial.content}"
            </blockquote>
          </div>

          {/* Tags */}
          {testimonial.tags && testimonial.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {testimonial.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    <IconTag className="w-3 h-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <Button
              onClick={() => handleStatusUpdate('approved')}
              disabled={testimonial.status === 'approved'}
              className="flex items-center gap-2 btnSecondary"
            >
              <IconCheck className="w-4 h-4" />
              {testimonial.status === 'approved' ? 'Approved' : 'Approve'}
            </Button>

            <Button
              onClick={() => handleStatusUpdate('rejected')}
              disabled={testimonial.status === 'rejected'}
              className="flex items-center gap-2 cursor-pointer"
              variant={testimonial.status === 'rejected' ? 'secondary' : 'destructive'}
            >
              <IconX className="w-4 h-4" />
              {testimonial.status === 'rejected' ? 'Rejected' : 'Reject'}
            </Button>

            <Button
              onClick={() => handleStatusUpdate('flagged')}
              disabled={testimonial.status === 'flagged'}
              className="flex items-center gap-2 cursor-pointer"
              variant={testimonial.status === 'flagged' ? 'secondary' : 'outline'}
            >
              <IconFlag className="w-4 h-4" />
              {testimonial.status === 'flagged' ? 'Flagged' : 'Flag'}
            </Button>

            <ExportDropdown
              testimonials={[testimonial]}
              groupName={testimonial.groupName || undefined}
              triggerVariant="outline"
            />
          </div>

          {/* Footer with metadata */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-white/10">
            <div>
              Created: {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            {testimonial.approvedAt && (
              <div>
                Approved: {new Date(testimonial.approvedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>


    </div>
  )
}