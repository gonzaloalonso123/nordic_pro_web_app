import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { Tables, TablesInsert } from "@/types/database.types";

type FormResponseRow = Tables<"form_responses">;
type FormResponseInsert = TablesInsert<"form_responses">;
type QuestionResponseInsert = TablesInsert<"question_responses">;

export const formResponsesService = {
  async getByForm(
    supabase: SupabaseClient<Database>,
    formId: string
  ): Promise<any[]> {
    const { data, error } = await supabase
      .from("form_responses")
      .select(
        `
        *,
        users(id, name),
        question_responses(
          id,
          question_id,
          response,
          questions(
            id,
            question,
            input_type,
            categories(name)
          )
        )
      `
      )
      .eq("form_id", formId)
      .order("submitted_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByOrganization(
    supabase: SupabaseClient<Database>,
    organizationId: string
  ): Promise<any[]> {
    const { data, error } = await supabase
      .from("form_responses")
      .select(
        `
        *,
        forms(id, title),
        users(id, name),
        question_responses(
          id,
          question_id,
          response,
          questions(
            id,
            question,
            input_type
          )
        )
      `
      )
      .eq("organization_id", organizationId)
      .order("submitted_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  },

  async getByInvitation(
    supabase: SupabaseClient<Database>,
    invitationId: string
  ): Promise<any[]> {
    const { data, error } = await supabase
      .from("form_responses")
      .select(
        `
        *,
        forms(id, title),
        question_responses(
          id,
          question_id,
          response,
          questions(
            id,
            question,
            input_type,
            question_options(
              *
            )
          )
        )
          `
      )
      .eq("invitation_id", invitationId)
      .order("submitted_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByUser(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<any[]> {
    const { data, error } = await supabase
      .from("form_responses")
      .select(
        `
        *,
        forms(id, title),
        question_responses(
          id,
          question_id,
          response,
          questions(
            id,
            question,
            input_type
          )
        )
      `
      )
      .eq("user_id", userId)
      .order("submitted_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(
    supabase: SupabaseClient<Database>,
    responseId: string
  ): Promise<any | null> {
    const { data, error } = await supabase
      .from("form_responses")
      .select(
        `
        *,
        forms(*),
        users(id, name),
        question_responses(
          id,
          question_id,
          response,
          questions(
            *,
            categories(name),
            question_options(*),
            emoji_options(*)
          )
        )
      `
      )
      .eq("id", responseId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async submit(
    supabase: SupabaseClient<Database>,
    invitationId: string,
    formId: string,
    answers: Record<string, any>,
    earnedExperience: number
  ): Promise<FormResponseRow> {
    const { data: formResponse, error: formError } = await supabase
      .from("form_responses")
      .insert({
        form_id: formId,
        invitation_id: invitationId,
        earned_experience: earnedExperience,
        completed: true,
      })
      .select()
      .single();

    if (formError) throw formError;
    const questionResponses: QuestionResponseInsert[] = Object.entries(
      answers
    ).map(([questionId, response]) => ({
      form_response_id: formResponse.id,
      question_id: questionId,
      response,
    }));

    const { error: qrError } = await supabase
      .from("question_responses")
      .insert(questionResponses);

    if (qrError) throw qrError;

    const { error: expError } = await supabase.rpc("add_user_experience", {
      p_experience_points: earnedExperience,
    });

    if (expError) throw expError;

    return formResponse;
  },

  async delete(
    supabase: SupabaseClient<Database>,
    responseId: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("form_responses")
      .delete()
      .eq("id", responseId);

    if (error) throw error;
    return true;
  },

  async getAnalytics(
    supabase: SupabaseClient<Database>,
    formId: string,
    organizationId?: string
  ): Promise<any> {
    let query = supabase.rpc("get_form_analytics", {
      p_form_id: formId,
    });

    if (organizationId) {
      query = supabase.rpc("get_form_analytics_by_org", {
        p_form_id: formId,
        p_organization_id: organizationId,
      });
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || {};
  },

  // Get user analytics
  async getUserAnalytics(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<any> {
    const { data, error } = await supabase.rpc("get_user_analytics", {
      p_user_id: userId,
    });

    if (error) throw error;
    return data || {};
  },
};
