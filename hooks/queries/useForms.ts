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
} from "@/utils/database.types";
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

// Get forms by user
export const useFormsByUser = <TData = FormRow[]>(
  userId: string | undefined,
  options?: Omit<
    UseQueryOptions<FormRow[] | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<FormRow[] | null, Error, TData>({
    queryKey: ["forms", "user", userId],
    queryFn: () => (userId ? formsService.getByUser(supabase, userId) : null),
    enabled: !!userId,
    ...options,
  });
};

// Get forms by event
export const useFormsByEvent = <TData = FormRow[]>(
  eventId: string | undefined,
  options?: Omit<
    UseQueryOptions<FormRow[] | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<FormRow[] | null, Error, TData>({
    queryKey: ["forms", "event", eventId],
    queryFn: () =>
      eventId ? formsService.getByEvent(supabase, eventId) : null,
    enabled: !!eventId,
    ...options,
  });
};

// Create form mutation
export const useCreateForm = (
  options?: Omit<UseMutationOptions<FormRow, Error, FormInsert>, "mutationFn">
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<FormRow, Error, FormInsert>({
    mutationFn: (form: FormInsert) => formsService.create(supabase, form),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({
        queryKey: ["forms", "user", data.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["forms", "event", data.event_id],
      });
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

  return useMutation<FormRow, Error, { formId: string; updates: FormUpdate }>({
    mutationFn: ({ formId, updates }) =>
      formsService.update(supabase, formId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["forms", variables.formId] });
      queryClient.invalidateQueries({
        queryKey: ["forms", "user", data.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["forms", "event", data.event_id],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Soft delete form mutation
export const useSoftDeleteForm = (
  options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (formId: string) => formsService.softDelete(supabase, formId),
    onSuccess: (data, formId, context) => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["forms", formId] });
      options?.onSuccess?.(data, formId, context);
    },
    ...options,
  });
};

// Hard delete form mutation
export const useHardDeleteForm = (
  options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (formId: string) => formsService.hardDelete(supabase, formId),
    onSuccess: (data, formId, context) => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["forms", formId] });
      options?.onSuccess?.(data, formId, context);
    },
    ...options,
  });
};
