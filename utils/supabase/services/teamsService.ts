import type { TypedSupabaseClient } from "@/utils/types"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

export type TeamRow = Tables<"teams">
export type TeamInsert = TablesInsert<"teams">
export type TeamUpdate = TablesUpdate<"teams">

export const teamsService = {
  // Get all teams
  getAll: async (supabase: TypedSupabaseClient) => {
    const { data, error } = await supabase.from("teams").select("*").order("team_name")

    if (error) throw error
    return data
  },

  // Get team by ID
  getById: async (supabase: TypedSupabaseClient, teamId: string) => {
    const { data, error } = await supabase.from("teams").select("*").eq("team_id", teamId).single()

    if (error) throw error
    return data
  },

  // Get team with members
  getWithMembers: async (supabase: TypedSupabaseClient, teamId: string) => {
    const { data, error } = await supabase
      .from("teams")
      .select(`
        *,
        users:users(*)
      `)
      .eq("team_id", teamId)
      .single()

    if (error) throw error
    return data
  },

  // Create a new team
  create: async (supabase: TypedSupabaseClient, team: TeamInsert) => {
    const { data, error } = await supabase.from("teams").insert(team).select().single()

    if (error) throw error
    return data
  },

  // Update a team
  update: async (supabase: TypedSupabaseClient, teamId: string, updates: TeamUpdate) => {
    const { data, error } = await supabase.from("teams").update(updates).eq("team_id", teamId).select().single()

    if (error) throw error
    return data
  },

  // Delete a team
  delete: async (supabase: TypedSupabaseClient, teamId: string) => {
    const { error } = await supabase.from("teams").delete().eq("team_id", teamId)

    if (error) throw error
    return true
  },
}

