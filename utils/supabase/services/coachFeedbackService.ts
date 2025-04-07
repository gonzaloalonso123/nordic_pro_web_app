import type { TypedSupabaseClient } from "@/utils/types"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

export type CoachFeedbackRow = Tables<"coach_feedback">
export type CoachFeedbackInsert = TablesInsert<"coach_feedback">
export type CoachFeedbackUpdate = TablesUpdate<"coach_feedback">

export const coachFeedbackService = {
  // Get feedback by ID
  getById: async (supabase: TypedSupabaseClient, feedbackId: string) => {
    const { data, error } = await supabase.from("coach_feedback").select("*").eq("feedback_id", feedbackId).single()

    if (error) throw error
    return data
  },

  // Get feedback by week
  getByWeek: async (supabase: TypedSupabaseClient, weekStartDate: string) => {
    const { data, error } = await supabase
      .from("coach_feedback")
      .select(`
        *,
        coach:coach_id(user_id, full_name),
        player:player_id(user_id, full_name)
      `)
      .eq("week_start_date", weekStartDate)

    if (error) throw error
    return data
  },

  // Gt feedback given by a coach
  getByCoach: async (supabase: TypedSupabaseClient, coachId: string) => {
    const { data, error } = await supabase
      .from("coach_feedback")
      .select(`
        *,
        player:player_id(user_id, full_name)
      `)
      .eq("coach_id", coachId)

    if (error) throw error
    return data
  },

  // Get feedback received by a player
  getByPlayer: async (supabase: TypedSupabaseClient, playerId: string) => {
    const { data, error } = await supabase
      .from("coach_feedback")
      .select(`
        *,
        coach:coach_id(user_id, full_name)
      `)
      .eq("player_id", playerId)

    if (error) throw error
    return data
  },

  // Get feedback for a specific player in a specific week
  getByPlayerAndWeek: async (supabase: TypedSupabaseClient, playerId: string, weekStartDate: string) => {
    const { data, error } = await supabase
      .from("coach_feedback")
      .select(`
        *,
        coach:coach_id(user_id, full_name)
      `)
      .eq("player_id", playerId)
      .eq("week_start_date", weekStartDate)

    if (error) throw error
    return data
  },

  // Get a specific feedback from a coach to a player for a week
  getSpecificFeedback: async (
    supabase: TypedSupabaseClient,
    coachId: string,
    playerId: string,
    weekStartDate: string,
  ) => {
    const { data, error } = await supabase
      .from("coach_feedback")
      .select("*")
      .eq("coach_id", coachId)
      .eq("player_id", playerId)
      .eq("week_start_date", weekStartDate)
      .single()

    if (error && error.code !== "PGRST116") throw error // PGRST116 is "No rows returned"
    return data
  },

  // Create feedback
  create: async (supabase: TypedSupabaseClient, feedback: CoachFeedbackInsert) => {
    const { data, error } = await supabase.from("coach_feedback").insert(feedback).select().single()

    if (error) throw error
    return data
  },

  // Update feedback
  update: async (supabase: TypedSupabaseClient, feedbackId: string, updates: CoachFeedbackUpdate) => {
    const { data, error } = await supabase
      .from("coach_feedback")
      .update(updates)
      .eq("feedback_id", feedbackId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete feedback
  delete: async (supabase: TypedSupabaseClient, feedbackId: string) => {
    const { error } = await supabase.from("coach_feedback").delete().eq("feedback_id", feedbackId)

    if (error) throw error
    return true
  },
}

