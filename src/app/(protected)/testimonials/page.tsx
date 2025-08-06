"use client"

import * as React from "react"
import { TestimonialsView } from "@/components/testimonials/testimonials-view"
import { TestimonialWithProjectAndGroup } from "@/lib/testimonials"

interface Group {
  id: string
  name: string
  color: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = React.useState<TestimonialWithProjectAndGroup[]>([])
  const [groups, setGroups] = React.useState<Group[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch testimonials and groups in parallel
      const [testimonialsResponse, groupsResponse] = await Promise.all([
        fetch('/api/testimonials'),
        fetch('/api/groups')
      ])

      if (!testimonialsResponse.ok) {
        throw new Error('Failed to fetch testimonials')
      }

      if (!groupsResponse.ok) {
        throw new Error('Failed to fetch groups')
      }

      const [testimonialsData, groupsData] = await Promise.all([
        testimonialsResponse.json(),
        groupsResponse.json()
      ])

      setTestimonials(testimonialsData)
      setGroups(groupsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <TestimonialsView
      data={testimonials}
      groups={groups}
      projectId={null}
      loading={loading}
      error={error}
      onRetry={fetchData}
    />
  )
}