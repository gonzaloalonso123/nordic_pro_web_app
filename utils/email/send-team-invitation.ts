"use server";
import { Resend } from "resend";
import { JOIN_TEAM_SWEDISH } from "../email-templates/join-team-swedish";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/utils/database.types";
import * as organisationsInvitation from "../supabase/services/organisations_invitation";
import { createClient } from "../supabase/server";

const resend = new Resend("re_7GG7eMSx_8AaSGrUWtumrtMd2sWXH75Ro");

interface SendTeamInvitationParams {
  email: string;
  invitatorName: string;
  organisationId: string;
  organisationName: string;
  invitationId: string;
  teamName?: string;
  teamId?: string;
}

export const sendTeamInvitation = async ({
  email,
  invitatorName,
  organisationId,
  organisationName,
  invitationId,
  teamId,
  teamName,
}: SendTeamInvitationParams): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const supabase = await createClient();
    const { data: existingUsers } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1);

    const userExists = existingUsers && existingUsers.length > 0;
    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!userExists) {
      const emailHtml = JOIN_TEAM_SWEDISH(
        invitatorName,
        organisationName,
        redirectUrl,
        invitationId,
        teamName
      );
      const { data, error } = await resend.emails.send({
        from: "NordicPro <no-reply@nordicpro.se>",
        to: email,
        subject: `${invitatorName} har bjudit in dig ${teamName ? `till teamet: ${teamName}` : ""}`,
        html: emailHtml,
      });
      if (error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }
    }
    return {
      success: true,
      message: "Team invitation sent successfully",
    };
  } catch (error) {
    console.error("Error sending team invitation:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
