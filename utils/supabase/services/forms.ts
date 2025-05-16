import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

type FormRow = Tables<"forms">;
type FormInsert = TablesInsert<"forms">;
type FormUpdate = TablesUpdate<"forms">;

export const formsService = {
  async getAll(supabase: SupabaseClient<Database>): Promise<FormRow[]> {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .order("title");

    if (error) throw error;
    return data || [];
  },

  async getById(
    supabase: SupabaseClient<Database>,
    formId: string
  ): Promise<FormRow | null> {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", formId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async getByCreator(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<FormRow[]> {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("created_by", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByOrganization(
    supabase: SupabaseClient<Database>,
    organizationId: string
  ): Promise<FormRow[]> {
    const { data, error } = await supabase
      .from("form_responses")
      .select(
        `
        forms(*)
      `
      )
      .eq("organization_id", organizationId)
      .order("submitted_at", { ascending: false })
      .limit(1000);

    if (error) throw error;

    const forms = data?.map((item) => item.forms) || [];
    const uniqueForms = Array.from(new Set(forms.map((form) => form.id)))
      .map((id) => forms.find((form) => form.id === id))
      .filter(Boolean) as FormRow[];

    return uniqueForms;
  },

  async create(
    supabase: SupabaseClient<Database>,
    form: FormInsert & { question_ids: string[] }
  ): Promise<FormRow> {
    const { question_ids, ...formData } = form;
    const { data, error } = await supabase
      .from("forms")
      .insert(formData)
      .select()
      .single();

    if (error) throw error;
    this.addQuestions(supabase, data.id, question_ids);
    return data;
  },

  // Update form
  async update(
    supabase: SupabaseClient<Database>,
    formId: string,
    updates: FormUpdate & { question_ids: string[] }
  ): Promise<FormRow> {
    const { question_ids, ...updatesData } = updates;
    const { data, error } = await supabase
      .from("forms")
      .update(updates)
      .eq("id", formId)
      .select()
      .single();

    if (error) throw error;

    const previousQuestions = await this.getWithQuestions(supabase, formId);
    const previousQuestionIds = previousQuestions.questions.map(
      (question: any) => question.id
    );
    const newQuestionIds = question_ids;
    const questionsToAdd = newQuestionIds.filter(
      (id) => !previousQuestionIds.includes(id)
    );
    const questionsToRemove = previousQuestionIds.filter(
      (id: string) => !newQuestionIds.includes(id)
    );
    for (const questionId of questionsToRemove) {
      await this.removeQuestion(supabase, formId, questionId);
    }
    await this.addQuestions(supabase, formId, questionsToAdd);

    return data;
  },

  async delete(
    supabase: SupabaseClient<Database>,
    formId: string
  ): Promise<boolean> {
    const { error } = await supabase.from("forms").delete().eq("id", formId);

    if (error) throw error;
    return true;
  },

  async getWithQuestions(
    supabase: SupabaseClient<Database>,
    formId: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from("forms")
      .select(
        `
        *,
        form_questions(
          sort_order,
          questions(
            *,
            form_categories(name),
            question_options(*),
            emoji_options(*)
          )
        )
      `
      )
      .eq("id", formId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    if (data) {
      const questions = data.form_questions
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((fq) => ({
          ...fq.questions,
          sort_order: fq.sort_order,
        }));

      return {
        ...data,
        questions,
      };
    }

    return data;
  },

  async getResponses(
    supabase: SupabaseClient<Database>,
    formId: string,
    organizationId?: string
  ): Promise<any[]> {
    let query = supabase
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
            form_categories(name)
          )
        )
      `
      )
      .eq("form_id", formId)
      .order("submitted_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async addQuestions(
    supabase: SupabaseClient<Database>,
    formId: string,
    question_ids: string[]
  ): Promise<boolean> {
    const { data: existingQuestions } = await supabase
      .from("form_questions")
      .select("sort_order")
      .eq("form_id", formId)
      .order("sort_order", { ascending: false })
      .limit(1);

    const startOrder =
      existingQuestions && existingQuestions.length > 0
        ? existingQuestions[0].sort_order + 1
        : 0;

    const formQuestions = question_ids.map((questionId, index) => ({
      form_id: formId,
      question_id: questionId,
      sort_order: startOrder + index,
    }));

    const { error } = await supabase
      .from("form_questions")
      .insert(formQuestions);

    if (error) throw error;
    return true;
  },

  // Remove question from form
  async removeQuestion(
    supabase: SupabaseClient<Database>,
    formId: string,
    questionId: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("form_questions")
      .delete()
      .eq("form_id", formId)
      .eq("question_id", questionId);

    if (error) throw error;
    return true;
  },

  async updateQuestionOrder(
    supabase: SupabaseClient<Database>,
    formId: string,
    questionOrders: { questionId: string; order: number }[]
  ): Promise<boolean> {
    // Use a transaction to update all orders
    const { error } = await supabase.rpc("update_question_orders", {
      p_form_id: formId,
      p_question_orders: questionOrders.map((qo) => ({
        question_id: qo.questionId,
        sort_order: qo.order,
      })),
    });

    if (error) throw error;
    return true;
  },
};
