import type { TypedSupabaseClient } from "@/utils/types"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

export type UserRow = Tables<"users">
export type UserInsert = TablesInsert<"users">
export type UserUpdate = TablesUpdate<"users">
export type UserRole = "player" | "coach" | "parent" | "admin"

export const usersService = {
  // Get all users
  getAll: async (supabase: TypedSupabaseClient) => {
    const { data, error } = await supabase.from("users").select("*").order("full_name")

    if (error) throw error
    return data
  },

  // Get user by ID
  getById: async (supabase: TypedSupabaseClient, userId: string) => {
    const { data, error } = await supabase.from("users").select("*").eq("user_id", userId).single()

    if (error) throw error
    return data
  },

  // Get user by email
  getByEmail: async (supabase: TypedSupabaseClient, email: string) => {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) throw error
    return data
  },

  // Get users by role
  getByRole: async (supabase: TypedSupabaseClient, role: UserRole) => {
    const { data, error } = await supabase.from("users").select("*").eq("role", role).order("full_name")

    if (error) throw error
    return data
  },

  // Get users by team
  getByTeam: async (supabase: TypedSupabaseClient, teamId: string) => {
    const { data, error } = await supabase.from("users").select("*").eq("team_id", teamId).order("full_name")

    if (error) throw error
    return data
  },

  // Get players by team
  getPlayersByTeam: async (supabase: TypedSupabaseClient, teamId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("team_id", teamId)
      .eq("role", "player")
      .order("full_name")

    if (error) throw error
    return data
  },

  // Get coaches by team
  getCoachesByTeam: async (supabase: TypedSupabaseClient, teamId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("team_id", teamId)
      .eq("role", "coach")
      .order("full_name")

    if (error) throw error
    return data
  },

  // Get children of a parent
  getChildren: async (supabase: TypedSupabaseClient, parentId: string) => {
    const { data, error } = await supabase
      .from("parent_child")
      .select(`
        child:child_id(*)
      `)
      .eq("parent_id", parentId)

    if (error) throw error
    return data.map((item) => item.child)
  },

  // Get parents of a child
  getParents: async (supabase: TypedSupabaseClient, childId: string) => {
    const { data, error } = await supabase
      .from("parent_child")
      .select(`
        parent:parent_id(*)
      `)
      .eq("child_id", childId)

    if (error) throw error
    return data.map((item) => item.parent)
  },

  // Create a new user
  create: async (supabase: TypedSupabaseClient, user: UserInsert) => {
    const { data, error } = await supabase.from("users").insert(user).select().single()

    if (error) throw error
    return data
  },

  // Update a user
  update: async (supabase: TypedSupabaseClient, userId: string, updates: UserUpdate) => {
    const { data, error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a user
  delete: async (supabase: TypedSupabaseClient, userId: string) => {
    const { error } = await supabase.from("users").delete().eq("user_id", userId)

    if (error) throw error
    return true
  },

  // Add parent-child relationship
  addParentChild: async (supabase: TypedSupabaseClient, parentId: string, childId: string) => {
    const { data, error } = await supabase
      .from("parent_child")
      .insert({ parent_id: parentId, child_id: childId })
      .select()

    if (error) throw error
    return data
  },

  // Remove parent-child relationship
  removeParentChild: async (supabase: TypedSupabaseClient, parentId: string, childId: string) => {
    const { error } = await supabase.from("parent_child").delete().eq("parent_id", parentId).eq("child_id", childId)

    if (error) throw error
    return true
  },
}

