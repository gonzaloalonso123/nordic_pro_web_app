"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import FormBuilder from "@/components/form-builder/form-manager/form-builder"
import type { Form, Question } from "@/components/form-builder/types"

export default function EditFormPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.id as string

  const [form, setForm] = useState<Form | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    // Load forms from localStorage
    const storedForms = localStorage.getItem("form-builder-forms")
    if (storedForms) {
      const parsedForms = JSON.parse(storedForms)

      // Find the form to edit
      const foundForm = parsedForms.find((f: Form) => f.id === formId)
      if (foundForm) {
        // Convert date strings back to Date objects
        setForm({
          ...foundForm,
          createdAt: new Date(foundForm.createdAt),
          updatedAt: new Date(foundForm.updatedAt),
        })
      } else {
        // Form not found, redirect back to forms list
        router.push("/unsupervised-app/admin/organisations/forms/forms")
      }
    }

    // Load questions from localStorage
    const storedQuestions = localStorage.getItem("form-builder-questions")
    if (storedQuestions) {
      const parsedQuestions = JSON.parse(storedQuestions)
      setQuestions(parsedQuestions)

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(parsedQuestions.map((q: Question) => q.category)))
      setCategories(uniqueCategories as string[])
    }
  }, [formId, router])

  const handleSaveForm = async (updatedForm: Form) => {
    // Load existing forms
    const storedForms = localStorage.getItem("form-builder-forms")
    if (storedForms) {
      const parsedForms = JSON.parse(storedForms)

      // Update the form
      const updatedForms = parsedForms.map((f: Form) => (f.id === formId ? updatedForm : f))

      // Save to localStorage
      localStorage.setItem("form-builder-forms", JSON.stringify(updatedForms))
    }

    return Promise.resolve()
  }

  if (!form) {
    return <div className="container py-8">Loading...</div>
  }

  return (
    <div className="container py-8">
      <FormBuilder initialForm={form} questions={questions} categories={categories} onSave={handleSaveForm} />
    </div>
  )
}
