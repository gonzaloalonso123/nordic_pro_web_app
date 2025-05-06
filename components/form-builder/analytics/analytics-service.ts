import type {
  FormResponse,
  Question,
  QuestionAnalytics,
  UserAnalytics,
  TimeSeriesAnalytics,
  AnalyticsFilters,
  Form,
} from "../types"
import { loadMockData } from "./mock-data"

// Process responses for a specific question
export const analyzeQuestion = (
  question: Question,
  responses: FormResponse[],
  filters?: AnalyticsFilters,
): QuestionAnalytics => {
  // Filter responses based on filters
  let filteredResponses = responses

  if (filters) {
    if (filters.userId) {
      filteredResponses = filteredResponses.filter((r) => r.userId === filters.userId)
    }

    if (filters.dateRange) {
      filteredResponses = filteredResponses.filter(
        (r) => r.submittedAt >= filters.dateRange!.start && r.submittedAt <= filters.dateRange!.end,
      )
    }
  }

  // Get answers for this question
  const answers = filteredResponses
    .map((response) => response.answers[question.id])
    .filter((answer) => answer !== undefined)

  let responseData: any

  switch (question.inputType) {
    case "text":
      // For text, create a frequency map of words
      responseData = analyzeTextResponses(answers as string[])
      break

    case "number":
    case "slider":
      // For numbers, calculate distribution and statistics
      responseData = analyzeNumericResponses(answers as number[])
      break

    case "emoji":
      // For emojis, count frequency of each emoji
      responseData = analyzeEmojiResponses(answers)
      break

    case "yesno":
      // For yes/no, count true/false
      responseData = {
        yes: answers.filter((a) => a === true).length,
        no: answers.filter((a) => a === false).length,
      }
      break

    case "multiple":
      // For multiple choice, count frequency of each option
      responseData = analyzeMultipleChoiceResponses(answers as string[][], question.options || [])
      break

    default:
      responseData = {}
  }

  return {
    questionId: question.id,
    question: question.question,
    inputType: question.inputType,
    category: question.category,
    totalResponses: answers.length,
    responseData,
  }
}

// Analyze text responses
const analyzeTextResponses = (answers: string[]) => {
  // Simple word frequency analysis
  const wordFrequency: Record<string, number> = {}
  const stopWords = ["the", "and", "a", "to", "of", "in", "is", "it", "that", "was", "for", "on", "with", "as", "this"]

  answers.forEach((answer) => {
    if (!answer) return

    const words = answer
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.includes(word))

    words.forEach((word) => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1
    })
  })

  // Sort by frequency
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30) // Top 30 words
    .map(([word, count]) => ({ word, count }))

  return {
    wordFrequency: sortedWords,
    totalWords: answers.reduce((sum, answer) => sum + (answer?.split(/\s+/).length || 0), 0),
    averageLength:
      answers.length > 0 ? answers.reduce((sum, answer) => sum + (answer?.length || 0), 0) / answers.length : 0,
  }
}

// Analyze numeric responses
const analyzeNumericResponses = (answers: number[]) => {
  if (answers.length === 0) return { min: 0, max: 0, average: 0, median: 0, distribution: [] }

  // Sort for calculations
  const sorted = [...answers].sort((a, b) => a - b)

  // Calculate statistics
  const min = sorted[0]
  const max = sorted[sorted.length - 1]
  const sum = sorted.reduce((a, b) => a + b, 0)
  const average = sum / sorted.length
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)]

  // Create distribution buckets
  const bucketCount = Math.min(10, max - min + 1)
  const bucketSize = (max - min) / bucketCount

  const distribution = Array(bucketCount)
    .fill(0)
    .map((_, i) => {
      const bucketMin = min + i * bucketSize
      const bucketMax = min + (i + 1) * bucketSize
      const count = sorted.filter(
        (n) => n >= bucketMin && (i === bucketCount - 1 ? n <= bucketMax : n < bucketMax),
      ).length

      return {
        range: `${bucketMin.toFixed(1)} - ${bucketMax.toFixed(1)}`,
        count,
        percentage: (count / sorted.length) * 100,
      }
    })

  return { min, max, average, median, distribution }
}

// Analyze emoji responses
const analyzeEmojiResponses = (answers: any[]) => {
  const emojiCounts: Record<string, { count: number; value?: number }> = {}
  let valueSum = 0
  let valueCount = 0

  answers.forEach((answer) => {
    if (!answer) return

    // Handle both simple emoji strings and emoji objects with values
    const emoji = typeof answer === "object" ? answer.emoji : answer
    const value = typeof answer === "object" ? answer.value : undefined

    if (!emojiCounts[emoji]) {
      emojiCounts[emoji] = { count: 0, value }
    }

    emojiCounts[emoji].count++

    if (value !== undefined) {
      valueSum += value
      valueCount++
    }
  })

  // Sort by frequency
  const sortedEmojis = Object.entries(emojiCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([emoji, data]) => ({
      emoji,
      count: data.count,
      percentage: (data.count / answers.length) * 100,
      value: data.value,
    }))

  return {
    emojiCounts: sortedEmojis,
    totalResponses: answers.length,
    averageValue: valueCount > 0 ? valueSum / valueCount : undefined,
  }
}

// Analyze multiple choice responses
const analyzeMultipleChoiceResponses = (answers: string[][], options: any[]) => {
  const optionCounts: Record<string, { count: number; label: string }> = {}

  // Initialize counts for all options
  options.forEach((option) => {
    optionCounts[option.value] = { count: 0, label: option.label }
  })

  // Count selections
  answers.forEach((selectedOptions) => {
    if (!selectedOptions) return

    selectedOptions.forEach((option) => {
      if (optionCounts[option]) {
        optionCounts[option].count++
      }
    })
  })

  // Calculate total selections and percentages
  const totalSelections = Object.values(optionCounts).reduce((sum, { count }) => sum + count, 0)
  const totalResponses = answers.length

  const optionStats = Object.entries(optionCounts).map(([value, { count, label }]) => ({
    value,
    label,
    count,
    percentageOfSelections: totalSelections > 0 ? (count / totalSelections) * 100 : 0,
    percentageOfResponses: totalResponses > 0 ? (count / totalResponses) * 100 : 0,
  }))

  // Sort by count
  return {
    options: optionStats.sort((a, b) => b.count - a.count),
    totalSelections,
    totalResponses,
    averageSelectionsPerResponse: totalResponses > 0 ? totalSelections / totalResponses : 0,
  }
}

// Analyze user responses
export const analyzeUser = (userId: string, responses: FormResponse[], questions: Question[]): UserAnalytics => {
  // Filter responses for this user
  const userResponses = responses.filter((r) => r.userId === userId)

  // Count responses by category
  const responsesByCategory: Record<string, number> = {}

  userResponses.forEach((response) => {
    Object.keys(response.answers).forEach((questionId) => {
      const question = questions.find((q) => q.id === questionId)
      if (question) {
        responsesByCategory[question.category] = (responsesByCategory[question.category] || 0) + 1
      }
    })
  })

  // Count unique forms completed
  const completedForms = new Set(userResponses.map((r) => r.formId)).size

  return {
    userId,
    userName: userResponses[0]?.userName || userId,
    totalResponses: userResponses.length,
    completedForms,
    responsesByCategory,
  }
}

// Get time series data for responses
export const getTimeSeriesData = (
  responses: FormResponse[],
  questionId?: string,
  formId?: string,
  interval: "day" | "week" | "month" = "day",
): TimeSeriesAnalytics => {
  // Filter responses
  let filteredResponses = responses

  if (formId) {
    filteredResponses = filteredResponses.filter((r) => r.formId === formId)
  }

  // Group by time interval
  const timeData: Record<string, { count: number; date: Date }> = {}

  filteredResponses.forEach((response) => {
    let dateKey: string
    const date = new Date(response.submittedAt)

    switch (interval) {
      case "day":
        dateKey = date.toISOString().split("T")[0] // YYYY-MM-DD
        break
      case "week":
        // Get the Monday of the week
        const day = date.getDay() || 7 // Convert Sunday (0) to 7
        const diff = date.getDate() - day + 1 // Adjust to Monday
        const monday = new Date(date)
        monday.setDate(diff)
        dateKey = monday.toISOString().split("T")[0]
        break
      case "month":
        dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        break
    }

    if (!timeData[dateKey]) {
      timeData[dateKey] = { count: 0, date: new Date(date) }
    }

    // If looking at a specific question, only count if it was answered
    if (questionId) {
      if (response.answers[questionId] !== undefined) {
        timeData[dateKey].count++
      }
    } else {
      timeData[dateKey].count++
    }
  })

  // Convert to array and sort by date
  const data = Object.entries(timeData)
    .map(([dateKey, { count, date }]) => ({
      date,
      value: count,
      label: dateKey,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  return {
    questionId,
    formId,
    data,
  }
}

// Get analytics for a form
export const getFormAnalytics = (form: Form, questions: Question[], filters?: AnalyticsFilters) => {
  // Load or generate mock data
  const { users, responses } = loadMockData(form, questions)

  // Filter responses based on form ID
  const formResponses = responses.filter((r) => r.formId === form.id)

  // Apply additional filters
  let filteredResponses = formResponses

  if (filters) {
    if (filters.userId) {
      filteredResponses = filteredResponses.filter((r) => r.userId === filters.userId)
    }

    if (filters.category) {
      // For category filtering, we need to find questions in that category
      const categoryQuestionIds = questions.filter((q) => q.category === filters.category).map((q) => q.id)

      // Then filter responses that have answers to those questions
      filteredResponses = filteredResponses.filter((r) =>
        Object.keys(r.answers).some((qId) => categoryQuestionIds.includes(qId)),
      )
    }

    if (filters.dateRange) {
      filteredResponses = filteredResponses.filter(
        (r) => r.submittedAt >= filters.dateRange!.start && r.submittedAt <= filters.dateRange!.end,
      )
    }
  }

  // Get question analytics for each question in the form
  const questionAnalytics = form.questions
    .map((questionId) => {
      const question = questions.find((q) => q.id === questionId)
      if (!question) return null

      return analyzeQuestion(question, filteredResponses, filters)
    })
    .filter(Boolean) as QuestionAnalytics[]

  // Get unique users who responded
  const uniqueUserIds = Array.from(new Set(filteredResponses.map((r) => r.userId)))

  // Get user analytics for each user
  const userAnalytics = uniqueUserIds.map((userId) => analyzeUser(userId, filteredResponses, questions))

  // Get time series data
  const timeSeriesData = getTimeSeriesData(filteredResponses, undefined, form.id)

  return {
    form,
    questionAnalytics,
    userAnalytics,
    timeSeriesData,
    totalResponses: filteredResponses.length,
    uniqueUsers: uniqueUserIds.length,
  }
}
