"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { createClient, supabase } from "@/utils/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";
import { formInvitationsService } from "@/utils/supabase/services/form-invitations";

type FormInvitationRow = Tables<"form_invitations">;
type FormInvitationInsert = TablesInsert<"form_invitations">;
type FormInvitationUpdate = TablesUpdate<"form_invitations">;

// Queries
export const useFormInvitations = <TData = FormInvitationRow[]>(
  options?: Omit<UseQueryOptions<FormInvitationRow[], Error, TData>, "queryKey" | "queryFn">
) => {
  return useQuery<FormInvitationRow[], Error, TData>({
    queryKey: ["form_invitations"],
    queryFn: () => formInvitationsService.getAll(supabase),
    ...options,
  });
};

export const useFormInvitation = <TData = FormInvitationRow>(
  invitationId: string,
  options?: Omit<UseQueryOptions<FormInvitationRow | null, Error, TData>, "queryKey" | "queryFn">
) => {
  return useQuery<FormInvitationRow | null, Error, TData>({
    queryKey: ["form_invitations", invitationId],
    queryFn: () => formInvitationsService.getById(supabase, invitationId),
    ...options,
  });
};

export const useFormInvitationsByForm = <TData = FormInvitationRow[]>(
  formId: string,
  options?: Omit<UseQueryOptions<FormInvitationRow[], Error, TData>, "queryKey" | "queryFn">
) => {
  return useQuery<FormInvitationRow[], Error, TData>({
    queryKey: ["form_invitations", "form", formId],
    queryFn: () => formInvitationsService.getByForm(supabase, formId),
    ...options,
  });
};

export const useFormInvitationsByUser = <TData = FormInvitationRow[]>(
  userId: string,
  options?: Omit<UseQueryOptions<FormInvitationRow[], Error, TData>, "queryKey" | "queryFn">
) => {
  return useQuery<FormInvitationRow[], Error, TData>({
    queryKey: ["form_invitations", "user", userId],
    enabled: !!userId,
    queryFn: () => formInvitationsService.getByUser(supabase, userId),
    ...options,
  });
};

export const useFormInvitationsByTeam = <TData = FormInvitationRow[]>(
  teamId: string,
  options?: Omit<UseQueryOptions<FormInvitationRow[], Error, TData>, "queryKey" | "queryFn">
) => {
  return useQuery<FormInvitationRow[], Error, TData>({
    queryKey: ["form_invitations", "team", teamId],
    queryFn: () => formInvitationsService.getWithFormByTeam(supabase, teamId),
    ...options,
  });
};

export const useFormInvitationByFormAndUser = <TData = FormInvitationRow | null>(
  formId: string,
  userId: string,
  options?: Omit<UseQueryOptions<FormInvitationRow | null, Error, TData>, "queryKey" | "queryFn">
) => {
  return useQuery<FormInvitationRow | null, Error, TData>({
    queryKey: ["form_invitations", "form", formId, "user", userId],
    queryFn: () => formInvitationsService.getByFormAndUser(supabase, formId, userId),
    ...options,
  });
};

// Mutations
export const useCreateFormInvitation = (
  options?: Omit<UseMutationOptions<FormInvitationRow, Error, FormInvitationInsert>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<FormInvitationRow, Error, FormInvitationInsert>({
    mutationFn: (invitation) => formInvitationsService.create(supabase, invitation),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["form_invitations"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateFormInvitation = (
  options?: Omit<
    UseMutationOptions<FormInvitationRow, Error, { id: string; updates: FormInvitationUpdate }>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<FormInvitationRow, Error, { id: string; updates: FormInvitationUpdate }>({
    mutationFn: ({ id, updates }) => formInvitationsService.update(supabase, id, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["form_invitations", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["form_invitations"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useDeleteFormInvitation = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (id) => formInvitationsService.delete(supabase, id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["form_invitations", variables],
      });
      queryClient.invalidateQueries({ queryKey: ["form_invitations"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useBulkCreateFormInvitations = (
  options?: Omit<UseMutationOptions<FormInvitationRow[], Error, FormInvitationInsert[]>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<FormInvitationRow[], Error, FormInvitationInsert[]>({
    mutationFn: (invitations) => formInvitationsService.bulkCreate(supabase, invitations),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["form_invitations"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useSendInvitationsToTeam = (
  options?: Omit<UseMutationOptions<FormInvitationRow[], Error, { teamId: string; formId: string }>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  return useMutation<FormInvitationRow[], Error, { teamId: string; formId: string }>({
    mutationFn: ({ teamId, formId }) => formInvitationsService.sendToTeam(supabase, formId, teamId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["form_invitations"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useSendInvitationsToUsers = (
  options?: Omit<UseMutationOptions<FormInvitationRow[], Error, { userIds: string[]; formId: string }>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  return useMutation<FormInvitationRow[], Error, { userIds: string[]; formId: string }>({
    mutationFn: ({ userIds, formId }) => formInvitationsService.sendToMembers(supabase, formId, userIds),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["form_invitations"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
