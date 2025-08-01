"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns,
  IconPlus,
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

export interface TestimonialData {
  id: string
  customerName: string
  customerEmail: string
  customerCompany: string | null
  customerTitle: string | null
  content: string
  rating: number | null
  status: string
  source: string
  tags: string[] | null
  createdAt: Date
  approvedAt: Date | null
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

// Create columns function to avoid hooks issues
const createColumns = (setData: React.Dispatch<React.SetStateAction<TestimonialData[]>>): ColumnDef<TestimonialData>[] => [
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
        <div className="space-y-1">
          <div className="font-medium">{testimonial.customerName}</div>
          {testimonial.customerCompany && (
            <div className="text-sm text-muted-foreground">
              {testimonial.customerTitle && `${testimonial.customerTitle}, `}
              {testimonial.customerCompany}
            </div>
          )}
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => <SourceBadge source={row.original.source} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
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
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
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
                  // Update the local data immediately
                  setData(prevData =>
                    prevData.map(item =>
                      item.id === testimonial.id
                        ? { ...item, status: 'approved', approvedAt: new Date() }
                        : item
                    )
                  )
                } catch (error) {
                  // Error is already handled by toast.promise
                }
              }}
              disabled={testimonial.status === 'approved'}
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
                  // Update the local data immediately
                  setData(prevData =>
                    prevData.map(item =>
                      item.id === testimonial.id
                        ? { ...item, status: 'rejected', approvedAt: null }
                        : item
                    )
                  )
                } catch (error) {
                  // Error is already handled by toast.promise
                }
              }}
              disabled={testimonial.status === 'rejected'}
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
                  // Update the local data immediately
                  setData(prevData =>
                    prevData.map(item =>
                      item.id === testimonial.id
                        ? { ...item, status: 'flagged', approvedAt: null }
                        : item
                    )
                  )
                } catch (error) {
                  // Error is already handled by toast.promise
                }
              }}
              disabled={testimonial.status === 'flagged'}
            >
              <IconFlag className="w-4 h-4 mr-2" />
              Flag
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function TestimonialsTable({
  data: initialData,
  projectId
}: {
  data: TestimonialData[]
  projectId: string | null
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true }
  ])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns = React.useMemo(() => createColumns(setData), [setData])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

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

  return (
    <div className="w-full space-y-4">
      {/* Filters and Controls */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search testimonials..."
            value={(table.getColumn("customerName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("customerName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          {/* Status Filter */}
          <Select
            value={(table.getColumn("status")?.getFilterValue() as string[])?.join(",") ?? "all"}
            onValueChange={(value) => {
              if (value === "all") {
                table.getColumn("status")?.setFilterValue(undefined)
              } else {
                const filterValue = value ? value.split(",") : []
                table.getColumn("status")?.setFilterValue(filterValue.length > 0 ? filterValue : undefined)
              }
            }}
          >
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
          <Select
            value={(table.getColumn("source")?.getFilterValue() as string[])?.join(",") ?? "all"}
            onValueChange={(value) => {
              if (value === "all") {
                table.getColumn("source")?.setFilterValue(undefined)
              } else {
                const filterValue = value ? value.split(",") : []
                table.getColumn("source")?.setFilterValue(filterValue.length > 0 ? filterValue : undefined)
              }
            }}
          >
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm">
            <IconPlus />
            <span className="hidden lg:inline">Add Testimonial</span>
          </Button>
        </div>
      </div>

      {/* Table */}
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

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}