import type { TypedSupabaseClient } from "@/utils/types"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

export type AttendanceRow = Tables<"attendance">
export type AttendanceInsert = TablesInsert<"attendance">
export type AttendanceUpdate = TablesUpdate<"attendance">

export const attendanceService = {
  // Get attendance by ID
  getById: async (supabase: TypedSupabaseClient, attendanceId: string) => {
    const { data, error } = await supabase.from("attendance").select("*").eq("attendance_id", attendanceId).single()

    if (error) throw error
    return data
  },

  // Get attendance by event
  getByEvent: async (supabase: TypedSupabaseClient, eventId: string) => {
    const { data, error } = await supabase
      .from("attendance")
      .select(`
        *,
        player:player_id(user_id, full_name)
      `)
      .eq("event_id", eventId)

    if (error) throw error
    return data
  },

  // Get attendance by player
  getByPlayer: async (supabase: TypedSupabaseClient, playerId: string) => {
    const { data, error } = await supabase
      .from("attendance")
      .select(`
        *,
        event:event_id(*)
      `)
      .eq("player_id", playerId)

    if (error) throw error
    return data
  },

  // Get player's attendance for an event
  getPlayerEventAttendance: async (supabase: TypedSupabaseClient, eventId: string, playerId: string) => {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("event_id", eventId)
      .eq("player_id", playerId)
      .single()

    if (error && error.code !== "PGRST116") throw error // PGRST116 is "No rows returned"
    return data
  },

  // Create or update attendance
  upsert: async (supabase: TypedSupabaseClient, attendance: AttendanceInsert) => {
    const { data, error } = await supabase
      .from("attendance")
      .upsert(attendance, {
        onConflict: "event_id,player_id",
        ignoreDuplicates: false,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update attendance
  update: async (supabase: TypedSupabaseClient, attendanceId: string, updates: AttendanceUpdate) => {
    const { data, error } = await supabase
      .from("attendance")
      .update(updates)
      .eq("attendance_id", attendanceId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete attendance
  delete: async (supabase: TypedSupabaseClient, attendanceId: string) => {
    const { error } = await supabase.from("attendance").delete().eq("attendance_id", attendanceId)

    if (error) throw error
    return true
  },
}

