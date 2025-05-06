import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../database.types";
import type { Tables, TablesInsert } from "../../database.types";

type FormResponseRow = Tables<"form_responses">;
type FormResponseInsert = TablesInsert<"form_responses">;
type QuestionResponseInsert = TablesInsert<"question_responses">;

export const formResponsesService = {
  // Get all responses for a form
  async getByForm(supabase: SupabaseClient<Database>, formId: string): Promise<any[]> {
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

  // Get responses by organization
  async getByOrganization(supabase: SupabaseClient<Database>, organizationId: string): Promise<any[]> {
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

  // Get responses by user
  async getByUser(supabase: SupabaseClient<Database>, userId: string): Promise<any[]> {
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

  // Get a single response by ID
  async getById(supabase: SupabaseClient<Database>, responseId: string): Promise<any | null> {
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

  // Submit a form response
  async submit(
    supabase: SupabaseClient<Database>,
    formId: string,
    userId: string,
    organizationId: string,
    answers: Record<string, any>,
    earnedExperience: number
  ): Promise<FormResponseRow> {
    // Create the form response
    const { data: formResponse, error: formError } = await supabase
      .from("form_responses")
      .insert({
        form_id: formId,
        user_id: userId,
        organization_id: organizationId,
        earned_experience: earnedExperience,
        completed: true,
      })
      .select()
      .single();

    if (formError) throw formError;

    // Create question responses
    const questionResponses: QuestionResponseInsert[] = Object.entries(answers).map(([questionId, response]) => ({
      form_response_id: formResponse.id,
      question_id: questionId,
      response,
    }));

    const { error: qrError } = await supabase.from("question_responses").insert(questionResponses);

    if (qrError) throw qrError;

    // Add to completed forms
    const { error: cfError } = await supabase.from("completed_forms").insert({
      user_id: userId,
      form_id: formId,
      organization_id: organizationId,
    });

    if (cfError && cfError.code !== "23505") throw cfError; // Ignore unique constraint violations

    // Update user experience
    const { error: expError } = await supabase.rpc("add_user_experience", {
      p_user_id: userId,
      p_experience_points: earnedExperience,
    });

    if (expError) throw expError;

    return formResponse;
  },

  // Delete a response
  async delete(supabase: SupabaseClient<Database>, responseId: string): Promise<boolean> {
    const { error } = await supabase.from("form_responses").delete().eq("id", responseId);

    if (error) throw error;
    return true;
  },

  // Get analytics for a form
  async getAnalytics(supabase: SupabaseClient<Database>, formId: string, organizationId?: string): Promise<any> {
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
  async getUserAnalytics(supabase: SupabaseClient<Database>, userId: string): Promise<any> {
    const { data, error } = await supabase.rpc("get_user_analytics", {
      p_user_id: userId,
    });

    if (error) throw error;
    return data || {};
  },
};
