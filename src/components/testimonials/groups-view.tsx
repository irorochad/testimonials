"use client"

import * as React from "react"
import { useState } from "react"
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconUsers,
    IconTag,
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

interface Group {
    id: string
    projectId: string
    name: string
    description: string | null
    color: string
    createdAt: Date
    updatedAt: Date
}

interface GroupsViewProps {
    groups: Group[]
    projectId: string
}

export function GroupsView({ groups: initialGroups, projectId }: GroupsViewProps) {
    const [groups, setGroups] = useState(initialGroups)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingGroup, setEditingGroup] = useState<Group | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#3B82F6'
    })

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
        }
    }

    const handleEditGroup = async () => {
        if (!editingGroup || !formData.name.trim()) {
            toast.error('Group name is required')
            return
        }

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
                    {groups.map((group) => (
                        <Card key={group.id} className="relative group hover:shadow-lg transition-all duration-200">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: group.color }}
                                        />
                                        <CardTitle className="text-lg truncate">{group.name}</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditDialog(group)}
                                            className="h-8 w-8 p-0 cursor-pointer"
                                        >
                                            <IconEdit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteGroup(group.id)}
                                            className="h-8 w-8 p-0 cursor-pointer text-destructive hover:text-destructive"
                                        >
                                            <IconTrash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {group.description && (
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {group.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <IconUsers className="w-4 h-4" />
                                        <span>0 testimonials</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Created {new Date(group.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
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
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter group description..."
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
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateGroup} className="btn-primary">
                            Create Group
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
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditGroup} className="btn-primary">
                            Update Group
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}