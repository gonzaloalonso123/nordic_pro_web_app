export type InputType =
  | "text"
  | "number"
  | "emoji"
  | "slider"
  | "yesno"
  | "multiple";

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface EmojiOption {
  id: string;
  emoji: string;
  value: number;
  label?: string;
}

export interface Question {
  id: string;
  category: string;
  question: string;
  inputType: InputType;
  required: boolean;
  description?: string;
  options?: QuestionOption[]; // For multiple choice questions
  emojiOptions?: EmojiOption[]; // For emoji questions
  min?: number; // For slider or number
  max?: number; // For slider or number
  step?: number; // For slider
  imageUrl?: string; // Image to show with the question
  experience: number; // Experience points earned for answering
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: string[]; // Array of question IDs
  createdAt: Date;
  updatedAt: Date;
  displayMode: "single" | "sequential"; // Display all questions or one at a time
  totalExperience: number; // Total experience points for completing the form
}

export interface FormWithQuestions extends Omit<Form, "questions"> {
  questions: Question[];
}

export interface FormProgress {
  formId: string;
  currentQuestionIndex: number;
  answeredQuestions: string[]; // IDs of answered questions
  completed: boolean;
  earnedExperience: number;
}

export interface UserProfile {
  id: string;
  name?: string;
  totalExperience: number;
  completedForms: string[]; // Array of completed form IDs
}

// Analytics types
export interface FormResponse {
  id: string;
  formId: string;
  userId: string;
  userName?: string;
  answers: Record<string, any>; // questionId -> answer
  submittedAt: Date;
}

export interface AnalyticsFilters {
  formId?: string;
  userId?: string;
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface QuestionAnalytics {
  questionId: string;
  question: string;
  inputType: InputType;
  category: string;
  totalResponses: number;
  responseData: any; // Varies based on question type
}

export interface UserAnalytics {
  userId: string;
  userName: string;
  totalResponses: number;
  completedForms: number;
  averageResponseTime?: number;
  responsesByCategory: Record<string, number>;
}

export interface TimeSeriesDataPoint {
  date: Date;
  value: number;
  label?: string;
}

export interface TimeSeriesAnalytics {
  questionId?: string;
  formId?: string;
  data: TimeSeriesDataPoint[];
}
