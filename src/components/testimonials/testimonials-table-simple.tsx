"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  IconDotsVertical,
  IconStar,
  IconStarFilled,
  IconCheck,
  IconX,
  IconClock,
  IconFlag,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"
import { TestimonialWithProjectAndGroup } from "@/lib/testimonials"

interface TestimonialsTableSimpleProps {
  data: TestimonialWithProjectAndGroup[]
  onStatusUpdate: (id: string, status: string) => void
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return {
          icon: IconCheck,
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }
      case 'rejected':
        return {
          icon: IconX,
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }
      case 'flagged':
        return {
          icon: IconFlag,
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }
      default: // pending
        return {
          icon: IconClock,
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`${config.className} flex items-center gap-1`}>
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
            <IconStarFilled className="w-4 h-4 text-yellow-400" />
          ) : (
            <IconStar className="w-4 h-4 text-gray-300" />
          )}
        </div>
      ))}
      <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
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

// Create columns function
const createColumns = (onStatusUpdate: (id: string, status: string) => void): ColumnDef<TestimonialWithProjectAndGroup>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => {
      const testimonial = row.original
      return (
        <div className="flex items-center gap-3">
          {/* Customer Image */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
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

          {/* Customer Info */}
          <div className="space-y-1 min-w-0 flex-1">
            <Link
              href={`/testimonials/view/${testimonial.id}`}
              className="font-medium text-primary hover:underline cursor-pointer block truncate"
            >
              {testimonial.customerName}
            </Link>
            {testimonial.customerCompany && (
              <div className="text-sm text-muted-foreground truncate">
                {testimonial.customerTitle && `${testimonial.customerTitle}, `}
                {testimonial.customerCompany}
              </div>
            )}
          </div>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "content",
    header: "Testimonial",
    cell: ({ row }) => {
      const content = row.original.content
      const truncated = content.length > 50 ? `${content.substring(0, 50)}...` : content

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-xs">
                <p className="text-sm leading-relaxed">{truncated}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="text-sm leading-relaxed">{content}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => <RatingDisplay rating={row.original.rating} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => <SourceBadge source={row.original.source} />,
  },
  {
    accessorKey: "groupName",
    header: "Group",
    cell: ({ row }) => {
      const testimonial = row.original
      if (!testimonial.groupName) {
        return <Badge variant="outline" className="text-xs text-muted-foreground">Uncategorized</Badge>
      }

      return (
        <Badge 
          variant="outline" 
          className="text-xs"
          style={{ 
            borderColor: testimonial.groupColor || '#3B82F6',
            color: testimonial.groupColor || '#3B82F6'
          }}
        >
          {testimonial.groupName}
        </Badge>
      )
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.original.tags
      if (!tags || tags.length === 0) {
        return <span className="text-muted-foreground text-sm">No tags</span>
      }

      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{tags.length - 2}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.original.createdAt
      return (
        <div className="text-sm">
          {new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          })}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const testimonial = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={async () => {
                try {
                  await toast.promise(
                    updateTestimonialStatus(testimonial.id, 'approved'),
                    {
                      loading: 'Approving testimonial...',
                      success: 'Testimonial approved!',
                      error: 'Failed to approve testimonial',
                    }
                  )
                  onStatusUpdate(testimonial.id, 'approved')
                } catch (error) {
                  // Error is already handled by toast.promise
                }
              }}
              disabled={testimonial.status === 'approved'}
              className="cursor-pointer"
            >
              <IconCheck className="w-4 h-4 mr-2" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                try {
                  await toast.promise(
                    updateTestimonialStatus(testimonial.id, 'rejected'),
                    {
                      loading: 'Rejecting testimonial...',
                      success: 'Testimonial rejected!',
                      error: 'Failed to reject testimonial',
                    }
                  )
                  onStatusUpdate(testimonial.id, 'rejected')
                } catch (error) {
                  // Error is already handled by toast.promise
                }
              }}
              disabled={testimonial.status === 'rejected'}
              className="cursor-pointer"
            >
              <IconX className="w-4 h-4 mr-2" />
              Reject
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                try {
                  await toast.promise(
                    updateTestimonialStatus(testimonial.id, 'flagged'),
                    {
                      loading: 'Flagging testimonial...',
                      success: 'Testimonial flagged!',
                      error: 'Failed to flag testimonial',
                    }
                  )
                  onStatusUpdate(testimonial.id, 'flagged')
                } catch (error) {
                  // Error is already handled by toast.promise
                }
              }}
              disabled={testimonial.status === 'flagged'}
              className="cursor-pointer"
            >
              <IconFlag className="w-4 h-4 mr-2" />
              Flag
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function TestimonialsTableSimple({ data, onStatusUpdate }: TestimonialsTableSimpleProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true }
  ])

  const columns = React.useMemo(() => createColumns(onStatusUpdate), [onStatusUpdate])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No testimonials found
          </h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border mx-4 lg:mx-6">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}