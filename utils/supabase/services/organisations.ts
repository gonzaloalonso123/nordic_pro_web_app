import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../database.types";
import type { Tables, TablesInsert, TablesUpdate } from "../../database.types";

type OrganisationRow = Tables<"organisations">;
type OrganisationInsert = TablesInsert<"organisations">;
type OrganisationUpdate = TablesUpdate<"organisations">;

export const organisationsService = {
  // Get all organisations
  async getAll(supabase: SupabaseClient<Database>): Promise<OrganisationRow[]> {
    const { data, error } = await supabase
      .from("organisations")
      .select("*")
      .order("name");

    if (error) throw error;
    return data || [];
  },

  // Get organisation by ID
  async getById(
    supabase: SupabaseClient<Database>,
    organisationId: string
  ): Promise<OrganisationRow | null> {
    const { data, error } = await supabase
      .from("organisations")
      .select("*")
      .eq("id", organisationId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Get organisations by user
  async getByUser(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<OrganisationRow[]> {
    const { data, error } = await supabase
      .from("organisations")
      .select(
        `
        *,
        users_organisations!inner(user_id)
      `
      )
      .eq("users_organisations.user_id", userId);

    if (error) throw error;
    return data || [];
  },

  // Get organisations by team
  async getByTeam(
    supabase: SupabaseClient<Database>,
    teamId: string
  ): Promise<OrganisationRow[]> {
    const { data, error } = await supabase
      .from("organisations")
      .select(
        `
        *,
        teams_organisations!inner(team_id)
      `
      )
      .eq("teams_organisations.team_id", teamId);

    if (error) throw error;
    return data || [];
  },

  // Create organisation
  async create(
    supabase: SupabaseClient<Database>,
    organisation: OrganisationInsert
  ): Promise<OrganisationRow> {
    const { data, error } = await supabase
      .from("organisations")
      .insert(organisation)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update organisation
  async update(
    supabase: SupabaseClient<Database>,
    organisationId: string,
    updates: OrganisationUpdate
  ): Promise<OrganisationRow> {
    const { data, error } = await supabase
      .from("organisations")
      .update(updates)
      .eq("id", organisationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete organisation
  async delete(
    supabase: SupabaseClient<Database>,
    organisationId: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("organisations")
      .delete()
      .eq("id", organisationId);

    if (error) throw error;
    return true;
  },

  // Get organisation with teams
  async getWithTeams(
    supabase: SupabaseClient<Database>,
    organisationId: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from("organisations")
      .select(
        `
        *,
        teams_organisations(
          teams(*)
        )
      `
      )
      .eq("id", organisationId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Get organisation with users
  async getWithUsers(
    supabase: SupabaseClient<Database>,
    organisationId: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from("organisations")
      .select(
        `
        *,
        users_organisations(
          id,
          role,
          users(*)
        )
      `
      )
      .eq("id", organisationId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Get organisation with calendar
  async getWithCalendar(
    supabase: SupabaseClient<Database>,
    organisationId: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from("organisations")
      .select(
        `
        *,
        calendars(*)
      `
      )
      .eq("id", organisationId)
      .eq("calendars.entity_type", "ORGANISATION")
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },
  async addMember(
    supabase: SupabaseClient<Database>,
    organisationId: string,
    userId: string,
    role: string
  ) {
    const { data, error } = await supabase
      .from("users_organisations")
      .insert({
        organisation_id: organisationId,
        user_id: userId,
        role,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async removeMember(
    supabase: SupabaseClient<Database>,
    organisationId: string,
    userId: string
  ) {
    const { error } = await supabase
      .from("users_organisations")
      .delete()
      .eq("organisation_id", organisationId)
      .eq("user_id", userId);
    if (error) throw error;
    return true;
  },
  async addTeam(
    supabase: SupabaseClient<Database>,
    organisationId: string,
    teamId: string
  ) {
    const { data, error } = await supabase
      .from("teams_organisations")
      .insert({
        organisation_id: organisationId,
        team_id: teamId,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async removeTeam(
    supabase: SupabaseClient<Database>,
    organisationId: string,
    teamId: string
  ) {
    const { error } = await supabase
      .from("teams_organisations")
      .delete()
      .eq("organisation_id", organisationId)
      .eq("team_id", teamId);
    if (error) throw error;
    return true;
  },
};
