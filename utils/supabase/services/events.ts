import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../../database.types"
import type { Tables, TablesInsert, TablesUpdate } from "../../database.types"

type EventRow = Tables<"events">
type EventInsert = TablesInsert<"events">
type EventUpdate = TablesUpdate<"events">

export const eventsService = {
  // Get all events
  async getAll(supabase: SupabaseClient<Database>): Promise<EventRow[]> {
    const { data, error } = await supabase.from("events").select("*").order("start_date", { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get event by ID
  async getById(supabase: SupabaseClient<Database>, eventId: string): Promise<EventRow | null> {
    const { data, error } = await supabase.from("events").select("*").eq("id", eventId).single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  // Get events by calendar
  async getByCalendar(supabase: SupabaseClient<Database>, calendarId: string): Promise<EventRow[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("calendar_id", calendarId)
      .order("start_date", { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get events by team (via calendar)
  async getByTeam(supabase: SupabaseClient<Database>, teamId: string): Promise<EventRow[]> {
    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        calendars!inner(team_id)
      `)
      .eq("calendars.team_id", teamId)
      .eq("calendars.entity_type", "TEAM")
      .order("start_date", { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get events by organisation (via calendar)
  async getByOrganisation(supabase: SupabaseClient<Database>, organisationId: string): Promise<EventRow[]> {
    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        calendars!inner(organisation_id)
      `)
      .eq("calendars.organisation_id", organisationId)
      .eq("calendars.entity_type", "ORGANISATION")
      .order("start_date", { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get upcoming events by team
  async getUpcomingByTeam(supabase: SupabaseClient<Database>, teamId: string): Promise<EventRow[]> {
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        calendars!inner(team_id)
      `)
      .eq("calendars.team_id", teamId)
      .eq("calendars.entity_type", "TEAM")
      .gte("start_date", now)
      .order("start_date", { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get past events by team
  async getPastByTeam(supabase: SupabaseClient<Database>, teamId: string): Promise<EventRow[]> {
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        calendars!inner(team_id)
      `)
      .eq("calendars.team_id", teamId)
      .eq("calendars.entity_type", "TEAM")
      .lt("end_date", now)
      .order("start_date", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get events by type and team
  async getByTypeAndTeam(supabase: SupabaseClient<Database>, eventType: string, teamId: string): Promise<EventRow[]> {
    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        calendars!inner(team_id)
      `)
      .eq("type", eventType.toUpperCase())
      .eq("calendars.team_id", teamId)
      .eq("calendars.entity_type", "TEAM")
      .order("start_date", { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get event with attendance
  async getWithAttendance(supabase: SupabaseClient<Database>, eventId: string): Promise<any> {
    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        events_attendance(
          id,
          user_id,
          did_attend,
          reason,
          users(
            id,
            first_name,
            last_name,
            email,
            avatar
          )
        )
      `)
      .eq("id", eventId)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  // Get event with roster
  async getWithRoster(supabase: SupabaseClient<Database>, eventId: string): Promise<any> {
    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        events_invitation(
          id,
          user_id,
          will_attend,
          reason,
          users(
            id,
            first_name,
            last_name,
            email,
            avatar
          )
        )
      `)
      .eq("id", eventId)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  // Create event
  async create(supabase: SupabaseClient<Database>, event: EventInsert): Promise<EventRow> {
    const { data, error } = await supabase.from("events").insert(event).select().single()

    if (error) throw error
    return data
  },

  // Update event
  async update(supabase: SupabaseClient<Database>, eventId: string, updates: EventUpdate): Promise<EventRow> {
    const { data, error } = await supabase.from("events").update(updates).eq("id", eventId).select().single()

    if (error) throw error
    return data
  },

  // Delete event
  async delete(supabase: SupabaseClient<Database>, eventId: string): Promise<boolean> {
    const { error } = await supabase.from("events").delete().eq("id", eventId)

    if (error) throw error
    return true
  },
}
