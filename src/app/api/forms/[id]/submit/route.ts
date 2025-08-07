import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { forms, formSubmissions, testimonials, projects } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { generateUniqueSlug } from '@/lib/slug-generator'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { data } = body

    if (!data) {
      return NextResponse.json({ error: 'Form data is required' }, { status: 400 })
    }

    // Get the form and verify it's active
    const form = await db
      .select({
        id: forms.id,
        projectId: forms.projectId,
        name: forms.name,
        fields: forms.fields,
        isActive: forms.isActive,
      })
      .from(forms)
      .where(eq(forms.id, id))
      .limit(1)

    if (!form[0]) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    if (!form[0].isActive) {
      return NextResponse.json({ error: 'Form is not active' }, { status: 400 })
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create form submission record
    const submission = await db
      .insert(formSubmissions)
      .values({
        formId: form[0].id,
        data,
        ipAddress,
        userAgent,
      })
      .returning()

    // Create testimonial from form submission
    console.log('Received form data:', data)
    
    const customerName = data.name || data.customerName || 'Anonymous'
    const customerEmail = data.email || data.customerEmail || ''
    const content = data.testimonial || data.content || data.message || ''
    const rating = data.rating ? parseInt(data.rating) : null
    const customerCompany = data.company || data.customerCompany || null
    const customerTitle = data.position || data.title || data.customerTitle || null
    // Find the image field dynamically (it might have a generated ID)
    const imageField = Object.keys(data).find(key => key.startsWith('file_') || key === 'profile_image')
    const customerImageUrl = imageField ? data[imageField] : (data.profile_image || data.customerImageUrl || null)
    
    console.log('Extracted customerImageUrl:', customerImageUrl)

    if (content && customerEmail) {
      // Generate unique slug for testimonial
      const testimonialSlug = await generateUniqueSlug(async (slug: string) => {
        const existing = await db
          .select({ id: testimonials.id })
          .from(testimonials)
          .where(and(
            eq(testimonials.projectId, form[0].projectId),
            eq(testimonials.slug, slug)
          ))
          .limit(1)
        return existing.length > 0
      })

      const testimonial = await db
        .insert(testimonials)
        .values({
          projectId: form[0].projectId,
          slug: testimonialSlug,
          customerName,
          customerEmail,
          customerCompany,
          customerTitle,
          customerImageUrl,
          content,
          rating,
          status: 'pending', // Forms submissions start as pending
          source: 'form',
          sourceMetadata: {
            formId: form[0].id,
            formName: form[0].name,
            submissionId: submission[0].id,
          },
        })
        .returning()

      // Link the testimonial to the form submission
      await db
        .update(formSubmissions)
        .set({ testimonialId: testimonial[0].id })
        .where(eq(formSubmissions.id, submission[0].id))
    }

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully'
    })

  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}