"use client"

import { useEffect, useState } from "react"
import QuestionList from "@/components/form-builder/question-manager/question-list"
import type { Question } from "@/components/form-builder/types"

export default function QuestionsPage() {
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

  const handleDeleteQuestion = async (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id)
    setQuestions(updatedQuestions)
    localStorage.setItem("form-builder-questions", JSON.stringify(updatedQuestions))

    // Update categories
    const uniqueCategories = Array.from(new Set(updatedQuestions.map((q) => q.category)))
    setCategories(uniqueCategories as string[])

    return Promise.resolve()
  }

  return (
    <div className="container py-8">
      <QuestionList questions={questions} categories={categories} onDelete={handleDeleteQuestion} />
    </div>
  )
}
