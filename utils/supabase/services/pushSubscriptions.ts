import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

type PushSubscriptionRow = Tables<"push_subscriptions">;
type PushSubscriptionInsert = TablesInsert<"push_subscriptions">;
type PushSubscriptionUpdate = TablesUpdate<"push_subscriptions">;

export const pushSubscriptionsService = {
  // Get all push subscriptions
  async getAll(
    supabase: SupabaseClient<Database>
  ): Promise<PushSubscriptionRow[]> {
    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get push subscription by ID
  async getById(
    supabase: SupabaseClient<Database>,
    id: string
  ): Promise<PushSubscriptionRow | null> {
    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Get push subscriptions by user ID
  async getByUserId(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<PushSubscriptionRow[]> {
    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  },

  // Get push subscription by endpoint
  async getByEndpoint(
    supabase: SupabaseClient<Database>,
    endpoint: string
  ): Promise<PushSubscriptionRow | null> {
    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("endpoint", endpoint)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Create push subscription
  async create(
    supabase: SupabaseClient<Database>,
    subscription: PushSubscriptionInsert
  ): Promise<PushSubscriptionRow> {
    const timestamp = new Date().toISOString();

    const { data, error } = await supabase
      .from("push_subscriptions")
      .insert({
        ...subscription,
        created_at: timestamp,
        updated_at: timestamp
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update push subscription
  async update(
    supabase: SupabaseClient<Database>,
    id: string,
    updates: PushSubscriptionUpdate
  ): Promise<PushSubscriptionRow> {
    const { data, error } = await supabase
      .from("push_subscriptions")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete push subscription by ID
  async delete(
    supabase: SupabaseClient<Database>,
    id: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  // Delete push subscription by endpoint
  async deleteByEndpoint(
    supabase: SupabaseClient<Database>,
    endpoint: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("endpoint", endpoint);

    if (error) throw error;
    return true;
  },

  // Create or update push subscription
  async upsert(
    supabase: SupabaseClient<Database>,
    subscription: PushSubscriptionInsert
  ): Promise<PushSubscriptionRow> {
    // Check if subscription with this endpoint already exists
    const existing = await this.getByEndpoint(supabase, subscription.endpoint);

    if (existing) {
      // Update existing subscription
      return await this.update(supabase, existing.id, subscription);
    } else {
      // Create new subscription
      return await this.create(supabase, subscription);
    }
  }
};
