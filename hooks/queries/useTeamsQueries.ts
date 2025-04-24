import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import useSupabaseBrowser from "@/utils/supabase/client"
import { teamsService } from "@/utils/supabase/services"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

type TeamRow = Tables<"teams">
type TeamInsert = TablesInsert<"teams">
type TeamUpdate = TablesUpdate<"teams">

// Get all teams
export const useTeams = <TData = TeamRow[]>(
  options?: Omit<UseQueryOptions<TeamRow[], Error, TData>, "queryKey" | "queryFn">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<TeamRow[], Error, TData>({
    queryKey: ["teams"],
    queryFn: () => teamsService.getAll(supabase),
    ...options,
  })
}

// Get team by ID
export const useTeam = <TData = TeamRow>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<TeamRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<TeamRow | null, Error, TData>({
    queryKey: ["teams", teamId],
    queryFn: () => (teamId ? teamsService.getById(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  })
}

// Get team with members
export const useTeamWithMembers = <TData = any>(
  teamId: string | undefined,
  options?: Omit<UseQueryOptions<any | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any | null, Error, TData>({
    queryKey: ["teams", teamId, "members"],
    queryFn: () => (teamId ? teamsService.getWithMembers(supabase, teamId) : null),
    enabled: !!teamId,
    ...options,
  })
}

// Create team mutation
export const useCreateTeam = (options?: Omit<UseMutationOptions<TeamRow, Error, TeamInsert>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<TeamRow, Error, TeamInsert>({
    mutationFn: (team: TeamInsert) => teamsService.create(supabase, team),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Update team mutation
export const useUpdateTeam = (
  options?: Omit<UseMutationOptions<TeamRow, Error, { teamId: string; updates: TeamUpdate }>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<TeamRow, Error, { teamId: string; updates: TeamUpdate }>({
    mutationFn: ({ teamId, updates }) => teamsService.update(supabase, teamId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
      queryClient.invalidateQueries({ queryKey: ["teams", variables.teamId] })
      queryClient.invalidateQueries({ queryKey: ["teams", variables.teamId, "members"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Delete team mutation
export const useDeleteTeam = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, string>({
    mutationFn: (teamId: string) => teamsService.delete(supabase, teamId),
    onSuccess: (data, teamId, context) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] })
      queryClient.invalidateQueries({ queryKey: ["teams", teamId, "members"] })
      options?.onSuccess?.(data, teamId, context)
    },
    ...options,
  })
}

