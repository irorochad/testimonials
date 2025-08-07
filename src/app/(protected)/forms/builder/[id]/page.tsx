import { FormBuilder } from "@/components/forms/form-builder"

interface FormBuilderEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function FormBuilderEditPage({ params }: FormBuilderEditPageProps) {
  const { id } = await params
  return <FormBuilder formId={id} />
}