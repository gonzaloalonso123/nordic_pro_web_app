"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import QuestionForm from "@/components/form-builder/question-manager/question-form"
import type { Question } from "@/components/form-builder/types"

export default function EditQuestionPage() {
  const params = useParams()
  const router = useRouter()
  const questionId = params.id as string

  const [question, setQuestion] = useState<Question | null>(null)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    // Load questions from localStorage
    const storedQuestions = localStorage.getItem("form-builder-questions")
    if (storedQuestions) {
      const parsedQuestions = JSON.parse(storedQuestions)

      // Find the question to edit
      const foundQuestion = parsedQuestions.find((q: Question) => q.id === questionId)
      if (foundQuestion) {
        setQuestion(foundQuestion)
      } else {
        // Question not found, redirect back to questions list
        router.push("/questions")
      }

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(parsedQuestions.map((q: Question) => q.category)))
      setCategories(uniqueCategories as string[])
    }
  }, [questionId, router])

  const handleSaveQuestion = async (updatedQuestion: Question) => {
    // Load existing questions
    const storedQuestions = localStorage.getItem("form-builder-questions")
    if (storedQuestions) {
      const parsedQuestions = JSON.parse(storedQuestions)

      // Update the question
      const updatedQuestions = parsedQuestions.map((q: Question) => (q.id === questionId ? updatedQuestion : q))

      // Save to localStorage
      localStorage.setItem("form-builder-questions", JSON.stringify(updatedQuestions))
    }

    return Promise.resolve()
  }

  if (!question) {
    return <div className="container py-8">Loading...</div>
  }

  return (
    <div className="container py-8">
      <QuestionForm initialQuestion={question} categories={categories} onSave={handleSaveQuestion} />
    </div>
  )
}
