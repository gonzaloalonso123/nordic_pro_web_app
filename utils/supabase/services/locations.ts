import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from "@/types/database.types";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

type LocationRow = Tables<"locations">;
type LocationInsert = TablesInsert<"locations">;
type LocationUpdate = TablesUpdate<"locations">;

export const locationsService = {
  // Get all locations
  async getAll(supabase: SupabaseClient<Database>): Promise<LocationRow[]> {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("name");

    if (error) throw error;
    return data || [];
  },

  // Get location by ID
  async getById(
    supabase: SupabaseClient<Database>,
    locationId: string
  ): Promise<LocationRow | null> {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("id", locationId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Get locations by organisation
  async getByOrganisation(
    supabase: SupabaseClient<Database>,
    organisationId: string
  ): Promise<LocationRow[]> {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("organisation_id", organisationId);

    if (error) throw error;
    return data || [];
  },

  // Create location
  async create(
    supabase: SupabaseClient<Database>,
    location: LocationInsert
  ): Promise<LocationRow> {
    const { data, error } = await supabase
      .from("locations")
      .insert(location)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update location
  async update(
    supabase: SupabaseClient<Database>,
    locationId: string,
    updates: LocationUpdate
  ): Promise<LocationRow> {
    const { data, error } = await supabase
      .from("locations")
      .update(updates)
      .eq("id", locationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete location
  async delete(
    supabase: SupabaseClient<Database>,
    locationId: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("locations")
      .delete()
      .eq("id", locationId);

    if (error) throw error;
    return true;
  },
};