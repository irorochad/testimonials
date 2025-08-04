"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import { TestimonialsGrid } from "@/components/testimonials/testimonials-grid"
import { ExportDropdown } from "@/components/testimonials/export-dropdown"
import { TestimonialWithProjectAndGroup } from "@/lib/testimonials"

interface Group {
    id: string
    name: string
    color: string
    testimonialCount: number
}

export default function WidgetsPage() {
    const [testimonials, setTestimonials] = useState<TestimonialWithProjectAndGroup[]>([])
    const [groups, setGroups] = useState<Group[]>([])
    const [loading, setLoading] = useState(true)

    // Load testimonials and groups
    useEffect(() => {
        async function loadData() {
            try {
                const response = await fetch('/api/testimonials')
                if (!response.ok) {
                    throw new Error('Failed to fetch testimonials')
                }

                const data = await response.json()
                const testimonialsData = data.testimonials
                setTestimonials(testimonialsData)

                // Extract unique groups
                const groupsMap = new Map<string, Group>()
                testimonialsData.forEach((testimonial: TestimonialWithProjectAndGroup) => {
                    if (testimonial.groupId && testimonial.groupName) {
                        if (!groupsMap.has(testimonial.groupId)) {
                            groupsMap.set(testimonial.groupId, {
                                id: testimonial.groupId,
                                name: testimonial.groupName,
                                color: testimonial.groupColor || '#3B82F6',
                                testimonialCount: 0
                            })
                        }
                        const group = groupsMap.get(testimonial.groupId)!
                        group.testimonialCount++
                    }
                })

                setGroups(Array.from(groupsMap.values()))
            } catch (error) {
                console.error('Error loading data:', error)
                toast.error('Failed to load testimonials')
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    // Handle testimonial status updates
    const handleStatusUpdate = (id: string, status: string) => {
        setTestimonials(prev =>
            prev.map(testimonial =>
                testimonial.id === id ? { ...testimonial, status } : testimonial
            )
        )
    }

    // Handle testimonial group updates
    const handleGroupUpdate = (
        id: string,
        groupId: string | null,
        groupName: string | null,
        groupColor: string | null
    ) => {
        setTestimonials(prev =>
            prev.map(testimonial =>
                testimonial.id === id
                    ? { ...testimonial, groupId, groupName, groupColor }
                    : testimonial
            )
        )
    }



    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading testimonials...</p>
                </div>
            </div>
        )
    }

    const approvedTestimonials = testimonials.filter(t => t.status === 'approved')
    const ungroupedTestimonials = approvedTestimonials.filter(t => !t.groupId)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Widgets</h1>
                    <p className="text-muted-foreground mt-1">
                        Export and embed your testimonials anywhere
                    </p>
                </div>
                <ExportDropdown testimonials={approvedTestimonials}>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Widget
                    </Button>
                </ExportDropdown>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Testimonials
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{testimonials.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {approvedTestimonials.length} approved
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Groups
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{groups.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {ungroupedTestimonials.length} ungrouped
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Average Rating
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {approvedTestimonials.length > 0
                                ? (approvedTestimonials.reduce((acc, t) => acc + (t.rating || 0), 0) / approvedTestimonials.length).toFixed(1)
                                : '0.0'
                            }
                        </div>
                        <p className="text-xs text-muted-foreground">
                            out of 5 stars
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Export Tabs */}
            <Tabs defaultValue="groups" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="groups">By Groups</TabsTrigger>
                    <TabsTrigger value="all">All Testimonials</TabsTrigger>
                </TabsList>

                <TabsContent value="groups" className="space-y-6">
                    {/* Groups */}
                    {groups.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Testimonial Groups</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groups.map((group) => {
                                    const groupTestimonials = approvedTestimonials.filter(t => t.groupId === group.id)
                                    return (
                                        <Card key={group.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: group.color }}
                                                        />
                                                        <CardTitle className="text-lg">{group.name}</CardTitle>
                                                    </div>
                                                    <Badge variant="secondary">
                                                        {group.testimonialCount}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-muted-foreground">
                                                        {groupTestimonials.length} approved testimonials
                                                    </p>
                                                    <ExportDropdown
                                                        testimonials={groupTestimonials}
                                                        groupName={group.name}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Ungrouped Testimonials */}
                    {ungroupedTestimonials.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Ungrouped Testimonials</h2>
                                <ExportDropdown testimonials={ungroupedTestimonials} />
                            </div>
                            <TestimonialsGrid
                                data={ungroupedTestimonials}
                                groups={groups}
                                onStatusUpdate={handleStatusUpdate}
                                onGroupUpdate={handleGroupUpdate}
                            />
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="all" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">All Approved Testimonials</h2>
                        <ExportDropdown testimonials={approvedTestimonials} />
                    </div>

                    {approvedTestimonials.length > 0 ? (
                        <TestimonialsGrid
                            data={approvedTestimonials}
                            groups={groups}
                            onStatusUpdate={handleStatusUpdate}
                            onGroupUpdate={handleGroupUpdate}
                        />
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                                        No approved testimonials yet
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Approve some testimonials to start creating widgets
                                    </p>
                                    <Button variant="outline" asChild>
                                        <a href="/testimonials">View All Testimonials</a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>


        </div>
    )
}