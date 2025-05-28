import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";

type FormProgramRow = Tables<"form_program">;
type FormProgramInsert = TablesInsert<"form_program">;
type FormProgramUpdate = TablesUpdate<"form_program">;

export const formProgramsService = {
  async getAll(supabase: SupabaseClient<Database>): Promise<FormProgramRow[]> {
    const { data, error } = await supabase
      .from("form_program")
      .select("*")
      .order("name");

    if (error) throw error;
    return data || [];
  },

  async getById(
    supabase: SupabaseClient<Database>,
    programId: string
  ): Promise<FormProgramRow | null> {
    const { data, error } = await supabase
      .from("form_program")
      .select("*")
      .eq("id", programId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async getByCategory(
    supabase: SupabaseClient<Database>,
    categoryId: string
  ): Promise<FormProgramRow[]> {
    const { data, error } = await supabase
      .from("form_program")
      .select("*")
      .eq("category_id", categoryId)
      .order("name");

    if (error) throw error;
    return data || [];
  },

  async create(
    supabase: SupabaseClient<Database>,
    program: FormProgramInsert
  ): Promise<FormProgramRow> {
    const { data, error } = await supabase
      .from("form_program")
      .insert(program)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(
    supabase: SupabaseClient<Database>,
    programId: string,
    updates: FormProgramUpdate
  ): Promise<FormProgramRow> {
    const { data, error } = await supabase
      .from("form_program")
      .update(updates)
      .eq("id", programId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(
    supabase: SupabaseClient<Database>,
    programId: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("form_program")
      .delete()
      .eq("id", programId);

    if (error) throw error;
    return true;
  },
};
