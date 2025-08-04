import { IconUsers, IconFolder, IconStar, IconClock } from "@tabler/icons-react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DashboardStats {
  totalTestimonials: number
  totalApproved: number
  totalGroups: number
  averageRating: number
  recentTestimonials: number
  approvalRate: number
}

interface SectionCardsProps {
  stats: DashboardStats
}

export function SectionCards({ stats }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Testimonials</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalTestimonials}
          </CardTitle>
          <CardAction>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <IconUsers className="h-5 w-5 text-primary" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.totalApproved} approved testimonials
          </div>
          <div className="text-muted-foreground">
            {stats.approvalRate.toFixed(1)}% approval rate
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Testimonial Groups</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalGroups}
          </CardTitle>
          <CardAction>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <IconFolder className="h-5 w-5 text-primary" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Organized collections
          </div>
          <div className="text-muted-foreground">
            {stats.totalGroups === 0 ? 'Create groups to organize testimonials' : 'Helping organize your testimonials'}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Rating</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0'}
          </CardTitle>
          <CardAction>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <IconStar className="h-5 w-5 text-primary" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.averageRating >= 4.5 ? 'Excellent ratings' : stats.averageRating >= 4.0 ? 'Great ratings' : stats.averageRating >= 3.0 ? 'Good ratings' : stats.averageRating > 0 ? 'Building reputation' : 'No ratings yet'}
          </div>
          <div className="text-muted-foreground">
            From {stats.totalApproved} approved testimonials
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Recent Activity</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.recentTestimonials}
          </CardTitle>
          <CardAction>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <IconClock className="h-5 w-5 text-primary" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.recentTestimonials === 0 ? 'No recent activity' : `${stats.recentTestimonials} new this month`}
          </div>
          <div className="text-muted-foreground">
            Last 30 days activity
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
