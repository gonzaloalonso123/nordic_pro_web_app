import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../../database.types"
import type { Tables, TablesInsert, TablesUpdate } from "../../database.types"

type FormRow = Tables<"forms">
type FormInsert = TablesInsert<"forms">
type FormUpdate = TablesUpdate<"forms">

export const formsService = {
  // Get all forms
  async getAll(supabase: SupabaseClient<Database>): Promise<FormRow[]> {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get form by ID
  async getById(supabase: SupabaseClient<Database>, formId: string): Promise<FormRow | null> {
    const { data, error } = await supabase.from("forms").select("*").eq("id", formId).is("deleted_at", null).single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  // Get forms by user
  async getByUser(supabase: SupabaseClient<Database>, userId: string): Promise<FormRow[]> {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get forms by event
  async getByEvent(supabase: SupabaseClient<Database>, eventId: string): Promise<FormRow[]> {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("event_id", eventId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create form
  async create(supabase: SupabaseClient<Database>, form: FormInsert): Promise<FormRow> {
    const { data, error } = await supabase.from("forms").insert(form).select().single()

    if (error) throw error
    return data
  },

  // Update form
  async update(supabase: SupabaseClient<Database>, formId: string, updates: FormUpdate): Promise<FormRow> {
    const { data, error } = await supabase
      .from("forms")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", formId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Soft delete form
  async softDelete(supabase: SupabaseClient<Database>, formId: string): Promise<boolean> {
    const { error } = await supabase
      .from("forms")
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", formId)

    if (error) throw error
    return true
  },

  // Hard delete form
  async hardDelete(supabase: SupabaseClient<Database>, formId: string): Promise<boolean> {
    const { error } = await supabase.from("forms").delete().eq("id", formId)

    if (error) throw error
    return true
  },
}
