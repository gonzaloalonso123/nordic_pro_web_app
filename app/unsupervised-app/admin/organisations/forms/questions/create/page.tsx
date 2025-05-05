"use client"

import { useEffect, useState } from "react"
import QuestionForm from "@/components/form-builder/question-manager/question-form"
import type { Question } from "@/components/form-builder/types"

export default function CreateQuestionPage() {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    // Load existing categories from localStorage
    const storedQuestions = localStorage.getItem("form-builder-questions")
    if (storedQuestions) {
      const parsedQuestions = JSON.parse(storedQuestions)
      const uniqueCategories = Array.from(new Set(parsedQuestions.map((q: Question) => q.category)))
      setCategories(uniqueCategories as string[])
    }
  }, [])

  const handleSaveQuestion = async (question: Question) => {
    // Load existing questions
    const storedQuestions = localStorage.getItem("form-builder-questions")
    const existingQuestions = storedQuestions ? JSON.parse(storedQuestions) : []

    // Add new question
    const updatedQuestions = [...existingQuestions, question]

    // Save to localStorage
    localStorage.setItem("form-builder-questions", JSON.stringify(updatedQuestions))

    return Promise.resolve()
  }

  return (
    <div className="container py-8">
      <QuestionForm categories={categories} onSave={handleSaveQuestion} />
    </div>
  )
}
