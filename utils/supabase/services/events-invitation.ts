import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../database.types";
import type { Tables, TablesInsert, TablesUpdate } from "../../database.types";

type EventInvitationRow = Tables<"events_invitation">;
type EventInvitationInsert = TablesInsert<"events_invitation">;
type EventInvitationUpdate = TablesUpdate<"events_invitation">;

export const eventsInvitationService = {
  // Get all invitations
  async getAll(
    supabase: SupabaseClient<Database>
  ): Promise<EventInvitationRow[]> {
    const { data, error } = await supabase
      .from("events_invitation")
      .select("*");

    if (error) throw error;
    return data || [];
  },

  // Get invitation by ID
  async getById(
    supabase: SupabaseClient<Database>,
    invitationId: string
  ): Promise<EventInvitationRow | null> {
    const { data, error } = await supabase
      .from("events_invitation")
      .select("*")
      .eq("id", invitationId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Get invitations by event
  async getByEvent(
    supabase: SupabaseClient<Database>,
    eventId: string
  ): Promise<EventInvitationRow[]> {
    const { data, error } = await supabase
      .from("events_invitation")
      .select("*")
      .eq("event_id", eventId);

    if (error) throw error;
    return data || [];
  },

  async getByUser(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<EventInvitationRow[]> {
    const { data, error } = await supabase
      .from("events_invitation")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  },

  // Get invitation by event and user
  async getByEventAndUser(
    supabase: SupabaseClient<Database>,
    eventId: string,
    userId: string
  ): Promise<EventInvitationRow | null> {
    const { data, error } = await supabase
      .from("events_invitation")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Create invitation
  async create(
    supabase: SupabaseClient<Database>,
    invitation: EventInvitationInsert
  ): Promise<EventInvitationRow> {
    const { data, error } = await supabase
      .from("events_invitation")
      .insert(invitation)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(
    supabase: SupabaseClient<Database>,
    invitationId: string,
    updates: EventInvitationUpdate
  ): Promise<EventInvitationRow> {
    const { data, error } = await supabase
      .from("events_invitation")
      .update(updates)
      .eq("id", invitationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(
    supabase: SupabaseClient<Database>,
    invitationId: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("events_invitation")
      .delete()
      .eq("id", invitationId);

    if (error) throw error;
    return true;
  },

  async bulkCreate(
    supabase: SupabaseClient<Database>,
    invitations: EventInvitationInsert[]
  ): Promise<EventInvitationRow[]> {
    const { data, error } = await supabase
      .from("events_invitation")
      .insert(invitations)
      .select();

    if (error) throw error;
    return data || [];
  },

  async getWithUserDetails(
    supabase: SupabaseClient<Database>,
    invitationId: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from("events_invitation")
      .select(
        `
        *,
        users(
          id,
          first_name,
          last_name,
          email,
          avatar
        )
      `
      )
      .eq("id", invitationId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },
};
