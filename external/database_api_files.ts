// =============================================================================
// FILE: src/db/schema.ts
// PURPOSE: Add widget-related tables to your existing schema
// ADD THESE TABLES TO YOUR EXISTING SCHEMA FILE
// =============================================================================

import { pgTable, uuid, text, jsonb, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Add these to your existing schema.ts file alongside your current tables

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  domain: text('domain'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const testimonials = pgTable('testimonials', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  author: text('author').notNull(),
  title: text('title'),
  company: text('company'),
  avatar: text('avatar'),
  rating: integer('rating'),
  tags: jsonb('tags').$type<string[]>().default([]),
  source: text('source').$type<'email' | 'form' | 'import' | 'scrape'>().default('form'),
  status: text('status').$type<'pending' | 'approved' | 'rejected'>().default('pending'),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const widgetConfigs = pgTable('widget_configs', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  templateId: text('template_id').notNull(),
  settings: jsonb('settings').notNull(),
  filters: jsonb('filters').notNull().default({}),
  embedCode: text('embed_code'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const projectsRelations = relations(projects, ({ many, one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  testimonials: many(testimonials),
  widgets: many(widgetConfigs),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  project: one(projects, {
    fields: [testimonials.projectId],
    references: [projects.id],
  }),
}));

export const widgetConfigsRelations = relations(widgetConfigs, ({ one }) => ({
  project: one(projects, {
    fields: [widgetConfigs.projectId],
    references: [projects.id],
  }),
}));

// =============================================================================
// FILE: src/app/api/projects/route.ts
// PURPOSE: API routes for project management
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, session.user.id));

    return NextResponse.json({ projects: userProjects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, domain, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const [newProject] = await db
      .insert(projects)
      .values({
        userId: session.user.id,
        name,
        domain,
        description,
      })
      .returning();

    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =============================================================================
// FILE: src/app/api/widgets/route.ts
// PURPOSE: API routes for widget management
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { widgetConfigs, projects } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Verify project ownership
    const project = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, session.user.id)))
      .limit(1);

    if (!project.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const widgets = await db
      .select()
      .from(widgetConfigs)
      .where(eq(widgetConfigs.projectId, projectId));

    return NextResponse.json({ widgets });
  } catch (error) {
    console.error('Error fetching widgets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, name, templateId, settings, filters } = body;

    if (!projectId || !name || !templateId || !settings) {
      return NextResponse.json({ 
        error: 'Missing required fields: projectId, name, templateId, settings' 
      }, { status: 400 });
    }

    // Verify project ownership
    const project = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, session.user.id)))
      .limit(1);

    if (!project.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Generate unique widget ID for embed code
    const widgetId = nanoid(12);
    const embedCode = `<script src="${process.env.NEXT_PUBLIC_APP_URL}/embed/widget.js" data-widget-id="${widgetId}"></script>`;

    const [newWidget] = await db
      .insert(widgetConfigs)
      .values({
        id: widgetId,
        projectId,
        name,
        templateId,
        settings,
        filters: filters || {},
        embedCode,
      })
      .returning();

    return NextResponse.json({ widget: newWidget }, { status: 201 });
  } catch (error) {
    console.error('Error creating widget:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =============================================================================
// FILE: src/app/api/widgets/[id]/route.ts
// PURPOSE: API routes for individual widget operations
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { widgetConfigs, projects } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

interface Params {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const widget = await db
      .select({
        widget: widgetConfigs,
        project: projects,
      })
      .from(widgetConfigs)
      .innerJoin(projects, eq(widgetConfigs.projectId, projects.id))
      .where(and(
        eq(widgetConfigs.id, params.id),
        eq(projects.userId, session.user.id)
      ))
      .limit(1);

    if (!widget.length) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }

    return NextResponse.json({ widget: widget[0].widget });
  } catch (error) {
    console.error('Error fetching widget:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, templateId, settings, filters, isActive } = body;

    // Verify widget ownership
    const widget = await db
      .select({
        widget: widgetConfigs,
        project: projects,
      })
      .from(widgetConfigs)
      .innerJoin(projects, eq(widgetConfigs.projectId, projects.id))
      .where(and(
        eq(widgetConfigs.id, params.id),
        eq(projects.userId, session.user.id)
      ))
      .limit(1);

    if (!widget.length) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (templateId !== undefined) updateData.templateId = templateId;
    if (settings !== undefined) updateData.settings = settings;
    if (filters !== undefined) updateData.filters = filters;
    if (isActive !== undefined) updateData.isActive = isActive;

    const [updatedWidget] = await db
      .update(widgetConfigs)
      .set(updateData)
      .where(eq(widgetConfigs.id, params.id))
      .returning();

    return NextResponse.json({ widget: updatedWidget });
  } catch (error) {
    console.error('Error updating widget:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify widget ownership
    const widget = await db
      .select({
        widget: widgetConfigs,
        project: projects,
      })
      .from(widgetConfigs)
      .innerJoin(projects, eq(widgetConfigs.projectId, projects.id))
      .where(and(
        eq(widgetConfigs.id, params.id),
        eq(projects.userId, session.user.id)
      ))
      .limit(1);

    if (!widget.length) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }

    await db
      .delete(widgetConfigs)
      .where(eq(widgetConfigs.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting widget:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =============================================================================
// FILE: src/app/api/testimonials/route.ts
// PURPOSE: API routes for testimonial management
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { testimonials, projects } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Verify project ownership
    const project = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, session.user.id)))
      .limit(1);

    if (!project.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const projectTestimonials = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.projectId, projectId))
      .orderBy(desc(testimonials.createdAt));

    return NextResponse.json({ testimonials: projectTestimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, content, author, title, company, avatar, rating, tags, source } = body;

    if (!projectId || !content || !author) {
      return NextResponse.json({ 
        error: 'Missing required fields: projectId, content, author' 
      }, { status: 400 });
    }

    // Verify project ownership
    const project = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, session.user.id)))
      .limit(1);

    if (!project.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const [newTestimonial] = await db
      .insert(testimonials)
      .values({
        projectId,
        content,
        author,
        title,
        company,
        avatar,
        rating,
        tags: tags || [],
        source: source || 'form',
        status: 'pending',
      })
      .returning();

    return NextResponse.json({ testimonial: newTestimonial }, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}