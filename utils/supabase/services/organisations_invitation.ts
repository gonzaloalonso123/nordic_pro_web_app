import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/utils/database.types";
import { serverData } from "@/utils/data/server";
import { usersService } from "./users";
import { teamsService } from "./teams";

type OrganisationInvitationRow =
  Database["public"]["Tables"]["organisations_invitation"]["Row"];
type OrganisationInvitationInsert =
  Database["public"]["Tables"]["organisations_invitation"]["Insert"];
type OrganisationInvitationUpdate =
  Database["public"]["Tables"]["organisations_invitation"]["Update"];

export const getAll = async (
  supabase: SupabaseClient<Database>
): Promise<OrganisationInvitationRow[]> => {
  const { data, error } = await supabase
    .from("organisations_invitation")
    .select("*");

  if (error) throw error;
  return data || [];
};

export const getById = async (
  supabase: SupabaseClient<Database>,
  invitationId: string
): Promise<OrganisationInvitationRow | null> => {
  const { data, error } = await supabase
    .from("organisations_invitation")
    .select("*")
    .eq("id", invitationId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
};

export const getByOrganisation = async (
  supabase: SupabaseClient<Database>,
  organisationId: string
): Promise<OrganisationInvitationRow[]> => {
  const { data, error } = await supabase
    .from("organisations_invitation")
    .select("*")
    .eq("organisation_id", organisationId);

  if (error) throw error;
  return data || [];
};

export const getByEmail = async (
  supabase: SupabaseClient<Database>,
  email: string
): Promise<OrganisationInvitationRow[]> => {
  const { data, error } = await supabase
    .from("organisations_invitation")
    .select("*")
    .eq("email", email);

  if (error) throw error;
  return data || [];
};

export const create = async (
  supabase: SupabaseClient<Database>,
  invitation: Omit<OrganisationInvitationInsert, "id">
): Promise<OrganisationInvitationRow> => {
  const newInvitation: OrganisationInvitationInsert = {
    ...invitation,
  };

  const { data, error } = await supabase
    .from("organisations_invitation")
    .insert(newInvitation)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const update = async (
  supabase: SupabaseClient<Database>,
  invitationId: string,
  updates: OrganisationInvitationUpdate
): Promise<OrganisationInvitationRow> => {
  const { data, error } = await supabase
    .from("organisations_invitation")
    .update(updates)
    .eq("id", invitationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteInvitation = async (
  supabase: SupabaseClient<Database>,
  invitationId: string
): Promise<boolean> => {
  const { error } = await supabase
    .from("organisations_invitation")
    .delete()
    .eq("id", invitationId);

  if (error) throw error;
  return true;
};

export const acceptInvitation = async (
  supabase: SupabaseClient<Database>,
  invitationId: string,
  userId: string
): Promise<boolean> => {
  const invitation = await getById(supabase, invitationId);
  if (!invitation) throw new Error("Invitation not found");
  if (userId) {
    const { error: userOrgError } = await supabase
      .from("users_organisations")
      .insert({
        user_id: userId,
        organisation_id: invitation.organisation_id,
        role: "USER",
      });

    if (invitation.team_id) {
      teamsService.addUserToTeam(
        supabase,
        invitation.team_id,
        userId,
        "MEMBER",
        "PLAYER"
      );
    }

    if (userOrgError) throw userOrgError;
  }

  return await deleteInvitation(supabase, invitationId);
};

export const rejectInvitation = async (
  supabase: SupabaseClient<Database>,
  invitationId: string
): Promise<boolean> => {
  return await deleteInvitation(supabase, invitationId);
};
