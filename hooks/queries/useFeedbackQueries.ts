import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import useSupabaseBrowser from "@/utils/supabase/browser"
import { feedbackService } from "@/utils/supabase/services"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

type FeedbackRow = Tables<"feedback">
type FeedbackInsert = TablesInsert<"feedback">
type FeedbackUpdate = TablesUpdate<"feedback">

// Get feedback by ID
export const useFeedback = <TData = FeedbackRow>(
  feedbackId: string | undefined,
  options?: Omit<UseQueryOptions<FeedbackRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<FeedbackRow | null, Error, TData>({
    queryKey: ["feedback", feedbackId],
    queryFn: () => (feedbackId ? feedbackService.getById(supabase, feedbackId) : null),
    enabled: !!feedbackId,
    ...options,
  })
}

// Get feedback by event
export const useFeedbackByEvent = <TData = any[]>(
  eventId: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["feedback", "event", eventId],
    queryFn: () => (eventId ? feedbackService.getByEvent(supabase, eventId) : null),
    enabled: !!eventId,
    ...options,
  })
}

// Get feedback by player
export const useFeedbackByPlayer = <TData = any[]>(
  playerId: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["feedback", "player", playerId],
    queryFn: () => (playerId ? feedbackService.getByPlayer(supabase, playerId) : null),
    enabled: !!playerId,
    ...options,
  })
}

// Get player's feedback for an event
export const usePlayerEventFeedback = <TData = FeedbackRow>(
  eventId: string | undefined,
  playerId: string | undefined,
  options?: Omit<UseQueryOptions<FeedbackRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<FeedbackRow | null, Error, TData>({
    queryKey: ["feedback", "event", eventId, "player", playerId],
    queryFn: () => (eventId && playerId ? feedbackService.getPlayerEventFeedback(supabase, eventId, playerId) : null),
    enabled: !!(eventId && playerId),
    ...options,
  })
}

// Get average rating for an event
export const useEventAverageRating = <TData = number>(
  eventId: string | undefined,
  options?: Omit<UseQueryOptions<number | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<number | null, Error, TData>({
    queryKey: ["feedback", "event", eventId, "average"],
    queryFn: () => (eventId ? feedbackService.getEventAverageRating(supabase, eventId) : null),
    enabled: !!eventId,
    ...options,
  })
}

// Create feedback mutation
export const useCreateFeedback = (
  options?: Omit<UseMutationOptions<FeedbackRow, Error, FeedbackInsert>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<FeedbackRow, Error, FeedbackInsert>({
    mutationFn: (feedback: FeedbackInsert) => feedbackService.create(supabase, feedback),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["feedback", "event", data.event_id] })
      queryClient.invalidateQueries({ queryKey: ["feedback", "player", data.player_id] })
      queryClient.invalidateQueries({
        queryKey: ["feedback", "event", data.event_id, "player", data.player_id],
      })
      queryClient.invalidateQueries({ queryKey: ["feedback", "event", data.event_id, "average"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Update feedback mutation
export const useUpdateFeedback = (
  options?: Omit<UseMutationOptions<FeedbackRow, Error, { feedbackId: string; updates: FeedbackUpdate }>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<FeedbackRow, Error, { feedbackId: string; updates: FeedbackUpdate }>({
    mutationFn: ({ feedbackId, updates }) => feedbackService.update(supabase, feedbackId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["feedback", data.feedback_id] })
      queryClient.invalidateQueries({ queryKey: ["feedback", "event", data.event_id] })
      queryClient.invalidateQueries({ queryKey: ["feedback", "player", data.player_id] })
      queryClient.invalidateQueries({
        queryKey: ["feedback", "event", data.event_id, "player", data.player_id],
      })
      queryClient.invalidateQueries({ queryKey: ["feedback", "event", data.event_id, "average"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Delete feedback mutation
export const useDeleteFeedback = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, string>({
    mutationFn: (feedbackId: string) => feedbackService.delete(supabase, feedbackId),
    onSuccess: (data, feedbackId, context) => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] })
      options?.onSuccess?.(data, feedbackId, context)
    },
    ...options,
  })
}

