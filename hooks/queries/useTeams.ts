import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { teamsService } from "@/utils/supabase/services";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";
import { supabase } from "@/utils/supabase/client";

type TeamRow = Tables<"teams">;
type TeamInsert = TablesInsert<"teams">;
type TeamUpdate = TablesUpdate<"teams">;

// Get all teams
export const useTeams = <TData = TeamRow[]>(
  options?: Omit<UseQueryOptions<TeamRow[], Error, TData>, "queryKey" | "queryFn">
) => {
  return useQuery<TeamRow[], Error, TData>({
    queryKey: ["teams"],
    queryFn: () => teamsService.getAll(supabase),
    ...options,
  });
};

// Get team by ID
export const useTeam = <TData = TeamRow>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<TeamRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<TeamRow | null, Error, TData>({
    queryKey: ["teams", teamId],
    queryFn: () => (teamId ? teamsService.getById(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  });
};

// Get teams by user
export const useTeamsByUser = <TData = TeamRow[]>(
  userId: string | undefined,
  options?: Omit<UseQueryOptions<TeamRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<TeamRow[] | null, Error, TData>({
    queryKey: ["teams", "user", userId],
    queryFn: () => (userId ? teamsService.getByUser(supabase, userId) : null),
    enabled: !!userId,
    ...options,
  });
};

// Get teams by organisation
export const useTeamsByOrganisation = <TData = TeamRow[]>(
  organisationId: string | undefined,
  options?: Omit<UseQueryOptions<TeamRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<TeamRow[] | null, Error, TData>({
    queryKey: ["teams", "organisation", organisationId],
    queryFn: () => (organisationId ? teamsService.getByOrganisation(supabase, organisationId) : null),
    enabled: !!organisationId,
    ...options,
  });
};

// Get team with users
export const useTeamWithUsers = <TData = any>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<any | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<any | null, Error, TData>({
    queryKey: ["teams", teamId, "users"],
    queryFn: () => (teamId ? teamsService.getWithUsers(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  });
};

// Get team with organisations
export const useTeamWithOrganisations = <TData = any>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<any | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<any | null, Error, TData>({
    queryKey: ["teams", teamId, "organisations"],
    queryFn: () => (teamId ? teamsService.getWithOrganisations(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  });
};

// Get team with calendar
export const useTeamWithCalendar = <TData = any>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<any | null, Error, TData>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery<any | null, Error, TData>({
    queryKey: ["teams", teamId, "calendar"],
    queryFn: () => (teamId ? teamsService.getWithCalendar(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  });
};

// Create team mutation
export const useCreateTeam = (options?: Omit<UseMutationOptions<TeamRow, Error, TeamInsert>, "mutationFn">) => {
  const queryClient = useQueryClient();

  return useMutation<TeamRow, Error, TeamInsert>({
    mutationFn: (team: TeamInsert) => teamsService.create(supabase, team),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Update team mutation
export const useUpdateTeam = (
  options?: Omit<UseMutationOptions<TeamRow, Error, { teamId: string; updates: TeamUpdate }>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<TeamRow, Error, { teamId: string; updates: TeamUpdate }>({
    mutationFn: ({ teamId, updates }) => teamsService.update(supabase, teamId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["teams", variables.teamId] });
      queryClient.invalidateQueries({
        queryKey: ["teams", variables.teamId, "users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["teams", variables.teamId, "organisations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["teams", variables.teamId, "calendar"],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateUserInTeam = (
  options?: Omit<
    UseMutationOptions<
      TeamRow,
      Error,
      {
        teamId: string;
        updates: {
          role?: string;
          position?: string;
        };
      }
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    TeamRow,
    Error,
    {
      teamId: string;
      userId: string;
      updates: {
        role?: string;
        position?: string;
      };
    }
  >({
    mutationFn: ({ teamId, userId, updates }) => teamsService.updateUserInTeam(supabase, teamId, userId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["teams", variables.teamId] });
    },
    ...options,
  });
};

export const useDeleteTeam = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (teamId: string) => teamsService.delete(supabase, teamId),
    onSuccess: (data, teamId, context) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
      options?.onSuccess?.(data, teamId, context);
    },
    ...options,
  });
};

export const useAddUserToTeam = (
  options?: Omit<UseMutationOptions<boolean, Error, { teamId: string; userId: string }>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, { teamId: string; userId: string; role: string; position: string }>({
    mutationFn: ({ teamId, userId, role, position }) =>
      teamsService.addUserToTeam(supabase, teamId, userId, role, position),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["teams", variables.teamId] });
    },
  });
};

export const useRemoveUserFromTeam = (
  options?: Omit<UseMutationOptions<boolean, Error, { teamId: string; userId: string }>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, { teamId: string; userId: string }>({
    mutationFn: ({ teamId, userId }) => teamsService.removeUserFromTeam(supabase, teamId, userId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["teams", variables.teamId] });
    },
  });
};
