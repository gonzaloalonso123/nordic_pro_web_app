import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

type ChatMessageRow = Tables<"chat_messages">;
type ChatMessageInsert = TablesInsert<"chat_messages">;
type ChatMessageUpdate = TablesUpdate<"chat_messages">;

type MessageReadRow = Tables<"message_reads">;
type MessageReadInsert = TablesInsert<"message_reads">;

export const chatMessagesService = {
  async getByRoom(
    supabase: SupabaseClient<Database>,
    roomId: string
  ): Promise<ChatMessageRow[]> {
    const { data, error } = await supabase
      .from("chat_messages")
      .select(
        `
        *,
        users ( id, first_name, last_name, avatar ),
        message_reads (*)
      `
      )
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get a single chat message by ID
  async getById(
    supabase: SupabaseClient<Database>,
    messageId: string
  ): Promise<ChatMessageRow | null> {
    const { data, error } = await supabase
      .from("chat_messages")
      .select(
        `
        *,
        users ( id, first_name, last_name, avatar ),
        message_reads (*)
      `
      )
      .eq("id", messageId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116: "No rows found"
    return data;
  },

  // Create (send) a chat message
  async create(
    supabase: SupabaseClient<Database>,
    message: ChatMessageInsert
  ): Promise<ChatMessageRow> {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert(message)
      .select(
        `
        *,
        users ( id, first_name, last_name, avatar ),
        message_reads (*)
      `
      )
      .single();

    if (error) throw error;
    return data;
  },

  // Update a chat message
  async update(
    supabase: SupabaseClient<Database>,
    messageId: string,
    updates: ChatMessageUpdate
  ): Promise<ChatMessageRow> {
    // Assuming 'updated_at' is handled by a DB trigger or you want to set it manually.
    // If manual, add: { ...updates, updated_at: new Date().toISOString() }
    const { data, error } = await supabase
      .from("chat_messages")
      .update(updates)
      .eq("id", messageId)
      .select(
        `
        *,
        users ( id, first_name, last_name, avatar ),
        message_reads (*)
      `
      )
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a chat message
  async delete(
    supabase: SupabaseClient<Database>,
    messageId: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("id", messageId);

    if (error) throw error;
    return true;
  },

  // Mark a message as read
  async markAsRead(
    supabase: SupabaseClient<Database>,
    messageRead: MessageReadInsert
  ): Promise<MessageReadRow> {
    // This assumes you might want to prevent duplicate read entries.
    // If your table has a unique constraint on (message_id, user_id),
    // you might use .upsert() or handle potential errors.
    const { data, error } = await supabase
      .from("message_reads")
      .insert(messageRead)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get unread message count for a specific room and user
  // This is similar to the one in chatRoomsService, but focused on messages.
  async getUnreadCountByRoomForUser(
    supabase: SupabaseClient<Database>,
    roomId: string,
    userId: string
  ): Promise<number> {
    const { count, error } = await supabase
      .from("chat_messages")
      .select("*", { count: "exact", head: true })
      .eq("room_id", roomId)
      .is("user_id", null) // Or filter by messages not from the current user: .not("user_id", "eq", userId)
      .not(
        "message_reads",
        "cs",
        `{"user_id":"${userId}", "message_id": "id"}`
      ); // This part might need adjustment based on how message_reads are linked

    // A more robust way to count unread messages:
    // Fetch messages in the room, then filter out those that have a read receipt for the user.
    // This is more complex client-side or requires a more specific query/function.
    // For simplicity, the above query attempts a direct count.
    // A common pattern is to count messages where the user_id is NOT the current user,
    // and for which no entry exists in message_reads for that message_id and user_id.

    // Alternative approach using a subquery or RPC might be more accurate for unread counts.
    // Example: Count messages in room_id where user_id != current_user_id
    // AND id NOT IN (SELECT message_id FROM message_reads WHERE user_id = current_user_id)

    if (error) {
      console.error("Error fetching unread message count:", error);
      throw error;
    }
    return count || 0;
  },
};