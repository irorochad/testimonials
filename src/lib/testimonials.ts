import { db } from "@/db"
import { projects, testimonials, groups } from "@/db/schema"
import { eq, and } from "drizzle-orm"

// Extended testimonial type with project and group info for UI components
export interface TestimonialWithProjectAndGroup {
  id: string
  customerName: string
  customerEmail: string
  customerCompany: string | null
  customerTitle: string | null
  customerImageUrl: string | null
  content: string
  rating: number | null
  status: string
  isPublic: boolean
  source: string
  sourceMetadata: any
  tags: string[] | null
  createdAt: Date
  approvedAt: Date | null
  projectId: string
  projectName: string
  projectPublicSlug: string | null
  projectIsPublic: boolean
  groupId: string | null
  groupName: string | null
  groupColor: string | null
}

// Get all testimonials for a user's project
export async function getUserTestimonials(userId: string): Promise<TestimonialWithProjectAndGroup[]> {
  try {
    // Get user's project first
    const userProject = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.userId, userId))
      .limit(1);

    if (!userProject[0]) {
      return [];
    }


    const result = await db
      .select({
        id: testimonials.id,
        customerName: testimonials.customerName,
        customerEmail: testimonials.customerEmail,
        customerCompany: testimonials.customerCompany,
        customerTitle: testimonials.customerTitle,
        customerImageUrl: testimonials.customerImageUrl,
        content: testimonials.content,
        rating: testimonials.rating,
        status: testimonials.status,
        isPublic: testimonials.isPublic,
        source: testimonials.source,
        sourceMetadata: testimonials.sourceMetadata,
        tags: testimonials.tags,
        createdAt: testimonials.createdAt,
        approvedAt: testimonials.approvedAt,
        projectId: testimonials.projectId,
        projectName: projects.name,
        projectPublicSlug: projects.publicSlug,
        projectIsPublic: projects.isPublic,
        groupId: testimonials.groupId,
        groupName: groups.name,
        groupColor: groups.color,
      })
      .from(testimonials)
      .innerJoin(projects, eq(testimonials.projectId, projects.id))
      .leftJoin(groups, eq(testimonials.groupId, groups.id))
      .where(eq(testimonials.projectId, userProject[0].id))
      .orderBy(testimonials.createdAt);

    return result.map(item => ({
      ...item,
      tags: item.tags as string[] | null,
      sourceMetadata: item.sourceMetadata as any
    }));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

// Get a single testimonial by ID for a user
export async function getUserTestimonial(userId: string, testimonialId: string): Promise<TestimonialWithProjectAndGroup | null> {
  try {
    const result = await db
      .select({
        id: testimonials.id,
        customerName: testimonials.customerName,
        customerEmail: testimonials.customerEmail,
        customerCompany: testimonials.customerCompany,
        customerTitle: testimonials.customerTitle,
        customerImageUrl: testimonials.customerImageUrl,
        content: testimonials.content,
        rating: testimonials.rating,
        status: testimonials.status,
        isPublic: testimonials.isPublic,
        source: testimonials.source,
        sourceMetadata: testimonials.sourceMetadata,
        tags: testimonials.tags,
        createdAt: testimonials.createdAt,
        approvedAt: testimonials.approvedAt,
        projectId: testimonials.projectId,
        projectName: projects.name,
        projectPublicSlug: projects.publicSlug,
        projectIsPublic: projects.isPublic,
        groupId: testimonials.groupId,
        groupName: groups.name,
        groupColor: groups.color,
      })
      .from(testimonials)
      .innerJoin(projects, eq(testimonials.projectId, projects.id))
      .leftJoin(groups, eq(testimonials.groupId, groups.id))
      .where(
        and(
          eq(testimonials.id, testimonialId),
          eq(projects.userId, userId)
        )
      )
      .limit(1);

    const testimonial = result[0];
    if (!testimonial) return null;

    return {
      ...testimonial,
      tags: testimonial.tags as string[] | null,
      sourceMetadata: testimonial.sourceMetadata as any
    };
  } catch (error) {
    // console.error('Error fetching testimonial:', error);
    return null;
  }
}

// Get user's project info
export async function getUserProject(userId: string) {
  try {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .limit(1);

    return project[0] || null;
  } catch (error) {
    // console.error('Error fetching user project:', error);
    return null;
  }
}