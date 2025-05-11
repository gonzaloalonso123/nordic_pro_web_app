import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../database.types";
import type { Tables, TablesInsert, TablesUpdate } from "../../database.types";

type TeamRow = Tables<"teams">;
type TeamInsert = TablesInsert<"teams">;
type TeamUpdate = TablesUpdate<"teams">;

export const teamsService = {
  async getAll(supabase: SupabaseClient<Database>): Promise<TeamRow[]> {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("name");

    if (error) throw error;
    return data || [];
  },

  // Get team by ID
  async getById(
    supabase: SupabaseClient<Database>,
    teamId: string
  ): Promise<TeamRow | null> {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Get teams by user
  async getByUser(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<TeamRow[]> {
    const { data, error } = await supabase
      .from("teams")
      .select(
        `
        *,
        users_teams!inner(users_id)
      `
      )
      .eq("users_teams.users_id", userId);

    if (error) throw error;
    return data || [];
  },

  // Get teams by organisation
  async getByOrganisation(
    supabase: SupabaseClient<Database>,
    organisationId: string
  ): Promise<TeamRow[]> {
    const { data, error } = await supabase
      .from("teams")
      .select(
        `
        *,
        teams_organisations!inner(organisation_id)
      `
      )
      .eq("teams_organisations.organisation_id", organisationId);

    if (error) throw error;
    return data || [];
  },

  // Create team
  async create(
    supabase: SupabaseClient<Database>,
    team: TeamInsert
  ): Promise<TeamRow> {
    const { data, error } = await supabase
      .from("teams")
      .insert(team)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update team
  async update(
    supabase: SupabaseClient<Database>,
    teamId: string,
    updates: TeamUpdate
  ): Promise<TeamRow> {
    const { data, error } = await supabase
      .from("teams")
      .update(updates)
      .eq("id", teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete team
  async delete(
    supabase: SupabaseClient<Database>,
    teamId: string
  ): Promise<boolean> {
    const { error } = await supabase.from("teams").delete().eq("id", teamId);

    if (error) throw error;
    return true;
  },

  // Get team with users
  async getWithUsers(
    supabase: SupabaseClient<Database>,
    teamId: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from("teams")
      .select(
        `
        *,
        users:users_teams(
          id,
          role,
          position,
          user:users(*)
        )
      `
      )
      .eq("id", teamId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async getWithOrganisations(
    supabase: SupabaseClient<Database>,
    teamId: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from("teams")
      .select(
        `
        *,
        teams_organisations(
          organisations(*)
        )
      `
      )
      .eq("id", teamId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Get team with calendar
  async getWithCalendar(
    supabase: SupabaseClient<Database>,
    teamId: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from("teams")
      .select(
        `
        *,
        calendars(*)
      `
      )
      .eq("id", teamId)
      .eq("calendars.entity_type", "TEAM")
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async addUserToTeam(
    supabase: SupabaseClient<Database>,
    teamId: string,
    userId: string,
    role: string,
    position: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from("users_teams")
      .insert({
        team_id: teamId,
        user_id: userId,
        role,
        position,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async removeUserFromTeam(
    supabase: SupabaseClient<Database>,
    teamId: string,
    userId: string
  ): Promise<any> {
    const { error } = await supabase
      .from("users_teams")
      .delete()
      .eq("team_id", teamId)
      .eq("users_id", userId);
    if (error) throw error;
    return true;
  },
};
