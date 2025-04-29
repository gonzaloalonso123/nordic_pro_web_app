import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../../database.types"
import type { Tables, TablesInsert, TablesUpdate } from "../../database.types"

type CalendarRow = Tables<"calendars">
type CalendarInsert = TablesInsert<"calendars">
type CalendarUpdate = TablesUpdate<"calendars">

export const calendarsService = {
  // Get all calendars
  async getAll(supabase: SupabaseClient<Database>): Promise<CalendarRow[]> {
    const { data, error } = await supabase.from("calendars").select("*")

    if (error) throw error
    return data || []
  },

  // Get calendar by ID
  async getById(supabase: SupabaseClient<Database>, calendarId: string): Promise<CalendarRow | null> {
    const { data, error } = await supabase.from("calendars").select("*").eq("id", calendarId).single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  // Get calendar by team
  async getByTeam(supabase: SupabaseClient<Database>, teamId: string): Promise<CalendarRow | null> {
    const { data, error } = await supabase
      .from("calendars")
      .select("*")
      .eq("team_id", teamId)
      .eq("entity_type", "TEAM")
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  // Get calendar by organisation
  async getByOrganisation(supabase: SupabaseClient<Database>, organisationId: string): Promise<CalendarRow | null> {
    const { data, error } = await supabase
      .from("calendars")
      .select("*")
      .eq("organisation_id", organisationId)
      .eq("entity_type", "ORGANISATION")
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  // Create calendar
  async create(supabase: SupabaseClient<Database>, calendar: CalendarInsert): Promise<CalendarRow> {
    const { data, error } = await supabase.from("calendars").insert(calendar).select().single()

    if (error) throw error
    return data
  },

  // Update calendar
  async update(supabase: SupabaseClient<Database>, calendarId: string, updates: CalendarUpdate): Promise<CalendarRow> {
    const { data, error } = await supabase.from("calendars").update(updates).eq("id", calendarId).select().single()

    if (error) throw error
    return data
  },

  // Delete calendar
  async delete(supabase: SupabaseClient<Database>, calendarId: string): Promise<boolean> {
    const { error } = await supabase.from("calendars").delete().eq("id", calendarId)

    if (error) throw error
    return true
  },

  // Get calendar with events
  async getWithEvents(supabase: SupabaseClient<Database>, calendarId: string): Promise<any> {
    const { data, error } = await supabase
      .from("calendars")
      .select(`
        *,
        events(*)
      `)
      .eq("id", calendarId)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },
}
