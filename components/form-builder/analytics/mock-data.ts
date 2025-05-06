import type { FormResponse, UserProfile, Question, Form } from "../types"
import { v4 as uuidv4 } from "uuid"

// Generate random date within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Generate mock users
export const generateMockUsers = (count: number): UserProfile[] => {
  const userNames = [
    "Alex Johnson",
    "Taylor Smith",
    "Jordan Williams",
    "Casey Brown",
    "Morgan Davis",
    "Riley Wilson",
    "Jamie Miller",
    "Avery Moore",
    "Quinn Taylor",
    "Jordan Anderson",
    "Skyler Thomas",
    "Drew Jackson",
    "Reese White",
    "Cameron Harris",
    "Dakota Martin",
    "Hayden Thompson",
    "Parker Garcia",
    "Jordan Martinez",
    "Peyton Robinson",
    "Charlie Clark",
  ]

  return Array.from({ length: count }).map((_, index) => ({
    id: `user-${index + 1}`,
    name: userNames[index],
    totalExperience: Math.floor(Math.random() * 1000) + 100,
    completedForms: [],
  }))
}

// Generate mock responses for a form
export const generateMockResponses = (
  form: Form,
  questions: Question[],
  users: UserProfile[],
  count: number,
): FormResponse[] => {
  const startDate = new Date(2023, 0, 1) // Jan 1, 2023
  const endDate = new Date() // Current date

  const responses: FormResponse[] = []

  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const answers: Record<string, any> = {}

    // Generate answers for each question
    form.questions.forEach((questionId) => {
      const question = questions.find((q) => q.id === questionId)
      if (!question) return

      switch (question.inputType) {
        case "text":
          answers[questionId] = generateRandomText()
          break
        case "number":
          const min = question.min || 0
          const max = question.max || 100
          answers[questionId] = Math.floor(Math.random() * (max - min + 1)) + min
          break
        case "emoji":
          if (question.emojiOptions && question.emojiOptions.length > 0) {
            const option = question.emojiOptions[Math.floor(Math.random() * question.emojiOptions.length)]
            answers[questionId] = { emoji: option.emoji, value: option.value }
          } else {
            const emojis = ["😀", "😊", "🙂", "😐", "😕", "😢", "😡"]
            answers[questionId] = emojis[Math.floor(Math.random() * emojis.length)]
          }
          break
        case "slider":
          const sliderMin = question.min || 0
          const sliderMax = question.max || 100
          answers[questionId] = Math.floor(Math.random() * (sliderMax - sliderMin + 1)) + sliderMin
          break
        case "yesno":
          answers[questionId] = Math.random() > 0.5
          break
        case "multiple":
          if (question.options && question.options.length > 0) {
            // Select 1-3 random options
            const numSelected = Math.floor(Math.random() * 3) + 1
            const selectedOptions = []
            const availableOptions = [...question.options]

            for (let j = 0; j < Math.min(numSelected, availableOptions.length); j++) {
              const index = Math.floor(Math.random() * availableOptions.length)
              selectedOptions.push(availableOptions[index].value)
              availableOptions.splice(index, 1)
            }

            answers[questionId] = selectedOptions
          }
          break
      }
    })

    // Add to user's completed forms if not already there
    if (!user.completedForms.includes(form.id)) {
      user.completedForms.push(form.id)
    }

    responses.push({
      id: uuidv4(),
      formId: form.id,
      userId: user.id,
      userName: user.name,
      answers,
      submittedAt: randomDate(startDate, endDate),
    })
  }

  // Sort by date
  return responses.sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime())
}

// Helper to generate random text
const generateRandomText = (): string => {
  const responses = [
    "This was a great experience!",
    "I found this quite challenging.",
    "Interesting questions, made me think.",
    "Could use some improvements.",
    "Very well designed survey.",
    "The questions were clear and concise.",
    "I enjoyed participating in this.",
    "Some questions were confusing.",
    "Looking forward to more surveys like this.",
    "The interface was user-friendly.",
    "I had some technical issues.",
    "Very relevant to my interests.",
    "Too many questions for my liking.",
    "The experience points system is motivating.",
    "I learned something new from this.",
    "Would recommend to others.",
    "The images helped clarify the questions.",
    "Some options didn't quite fit my situation.",
    "Very thorough and comprehensive.",
    "Quick and easy to complete.",
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

// Load or generate mock data
export const loadMockData = (
  form: Form,
  questions: Question[],
): {
  users: UserProfile[]
  responses: FormResponse[]
} => {
  // Check if we already have mock data in localStorage
  const storedUsers = localStorage.getItem("mock-users")
  const storedResponses = localStorage.getItem(`mock-responses-${form.id}`)

  if (storedUsers && storedResponses) {
    return {
      users: JSON.parse(storedUsers),
      responses: JSON.parse(storedResponses).map((r: any) => ({
        ...r,
        submittedAt: new Date(r.submittedAt),
      })),
    }
  }

  // Generate new mock data
  const users = generateMockUsers(20)
  const responses = generateMockResponses(form, questions, users, 200)

  // Store in localStorage for future use
  localStorage.setItem("mock-users", JSON.stringify(users))
  localStorage.setItem(`mock-responses-${form.id}`, JSON.stringify(responses))

  return { users, responses }
}
