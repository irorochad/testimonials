import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    // Validate session and get user
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { projectName, websiteUrl } = body;

    // Validate input
    if (!projectName?.trim() || !websiteUrl?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Project name and website URL are required' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedProjectName = projectName.trim().substring(0, 255);
    const sanitizedWebsiteUrl = websiteUrl.trim().substring(0, 500);

    // Validate URL format
    try {
      new URL(sanitizedWebsiteUrl.startsWith('http') ? sanitizedWebsiteUrl : `https://${sanitizedWebsiteUrl}`);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid website URL format' },
        { status: 400 }
      );
    }

    // Generate unique embed code
    const embedCode = nanoid(10);

    // Create project in database
    const [newProject] = await db
      .insert(projects)
      .values({
        userId: session.user.id,
        name: sanitizedProjectName,
        websiteUrl: sanitizedWebsiteUrl.startsWith('http') ? sanitizedWebsiteUrl : `https://${sanitizedWebsiteUrl}`,
        embedCode,
        settings: {},
      })
      .returning();

    return NextResponse.json({
      success: true,
      project: {
        id: newProject.id,
        name: newProject.name,
        websiteUrl: newProject.websiteUrl,
        embedCode: newProject.embedCode,
      }
    });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create project' 
      },
      { status: 500 }
    );
  }
}