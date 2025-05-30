import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { organisationsInvitationService } from "@/utils/supabase/services";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";

type OrganisationInvitationRow = Tables<"organisations_invitation">;
type OrganisationInvitationInsert = TablesInsert<"organisations_invitation">;
type OrganisationInvitationUpdate = TablesUpdate<"organisations_invitation">;

// Get all invitations
export const useOrganisationsInvitations = <
  TData = OrganisationInvitationRow[],
>(
  options?: Omit<
    UseQueryOptions<OrganisationInvitationRow[], Error, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const supabase = createClient();
  return useQuery<OrganisationInvitationRow[], Error, TData>({
    queryKey: ["organisations_invitation"],
    queryFn: () => organisationsInvitationService.getAll(supabase),
    ...options,
  });
};

export const useOrganisationInvitation = <TData = OrganisationInvitationRow>(
  invitationId: string | undefined,
  options?: Omit<
    UseQueryOptions<OrganisationInvitationRow | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<OrganisationInvitationRow | null, Error, TData>({
    queryKey: ["organisations_invitation", invitationId],
    queryFn: () =>
      invitationId
        ? organisationsInvitationService.getById(supabase, invitationId)
        : null,
    enabled: !!invitationId,
    ...options,
  });
};

// Get invitations by organisation
export const useOrganisationInvitationsByOrganisation = <
  TData = OrganisationInvitationRow[],
>(
  organisationId: string | undefined,
  options?: Omit<
    UseQueryOptions<OrganisationInvitationRow[] | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<OrganisationInvitationRow[] | null, Error, TData>({
    queryKey: ["organisations_invitation", "organisation", organisationId],
    queryFn: () =>
      organisationId
        ? organisationsInvitationService.getByOrganisation(
            supabase,
            organisationId
          )
        : null,
    enabled: !!organisationId,
    ...options,
  });
};

// Get invitations by email
export const useOrganisationInvitationsByEmail = <
  TData = OrganisationInvitationRow[],
>(
  email: string | undefined,
  options?: Omit<
    UseQueryOptions<OrganisationInvitationRow[] | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<OrganisationInvitationRow[] | null, Error, TData>({
    queryKey: ["organisations_invitation", "email", email],
    queryFn: () =>
      email ? organisationsInvitationService.getByEmail(supabase, email) : null,
    enabled: !!email,
    ...options,
  });
};

// Create invitation mutation
export const useCreateOrganisationInvitation = (
  options?: Omit<
    UseMutationOptions<
      OrganisationInvitationRow,
      Error,
      Omit<OrganisationInvitationInsert, "id">
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    OrganisationInvitationRow,
    Error,
    Omit<OrganisationInvitationInsert, "id">
  >({
    mutationFn: (invitation) =>
      organisationsInvitationService.create(supabase, invitation),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["organisations_invitation"] });
      queryClient.invalidateQueries({
        queryKey: [
          "organisations_invitation",
          "organisation",
          data.organisation_id,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["organisations_invitation", "email", data.user_email],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateOrganisationInvitation = (
  options?: Omit<
    UseMutationOptions<
      OrganisationInvitationRow,
      Error,
      { invitationId: string; updates: OrganisationInvitationUpdate }
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    OrganisationInvitationRow,
    Error,
    { invitationId: string; updates: OrganisationInvitationUpdate }
  >({
    mutationFn: ({ invitationId, updates }) =>
      organisationsInvitationService.update(supabase, invitationId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["organisations_invitation"] });
      queryClient.invalidateQueries({
        queryKey: ["organisations_invitation", variables.invitationId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "organisations_invitation",
          "organisation",
          data.organisation_id,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["organisations_invitation", "email", data.user_email],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Delete invitation mutation
export const useDeleteOrganisationInvitation = (
  options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (invitationId: string) =>
      organisationsInvitationService.deleteInvitation(supabase, invitationId),
    onSuccess: (data, invitationId, context) => {
      queryClient.invalidateQueries({ queryKey: ["organisations_invitation"] });
      queryClient.invalidateQueries({
        queryKey: ["organisations_invitation", invitationId],
      });
      options?.onSuccess?.(data, invitationId, context);
    },
    ...options,
  });
};

export const useAcceptOrganisationInvitation = (
  options?: Omit<
    UseMutationOptions<
      boolean,
      Error,
      { invitationId: string; userId: string }
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { invitationId: string; userId: string }>({
    mutationFn: ({ invitationId, userId }) =>
      organisationsInvitationService.acceptInvitation(
        supabase,
        invitationId,
        userId
      ),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["organisations_invitation"] });
      queryClient.invalidateQueries({
        queryKey: ["organisations_invitation", variables.invitationId],
      });
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useQrCodeInvitationAccept = (
  options?: Omit<
    UseMutationOptions<boolean, Error, { userId: string; teamId: string }>,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  return useMutation<boolean, Error, { userId: string; teamId: string }>({
    mutationFn: ({ userId, teamId }) =>
      organisationsInvitationService.qrTypeInvitationAccept(
        supabase,
        userId,
        teamId
      ),
    ...options,
  });
};

export const useRejectOrganisationInvitation = (
  options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (invitationId: string) =>
      organisationsInvitationService.rejectInvitation(supabase, invitationId),
    onSuccess: (data, invitationId, context) => {
      queryClient.invalidateQueries({ queryKey: ["organisations_invitation"] });
      queryClient.invalidateQueries({
        queryKey: ["organisations_invitation", invitationId],
      });
      options?.onSuccess?.(data, invitationId, context);
    },
    ...options,
  });
};
