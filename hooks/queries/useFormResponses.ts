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

export const useSubmitFormResponse = (
  options?: Omit<
    UseMutationOptions<
      FormResponseRow,
      Error,
      {
        formId: string;
        answers: Record<string, any>;
        earnedExperience: number;
        invitationId: string;
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
      invitationId: string;
      userId: string;
      answers: Record<string, any>;
      earnedExperience: number;
    }
  >({
    mutationFn: ({ formId, answers, earnedExperience, invitationId }) =>
      formResponsesService.submit(
        supabase,
        invitationId,
        formId,
        answers,
        earnedExperience
      ),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["form-responses", "form", variables.formId],
      });
      queryClient.invalidateQueries({
        queryKey: ["form-analytics", variables.formId],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", variables.userId],
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

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
