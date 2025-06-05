import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types"

type ChatRoomRow = Tables<"chat_rooms">
type ChatRoomInsert = TablesInsert<"chat_rooms">
type ChatRoomUpdate = TablesUpdate<"chat_rooms">
type ChatMessageRow = Tables<"chat_messages">
type ChatMessageInsert = TablesInsert<"chat_messages">
type ChatRoomMemberRow = Tables<"chat_room_members">
type ChatRoomMemberInsert = TablesInsert<"chat_room_members">
type MessageReadRow = Tables<"message_reads">
type MessageReadInsert = TablesInsert<"message_reads">
type UserProfile = Pick<Tables<"users">, "id" | "first_name" | "last_name">

type LastMessageData = Pick<Tables<"chat_messages">, "id" | "content" | "created_at" | "user_id"> & {
  users: UserProfile | null
}

type ChatMessageWithDetails = Pick<Tables<"chat_messages">, "id" | "content" | "user_id" | "created_at"> & {
  users: Pick<Tables<"users">, "id" | "first_name" | "last_name" | "avatar"> | null
  message_reads: MessageReadRow[]
}

type ChatRoomMemberWithUser = Pick<Tables<"chat_room_members">, "user_id"> & {
  users: Pick<Tables<"users">, "id" | "first_name" | "last_name" | "avatar"> | null
}

export type ChatRoomWithMessagesAndMembers = Tables<"chat_rooms"> & {
  chat_messages: ChatMessageWithDetails[]
  chat_room_members: ChatRoomMemberWithUser[]
}

type ChatRoomMemberWithBasicUser = Pick<Tables<"chat_room_members">, "user_id" | "last_read_at"> & {
  users: Pick<Tables<"users">, "id" | "first_name" | "last_name" | "email" | "avatar"> | null
}
export type ChatRoomWithDetails = Tables<"chat_rooms"> & {
  chat_room_members: ChatRoomMemberWithBasicUser[]
  last_message: LastMessageData[] | null
}
export type ChatRoomMemberWithFullUser = Pick<Tables<"chat_room_members">, "user_id"> & {
  users: Pick<Tables<"users">, "id" | "first_name" | "last_name" | "email" | "avatar"> | null
}

export type ChatRoomWithUsers = Tables<"chat_rooms"> & {
  chat_room_members: ChatRoomMemberWithFullUser[]
}


export const chatRoomsService = {
  // Get all chat rooms
  async getAll(supabase: SupabaseClient<Database>): Promise<ChatRoomRow[]> {
    const { data, error } = await supabase.from("chat_rooms").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get chat room by ID
  async getById(supabase: SupabaseClient<Database>, chatRoomId: string): Promise<ChatRoomRow | null> {
    const { data, error } = await supabase.from("chat_rooms").select("*").eq("id", chatRoomId).single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  async getByUser(supabase: SupabaseClient<Database>, userId: string): Promise<ChatRoomWithDetails[]> {
    // First, get all room IDs where the user is a member
    const { data: userRooms, error: userRoomsError } = await supabase
      .from("chat_room_members")
      .select("room_id")
      .eq("user_id", userId);

    if (userRoomsError) throw userRoomsError;
    if (!userRooms || userRooms.length === 0) return [];

    const roomIds = userRooms.map(ur => ur.room_id);

    // Then get full room details with ALL members for those rooms
    const { data, error } = await supabase
      .from("chat_rooms")
      .select(`
        *,
        chat_room_members(
          user_id,
          last_read_at,
          users(
            id,
            first_name,
            last_name,
            email,
            avatar
          )
        ),
        last_message:chat_messages(
          id,
          content,
          created_at,
          user_id,
          users(
            id,
            first_name,
            last_name
          )
        )
      `)
      .in("id", roomIds)
      .order("updated_at", { ascending: false })
      .order("created_at", {
        foreignTable: "last_message",
        ascending: false
      })
      .limit(1, { foreignTable: "last_message" })

    if (error) throw error
    return data || []
  },

  // Create chat room
  async create(supabase: SupabaseClient<Database>, chatRoom: ChatRoomInsert): Promise<ChatRoomRow> {
    const { data, error } = await supabase.from("chat_rooms").insert(chatRoom).select().single()

    if (error) throw error
    return data
  },

  // Update chat room
  async update(supabase: SupabaseClient<Database>, chatRoomId: string, updates: ChatRoomUpdate): Promise<ChatRoomRow> {
    const { data, error } = await supabase.from("chat_rooms").update(updates).eq("id", chatRoomId).select().single()

    if (error) throw error
    return data
  },

  // Delete chat room
  async delete(supabase: SupabaseClient<Database>, chatRoomId: string): Promise<boolean> {
    const { error } = await supabase.from("chat_rooms").delete().eq("id", chatRoomId)

    if (error) throw error
    return true
  },

  // Get chat room with messages
  async getWithMessages(supabase: SupabaseClient<Database>, chatRoomId: string): Promise<ChatRoomWithMessagesAndMembers | null> {
    const { data, error } = await supabase
      .from("chat_rooms")
      .select(`
        *,
        chat_messages(
          id,
          content,
          user_id,
          created_at,
          users(
            id,
            first_name,
            last_name,
            avatar
          ),
          message_reads(*)
        ),
        chat_room_members(
          user_id,
          users(
            id,
            first_name,
            last_name,
            avatar
          )
        )
      `)
      .eq("id", chatRoomId)
      .order("created_at", { foreignTable: "chat_messages", ascending: true })
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  // Get chat room with users
  async getWithUsers(supabase: SupabaseClient<Database>, chatRoomId: string): Promise<ChatRoomWithUsers | null> {
    const { data, error } = await supabase
      .from("chat_rooms")
      .select(`
        *,
        chat_room_members(
          user_id,
          users(
            id,
            first_name,
            last_name,
            email,
            avatar
          )
        )
      `)
      .eq("id", chatRoomId)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },
  // Add a new method to get messages by room
  async getMessagesByRoom(supabase: SupabaseClient<Database>, roomId: string): Promise<ChatMessageRow[]> {
    const { data, error } = await supabase
      .from("chat_messages")
      .select(`
        *,
        users(
          id,
          first_name,
          last_name,
          avatar
        ),
        message_reads(*)
      `)
      .eq("room_id", roomId)
      .order("created_at", { ascending: true })

    if (error) throw error
    return data || []
  },

  // Add paginated message loading method
  async getMessagesByRoomPaginated(
    supabase: SupabaseClient<Database>, 
    roomId: string, 
    options: {
      limit?: number;
      offset?: number;
      before?: string; // ISO timestamp to get messages before this time
    } = {}
  ): Promise<{ messages: ChatMessageRow[]; hasMore: boolean; total: number }> {
    const { limit = 100, offset = 0, before } = options;

    // First get total count
    const { count: totalCount, error: countError } = await supabase
      .from("chat_messages")
      .select("*", { count: "exact", head: true })
      .eq("room_id", roomId);

    if (countError) throw countError;

    // Build query for messages
    let query = supabase
      .from("chat_messages")
      .select(`
        *,
        users(
          id,
          first_name,
          last_name,
          avatar
        ),
        message_reads(*)
      `)
      .eq("room_id", roomId)
      .order("created_at", { ascending: false }) // Get newest first for pagination
      .range(offset, offset + limit - 1);

    // If we have a "before" timestamp, only get messages before that time
    if (before) {
      query = query.lt("created_at", before);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Reverse the order to show oldest first (for chat display)
    const messages = (data || []).reverse();
    const hasMore = offset + limit < (totalCount || 0);

    return {
      messages,
      hasMore,
      total: totalCount || 0
    };
  },

  // Add a new method to send a message
  async sendMessage(
    supabase: SupabaseClient<Database>,
    message: ChatMessageInsert
  ): Promise<ChatMessageRow> {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert(message)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Add methods for chat room members
  async getChatRoomMembers(supabase: SupabaseClient<Database>, roomId: string): Promise<ChatRoomMemberRow[]> {
    const { data, error } = await supabase
      .from("chat_room_members")
      .select(`
        *,
        users(
          id,
          first_name,
          last_name,
          avatar
        )
      `)
      .eq("room_id", roomId)

    if (error) throw error
    return data || []
  },

  async addChatRoomMember(
    supabase: SupabaseClient<Database>,
    member: ChatRoomMemberInsert
  ): Promise<ChatRoomMemberRow> {
    const { data, error } = await supabase
      .from("chat_room_members")
      .insert(member)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removeChatRoomMember(
    supabase: SupabaseClient<Database>,
    roomId: string,
    userId: string
  ): Promise<void> {
    const { error } = await supabase
      .from("chat_room_members")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", userId)

    if (error) throw error
  },

  // Add methods for message reads
  async markMessageAsRead(
    supabase: SupabaseClient<Database>,
    messageRead: MessageReadInsert
  ): Promise<MessageReadRow> {
    const { data, error } = await supabase
      .from("message_reads")
      .insert(messageRead)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUnreadMessageCount(
    supabase: SupabaseClient<Database>,
    roomId: string,
    userId: string
  ): Promise<number> {
    // Get the user's last read timestamp for this room
    const { data: memberData, error: memberError } = await supabase
      .from("chat_room_members")
      .select("last_read_at")
      .eq("room_id", roomId)
      .eq("user_id", userId)
      .single();

    if (memberError) throw memberError;

    if (!memberData?.last_read_at) {
      // If no last read timestamp, count all messages NOT sent by the user
      const { count, error } = await supabase
        .from("chat_messages")
        .select('*', { count: 'exact', head: true })
        .eq("room_id", roomId)
        .neq("user_id", userId); // Exclude messages sent by the user

      if (error) throw error;
      return count || 0;
    }

    // Count messages newer than the last read timestamp, excluding user's own messages
    const { count, error } = await supabase
      .from("chat_messages")
      .select('*', { count: 'exact', head: true })
      .eq("room_id", roomId)
      .gt("created_at", memberData.last_read_at)
      .neq("user_id", userId); // Exclude messages sent by the user

    if (error) throw error;
    return count || 0;
  },

  // Mark all messages in a room as read for a user
  async markRoomAsRead(
    supabase: SupabaseClient<Database>,
    roomId: string,
    userId: string
  ): Promise<void> {
    const { error } = await supabase
      .from("chat_room_members")
      .update({ last_read_at: new Date().toISOString() })
      .eq("room_id", roomId)
      .eq("user_id", userId);

    if (error) throw error;

    // Clear notifications for this room when marking as read
    try {
      const { clearChatNotificationsForUser } = await import("@/utils/notificationService");
      await clearChatNotificationsForUser(roomId, userId);
    } catch (notificationError) {
      console.error(`Error clearing notifications for room ${roomId} and user ${userId}:`, notificationError);
    }
  },

  // Get unread counts for multiple rooms efficiently
  async getUnreadCountsBatch(
    supabase: SupabaseClient<Database>,
    roomIds: string[],
    userId: string
  ): Promise<Record<string, number>> {
    if (!roomIds.length) return {};

    // Get user's last read timestamps for all rooms
    const { data: memberData, error: memberError } = await supabase
      .from("chat_room_members")
      .select("room_id, last_read_at")
      .eq("user_id", userId)
      .in("room_id", roomIds);

    if (memberError) throw memberError;

    const counts: Record<string, number> = {};

    // Create a map of room_id to last_read_at
    const lastReadMap = new Map(
      memberData?.map(m => [m.room_id, m.last_read_at]) || []
    );

    // For each room, count unread messages (excluding user's own messages)
    await Promise.all(
      roomIds.map(async (roomId) => {
        const lastRead = lastReadMap.get(roomId);

        if (!lastRead) {
          // No last read timestamp, count all messages NOT sent by the user
          const { count, error } = await supabase
            .from("chat_messages")
            .select('*', { count: 'exact', head: true })
            .eq("room_id", roomId)
            .neq("user_id", userId); // Exclude messages sent by the user

          if (!error) {
            counts[roomId] = count || 0;
          }
        } else {
          // Count messages newer than last read, excluding user's own messages
          const { count, error } = await supabase
            .from("chat_messages")
            .select('*', { count: 'exact', head: true })
            .eq("room_id", roomId)
            .gt("created_at", lastRead)
            .neq("user_id", userId); // Exclude messages sent by the user

          if (!error) {
            counts[roomId] = count || 0;
          }
        }
      })
    );

    return counts;
  }
}
