"use client"

import * as React from "react"
import {
  IconLayoutGrid,
  IconTable,
  IconPlus,
  IconLayoutColumns,
  IconChevronDown,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TestimonialsGrid } from "./testimonials-grid"
import { TestimonialsTableSimple } from "./testimonials-table-simple"
import { TestimonialWithProjectAndGroup } from "@/lib/testimonials"

interface TestimonialsViewProps {
  data: TestimonialWithProjectAndGroup[]
  projectId: string | null
}

type ViewMode = 'cards' | 'table'

export function TestimonialsView({ data: initialData, projectId }: TestimonialsViewProps) {
  const [data, setData] = React.useState(() => initialData)
  const [viewMode, setViewMode] = React.useState<ViewMode>('cards')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [sourceFilter, setSourceFilter] = React.useState<string>('all')

  // Filter data based on search and filters
  const filteredData = React.useMemo(() => {
    return data.filter((testimonial) => {
      const matchesSearch = testimonial.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.customerCompany?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || testimonial.status === statusFilter
      const matchesSource = sourceFilter === 'all' || testimonial.source === sourceFilter

      return matchesSearch && matchesStatus && matchesSource
    })
  }, [data, searchTerm, statusFilter, sourceFilter])

  // Get unique values for filters
  const statusOptions = React.useMemo(() => {
    const statuses = Array.from(new Set(data.map(item => item.status)))
    return statuses.map(status => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: status
    }))
  }, [data])

  const sourceOptions = React.useMemo(() => {
    const sources = Array.from(new Set(data.map(item => item.source)))
    return sources.map(source => ({
      label: source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: source
    }))
  }, [data])

  // Handle status updates from cards/table
  const handleStatusUpdate = (id: string, newStatus: string) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id
          ? { ...item, status: newStatus, approvedAt: newStatus === 'approved' ? new Date() : null }
          : item
      )
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Controls Header */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center space-x-2">
          {/* Search */}
          <Input
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Source Filter */}
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="h-8 px-3 cursor-pointer"
            >
              <IconLayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Cards</span>
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8 px-3 cursor-pointer"
            >
              <IconTable className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Table</span>
            </Button>
          </div>

          {/* Additional Controls for Table View */}
          {viewMode === 'table' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <IconLayoutColumns className="w-4 h-4" />
                  <span className="hidden lg:inline ml-2">Columns</span>
                  <IconChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuCheckboxItem checked>
                  Customer
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Testimonial
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Rating
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Status
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Source
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Tags
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Created
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="outline" size="sm" className="cursor-pointer">
            <IconPlus className="w-4 h-4" />
            <span className="hidden lg:inline ml-2">Add Testimonial</span>
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 lg:px-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {data.length} testimonials
        </p>
      </div>

      {/* View Content */}
      {viewMode === 'cards' ? (
        <TestimonialsGrid
          data={filteredData}
          onStatusUpdate={handleStatusUpdate}
        />
      ) : (
        <TestimonialsTableSimple
          data={filteredData}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  )
}