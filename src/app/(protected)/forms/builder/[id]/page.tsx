import { FormBuilder } from "@/components/forms/form-builder"

interface FormBuilderEditPageProps {
  params: {
    id: string
  }
}

export default function FormBuilderEditPage({ params }: FormBuilderEditPageProps) {
  return <FormBuilder formId={params.id} />
}