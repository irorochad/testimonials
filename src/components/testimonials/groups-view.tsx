"use client"

import * as React from "react"
import { useState } from "react"
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconUsers,
    IconTag,
    IconCode,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ExportDropdown } from "./export-dropdown"

interface Group {
    id: string
    projectId: string
    name: string
    description: string | null
    color: string
    createdAt: Date
    updatedAt: Date
    testimonialCount: number
}

interface GroupsViewProps {
    groups: Group[]
    projectId: string
    allTestimonials?: any[] // All testimonials to avoid API calls
}

export function GroupsView({ groups: initialGroups, projectId, allTestimonials = [] }: GroupsViewProps) {
    const [groups, setGroups] = useState(initialGroups)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingGroup, setEditingGroup] = useState<Group | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#3B82F6'
    })

    // Helper function to determine if text should be white or black based on background color
    const getTextColor = (hexColor: string) => {
        // Convert hex to RGB
        const r = parseInt(hexColor.slice(1, 3), 16)
        const g = parseInt(hexColor.slice(3, 5), 16)
        const b = parseInt(hexColor.slice(5, 7), 16)

        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

        // Return white for dark colors, black for light colors
        return luminance > 0.5 ? '#000000' : '#ffffff'
    }

    // Helper function to get a lighter version of the color for better readability
    const getLighterColor = (hexColor: string, opacity: number = 0.1) => {
        const r = parseInt(hexColor.slice(1, 3), 16)
        const g = parseInt(hexColor.slice(3, 5), 16)
        const b = parseInt(hexColor.slice(5, 7), 16)
        return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            color: '#3B82F6'
        })
    }

    const handleCreateGroup = async () => {
        if (!formData.name.trim()) {
            toast.error('Group name is required')
            return
        }

        if (isCreating) return // Prevent double-clicks

        setIsCreating(true)
        try {
            const response = await fetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId,
                    name: formData.name.trim(),
                    description: formData.description.trim() || null,
                    color: formData.color,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to create group')
            }

            const newGroup = await response.json()
            setGroups(prev => [...prev, newGroup])
            setIsCreateDialogOpen(false)
            resetForm()
            toast.success('Group created successfully!')
        } catch (error) {
            toast.error('Failed to create group')
        } finally {
            setIsCreating(false)
        }
    }

    const handleEditGroup = async () => {
        if (!editingGroup || !formData.name.trim()) {
            toast.error('Group name is required')
            return
        }

        if (isEditing) return // Prevent double-clicks

        setIsEditing(true)
        try {
            const response = await fetch(`/api/groups/${editingGroup.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    description: formData.description.trim() || null,
                    color: formData.color,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to update group')
            }

            const updatedGroup = await response.json()
            setGroups(prev => prev.map(g => g.id === editingGroup.id ? updatedGroup : g))
            setIsEditDialogOpen(false)
            setEditingGroup(null)
            resetForm()
            toast.success('Group updated successfully!')
        } catch (error) {
            toast.error('Failed to update group')
        } finally {
            setIsEditing(false)
        }
    }

    const handleDeleteGroup = async (groupId: string) => {
        if (!confirm('Are you sure you want to delete this group? Testimonials in this group will be moved to "Uncategorized".')) {
            return
        }

        try {
            const response = await fetch(`/api/groups/${groupId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete group')
            }

            setGroups(prev => prev.filter(g => g.id !== groupId))
            toast.success('Group deleted successfully!')
        } catch (error) {
            toast.error('Failed to delete group')
        }
    }

    const openEditDialog = (group: Group) => {
        setEditingGroup(group)
        setFormData({
            name: group.name,
            description: group.description || '',
            color: group.color
        })
        setIsEditDialogOpen(true)
    }

    const openCreateDialog = () => {
        resetForm()
        setIsCreateDialogOpen(true)
    }



    return (
        <div className="w-full space-y-6">
            {/* Header */}
            {groups.length > 0 && (
                <div className="flex items-center justify-between px-4 lg:px-6">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {groups.length} group{groups.length !== 1 ? 's' : ''} total
                        </p>
                    </div>

                    <Button onClick={openCreateDialog} className="btn-primary">
                        <IconPlus className="w-4 h-4 mr-2" />
                        Create Group
                    </Button>
                </div>
            )}

            {/* Groups Grid */}
            {groups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="text-center">
                        <IconTag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                            No groups yet
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Create your first group to start organizing testimonials
                        </p>
                        <Button onClick={openCreateDialog} className="btn-primary">
                            <IconPlus className="w-4 h-4 mr-2" />
                            Create First Group
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 lg:px-6">
                    {groups.map((group) => {
                        const textColor = getTextColor(group.color)
                        const isLightBackground = textColor === '#000000'

                        return (
                            <Card
                                key={group.id}
                                className="relative group hover:shadow-lg transition-all duration-200 border-0"
                                style={{
                                    backgroundColor: group.color,
                                    color: textColor
                                }}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-white/30"
                                                style={{
                                                    backgroundColor: isLightBackground ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)'
                                                }}
                                            />
                                            <CardTitle
                                                className="text-lg truncate"
                                                style={{ color: textColor }}
                                            >
                                                {group.name}
                                            </CardTitle>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ExportDropdown
                                                testimonials={allTestimonials.filter(testimonial => 
                                                    testimonial.groupId === group.id && testimonial.status === 'approved'
                                                )}
                                                groupName={group.name}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 cursor-pointer hover:bg-white/20"
                                                    style={{ color: textColor }}
                                                    disabled={group.testimonialCount === 0}
                                                >
                                                    <IconCode className="w-4 h-4" />
                                                </Button>
                                            </ExportDropdown>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEditDialog(group)}
                                                className="h-8 w-8 p-0 cursor-pointer hover:bg-white/20"
                                                style={{ color: textColor }}
                                            >
                                                <IconEdit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteGroup(group.id)}
                                                className="h-8 w-8 p-0 cursor-pointer hover:bg-red-500/20"
                                                style={{ color: textColor }}
                                            >
                                                <IconTrash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {group.description && (
                                        <p
                                            className="text-sm mb-3 line-clamp-2 opacity-80"
                                            style={{ color: textColor }}
                                        >
                                            {group.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <div
                                            className="flex items-center gap-1 text-sm opacity-75"
                                            style={{ color: textColor }}
                                        >
                                            <IconUsers className="w-4 h-4" />
                                            <span>{group.testimonialCount} testimonial{group.testimonialCount !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div
                                            className="text-xs opacity-60"
                                            style={{ color: textColor }}
                                        >
                                            Created {new Date(group.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Group</DialogTitle>
                        <DialogDescription>
                            Create a new group to organize your testimonials.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Group Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter group name..."
                                className="border-none "
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter group description..."
                                className="border-none "
                            />
                        </div>
                        <div>
                            <Label htmlFor="color">Color</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="color"
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                    className="w-16 h-10"
                                />
                                <Input
                                    value={formData.color}
                                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                    placeholder="#3B82F6"
                                    className="flex-1 "

                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateDialogOpen(false)}
                            disabled={isCreating}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateGroup}
                            disabled={isCreating}
                            style={{
                                backgroundColor: formData.color,
                                borderColor: formData.color,
                                color: '#ffffff'
                            }}
                            className="hover:opacity-90 transition-opacity"
                        >
                            {isCreating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Creating...
                                </>
                            ) : (
                                'Create Group'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Group</DialogTitle>
                        <DialogDescription>
                            Update the group information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Group Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter group name..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-description">Description (Optional)</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter group description..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-color">Color</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="edit-color"
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                    className="w-16 h-10"
                                />
                                <Input
                                    value={formData.color}
                                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                    placeholder="#3B82F6"
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            disabled={isEditing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditGroup}
                            disabled={isEditing}
                            style={{
                                backgroundColor: formData.color,
                                borderColor: formData.color,
                                color: '#ffffff'
                            }}
                            className="hover:opacity-90 transition-opacity"
                        >
                            {isEditing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Updating...
                                </>
                            ) : (
                                'Update Group'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </div>
    )
}