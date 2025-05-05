"use client"

import { useEffect, useState } from "react"
import FormBuilder from "@/components/form-builder/form-manager/form-builder"
import type { Form, Question } from "@/components/form-builder/types"

export default function CreateFormPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    // Load questions from localStorage
    const storedQuestions = localStorage.getItem("form-builder-questions")
    if (storedQuestions) {
      const parsedQuestions = JSON.parse(storedQuestions)
      setQuestions(parsedQuestions)

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(parsedQuestions.map((q: Question) => q.category)))
      setCategories(uniqueCategories as string[])
    }
  }, [])

  const handleSaveForm = async (form: Form) => {
    // Load existing forms
    const storedForms = localStorage.getItem("form-builder-forms")
    const existingForms = storedForms ? JSON.parse(storedForms) : []

    // Add new form
    const updatedForms = [...existingForms, form]

    // Save to localStorage
    localStorage.setItem("form-builder-forms", JSON.stringify(updatedForms))

    return Promise.resolve()
  }

  return (
    <div className="container py-8">
      <FormBuilder questions={questions} categories={categories} onSave={handleSaveForm} />
    </div>
  )
}
