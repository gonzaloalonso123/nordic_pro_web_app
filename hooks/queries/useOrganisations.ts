import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { organisationsService } from "@/utils/supabase/services";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";
import { supabase } from "@/utils/supabase/client";

type OrganisationRow = Tables<"organisations">;
type OrganisationInsert = TablesInsert<"organisations">;
type OrganisationUpdate = TablesUpdate<"organisations">;

export const useOrganisations = <TData = OrganisationRow[]>(
  options?: Omit<UseQueryOptions<OrganisationRow[], Error, TData>, "queryKey" | "queryFn">
) => {
  return useQuery<OrganisationRow[], Error, TData>({
    queryKey: ["organisations"],
    queryFn: () => organisationsService.getAll(supabase),
    ...options,
  });
};

export const useOrganisation = <TData = OrganisationRow>(
  organisationId: string | undefined,
  options?: Omit<UseQueryOptions<OrganisationRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<OrganisationRow | null, Error, TData>({
    queryKey: ["organisations", organisationId],
    queryFn: () => (organisationId ? organisationsService.getById(supabase, organisationId) : null),
    enabled: !!organisationId,
    ...options,
  });
};

export const useOrganisationsByUser = <TData = OrganisationRow[]>(
  userId: string | undefined,
  options?: Omit<UseQueryOptions<OrganisationRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<OrganisationRow[] | null, Error, TData>({
    queryKey: ["organisations", "user", userId],
    queryFn: () => (userId ? organisationsService.getByUser(supabase, userId) : null),
    enabled: !!userId,
    ...options,
  });
};

export const useOrganisationsByTeam = <TData = OrganisationRow[]>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<OrganisationRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<OrganisationRow[] | null, Error, TData>({
    queryKey: ["organisations", "team", teamId],
    queryFn: () => (teamId ? organisationsService.getByTeam(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  });
};

// Get organisation with teams
export const useOrganisationWithTeams = <TData = any>(
  organisationId: string | undefined,
  options?: Omit<UseQueryOptions<any | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<any | null, Error, TData>({
    queryKey: ["organisations", organisationId, "teams"],
    queryFn: () => (organisationId ? organisationsService.getWithTeams(supabase, organisationId) : null),
    enabled: !!organisationId,
    ...options,
  });
};

// Get organisation with users
export const useOrganisationWithUsers = <TData = any>(
  organisationId: string | undefined,
  options?: Omit<UseQueryOptions<any | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<any | null, Error, TData>({
    queryKey: ["organisations", organisationId, "users"],
    queryFn: () => (organisationId ? organisationsService.getWithUsers(supabase, organisationId) : null),
    enabled: !!organisationId,
    ...options,
  });
};

// Get organisation with calendar
export const useOrganisationWithCalendar = <TData = any>(
  organisationId: string | undefined,
  options?: Omit<UseQueryOptions<any | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<any | null, Error, TData>({
    queryKey: ["organisations", organisationId, "calendar"],
    queryFn: () => (organisationId ? organisationsService.getWithCalendar(supabase, organisationId) : null),
    enabled: !!organisationId,
    ...options,
  });
};

export const useCreateOrganisation = (
  options?: Omit<UseMutationOptions<OrganisationRow, Error, OrganisationInsert>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<OrganisationRow, Error, OrganisationInsert>({
    mutationFn: (organisation: OrganisationInsert) => organisationsService.create(supabase, organisation),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Update organisation mutation
export const useUpdateOrganisation = (
  options?: Omit<
    UseMutationOptions<OrganisationRow, Error, { organisationId: string; updates: OrganisationUpdate }>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<OrganisationRow, Error, { organisationId: string; updates: OrganisationUpdate }>({
    mutationFn: ({ organisationId, updates }) => organisationsService.update(supabase, organisationId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId, "teams"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId, "users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId, "calendar"],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Delete organisation mutation
export const useDeleteOrganisation = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (organisationId: string) => organisationsService.delete(supabase, organisationId),
    onSuccess: (data, organisationId, context) => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      queryClient.invalidateQueries({
        queryKey: ["organisations", organisationId],
      });
      options?.onSuccess?.(data, organisationId, context);
    },
    ...options,
  });
};

export const useAddMemberToOrganisation = (
  options?: Omit<UseMutationOptions<OrganisationRow, Error, { organisationId: string; userId: string }>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  return useMutation<OrganisationRow, Error, { organisationId: string; userId: string }>({
    mutationFn: ({ organisationId, userId }) =>
      organisationsService.addMember(supabase, organisationId, userId, "USER"),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId, "teams"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId, "users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId, "calendar"],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useRemoveMemberFromOrganisation = (
  options?: Omit<UseMutationOptions<OrganisationRow, Error, { organisationId: string; userId: string }>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, { organisationId: string; userId: string }>({
    mutationFn: ({ organisationId, userId }) => organisationsService.removeMember(supabase, organisationId, userId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId, "teams"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId, "users"],
      });
    },
  });
};

export const useAddTeamToOrganisation = (
  options?: Omit<UseMutationOptions<OrganisationRow, Error, { organisationId: string; teamId: string }>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  return useMutation<OrganisationRow, Error, { organisationId: string; teamId: string }>({
    mutationFn: ({ organisationId, teamId }) => organisationsService.addTeam(supabase, organisationId, teamId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId, "teams"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId, "users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId, "calendar"],
      });
    },
  });
};

export const useRemoveTeamFromOrganisation = (
  options?: Omit<UseMutationOptions<OrganisationRow, Error, { organisationId: string; teamId: string }>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, { organisationId: string; teamId: string }>({
    mutationFn: ({ organisationId, teamId }) => organisationsService.removeTeam(supabase, organisationId, teamId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.organisationId],
      });
    },
  });
};
