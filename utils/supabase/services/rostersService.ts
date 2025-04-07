import type { TypedSupabaseClient } from "@/utils/types"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

export type RosterRow = Tables<"rosters">
export type RosterInsert = TablesInsert<"rosters">
export type RosterUpdate = TablesUpdate<"rosters">
export type RosterResponse = "confirmed" | "declined" | "no_response"

export const rostersService = {
  // Get roster by ID
  getById: async (supabase: TypedSupabaseClient, rosterId: string) => {
    const { data, error } = await supabase.from("rosters").select("*").eq("roster_id", rosterId).single()

    if (error) throw error
    return data
  },

  // Get roster by event
  getByEvent: async (supabase: TypedSupabaseClient, eventId: string) => {
    const { data, error } = await supabase
      .from("rosters")
      .select(`
        *,
        player:player_id(user_id, full_name)
      `)
      .eq("event_id", eventId)

    if (error) throw error
    return data
  },

  // Get roster by player
  getByPlayer: async (supabase: TypedSupabaseClient, playerId: string) => {
    const { data, error } = await supabase
      .from("rosters")
      .select(`
        *,
        event:event_id(*)
      `)
      .eq("player_id", playerId)

    if (error) throw error
    return data
  },

  // Get player's roster status for an event
  getPlayerEventRoster: async (supabase: TypedSupabaseClient, eventId: string, playerId: string) => {
    const { data, error } = await supabase
      .from("rosters")
      .select("*")
      .eq("event_id", eventId)
      .eq("player_id", playerId)
      .single()

    if (error && error.code !== "PGRST116") throw error // PGRST116 is "No rows returned"
    return data
  },

  // Create roster entries for multiple players
  createBatch: async (supabase: TypedSupabaseClient, eventId: string, playerIds: string[]) => {
    const entries = playerIds.map((playerId) => ({
      event_id: eventId,
      player_id: playerId,
      response: "no_response" as RosterResponse,
    }))

    const { data, error } = await supabase.from("rosters").insert(entries).select()

    if (error) throw error
    return data
  },

  // Update player's response
  updateResponse: async (supabase: TypedSupabaseClient, rosterId: string, response: RosterResponse) => {
    const { data, error } = await supabase
      .from("rosters")
      .update({
        response,
        updated_at: new Date().toISOString(),
      })
      .eq("roster_id", rosterId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update player's response by event and player
  updateResponseByEventAndPlayer: async (
    supabase: TypedSupabaseClient,
    eventId: string,
    playerId: string,
    response: RosterResponse,
  ) => {
    const { data, error } = await supabase
      .from("rosters")
      .update({
        response,
        updated_at: new Date().toISOString(),
      })
      .eq("event_id", eventId)
      .eq("player_id", playerId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete roster entry
  delete: async (supabase: TypedSupabaseClient, rosterId: string) => {
    const { error } = await supabase.from("rosters").delete().eq("roster_id", rosterId)

    if (error) throw error
    return true
  },

  // Delete all roster entries for an event
  deleteByEvent: async (supabase: TypedSupabaseClient, eventId: string) => {
    const { error } = await supabase.from("rosters").delete().eq("event_id", eventId)

    if (error) throw error
    return true
  },
}

