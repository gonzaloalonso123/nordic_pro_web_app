import type { TypedSupabaseClient } from "@/utils/types"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

export type PlayerRatingRow = Tables<"player_ratings">
export type PlayerRatingInsert = TablesInsert<"player_ratings">
export type PlayerRatingUpdate = TablesUpdate<"player_ratings">

export const playerRatingsService = {
  // Get rating by ID
  getById: async (supabase: TypedSupabaseClient, ratingId: string) => {
    const { data, error } = await supabase.from("player_ratings").select("*").eq("rating_id", ratingId).single()

    if (error) throw error
    return data
  },

  // Get ratings by week
  getByWeek: async (supabase: TypedSupabaseClient, weekStartDate: string) => {
    const { data, error } = await supabase
      .from("player_ratings")
      .select(`
        *,
        rater:rater_id(user_id, full_name),
        ratee:ratee_id(user_id, full_name)
      `)
      .eq("week_start_date", weekStartDate)

    if (error) throw error
    return data
  },

  // Get ratings given by a player
  getByRater: async (supabase: TypedSupabaseClient, raterId: string) => {
    const { data, error } = await supabase
      .from("player_ratings")
      .select(`
        *,
        ratee:ratee_id(user_id, full_name)
      `)
      .eq("rater_id", raterId)

    if (error) throw error
    return data
  },

  // Get ratings received by a player
  getByRatee: async (supabase: TypedSupabaseClient, rateeId: string) => {
    const { data, error } = await supabase
      .from("player_ratings")
      .select(`
        *,
        rater:rater_id(user_id, full_name)
      `)
      .eq("ratee_id", rateeId)

    if (error) throw error
    return data
  },

  // Get ratings for a specific player in a specific week
  getByRateeAndWeek: async (supabase: TypedSupabaseClient, rateeId: string, weekStartDate: string) => {
    const { data, error } = await supabase
      .from("player_ratings")
      .select(`
        *,
        rater:rater_id(user_id, full_name)
      `)
      .eq("ratee_id", rateeId)
      .eq("week_start_date", weekStartDate)

    if (error) throw error
    return data
  },

  // Get a specific rating between two players for a week
  getSpecificRating: async (supabase: TypedSupabaseClient, raterId: string, rateeId: string, weekStartDate: string) => {
    const { data, error } = await supabase
      .from("player_ratings")
      .select("*")
      .eq("rater_id", raterId)
      .eq("ratee_id", rateeId)
      .eq("week_start_date", weekStartDate)
      .single()

    if (error && error.code !== "PGRST116") throw error // PGRST116 is "No rows returned"
    return data
  },

  // Create a rating
  create: async (supabase: TypedSupabaseClient, rating: PlayerRatingInsert) => {
    const { data, error } = await supabase.from("player_ratings").insert(rating).select().single()

    if (error) throw error
    return data
  },

  // Update a rating
  update: async (supabase: TypedSupabaseClient, ratingId: string, updates: PlayerRatingUpdate) => {
    const { data, error } = await supabase
      .from("player_ratings")
      .update(updates)
      .eq("rating_id", ratingId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a rating
  delete: async (supabase: TypedSupabaseClient, ratingId: string) => {
    const { error } = await supabase.from("player_ratings").delete().eq("rating_id", ratingId)

    if (error) throw error
    return true
  },

  // Get average performance rating for a player in a week
  getAveragePerformanceRating: async (supabase: TypedSupabaseClient, rateeId: string, weekStartDate: string) => {
    const { data, error } = await supabase
      .from("player_ratings")
      .select("performance_rating")
      .eq("ratee_id", rateeId)
      .eq("week_start_date", weekStartDate)

    if (error) throw error

    if (data.length === 0) return 0

    const sum = data.reduce((acc, curr) => acc + (curr.performance_rating || 0), 0)
    return sum / data.length
  },

  // Get average attitude rating for a player in a week
  getAverageAttitudeRating: async (supabase: TypedSupabaseClient, rateeId: string, weekStartDate: string) => {
    const { data, error } = await supabase
      .from("player_ratings")
      .select("attitude_rating")
      .eq("ratee_id", rateeId)
      .eq("week_start_date", weekStartDate)

    if (error) throw error

    if (data.length === 0) return 0

    const sum = data.reduce((acc, curr) => acc + (curr.attitude_rating || 0), 0)
    return sum / data.length
  },
}

