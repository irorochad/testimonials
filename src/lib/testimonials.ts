import { db } from "@/db"
import { projects, testimonials } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export interface TestimonialWithProject {
  id: string
  customerName: string
  customerEmail: string
  customerCompany: string | null
  customerTitle: string | null
  content: string
  rating: number | null
  status: string
  source: string
  sourceMetadata: any
  moderationScore: string | null
  moderationFlags: any
  tags: string[] | null
  createdAt: Date
  approvedAt: Date | null
  projectId: string
  projectName: string
}

// Get all testimonials for a user's project
export async function getUserTestimonials(userId: string): Promise<TestimonialWithProject[]> {
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
        content: testimonials.content,
        rating: testimonials.rating,
        status: testimonials.status,
        source: testimonials.source,
        sourceMetadata: testimonials.sourceMetadata,
        moderationScore: testimonials.moderationScore,
        moderationFlags: testimonials.moderationFlags,
        tags: testimonials.tags,
        createdAt: testimonials.createdAt,
        approvedAt: testimonials.approvedAt,
        projectId: testimonials.projectId,
        projectName: projects.name,
      })
      .from(testimonials)
      .innerJoin(projects, eq(testimonials.projectId, projects.id))
      .where(eq(testimonials.projectId, projects.id))
      .orderBy(testimonials.createdAt);

    return result.map(item => ({
      ...item,
      tags: item.tags as string[] | null,
      sourceMetadata: item.sourceMetadata as any,
      moderationFlags: item.moderationFlags as any
    }));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

// Get a single testimonial by ID for a user
export async function getUserTestimonial(userId: string, testimonialId: string): Promise<TestimonialWithProject | null> {
  try {
    const result = await db
      .select({
        id: testimonials.id,
        customerName: testimonials.customerName,
        customerEmail: testimonials.customerEmail,
        customerCompany: testimonials.customerCompany,
        customerTitle: testimonials.customerTitle,
        content: testimonials.content,
        rating: testimonials.rating,
        status: testimonials.status,
        source: testimonials.source,
        sourceMetadata: testimonials.sourceMetadata,
        moderationScore: testimonials.moderationScore,
        moderationFlags: testimonials.moderationFlags,
        tags: testimonials.tags,
        createdAt: testimonials.createdAt,
        approvedAt: testimonials.approvedAt,
        projectId: testimonials.projectId,
        projectName: projects.name,
      })
      .from(testimonials)
      .innerJoin(projects, eq(testimonials.projectId, projects.id))
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
      sourceMetadata: testimonial.sourceMetadata as any,
      moderationFlags: testimonial.moderationFlags as any
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