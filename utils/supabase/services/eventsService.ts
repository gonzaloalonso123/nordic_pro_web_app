import type { TypedSupabaseClient } from "@/utils/types"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

export type EventRow = Tables<"events">
export type EventInsert = TablesInsert<"events">
export type EventUpdate = TablesUpdate<"events">
export type EventType = "training" | "match" | "other"

export const eventsService = {
  // Get all events
  getAll: async (supabase: TypedSupabaseClient) => {
    const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: true })

    if (error) throw error
    return data
  },

  // Get event by ID
  getById: async (supabase: TypedSupabaseClient, eventId: string) => {
    const { data, error } = await supabase.from("events").select("*").eq("event_id", eventId).single()

    if (error) throw error
    return data
  },

  // Get events by team
  getByTeam: async (supabase: TypedSupabaseClient, teamId: string) => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("team_id", teamId)
      .order("event_date", { ascending: true })

    if (error) throw error
    return data
  },

  // Get upcoming events by team
  getUpcomingByTeam: async (supabase: TypedSupabaseClient, teamId: string) => {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("team_id", teamId)
      .gte("event_date", now)
      .order("event_date", { ascending: true })

    if (error) throw error
    return data
  },

  // Get past events by team
  getPastByTeam: async (supabase: TypedSupabaseClient, teamId: string) => {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("team_id", teamId)
      .lt("event_date", now)
      .order("event_date", { ascending: false })

    if (error) throw error
    return data
  },

  // Get events by type and team
  getByTypeAndTeam: async (supabase: TypedSupabaseClient, eventType: EventType, teamId: string) => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("event_type", eventType)
      .eq("team_id", teamId)
      .order("event_date", { ascending: true })

    if (error) throw error
    return data
  },

  // Get event with attendance
  getWithAttendance: async (supabase: TypedSupabaseClient, eventId: string) => {
    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        attendance:attendance(*)
      `)
      .eq("event_id", eventId)
      .single()

    if (error) throw error
    return data
  },

  // Get event with roster
  getWithRoster: async (supabase: TypedSupabaseClient, eventId: string) => {
    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        rosters:rosters(*)
      `)
      .eq("event_id", eventId)
      .single()

    if (error) throw error
    return data
  },

  // Create a new event
  create: async (supabase: TypedSupabaseClient, event: EventInsert) => {
    const { data, error } = await supabase.from("events").insert(event).select().single()

    if (error) throw error
    return data
  },

  // Update an event
  update: async (supabase: TypedSupabaseClient, eventId: string, updates: EventUpdate) => {
    const { data, error } = await supabase.from("events").update(updates).eq("event_id", eventId).select().single()

    if (error) throw error
    return data
  },

  // Delete an event
  delete: async (supabase: TypedSupabaseClient, eventId: string) => {
    const { error } = await supabase.from("events").delete().eq("event_id", eventId)

    if (error) throw error
    return true
  },
}

