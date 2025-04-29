import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../../database.types"
import type { Tables, TablesInsert, TablesUpdate } from "../../database.types"

type ChatRoomRow = Tables<"chat_rooms">
type ChatRoomInsert = TablesInsert<"chat_rooms">
type ChatRoomUpdate = TablesUpdate<"chat_rooms">

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

  // Get chat rooms by user
  async getByUser(supabase: SupabaseClient<Database>, userId: string): Promise<ChatRoomRow[]> {
    const { data, error } = await supabase
      .from("chat_rooms")
      .select(`
        *,
        users_chats!inner(user_id)
      `)
      .eq("users_chats.user_id", userId)
      .order("created_at", { ascending: false })

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
  async getWithMessages(supabase: SupabaseClient<Database>, chatRoomId: string): Promise<any> {
    const { data, error } = await supabase
      .from("chat_rooms")
      .select(`
        *,
        chat_messages(
          id,
          content,
          user_id,
          attachments,
          created_at,
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
  async getWithUsers(supabase: SupabaseClient<Database>, chatRoomId: string): Promise<any> {
    const { data, error } = await supabase
      .from("chat_rooms")
      .select(`
        *,
        users_chats(
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
}
