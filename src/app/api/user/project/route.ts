import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the user's project (they should have one after onboarding)
    const userProjects = await db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        websiteUrl: projects.websiteUrl,
        brandName: projects.brandName,
        embedCode: projects.embedCode,
        settings: projects.settings,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .where(eq(projects.userId, session.user.id))
      .limit(1);

    if (!userProjects.length) {
      return NextResponse.json(
        { error: 'No project found. Please complete onboarding first.' },
        { status: 404 }
      );
    }

    const project = userProjects[0];

    return NextResponse.json({
      success: true,
      project
    });

  } catch (error) {
    console.error('Error fetching user project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}