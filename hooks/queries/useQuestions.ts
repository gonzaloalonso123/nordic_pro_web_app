import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";
import { questionsService } from "@/utils/supabase/services/questions";

type QuestionRow = Tables<"questions">;
type QuestionInsert = TablesInsert<"questions">;
type QuestionUpdate = TablesUpdate<"questions">;
type QuestionOptionInsert = TablesInsert<"question_options">;
type EmojiOptionInsert = TablesInsert<"emoji_options">;

// Get all questions
export const useQuestions = <TData = QuestionRow[]>(
  options?: Omit<
    UseQueryOptions<QuestionRow[], Error, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const supabase = createClient();
  return useQuery<QuestionRow[], Error, TData>({
    queryKey: ["questions"],
    queryFn: () => questionsService.getAll(supabase),
    ...options,
  });
};

// Get question by ID
export const useQuestion = <TData = any>(
  questionId: string | undefined,
  options?: Omit<
    UseQueryOptions<any | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<any | null, Error, TData>({
    queryKey: ["questions", questionId],
    queryFn: () =>
      questionId ? questionsService.getById(supabase, questionId) : null,
    enabled: !!questionId,
    ...options,
  });
};

// Get questions by category
export const useQuestionsByCategory = <TData = QuestionRow[]>(
  categoryId: string | undefined,
  options?: Omit<
    UseQueryOptions<QuestionRow[] | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<QuestionRow[] | null, Error, TData>({
    queryKey: ["questions", "category", categoryId],
    queryFn: () =>
      categoryId ? questionsService.getByCategory(supabase, categoryId) : null,
    enabled: !!categoryId,
    ...options,
  });
};

// Get questions by creator
export const useQuestionsByCreator = <TData = QuestionRow[]>(
  userId: string | undefined,
  options?: Omit<
    UseQueryOptions<QuestionRow[] | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<QuestionRow[] | null, Error, TData>({
    queryKey: ["questions", "creator", userId],
    queryFn: () =>
      userId ? questionsService.getByCreator(supabase, userId) : null,
    enabled: !!userId,
    ...options,
  });
};

// Get all categories
export const useCategories = <TData = any[]>(
  options?: Omit<UseQueryOptions<any[], Error, TData>, "queryKey" | "queryFn">
) => {
  const supabase = createClient();
  return useQuery<any[], Error, TData>({
    queryKey: ["categories"],
    queryFn: () => questionsService.getCategories(supabase),
    ...options,
  });
};

// Create question mutation
export const useCreateQuestion = (
  options?: Omit<
    UseMutationOptions<
      any,
      Error,
      {
        question: QuestionInsert;
        options?: {
          questionOptions?: QuestionOptionInsert[];
          emojiOptions?: EmojiOptionInsert[];
        };
      }
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    {
      question: QuestionInsert;
      options?: {
        questionOptions?: QuestionOptionInsert[];
        emojiOptions?: EmojiOptionInsert[];
      };
    }
  >({
    mutationFn: ({ question, options }) =>
      questionsService.create(supabase, question, options),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Update question mutation
export const useUpdateQuestion = (
  options?: Omit<
    UseMutationOptions<
      any,
      Error,
      {
        questionId: string;
        updates: QuestionUpdate;
        options?: {
          questionOptions?: QuestionOptionInsert[];
          emojiOptions?: EmojiOptionInsert[];
        };
      }
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    {
      questionId: string;
      updates: QuestionUpdate;
      options?: {
        questionOptions?: QuestionOptionInsert[];
        emojiOptions?: EmojiOptionInsert[];
      };
    }
  >({
    mutationFn: ({ questionId, updates, options }) =>
      questionsService.update(supabase, questionId, updates, options),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({
        queryKey: ["questions", variables.questionId],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Delete question mutation
export const useDeleteQuestion = (
  options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (questionId: string) =>
      questionsService.delete(supabase, questionId),
    onSuccess: (data, questionId, context) => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["questions", questionId] });
      options?.onSuccess?.(data, questionId, context);
    },
    ...options,
  });
};

// Create category mutation
export const useCreateCategory = (
  options?: Omit<UseMutationOptions<any, Error, string>, "mutationFn">
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: (name: string) =>
      questionsService.createCategory(supabase, name),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
