import type { TypedSupabaseClient } from "@/utils/types"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

export type TrophyRow = Tables<"trophies">
export type TrophyInsert = TablesInsert<"trophies">
export type TrophyUpdate = TablesUpdate<"trophies">
export type TrophyType = "gold" | "green"

export const trophiesService = {
  // Get trophy by ID
  getById: async (supabase: TypedSupabaseClient, trophyId: string) => {
    const { data, error } = await supabase.from("trophies").select("*").eq("trophy_id", trophyId).single()

    if (error) throw error
    return data
  },

  // Get trophies by week
  getByWeek: async (supabase: TypedSupabaseClient, weekStartDate: string) => {
    const { data, error } = await supabase
      .from("trophies")
      .select(`
        *,
        player:player_id(user_id, full_name)
      `)
      .eq("week_start_date", weekStartDate)

    if (error) throw error
    return data
  },

  // Get trophies by player
  getByPlayer: async (supabase: TypedSupabaseClient, playerId: string) => {
    const { data, error } = await supabase.from("trophies").select("*").eq("player_id", playerId)

    if (error) throw error
    return data
  },

  // Get trophies by type and week
  getByTypeAndWeek: async (supabase: TypedSupabaseClient, trophyType: TrophyType, weekStartDate: string) => {
    const { data, error } = await supabase
      .from("trophies")
      .select(`
        *,
        player:player_id(user_id, full_name)
      `)
      .eq("trophy_type", trophyType)
      .eq("week_start_date", weekStartDate)

    if (error) throw error
    return data
  },

  // Get player's trophies for a specific week
  getPlayerWeekTrophies: async (supabase: TypedSupabaseClient, playerId: string, weekStartDate: string) => {
    const { data, error } = await supabase
      .from("trophies")
      .select("*")
      .eq("player_id", playerId)
      .eq("week_start_date", weekStartDate)

    if (error) throw error
    return data
  },

  // Create a trophy
  create: async (supabase: TypedSupabaseClient, trophy: TrophyInsert) => {
    const { data, error } = await supabase.from("trophies").insert(trophy).select().single()

    if (error) throw error
    return data
  },

  // Update a trophy
  update: async (supabase: TypedSupabaseClient, trophyId: string, updates: TrophyUpdate) => {
    const { data, error } = await supabase.from("trophies").update(updates).eq("trophy_id", trophyId).select().single()

    if (error) throw error
    return data
  },

  // Delete a trophy
  delete: async (supabase: TypedSupabaseClient, trophyId: string) => {
    const { error } = await supabase.from("trophies").delete().eq("trophy_id", trophyId)

    if (error) throw error
    return true
  },

  // Count trophies by player
  countByPlayer: async (supabase: TypedSupabaseClient, playerId: string) => {
    const { data, error } = await supabase.from("trophies").select("trophy_type").eq("player_id", playerId)

    if (error) throw error

    const goldCount = data.filter((t) => t.trophy_type === "gold").length
    const greenCount = data.filter((t) => t.trophy_type === "green").length

    return { gold: goldCount, green: greenCount, total: data.length }
  },
}

