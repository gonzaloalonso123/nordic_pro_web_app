import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import useSupabaseBrowser from "@/utils/supabase/browser"
import { coachFeedbackService } from "@/utils/supabase/services"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

type CoachFeedbackRow = Tables<"coach_feedback">
type CoachFeedbackInsert = TablesInsert<"coach_feedback">
type CoachFeedbackUpdate = TablesUpdate<"coach_feedback">

// Get feedback by ID
export const useCoachFeedback = <TData = CoachFeedbackRow>(
  feedbackId: string | undefined,
  options?: Omit<UseQueryOptions<CoachFeedbackRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<CoachFeedbackRow | null, Error, TData>({
    queryKey: ["coachFeedback", feedbackId],
    queryFn: () => (feedbackId ? coachFeedbackService.getById(supabase, feedbackId) : null),
    enabled: !!feedbackId,
    ...options,
  })
}

// Get feedback by week
export const useCoachFeedbackByWeek = <TData = any[]>(
  weekStartDate: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["coachFeedback", "week", weekStartDate],
    queryFn: () => (weekStartDate ? coachFeedbackService.getByWeek(supabase, weekStartDate) : null),
    enabled: !!weekStartDate,
    ...options,
  })
}

// Get feedback given by a coach
export const useCoachFeedbackByCoach = <TData = any[]>(
  coachId: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["coachFeedback", "coach", coachId],
    queryFn: () => (coachId ? coachFeedbackService.getByCoach(supabase, coachId) : null),
    enabled: !!coachId,
    ...options,
  })
}

// Get feedback received by a player
export const useCoachFeedbackByPlayer = <TData = any[]>(
  playerId: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["coachFeedback", "player", playerId],
    queryFn: () => (playerId ? coachFeedbackService.getByPlayer(supabase, playerId) : null),
    enabled: !!playerId,
    ...options,
  })
}

// Get feedback for a specific player in a specific week
export const useCoachFeedbackByPlayerAndWeek = <TData = any[]>(
  playerId: string | undefined,
  weekStartDate: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["coachFeedback", "player", playerId, "week", weekStartDate],
    queryFn: () =>
      playerId && weekStartDate ? coachFeedbackService.getByPlayerAndWeek(supabase, playerId, weekStartDate) : null,
    enabled: !!(playerId && weekStartDate),
    ...options,
  })
}

// Get a specific feedback from a coach to a player for a week
export const useSpecificCoachFeedback = <TData = CoachFeedbackRow>(
  coachId: string | undefined,
  playerId: string | undefined,
  weekStartDate: string | undefined,
  options?: Omit<UseQueryOptions<CoachFeedbackRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<CoachFeedbackRow | null, Error, TData>({
    queryKey: ["coachFeedback", "coach", coachId, "player", playerId, "week", weekStartDate],
    queryFn: () =>
      coachId && playerId && weekStartDate
        ? coachFeedbackService.getSpecificFeedback(supabase, coachId, playerId, weekStartDate)
        : null,
    enabled: !!(coachId && playerId && weekStartDate),
    ...options,
  })
}

// Create feedback mutation
export const useCreateCoachFeedback = (
  options?: Omit<UseMutationOptions<CoachFeedbackRow, Error, CoachFeedbackInsert>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<CoachFeedbackRow, Error, CoachFeedbackInsert>({
    mutationFn: (feedback: CoachFeedbackInsert) => coachFeedbackService.create(supabase, feedback),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["coachFeedback", "week", data.week_start_date] })
      queryClient.invalidateQueries({ queryKey: ["coachFeedback", "coach", data.coach_id] })
      queryClient.invalidateQueries({ queryKey: ["coachFeedback", "player", data.player_id] })
      queryClient.invalidateQueries({
        queryKey: ["coachFeedback", "player", data.player_id, "week", data.week_start_date],
      })
      queryClient.invalidateQueries({
        queryKey: ["coachFeedback", "coach", data.coach_id, "player", data.player_id, "week", data.week_start_date],
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Update feedback mutation
export const useUpdateCoachFeedback = (
  options?: Omit<
    UseMutationOptions<CoachFeedbackRow, Error, { feedbackId: string; updates: CoachFeedbackUpdate }>,
    "mutationFn"
  >,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<CoachFeedbackRow, Error, { feedbackId: string; updates: CoachFeedbackUpdate }>({
    mutationFn: ({ feedbackId, updates }) => coachFeedbackService.update(supabase, feedbackId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["coachFeedback", data.feedback_id] })
      queryClient.invalidateQueries({ queryKey: ["coachFeedback", "week", data.week_start_date] })
      queryClient.invalidateQueries({ queryKey: ["coachFeedback", "coach", data.coach_id] })
      queryClient.invalidateQueries({ queryKey: ["coachFeedback", "player", data.player_id] })
      queryClient.invalidateQueries({
        queryKey: ["coachFeedback", "player", data.player_id, "week", data.week_start_date],
      })
      queryClient.invalidateQueries({
        queryKey: ["coachFeedback", "coach", data.coach_id, "player", data.player_id, "week", data.week_start_date],
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Delete feedback mutation
export const useDeleteCoachFeedback = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, string>({
    mutationFn: (feedbackId: string) => coachFeedbackService.delete(supabase, feedbackId),
    onSuccess: (data, feedbackId, context) => {
      queryClient.invalidateQueries({ queryKey: ["coachFeedback"] })
      options?.onSuccess?.(data, feedbackId, context)
    },
    ...options,
  })
}

