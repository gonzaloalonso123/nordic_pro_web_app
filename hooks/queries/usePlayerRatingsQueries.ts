import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import useSupabaseBrowser from "@/utils/supabase/browser"
import { playerRatingsService } from "@/utils/supabase/services"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

type PlayerRatingRow = Tables<"player_ratings">
type PlayerRatingInsert = TablesInsert<"player_ratings">
type PlayerRatingUpdate = TablesUpdate<"player_ratings">

// Get rating by ID
export const usePlayerRating = <TData = PlayerRatingRow>(
  ratingId: string | undefined,
  options?: Omit<UseQueryOptions<PlayerRatingRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<PlayerRatingRow | null, Error, TData>({
    queryKey: ["playerRatings", ratingId],
    queryFn: () => (ratingId ? playerRatingsService.getById(supabase, ratingId) : null),
    enabled: !!ratingId,
    ...options,
  })
}

// Get ratings by week
export const usePlayerRatingsByWeek = <TData = any[]>(
  weekStartDate: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["playerRatings", "week", weekStartDate],
    queryFn: () => (weekStartDate ? playerRatingsService.getByWeek(supabase, weekStartDate) : null),
    enabled: !!weekStartDate,
    ...options,
  })
}

// Get ratings given by a player
export const usePlayerRatingsByRater = <TData = any[]>(
  raterId: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["playerRatings", "rater", raterId],
    queryFn: () => (raterId ? playerRatingsService.getByRater(supabase, raterId) : null),
    enabled: !!raterId,
    ...options,
  })
}

// Get ratings received by a player
export const usePlayerRatingsByRatee = <TData = any[]>(
  rateeId: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["playerRatings", "ratee", rateeId],
    queryFn: () => (rateeId ? playerRatingsService.getByRatee(supabase, rateeId) : null),
    enabled: !!rateeId,
    ...options,
  })
}

// Get ratings for a specific player in a specific week
export const usePlayerRatingsByRateeAndWeek = <TData = any[]>(
  rateeId: string | undefined,
  weekStartDate: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["playerRatings", "ratee", rateeId, "week", weekStartDate],
    queryFn: () =>
      rateeId && weekStartDate ? playerRatingsService.getByRateeAndWeek(supabase, rateeId, weekStartDate) : null,
    enabled: !!(rateeId && weekStartDate),
    ...options,
  })
}

// Get a specific rating between two players for a week
export const useSpecificPlayerRating = <TData = PlayerRatingRow>(
  raterId: string | undefined,
  rateeId: string | undefined,
  weekStartDate: string | undefined,
  options?: Omit<UseQueryOptions<PlayerRatingRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<PlayerRatingRow | null, Error, TData>({
    queryKey: ["playerRatings", "rater", raterId, "ratee", rateeId, "week", weekStartDate],
    queryFn: () =>
      raterId && rateeId && weekStartDate
        ? playerRatingsService.getSpecificRating(supabase, raterId, rateeId, weekStartDate)
        : null,
    enabled: !!(raterId && rateeId && weekStartDate),
    ...options,
  })
}

// Get average performance rating for a player in a week
export const useAveragePerformanceRating = <TData = number>(
  rateeId: string | undefined,
  weekStartDate: string | undefined,
  options?: Omit<UseQueryOptions<number | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<number | null, Error, TData>({
    queryKey: ["playerRatings", "ratee", rateeId, "week", weekStartDate, "performance"],
    queryFn: () =>
      rateeId && weekStartDate
        ? playerRatingsService.getAveragePerformanceRating(supabase, rateeId, weekStartDate)
        : null,
    enabled: !!(rateeId && weekStartDate),
    ...options,
  })
}

// Get average attitude rating for a player in a week
export const useAverageAttitudeRating = <TData = number>(
  rateeId: string | undefined,
  weekStartDate: string | undefined,
  options?: Omit<UseQueryOptions<number | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<number | null, Error, TData>({
    queryKey: ["playerRatings", "ratee", rateeId, "week", weekStartDate, "attitude"],
    queryFn: () =>
      rateeId && weekStartDate ? playerRatingsService.getAverageAttitudeRating(supabase, rateeId, weekStartDate) : null,
    enabled: !!(rateeId && weekStartDate),
    ...options,
  })
}

// Create a rating mutation
export const useCreatePlayerRating = (
  options?: Omit<UseMutationOptions<PlayerRatingRow, Error, PlayerRatingInsert>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<PlayerRatingRow, Error, PlayerRatingInsert>({
    mutationFn: (rating: PlayerRatingInsert) => playerRatingsService.create(supabase, rating),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["playerRatings", "week", data.week_start_date] })
      queryClient.invalidateQueries({ queryKey: ["playerRatings", "rater", data.rater_id] })
      queryClient.invalidateQueries({ queryKey: ["playerRatings", "ratee", data.ratee_id] })
      queryClient.invalidateQueries({
        queryKey: ["playerRatings", "ratee", data.ratee_id, "week", data.week_start_date],
      })
      queryClient.invalidateQueries({
        queryKey: ["playerRatings", "rater", data.rater_id, "ratee", data.ratee_id, "week", data.week_start_date],
      })
      queryClient.invalidateQueries({
        queryKey: ["playerRatings", "ratee", data.ratee_id, "week", data.week_start_date, "performance"],
      })
      queryClient.invalidateQueries({
        queryKey: ["playerRatings", "ratee", data.ratee_id, "week", data.week_start_date, "attitude"],
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Update a rating mutation
export const useUpdatePlayerRating = (
  options?: Omit<
    UseMutationOptions<PlayerRatingRow, Error, { ratingId: string; updates: PlayerRatingUpdate }>,
    "mutationFn"
  >,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<PlayerRatingRow, Error, { ratingId: string; updates: PlayerRatingUpdate }>({
    mutationFn: ({ ratingId, updates }) => playerRatingsService.update(supabase, ratingId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["playerRatings", data.rating_id] })
      queryClient.invalidateQueries({ queryKey: ["playerRatings", "week", data.week_start_date] })
      queryClient.invalidateQueries({ queryKey: ["playerRatings", "rater", data.rater_id] })
      queryClient.invalidateQueries({ queryKey: ["playerRatings", "ratee", data.ratee_id] })
      queryClient.invalidateQueries({
        queryKey: ["playerRatings", "ratee", data.ratee_id, "week", data.week_start_date],
      })
      queryClient.invalidateQueries({
        queryKey: ["playerRatings", "rater", data.rater_id, "ratee", data.ratee_id, "week", data.week_start_date],
      })
      queryClient.invalidateQueries({
        queryKey: ["playerRatings", "ratee", data.ratee_id, "week", data.week_start_date, "performance"],
      })
      queryClient.invalidateQueries({
        queryKey: ["playerRatings", "ratee", data.ratee_id, "week", data.week_start_date, "attitude"],
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Delete a rating mutation
export const useDeletePlayerRating = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, string>({
    mutationFn: (ratingId: string) => playerRatingsService.delete(supabase, ratingId),
    onSuccess: (data, ratingId, context) => {
      queryClient.invalidateQueries({ queryKey: ["playerRatings"] })
      options?.onSuccess?.(data, ratingId, context)
    },
    ...options,
  })
}

