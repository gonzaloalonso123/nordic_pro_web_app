import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";
import { teamsService } from "./teams";
import { formsService } from "./forms";
import { formResponsesService } from "./forms-responses";
import { triggerNewFormAvailableNotification } from "@/utils/notificationService";

type FormInvitationRow = Tables<"form_invitations">;
type FormInvitationInsert = TablesInsert<"form_invitations">;
type FormInvitationUpdate = TablesUpdate<"form_invitations">;

export const formInvitationsService = {
  async getAll(supabase: SupabaseClient<Database>): Promise<FormInvitationRow[]> {
    const { data, error } = await supabase
      .from("form_invitations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(supabase: SupabaseClient<Database>, invitationId: string): Promise<FormInvitationRow | null> {
    const { data, error } = await supabase.from("form_invitations").select("*").eq("id", invitationId).single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async getByForm(supabase: SupabaseClient<Database>, formId: string): Promise<FormInvitationRow[]> {
    const { data, error } = await supabase.from("form_invitations").select("*").eq("form_id", formId);

    if (error) throw error;
    return data || [];
  },

  async getByUser(supabase: SupabaseClient<Database>, userId: string): Promise<any[]> {
    const { data, error } = await supabase.from("form_invitations").select("*").eq("user_id", userId);

    if (error) throw error;
    const dataWithForms = await Promise.all(
      (data || []).map(async (invitation: FormInvitationRow) => {
        const form = await formsService.getById(supabase, invitation.form_id);
        return {
          ...invitation,
          form,
        };
      })
    );

    return dataWithForms;
  },

  async getByFormAndUser(
    supabase: SupabaseClient<Database>,
    formId: string,
    userId: string
  ): Promise<FormInvitationRow | null> {
    const { data, error } = await supabase
      .from("form_invitations")
      .select("*")
      .eq("form_id", formId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async getByTeam(supabase: SupabaseClient<Database>, teamId: string): Promise<FormInvitationRow[]> {
    const teamUsers = await teamsService.getWithUsers(supabase, teamId);
    if (!teamUsers || !teamUsers.users) {
      throw new Error("Team not found or has no members");
    }
    const userIds = teamUsers.users.map((u) => u.user.id);
    const { data, error } = await supabase
      .from("form_invitations")
      .select("*, users(first_name, last_name)")
      .in("user_id", userIds);
    if (error) throw error;
    return data || [];
  },

  async getWithFormByTeam(supabase: SupabaseClient<Database>, teamId: string): Promise<any[]> {
    const byTeam = await this.getByTeam(supabase, teamId);
    const commonInvitations = byTeam.reduce((acc: any, invitation: any) => {
      const commonInvitation = invitation.common_invitation_id;
      if (!acc.includes(commonInvitation)) {
        acc.push(commonInvitation);
      }
      return acc;
    }, []);

    const { data, error } = await supabase
      .from("form_invitations")
      .select(
        `
        *,
        forms(
          id,
          title,
          description,
          created_at,
          updated_at
        ),
        users(
          first_name,
          last_name
        )
      `
      )
      .in("common_invitation_id", commonInvitations);

    if (error) throw error;
    const groups: Record<string, any> = {};
    for (const invitation of data || []) {
      const commonId = invitation.common_invitation_id;
      if (commonId && !groups[commonId]) {
        groups[commonId] = {
          id: commonId,
          form: invitation.forms,
          created_at: invitation.created_at,
          team_id: teamId,
          invitations: [],
        };
      }

      if (invitation.completed) {
        const formResponse = await formResponsesService.getByInvitation(supabase, invitation.id);
        invitation.response = formResponse;
      }
      groups[commonId].invitations.push(invitation);
    }

    return Object.values(groups);
  },

  async create(supabase: SupabaseClient<Database>, invitation: FormInvitationInsert): Promise<FormInvitationRow> {
    const { data, error } = await supabase.from("form_invitations").insert(invitation).select().single();

    if (error) throw error;

    triggerNewFormAvailableNotification({
      recipientUserIds: [invitation.user_id!],
      formId: invitation.form_id!,
    }).catch((err) => {
      console.error("Error triggering form available notification:", err);
    });
    return data;
  },

  async update(
    supabase: SupabaseClient<Database>,
    invitationId: string,
    updates: FormInvitationUpdate
  ): Promise<FormInvitationRow> {
    const { data, error } = await supabase
      .from("form_invitations")
      .update(updates)
      .eq("id", invitationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete invitation
  async delete(supabase: SupabaseClient<Database>, invitationId: string): Promise<boolean> {
    const { error } = await supabase.from("form_invitations").delete().eq("id", invitationId);

    if (error) throw error;
    return true;
  },

  async bulkCreate(
    supabase: SupabaseClient<Database>,
    invitations: FormInvitationInsert[]
  ): Promise<FormInvitationRow[]> {
    const { data, error } = await supabase.from("form_invitations").insert(invitations).select();

    if (error) throw error;
    return data || [];
  },

  async sendToTeam(supabase: SupabaseClient<Database>, formId: string, teamId: string): Promise<FormInvitationRow[]> {
    const teamUsers = await teamsService.getWithUsers(supabase, teamId);
    if (!teamUsers || !teamUsers.users) {
      throw new Error("Team not found or has no members");
    }

    const created_at = new Date().toISOString();
    const invitations: FormInvitationInsert[] = teamUsers.users
      .filter((user) => user.role === "PLAYER")
      .map((userObj: any) => ({
        form_id: formId,
        user_id: userObj.user.id,
        created_at: created_at,
        common_invitation_id: `${teamId.split("-")[0]}-${formId.split("-")[0]}-${new Date().getTime()}`,
      }));
    return await this.bulkCreate(supabase, invitations);
  },

  async sendToMembers(
    supabase: SupabaseClient<Database>,
    formId: string,
    userIds: string[]
  ): Promise<FormInvitationRow[]> {
    if (!userIds || userIds.length === 0) {
      throw new Error("No user IDs provided for sending invitations");
    }
    const created_at = new Date().toISOString();
    const invitations: FormInvitationInsert[] = userIds.map((userId) => ({
      form_id: formId,
      user_id: userId,
      created_at: created_at,
      common_invitation_id: `${userId.split("-")[0]}-${formId.split("-")[0]}-${new Date().getTime()}`,
    }));
    return await this.bulkCreate(supabase, invitations);
  },

  async getWithUserDetails(supabase: SupabaseClient<Database>, invitationId: string): Promise<any> {
    const { data, error } = await supabase
      .from("form_invitations")
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
