"use client"

import { useState } from "react"
import Link from "next/link"
import {
    IconStar,
    IconStarFilled,
    IconCheck,
    IconX,
    IconFlag,
    IconDotsVertical,
    IconBuilding,
    IconUser,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Group {
    id: string
    name: string
    color: string
}

interface TestimonialCardProps {
    testimonial: {
        id: string
        customerName: string
        customerEmail: string
        customerCompany: string | null
        customerTitle: string | null
        customerImageUrl: string | null
        content: string
        rating: number | null
        status: string
        source: string
        tags: string[] | null
        createdAt: Date
        approvedAt: Date | null
        groupId: string | null
        groupName: string | null
        groupColor: string | null
    }
    groups?: Group[]
    onStatusUpdate?: (id: string, status: string) => void
    onGroupUpdate?: (id: string, groupId: string | null, groupName: string | null, groupColor: string | null) => void
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
                    icon: IconFlag
                }
        }
    }

    const config = getStatusConfig(status)
    const Icon = config.icon

    return (
        <Badge variant="outline" className={`${config.className} flex items-center gap-1 text-xs`}>
            <Icon className="w-3 h-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    )
}

// Rating display component
function RatingDisplay({ rating }: { rating: number | null }) {
    if (!rating) return null

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <div key={star}>
                    {star <= rating ? (
                        <IconStarFilled className="w-4 h-4 text-yellow-400" />
                    ) : (
                        <IconStar className="w-4 h-4 text-gray-300" />
                    )}
                </div>
            ))}
            <span className="ml-1 text-sm font-medium text-muted-foreground">
                {rating}/5
            </span>
        </div>
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

// Update testimonial group function
async function updateTestimonialGroup(id: string, groupId: string | null) {
    try {
        const response = await fetch(`/api/testimonials/${id}/group`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ groupId }),
        })

        if (!response.ok) {
            throw new Error('Failed to update group')
        }

        return await response.json()
    } catch (error) {
        console.error('Error updating testimonial group:', error)
        throw error
    }
}

export function TestimonialCard({ testimonial, groups, onStatusUpdate, onGroupUpdate }: TestimonialCardProps) {
    const [isHovered, setIsHovered] = useState(false)

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

            // Call the parent callback to update the data
            if (onStatusUpdate) {
                onStatusUpdate(testimonial.id, newStatus)
            }
        } catch (error) {
            // Error is already handled by toast.promise
        }
    }

    const handleGroupUpdate = async (groupId: string | null) => {
        try {
            await toast.promise(
                updateTestimonialGroup(testimonial.id, groupId),
                {
                    loading: 'Updating group...',
                    success: 'Group updated!',
                    error: 'Failed to update group',
                }
            )

            // Find the selected group details
            const selectedGroup = groupId ? groups?.find(g => g.id === groupId) : null
            
            // Call the parent callback to update the data
            if (onGroupUpdate) {
                onGroupUpdate(
                    testimonial.id, 
                    groupId, 
                    selectedGroup?.name || null, 
                    selectedGroup?.color || null
                )
            }
        } catch (error) {
            // Error is already handled by toast.promise
        }
    }

    const truncateContent = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content
        return content.substring(0, maxLength) + "..."
    }

    return (
        <Card className="relative group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-white/20 backdrop-blur-md bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 hover:from-blue-100/90 hover:via-indigo-100/70 hover:to-purple-100/90 dark:bg-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
             <Link href={`/testimonials/${testimonial.id}`}>
            <CardContent className="p-6">
                {/* Header with customer info */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Customer Image */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            {testimonial.customerImageUrl ? (
                                <img
                                    src={testimonial.customerImageUrl}
                                    alt={testimonial.customerName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                        const parent = e.currentTarget.parentElement
                                        if (parent) {
                                            parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">${testimonial.customerName.charAt(0).toUpperCase()}</div>`
                                        }
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                                    {testimonial.customerName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Customer Details */}
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm truncate">{testimonial.customerName}</h3>
                            {(testimonial.customerTitle || testimonial.customerCompany) && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <IconUser className="w-3 h-3" />
                                    <span className="truncate">
                                        {testimonial.customerTitle}
                                        {testimonial.customerTitle && testimonial.customerCompany && ' at '}
                                        {testimonial.customerCompany}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions Menu - Always visible */}
                    <div className="flex-shrink-0 ml-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 w-8 p-0 cursor-pointer transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                                >
                                    <IconDotsVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem
                                    onClick={() => handleStatusUpdate('approved')}
                                    disabled={testimonial.status === 'approved'}
                                    className="cursor-pointer"
                                >
                                    <IconCheck className="w-4 h-4 mr-2" />
                                    Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleStatusUpdate('rejected')}
                                    disabled={testimonial.status === 'rejected'}
                                    className="cursor-pointer"
                                >
                                    <IconX className="w-4 h-4 mr-2" />
                                    Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleStatusUpdate('flagged')}
                                    disabled={testimonial.status === 'flagged'}
                                    className="cursor-pointer"
                                >
                                    <IconFlag className="w-4 h-4 mr-2" />
                                    Flag
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Status and Group - Separate row */}
                <div className="flex justify-between items-center mb-4">
                    {/* Group Dropdown */}
                    <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        {groups && groups.length > 0 ? (
                            <Select
                                value={testimonial.groupId || "uncategorized"}
                                onValueChange={(value) => {
                                    const groupId = value === "uncategorized" ? null : value
                                    handleGroupUpdate(groupId)
                                }}
                            >
                                <SelectTrigger className="h-6 text-xs border-none bg-transparent p-1 hover:bg-muted/50 transition-colors">
                                    <SelectValue>
                                        {testimonial.groupName ? (
                                            <div className="flex items-center gap-1">
                                                <div 
                                                    className="w-2 h-2 rounded-full" 
                                                    style={{ backgroundColor: testimonial.groupColor || '#3B82F6' }}
                                                />
                                                <span style={{ color: testimonial.groupColor || '#3B82F6' }}>
                                                    {testimonial.groupName}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">Uncategorized</span>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="uncategorized">
                                        <span className="text-muted-foreground">Uncategorized</span>
                                    </SelectItem>
                                    {groups.map((group) => (
                                        <SelectItem key={group.id} value={group.id}>
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-3 h-3 rounded-full" 
                                                    style={{ backgroundColor: group.color }}
                                                />
                                                <span style={{ color: group.color }}>
                                                    {group.name}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                                Uncategorized
                            </Badge>
                        )}
                    </div>
                    
                    {/* Status Badge */}
                    <StatusBadge status={testimonial.status} />
                </div>

                {/* Testimonial Content */}
               
                    <div className="mb-4">
                        <blockquote className="text-sm leading-relaxed text-muted-foreground italic">
                            "{truncateContent(testimonial.content)}"
                        </blockquote>
                    </div>
               

                {/* Footer with rating and date */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {testimonial.rating && <RatingDisplay rating={testimonial.rating} />}
                    </div>

                    <div className="text-xs text-muted-foreground">
                        {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>
                </div>

                {/* Tags */}
                {testimonial.tags && testimonial.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {testimonial.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {testimonial.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{testimonial.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>
            </Link>
        </Card>
    )
}