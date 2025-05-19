import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";
import { getByEmail } from "./organisations_invitation";

type UserRow = Tables<"users">;
type UserInsert = TablesInsert<"users">;
type UserUpdate = TablesUpdate<"users">;

export const usersService = {
  // Get all users
  async getAll(supabase: SupabaseClient<Database>): Promise<UserRow[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get user by ID
  async getById(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<UserRow | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .is("deleted_at", null)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows returned"
    return data;
  },

  async getByIds(
    supabase: SupabaseClient<Database>,
    userIds: string[]
  ): Promise<UserRow[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .in("id", userIds)
      .is("deleted_at", null);

    if (error) throw error;
    return data || [];
  },

  // Get users by organisation
  async getByOrganisation(
    supabase: SupabaseClient<Database>,
    organisationId: string
  ): Promise<UserRow[]> {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *,
        users_organisations!inner(organisation_id)
      `
      )
      .eq("users_organisations.organisation_id", organisationId)
      .is("deleted_at", null);

    if (error) throw error;
    return data || [];
  },

  // Get users by team
  async getByTeam(
    supabase: SupabaseClient<Database>,
    teamId: string
  ): Promise<UserRow[]> {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *,
        users_teams!inner(team_id)
      `
      )
      .eq("users_teams.team_id", teamId)
      .is("deleted_at", null);

    if (error) throw error;
    return data || [];
  },

  // Create user
  async create(
    supabase: SupabaseClient<Database>,
    user: UserInsert
  ): Promise<UserRow> {
    const { data, error } = await supabase
      .from("users")
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update user
  async update(
    supabase: SupabaseClient<Database>,
    userId: string,
    updates: UserUpdate
  ): Promise<UserRow> {
    const { data, error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Soft delete user
  async softDelete(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("users")
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;
    return true;
  },

  // Hard delete user (use with caution)
  async hardDelete(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<boolean> {
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) throw error;
    return true;
  },

  // Get user with teams
  async getWithTeams(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *,
        users_teams(
          id,
          role,
          position,
          teams(*)
        )
      `
      )
      .eq("id", userId)
      .is("deleted_at", null)
      .single();

    if (error && error.code !== "PGRST116") {
      console.log("here", error);
      throw error;
    }
    return data;
  },

  // Get user with organisations
  async getWithOrganisations(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *,
        users_organisations(
          id,
          role,
          organisations(*)
        )
      `
      )
      .eq("id", userId)
      .is("deleted_at", null)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async getByEmail(
    supabase: SupabaseClient<Database>,
    email: string
  ): Promise<UserRow | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .is("deleted_at", null)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data;
  },
};
