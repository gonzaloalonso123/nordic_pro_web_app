import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";
import { triggerNewChatMessageNotification } from "@/utils/notificationService";

type ChatMessageRow = Tables<"messages">;
type ChatMessageInsert = TablesInsert<"messages">;
type ChatMessageUpdate = TablesUpdate<"messages">;

type MessageReadRow = Tables<"message_reads">;
type MessageReadInsert = TablesInsert<"message_reads">;

export const chatMessagesService = {
  async getByRoom(
    supabase: SupabaseClient<Database>,
    roomId: string
  ): Promise<ChatMessageRow[]> {
    if (!roomId) {
      return [];
    }

    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        users!messages_sender_id_fkey1 ( id, first_name, last_name, avatar )
    `)
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages for room:", roomId, error);
      throw error;
    }

    return data || [];
  },

  // Get a single chat message by ID
  async getById(
    supabase: SupabaseClient<Database>,
    messageId: string
  ): Promise<ChatMessageRow | null> {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
          *,
          users!messages_sender_id_fkey1 ( id, first_name, last_name, avatar )
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
      .from("messages")
      .insert(message)
      .select(
        `
          *,
          users!messages_sender_id_fkey1 ( id, first_name, last_name, avatar )
      `
      )
      .single();

    if (error) throw error;

    if (data && data.room_id && data.sender_id && data.content) {
      triggerNewChatMessageNotification({
        actorUserId: data.sender_id,
        roomId: data.room_id,
        messageContent: data.content,
      }).catch(err => {
        console.error("Error triggering new chat message notification:", err);
      });
    }

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
      .from("messages")
      .update(updates)
      .eq("id", messageId)
      .select(
        `
          *,
          users!messages_sender_id_fkey1 ( id, first_name, last_name, avatar )
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
      .from("messages")
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
    // Use upsert to handle duplicate read entries gracefully
    const { data, error } = await supabase
      .from("message_reads")
      .upsert(
        {
          message_id: messageRead.message_id,
          user_id: messageRead.user_id,
          read_at: messageRead.read_at || new Date().toISOString()
        },
        { 
          onConflict: 'message_id,user_id',
          ignoreDuplicates: false 
        }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Separate method to get message read status for a user
  async getMessageReadsForUser(
    supabase: SupabaseClient<Database>,
    messageIds: string[],
    userId: string
  ): Promise<MessageReadRow[]> {
    if (messageIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from("message_reads")
      .select("message_id, read_at, user_id")
      .in("message_id", messageIds)
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching message reads:", error);
      throw error;
    }
    return data || [];
  },
};
