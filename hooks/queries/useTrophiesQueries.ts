import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import useSupabaseBrowser from "@/utils/supabase/client"
import { trophiesService } from "@/utils/supabase/services"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

type TrophyRow = Tables<"trophies">
type TrophyInsert = TablesInsert<"trophies">
type TrophyUpdate = TablesUpdate<"trophies">
type TrophyType = "gold" | "green"

// Get trophy by ID
export const useTrophy = <TData = TrophyRow>(
  trophyId: string | undefined,
  options?: Omit<UseQueryOptions<TrophyRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<TrophyRow | null, Error, TData>({
    queryKey: ["trophies", trophyId],
    queryFn: () => (trophyId ? trophiesService.getById(supabase, trophyId) : null),
    enabled: !!trophyId,
    ...options,
  })
}

// Get trophies by week
export const useTrophiesByWeek = <TData = any[]>(
  weekStartDate: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["trophies", "week", weekStartDate],
    queryFn: () => (weekStartDate ? trophiesService.getByWeek(supabase, weekStartDate) : null),
    enabled: !!weekStartDate,
    ...options,
  })
}

// Get trophies by player
export const useTrophiesByPlayer = <TData = TrophyRow[]>(
  playerId: string | undefined,
  options?: Omit<UseQueryOptions<TrophyRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<TrophyRow[] | null, Error, TData>({
    queryKey: ["trophies", "player", playerId],
    queryFn: () => (playerId ? trophiesService.getByPlayer(supabase, playerId) : null),
    enabled: !!playerId,
    ...options,
  })
}

// Get trophies by type and week
export const useTrophiesByTypeAndWeek = <TData = any[]>(
  trophyType: TrophyType | undefined,
  weekStartDate: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["trophies", "type", trophyType, "week", weekStartDate],
    queryFn: () =>
      trophyType && weekStartDate ? trophiesService.getByTypeAndWeek(supabase, trophyType, weekStartDate) : null,
    enabled: !!(trophyType && weekStartDate),
    ...options,
  })
}

// Get player's trophies for a specific week
export const usePlayerWeekTrophies = <TData = TrophyRow[]>(
  playerId: string | undefined,
  weekStartDate: string | undefined,
  options?: Omit<UseQueryOptions<TrophyRow[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<TrophyRow[] | null, Error, TData>({
    queryKey: ["trophies", "player", playerId, "week", weekStartDate],
    queryFn: () =>
      playerId && weekStartDate ? trophiesService.getPlayerWeekTrophies(supabase, playerId, weekStartDate) : null,
    enabled: !!(playerId && weekStartDate),
    ...options,
  })
}

// Count trophies by player
export const useTrophyCountByPlayer = <TData = { gold: number; green: number; total: number }>(
  playerId: string | undefined,
  options?: Omit<
    UseQueryOptions<{ gold: number; green: number; total: number } | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<{ gold: number; green: number; total: number } | null, Error, TData>({
    queryKey: ["trophies", "player", playerId, "count"],
    queryFn: () => (playerId ? trophiesService.countByPlayer(supabase, playerId) : null),
    enabled: !!playerId,
    ...options,
  })
}

// Create a trophy mutation
export const useCreateTrophy = (options?: Omit<UseMutationOptions<TrophyRow, Error, TrophyInsert>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<TrophyRow, Error, TrophyInsert>({
    mutationFn: (trophy: TrophyInsert) => trophiesService.create(supabase, trophy),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["trophies", "week", data.week_start_date] })
      queryClient.invalidateQueries({ queryKey: ["trophies", "player", data.player_id] })
      queryClient.invalidateQueries({
        queryKey: ["trophies", "type", data.trophy_type, "week", data.week_start_date],
      })
      queryClient.invalidateQueries({
        queryKey: ["trophies", "player", data.player_id, "week", data.week_start_date],
      })
      queryClient.invalidateQueries({ queryKey: ["trophies", "player", data.player_id, "count"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Update a trophy mutation
export const useUpdateTrophy = (
  options?: Omit<UseMutationOptions<TrophyRow, Error, { trophyId: string; updates: TrophyUpdate }>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<TrophyRow, Error, { trophyId: string; updates: TrophyUpdate }>({
    mutationFn: ({ trophyId, updates }) => trophiesService.update(supabase, trophyId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["trophies", data.trophy_id] })
      queryClient.invalidateQueries({ queryKey: ["trophies", "week", data.week_start_date] })
      queryClient.invalidateQueries({ queryKey: ["trophies", "player", data.player_id] })
      queryClient.invalidateQueries({
        queryKey: ["trophies", "type", data.trophy_type, "week", data.week_start_date],
      })
      queryClient.invalidateQueries({
        queryKey: ["trophies", "player", data.player_id, "week", data.week_start_date],
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Delete a trophy mutation
export const useDeleteTrophy = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, string>({
    mutationFn: (trophyId: string) => trophiesService.delete(supabase, trophyId),
    onSuccess: (data, trophyId, context) => {
      queryClient.invalidateQueries({ queryKey: ["trophies"] })
      options?.onSuccess?.(data, trophyId, context)
    },
    ...options,
  })
}

