import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import useSupabaseBrowser from "@/utils/supabase/browser"
import { rostersService } from "@/utils/supabase/services"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

type RosterRow = Tables<"rosters">
type RosterInsert = TablesInsert<"rosters">
type RosterUpdate = TablesUpdate<"rosters">
type RosterResponse = "confirmed" | "declined" | "no_response"

// Get roster by ID
export const useRoster = <TData = RosterRow>(
  rosterId: string | undefined,
  options?: Omit<UseQueryOptions<RosterRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<RosterRow | null, Error, TData>({
    queryKey: ["rosters", rosterId],
    queryFn: () => (rosterId ? rostersService.getById(supabase, rosterId) : null),
    enabled: !!rosterId,
    ...options,
  })
}

// Get roster by event
export const useRosterByEvent = <TData = any[]>(
  eventId: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["rosters", "event", eventId],
    queryFn: () => (eventId ? rostersService.getByEvent(supabase, eventId) : null),
    enabled: !!eventId,
    ...options,
  })
}

// Get roster by player
export const useRosterByPlayer = <TData = any[]>(
  playerId: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["rosters", "player", playerId],
    queryFn: () => (playerId ? rostersService.getByPlayer(supabase, playerId) : null),
    enabled: !!playerId,
    ...options,
  })
}

// Get player's roster status for an event
export const usePlayerEventRoster = <TData = RosterRow>(
  eventId: string | undefined,
  playerId: string | undefined,
  options?: Omit<UseQueryOptions<RosterRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<RosterRow | null, Error, TData>({
    queryKey: ["rosters", "event", eventId, "player", playerId],
    queryFn: () => (eventId && playerId ? rostersService.getPlayerEventRoster(supabase, eventId, playerId) : null),
    enabled: !!(eventId && playerId),
    ...options,
  })
}

// Create roster entries for multiple players mutation
export const useCreateBatchRoster = (
  options?: Omit<UseMutationOptions<RosterRow[], Error, { eventId: string; playerIds: string[] }>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<RosterRow[], Error, { eventId: string; playerIds: string[] }>({
    mutationFn: ({ eventId, playerIds }) => rostersService.createBatch(supabase, eventId, playerIds),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["rosters", "event", variables.eventId] })
      variables.playerIds.forEach((playerId) => {
        queryClient.invalidateQueries({ queryKey: ["rosters", "player", playerId] })
        queryClient.invalidateQueries({
          queryKey: ["rosters", "event", variables.eventId, "player", playerId],
        })
      })
      queryClient.invalidateQueries({ queryKey: ["events", variables.eventId, "roster"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Update player's response mutation
export const useUpdateResponse = (
  options?: Omit<UseMutationOptions<RosterRow, Error, { rosterId: string; response: RosterResponse }>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<RosterRow, Error, { rosterId: string; response: RosterResponse }>({
    mutationFn: ({ rosterId, response }) => rostersService.updateResponse(supabase, rosterId, response),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["rosters", data.roster_id] })
      queryClient.invalidateQueries({ queryKey: ["rosters", "event", data.event_id] })
      queryClient.invalidateQueries({ queryKey: ["rosters", "player", data.player_id] })
      queryClient.invalidateQueries({
        queryKey: ["rosters", "event", data.event_id, "player", data.player_id],
      })
      queryClient.invalidateQueries({ queryKey: ["events", data.event_id, "roster"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Update player's response by event and player mutation
export const useUpdateResponseByEventAndPlayer = (
  options?: Omit<
    UseMutationOptions<RosterRow, Error, { eventId: string; playerId: string; response: RosterResponse }>,
    "mutationFn"
  >,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<RosterRow, Error, { eventId: string; playerId: string; response: RosterResponse }>({
    mutationFn: ({ eventId, playerId, response }) =>
      rostersService.updateResponseByEventAndPlayer(supabase, eventId, playerId, response),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["rosters", data.roster_id] })
      queryClient.invalidateQueries({ queryKey: ["rosters", "event", data.event_id] })
      queryClient.invalidateQueries({ queryKey: ["rosters", "player", data.player_id] })
      queryClient.invalidateQueries({
        queryKey: ["rosters", "event", data.event_id, "player", data.player_id],
      })
      queryClient.invalidateQueries({ queryKey: ["events", data.event_id, "roster"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Delete roster entry mutation
export const useDeleteRoster = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, string>({
    mutationFn: (rosterId: string) => rostersService.delete(supabase, rosterId),
    onSuccess: (data, rosterId, context) => {
      queryClient.invalidateQueries({ queryKey: ["rosters"] })
      queryClient.invalidateQueries({ queryKey: ["events"] })
      options?.onSuccess?.(data, rosterId, context)
    },
    ...options,
  })
}

// Delete all roster entries for an event mutation
export const useDeleteRosterByEvent = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, string>({
    mutationFn: (eventId: string) => rostersService.deleteByEvent(supabase, eventId),
    onSuccess: (data, eventId, context) => {
      queryClient.invalidateQueries({ queryKey: ["rosters", "event", eventId] })
      queryClient.invalidateQueries({ queryKey: ["events", eventId, "roster"] })
      options?.onSuccess?.(data, eventId, context)
    },
    ...options,
  })
}

