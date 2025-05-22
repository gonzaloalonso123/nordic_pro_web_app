import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";
import { decode } from "base64-arraybuffer";

type QuestionRow = Tables<"questions">;
type QuestionInsert = TablesInsert<"questions">;
type QuestionUpdate = TablesUpdate<"questions">;
type QuestionOptionInsert = TablesInsert<"question_options">;

export const questionsService = {
  async getAll(
    supabase: SupabaseClient<Database>
  ): Promise<(QuestionRow & { imagePreview: Blob | null })[]> {
    const { data, error } = await supabase
      .from("questions")
      .select(
        `
        *,
        form_categories(name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    const questionsWithImages = await Promise.all(
      data.map(async (question) => ({
        ...question,
        image_url: await this.retrieveQuestionImage(supabase, question.id),
      }))
    );

    return questionsWithImages || [];
  },
  // Get question by ID
  async getById(
    supabase: SupabaseClient<Database>,
    questionId: string
  ): Promise<any | null> {
    const { data, error } = await supabase
      .from("questions")
      .select(
        `
        *,
        form_categories(name),
        question_options(*),
      `
      )
      .eq("id", questionId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Get questions by category
  async getByCategory(
    supabase: SupabaseClient<Database>,
    categoryId: string
  ): Promise<QuestionRow[]> {
    const { data, error } = await supabase
      .from("questions")
      .select(
        `
        *,
        form_categories(name)
      `
      )
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get questions by creator
  async getByCreator(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<QuestionRow[]> {
    const { data, error } = await supabase
      .from("questions")
      .select(
        `
        *,
        form_categories(name)
      `
      )
      .eq("created_by", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create question with options
  async create(
    supabase: SupabaseClient<Database>,
    question: QuestionInsert,
    options?: {
      questionOptions?: QuestionOptionInsert[];
    }
  ): Promise<any> {
    // Start a transaction
    const { image_url, ...questionWithoutImage } = question;
    const { data, error } = await supabase
      .from("questions")
      .insert(questionWithoutImage)
      .select()
      .single();

    if (error) throw error;

    const questionId = data.id;

    if (options?.questionOptions && options.questionOptions.length > 0) {
      const questionOptionsWithId = options.questionOptions.map((option) => ({
        ...option,
        question_id: questionId,
      }));

      const { error: optionsError } = await supabase
        .from("question_options")
        .insert(questionOptionsWithId);

      if (optionsError) throw optionsError;
    }

    if (question.image_url) {
      await this.uploadQuestionImage(supabase, questionId, question.image_url);
    }
    return this.getById(supabase, questionId);
  },

  // Update question
  async update(
    supabase: SupabaseClient<Database>,
    questionId: string,
    updates: QuestionUpdate,
    options?: {
      questionOptions?: QuestionOptionInsert[];
    }
  ): Promise<any> {
    // Update the question
    const { error } = await supabase
      .from("questions")
      .update(updates)
      .eq("id", questionId);

    if (error) throw error;

    // Update question options if provided
    if (options?.questionOptions) {
      // Delete existing options
      const { error: deleteError } = await supabase
        .from("question_options")
        .delete()
        .eq("question_id", questionId);

      if (deleteError) throw deleteError;

      // Add new options
      if (options.questionOptions.length > 0) {
        const questionOptionsWithId = options.questionOptions.map((option) => ({
          ...option,
          question_id: questionId,
        }));

        const { error: optionsError } = await supabase
          .from("question_options")
          .insert(questionOptionsWithId);

        if (optionsError) throw optionsError;
      }
    }

    return this.getById(supabase, questionId);
  },

  async delete(
    supabase: SupabaseClient<Database>,
    questionId: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", questionId);

    if (error) throw error;
    return true;
  },

  // Get all categories
  async getCategories(supabase: SupabaseClient<Database>): Promise<any[]> {
    const { data, error } = await supabase
      .from("form_categories")
      .select("*")
      .order("name");

    if (error) throw error;
    return data || [];
  },

  // Create category
  async createCategory(
    supabase: SupabaseClient<Database>,
    name: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from("form_categories")
      .insert({ name })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async uploadQuestionImage(
    supabase: SupabaseClient<Database>,
    questionId: string,
    imageData: string
  ) {
    try {
      if (!imageData.startsWith("data:")) {
        return { path: imageData };
      }
      const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error("Invalid base64 image format");
      }
      const contentType = matches[1];
      const base64Data = matches[2];
      const fileExt = contentType.split("/")[1] || "png";
      const fileName = `${questionId}-${Date.now()}.${fileExt}`;

      const binaryData = decode(base64Data);

      const { data, error } = await supabase.storage
        .from("question-images")
        .upload(fileName, binaryData, {
          contentType,
          upsert: true,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("question-images")
        .getPublicUrl(fileName);
      const { error: updateError } = await supabase
        .from("questions")
        .update({
          image_url: publicUrlData.publicUrl,
        })
        .eq("id", questionId);

      if (updateError) throw updateError;

      return { path: publicUrlData.publicUrl };
    } catch (error) {
      console.error("Error uploading question image:", error);
      throw error;
    }
  },

  async retrieveQuestionImage(
    supabase: SupabaseClient<Database>,
    questionId: string
  ) {
    try {
      const { data: question, error } = await supabase
        .from("questions")
        .select("image_url")
        .eq("id", questionId)
        .single();

      if (error || !question?.image_url) {
        return null;
      }
      return question.image_url;
    } catch (error) {
      console.error("Error retrieving question image:", error);
      return null;
    }
  },
};
