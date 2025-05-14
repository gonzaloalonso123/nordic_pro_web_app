import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { formsService } from "@/utils/supabase/services";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";

type FormRow = Tables<"forms">;
type FormInsert = TablesInsert<"forms">;
type FormUpdate = TablesUpdate<"forms">;

// Get all forms
export const useForms = <TData = FormRow[]>(
  options?: Omit<
    UseQueryOptions<FormRow[], Error, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const supabase = createClient();
  return useQuery<FormRow[], Error, TData>({
    queryKey: ["forms"],
    queryFn: () => formsService.getAll(supabase),
    ...options,
  });
};

// Get form by ID
export const useForm = <TData = FormRow>(
  formId: string | undefined,
  options?: Omit<
    UseQueryOptions<FormRow | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<FormRow | null, Error, TData>({
    queryKey: ["forms", formId],
    queryFn: () => (formId ? formsService.getById(supabase, formId) : null),
    enabled: !!formId,
    ...options,
  });
};

// Get forms by creator
export const useFormsByCreator = <TData = FormRow[]>(
  userId: string | undefined,
  options?: Omit<
    UseQueryOptions<FormRow[] | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<FormRow[] | null, Error, TData>({
    queryKey: ["forms", "creator", userId],
    queryFn: () =>
      userId ? formsService.getByCreator(supabase, userId) : null,
    enabled: !!userId,
    ...options,
  });
};

// Get forms by organization
export const useFormsByOrganization = <TData = FormRow[]>(
  organizationId: string | undefined,
  options?: Omit<
    UseQueryOptions<FormRow[] | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<FormRow[] | null, Error, TData>({
    queryKey: ["forms", "organization", organizationId],
    queryFn: () =>
      organizationId
        ? formsService.getByOrganization(supabase, organizationId)
        : null,
    enabled: !!organizationId,
    ...options,
  });
};

// Get form with questions
export const useFormWithQuestions = <TData = Tables<"forms">>(
  formId: string | undefined,
  options?: Omit<
    UseQueryOptions<any | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<any | null, Error, TData>({
    queryKey: ["forms", formId, "questions"],
    queryFn: () =>
      formId ? formsService.getWithQuestions(supabase, formId) : null,
    enabled: !!formId,
    ...options,
  });
};

// Get form responses
export const useFormResponses = <TData = any[]>(
  formId: string | undefined,
  organizationId?: string,
  options?: Omit<
    UseQueryOptions<any[] | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["forms", formId, "responses", organizationId],
    queryFn: () =>
      formId
        ? formsService.getResponses(supabase, formId, organizationId)
        : null,
    enabled: !!formId,
    ...options,
  });
};

export const useCreateForm = (
  options?: Omit<UseMutationOptions<FormRow, Error, FormInsert>, "mutationFn">
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<FormRow, Error, FormInsert & { question_ids: string[] }>({
    mutationFn: (form: FormInsert & { question_ids: string[] }) =>
      formsService.create(supabase, form),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Update form mutation
export const useUpdateForm = (
  options?: Omit<
    UseMutationOptions<FormRow, Error, { formId: string; updates: FormUpdate }>,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    FormRow,
    Error,
    { formId: string; updates: FormUpdate & { question_ids: string[] } }
  >({
    mutationFn: ({ formId, updates }) =>
      formsService.update(supabase, formId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["forms", variables.formId] });
      queryClient.invalidateQueries({
        queryKey: ["forms", variables.formId, "questions"],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Delete form mutation
export const useDeleteForm = (
  options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (formId: string) => formsService.delete(supabase, formId),
    onSuccess: (data, formId, context) => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["forms", formId] });
      options?.onSuccess?.(data, formId, context);
    },
    ...options,
  });
};

// Add questions to form mutation
export const useAddQuestionsToForm = (
  options?: Omit<
    UseMutationOptions<
      boolean,
      Error,
      { formId: string; question_ids: string[] }
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    boolean,
    Error,
    { formId: string; question_ids: string[] }
  >({
    mutationFn: ({ formId, question_ids }) =>
      formsService.addQuestions(supabase, formId, question_ids),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["forms", variables.formId, "questions"],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Remove question from form mutation
export const useRemoveQuestionFromForm = (
  options?: Omit<
    UseMutationOptions<boolean, Error, { formId: string; questionId: string }>,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { formId: string; questionId: string }>({
    mutationFn: ({ formId, questionId }) =>
      formsService.removeQuestion(supabase, formId, questionId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["forms", variables.formId, "questions"],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateQuestionOrder = (
  options?: Omit<
    UseMutationOptions<
      boolean,
      Error,
      {
        formId: string;
        questionOrders: { questionId: string; order: number }[];
      }
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    boolean,
    Error,
    { formId: string; questionOrders: { questionId: string; order: number }[] }
  >({
    mutationFn: ({ formId, questionOrders }) =>
      formsService.updateQuestionOrder(supabase, formId, questionOrders),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["forms", variables.formId, "questions"],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
