import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types"

type EventAttendanceRow = Tables<"events_attendance">
type EventAttendanceInsert = TablesInsert<"events_attendance">
type EventAttendanceUpdate = TablesUpdate<"events_attendance">

export const eventsAttendanceService = {
  // Get all attendance records
  async getAll(supabase: SupabaseClient<Database>): Promise<EventAttendanceRow[]> {
    const { data, error } = await supabase.from("events_attendance").select("*")

    if (error) throw error
    return data || []
  },

  // Get attendance record by ID
  async getById(supabase: SupabaseClient<Database>, attendanceId: string): Promise<EventAttendanceRow | null> {
    const { data, error } = await supabase.from("events_attendance").select("*").eq("id", attendanceId).single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  // Get attendance records by event
  async getByEvent(supabase: SupabaseClient<Database>, eventId: string): Promise<EventAttendanceRow[]> {
    const { data, error } = await supabase.from("events_attendance").select("*").eq("event_id", eventId)

    if (error) throw error
    return data || []
  },

  // Get attendance records by user
  async getByUser(supabase: SupabaseClient<Database>, userId: string): Promise<EventAttendanceRow[]> {
    const { data, error } = await supabase.from("events_attendance").select("*").eq("user_id", userId)

    if (error) throw error
    return data || []
  },

  // Get attendance records by event and user
  async getByEventAndUser(
    supabase: SupabaseClient<Database>,
    eventId: string,
    userId: string,
  ): Promise<EventAttendanceRow | null> {
    const { data, error } = await supabase
      .from("events_attendance")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  // Create attendance record
  async create(supabase: SupabaseClient<Database>, attendance: EventAttendanceInsert): Promise<EventAttendanceRow> {
    const { data, error } = await supabase.from("events_attendance").insert(attendance).select().single()

    if (error) throw error
    return data
  },

  // Update attendance record
  async update(
    supabase: SupabaseClient<Database>,
    attendanceId: string,
    updates: EventAttendanceUpdate,
  ): Promise<EventAttendanceRow> {
    const { data, error } = await supabase
      .from("events_attendance")
      .update(updates)
      .eq("id", attendanceId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete attendance record
  async delete(supabase: SupabaseClient<Database>, attendanceId: string): Promise<boolean> {
    const { error } = await supabase.from("events_attendance").delete().eq("id", attendanceId)

    if (error) throw error
    return true
  },

  // Bulk create attendance records
  async bulkCreate(
    supabase: SupabaseClient<Database>,
    attendances: EventAttendanceInsert[],
  ): Promise<EventAttendanceRow[]> {
    const { data, error } = await supabase.from("events_attendance").insert(attendances).select()

    if (error) throw error
    return data || []
  },

  // Get attendance with user details
  async getWithUserDetails(supabase: SupabaseClient<Database>, attendanceId: string): Promise<any> {
    const { data, error } = await supabase
      .from("events_attendance")
      .select(`
        *,
        users(
          id,
          first_name,
          last_name,
          email,
          avatar
        )
      `)
      .eq("id", attendanceId)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },
}
