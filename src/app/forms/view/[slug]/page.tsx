import { notFound } from 'next/navigation'
import { db } from '@/db'
import { forms, projects } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { PublicFormView } from '@/components/forms/public-form-view'
import { FormField } from '@/db/types'

interface PublicFormPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PublicFormPage({ params }: PublicFormPageProps) {
  // Await params to fix Next.js 15 async params requirement
  const { slug } = await params

  // Get the form by slug
  const form = await db
    .select({
      id: forms.id,
      name: forms.name,
      description: forms.description,
      slug: forms.slug,
      fields: forms.fields,
      styling: forms.styling,
      settings: forms.settings,
      isActive: forms.isActive,
      projectName: projects.name,
      projectId: forms.projectId,
    })
    .from(forms)
    .innerJoin(projects, eq(forms.projectId, projects.id))
    .where(and(
      eq(forms.slug, slug),
      eq(forms.isActive, true)
    ))
    .limit(1)

  if (!form[0]) {
    notFound()
  }

  return <PublicFormView form={{
    ...form[0],
    fields: form[0].fields as FormField[],
    styling: form[0].styling as Record<string, unknown>,
    settings: form[0].settings as Record<string, unknown>,
  }} />
}