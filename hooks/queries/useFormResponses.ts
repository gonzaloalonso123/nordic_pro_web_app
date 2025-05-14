import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";
import { formResponsesService } from "@/utils/supabase/services/forms-responses";

type FormResponseRow = Tables<"form_responses">;

// Get responses by form
export const useFormResponses = <TData = any[]>(
  formId: string | undefined,
  options?: Omit<
    UseQueryOptions<any[] | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["form-responses", "form", formId],
    queryFn: () =>
      formId ? formResponsesService.getByForm(supabase, formId) : null,
    enabled: !!formId,
    ...options,
  });
};

// Get responses by organization
export const useResponsesByOrganization = <TData = any[]>(
  organizationId: string | undefined,
  options?: Omit<
    UseQueryOptions<any[] | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["form-responses", "organization", organizationId],
    queryFn: () =>
      organizationId
        ? formResponsesService.getByOrganization(supabase, organizationId)
        : null,
    enabled: !!organizationId,
    ...options,
  });
};

// Get responses by user
export const useResponsesByUser = <TData = any[]>(
  userId: string | undefined,
  options?: Omit<
    UseQueryOptions<any[] | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["form-responses", "user", userId],
    queryFn: () =>
      userId ? formResponsesService.getByUser(supabase, userId) : null,
    enabled: !!userId,
    ...options,
  });
};

// Get response by ID
export const useResponse = <TData = any>(
  responseId: string | undefined,
  options?: Omit<
    UseQueryOptions<any | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<any | null, Error, TData>({
    queryKey: ["form-responses", responseId],
    queryFn: () =>
      responseId ? formResponsesService.getById(supabase, responseId) : null,
    enabled: !!responseId,
    ...options,
  });
};

// Get form analytics
export const useFormAnalytics = <TData = any>(
  formId: string | undefined,
  organizationId?: string,
  options?: Omit<
    UseQueryOptions<any | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<any | null, Error, TData>({
    queryKey: ["form-analytics", formId, organizationId],
    queryFn: () =>
      formId
        ? formResponsesService.getAnalytics(supabase, formId, organizationId)
        : null,
    enabled: !!formId,
    ...options,
  });
};

// Get user analytics
export const useUserAnalytics = <TData = any>(
  userId: string | undefined,
  options?: Omit<
    UseQueryOptions<any | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<any | null, Error, TData>({
    queryKey: ["user-analytics", userId],
    queryFn: () =>
      userId ? formResponsesService.getUserAnalytics(supabase, userId) : null,
    enabled: !!userId,
    ...options,
  });
};

// Submit form response mutation
export const useSubmitFormResponse = (
  options?: Omit<
    UseMutationOptions<
      FormResponseRow,
      Error,
      {
        formId: string;
        userId: string;
        organizationId: string;
        answers: Record<string, any>;
        earnedExperience: number;
      }
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    FormResponseRow,
    Error,
    {
      formId: string;
      userId: string;
      organizationId: string;
      answers: Record<string, any>;
      earnedExperience: number;
    }
  >({
    mutationFn: ({
      formId,
      userId,
      organizationId,
      answers,
      earnedExperience,
    }) =>
      formResponsesService.submit(
        supabase,
        formId,
        userId,
        organizationId,
        answers,
        earnedExperience
      ),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["form-responses", "form", variables.formId],
      });
      queryClient.invalidateQueries({
        queryKey: ["form-responses", "user", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["form-responses", "organization", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["form-analytics", variables.formId],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-analytics", variables.userId],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Delete form response mutation
export const useDeleteFormResponse = (
  options?: Omit<
    UseMutationOptions<
      boolean,
      Error,
      { responseId: string; formId: string; userId: string }
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    boolean,
    Error,
    { responseId: string; formId: string; userId: string }
  >({
    mutationFn: ({ responseId }) =>
      formResponsesService.delete(supabase, responseId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["form-responses", variables.responseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["form-responses", "form", variables.formId],
      });
      queryClient.invalidateQueries({
        queryKey: ["form-responses", "user", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["form-analytics", variables.formId],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
