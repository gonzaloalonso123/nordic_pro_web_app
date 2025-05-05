"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import FormRenderer from "@/components/form-builder/form-renderer/form-renderer"
import type { Form, FormWithQuestions, Question } from "@/components/form-builder/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ExperienceProgress from "@/components/form-builder/experience-progress"

export default function PreviewFormPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.id as string

  const [formWithQuestions, setFormWithQuestions] = useState<FormWithQuestions | null>(null)

  useEffect(() => {
    // Load forms and questions from localStorage
    const storedForms = localStorage.getItem("form-builder-forms")
    const storedQuestions = localStorage.getItem("form-builder-questions")

    if (storedForms && storedQuestions) {
      const parsedForms = JSON.parse(storedForms)
      const parsedQuestions = JSON.parse(storedQuestions)

      // Find the form to preview
      const foundForm = parsedForms.find((f: Form) => f.id === formId)
      if (foundForm) {
        // Get the questions for this form
        const formQuestions = foundForm.questions
          .map((questionId: string) => parsedQuestions.find((q: Question) => q.id === questionId))
          .filter(Boolean)

        // Create the form with questions
        setFormWithQuestions({
          ...foundForm,
          createdAt: new Date(foundForm.createdAt),
          updatedAt: new Date(foundForm.updatedAt),
          questions: formQuestions,
        })
      } else {
        // Form not found, redirect back to forms list
        router.push("/unsupervised-app/admin/organisations/forms/forms")
      }
    }
  }, [formId, router])

  if (!formWithQuestions) {
    return <div className="container py-8">Loading...</div>
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Form Preview</h1>
        <p className="text-muted-foreground">This is how your form will appear to users.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <FormRenderer
            form={formWithQuestions}
            onSubmit={(values) => {
              console.log("Form submitted with values:", values)
              // In a real application, you'd save the responses to a database
            }}
          />
        </div>
        <div className="md:col-span-1">
          <ExperienceProgress />
        </div>
      </div>
    </div>
  )
}
