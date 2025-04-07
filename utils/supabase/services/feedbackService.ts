import type { TypedSupabaseClient } from "@/utils/types"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

export type FeedbackRow = Tables<"feedback">
export type FeedbackInsert = TablesInsert<"feedback">
export type FeedbackUpdate = TablesUpdate<"feedback">

export const feedbackService = {
  // Get feedback by ID
  getById: async (supabase: TypedSupabaseClient, feedbackId: string) => {
    const { data, error } = await supabase.from("feedback").select("*").eq("feedback_id", feedbackId).single()

    if (error) throw error
    return data
  },

  // Get feedback by event
  getByEvent: async (supabase: TypedSupabaseClient, eventId: string) => {
    const { data, error } = await supabase
      .from("feedback")
      .select(`
        *,
        player:player_id(user_id, full_name)
      `)
      .eq("event_id", eventId)

    if (error) throw error
    return data
  },

  // Get feedback by player
  getByPlayer: async (supabase: TypedSupabaseClient, playerId: string) => {
    const { data, error } = await supabase
      .from("feedback")
      .select(`
        *,
        event:event_id(*)
      `)
      .eq("player_id", playerId)

    if (error) throw error
    return data
  },

  // Get player's feedback for an event
  getPlayerEventFeedback: async (supabase: TypedSupabaseClient, eventId: string, playerId: string) => {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("event_id", eventId)
      .eq("player_id", playerId)
      .single()

    if (error && error.code !== "PGRST116") throw error // PGRST116 is "No rows returned"
    return data
  },

  // Create feedback
  create: async (supabase: TypedSupabaseClient, feedback: FeedbackInsert) => {
    const { data, error } = await supabase.from("feedback").insert(feedback).select().single()

    if (error) throw error
    return data
  },

  // Update feedback
  update: async (supabase: TypedSupabaseClient, feedbackId: string, updates: FeedbackUpdate) => {
    const { data, error } = await supabase
      .from("feedback")
      .update(updates)
      .eq("feedback_id", feedbackId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete feedback
  delete: async (supabase: TypedSupabaseClient, feedbackId: string) => {
    const { error } = await supabase.from("feedback").delete().eq("feedback_id", feedbackId)

    if (error) throw error
    return true
  },

  // Get average rating for an event
  getEventAverageRating: async (supabase: TypedSupabaseClient, eventId: string) => {
    const { data, error } = await supabase.from("feedback").select("rating").eq("event_id", eventId)

    if (error) throw error

    if (data.length === 0) return 0

    const sum = data.reduce((acc, curr) => acc + (curr.rating || 0), 0)
    return sum / data.length
  },
}

