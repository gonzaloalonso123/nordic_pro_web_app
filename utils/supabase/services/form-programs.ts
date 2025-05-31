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
type FormToProgramRow = Tables<"forms_form_programs">;

export const formProgramsService = {
  async getAll(supabase: SupabaseClient<Database>): Promise<FormProgramRow[]> {
    const { data, error } = await supabase
      .from("form_program")
      .select("*, forms_form_programs(*, forms(*)))");

    if (error) throw error;
    return data || [];
  },

  async getById(
    supabase: SupabaseClient<Database>,
    programId: string
  ): Promise<FormProgramRow | null> {
    const { data, error } = await supabase
      .from("form_program")
      .select("*, forms_form_programs(*, forms(*)))")
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
    program: FormProgramInsert & { forms: string[] }
  ): Promise<FormProgramRow> {
    const { forms, ...rest } = program;

    const { data: submitedProgram, error } = await supabase
      .from("form_program")
      .insert(rest)
      .select()
      .single();
    if (forms && submitedProgram) {
      await supabase
        .from("forms_form_programs")
        .insert(
          forms.map((form_id) => ({
            form_id,
            form_program_id: submitedProgram.id,
          }))
        )
        .select()
        .order("order");
    }
    if (error) throw error;
    return submitedProgram || null;
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
