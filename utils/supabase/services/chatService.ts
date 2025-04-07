import type { TypedSupabaseClient } from "@/utils/types"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

export type ChatRoomRow = Tables<"chat_rooms">
export type ChatRoomInsert = TablesInsert<"chat_rooms">
export type ChatRoomUpdate = TablesUpdate<"chat_rooms">
export type MessageRow = Tables<"messages">
export type MessageInsert = TablesInsert<"messages">
export type ChatParticipantRow = Tables<"chat_participants">
export type ChatParticipantInsert = TablesInsert<"chat_participants">

export const chatService = {
  // Get chat room by ID
  getRoomById: async (supabase: TypedSupabaseClient, roomId: string) => {
    const { data, error } = await supabase.from("chat_rooms").select("*").eq("room_id", roomId).single()

    if (error) throw error
    return data
  },

  // Get chat rooms for a user
  getRoomsByUser: async (supabase: TypedSupabaseClient, userId: string) => {
    const { data, error } = await supabase
      .from("chat_participants")
      .select(`
        room:room_id(
          *,
          participants:chat_participants(
            user:user_id(user_id, full_name)
          )
        )
      `)
      .eq("user_id", userId)

    if (error) throw error
    return data.map((item) => item.room)
  },

  // Get room participants
  getRoomParticipants: async (supabase: TypedSupabaseClient, roomId: string) => {
    const { data, error } = await supabase
      .from("chat_participants")
      .select(`
        user:user_id(*)
      `)
      .eq("room_id", roomId)

    if (error) throw error
    return data.map((item) => item.user)
  },

  // Create a chat room
  createRoom: async (supabase: TypedSupabaseClient, room: ChatRoomInsert, participantIds: string[]) => {
    // Create the room
    const { data: roomData, error: roomError } = await supabase.from("chat_rooms").insert(room).select().single()

    if (roomError) throw roomError

    // Add participants
    const participants = participantIds.map((userId) => ({
      room_id: roomData.room_id,
      user_id: userId,
    }))

    const { error: participantsError } = await supabase.from("chat_participants").insert(participants)

    if (participantsError) throw participantsError

    return roomData
  },

  // Update a chat room
  updateRoom: async (supabase: TypedSupabaseClient, roomId: string, updates: ChatRoomUpdate) => {
    const { data, error } = await supabase.from("chat_rooms").update(updates).eq("room_id", roomId).select().single()

    if (error) throw error
    return data
  },

  // Delete a chat room
  deleteRoom: async (supabase: TypedSupabaseClient, roomId: string) => {
    const { error } = await supabase.from("chat_rooms").delete().eq("room_id", roomId)

    if (error) throw error
    return true
  },

  // Add participant to room
  addParticipant: async (supabase: TypedSupabaseClient, roomId: string, userId: string) => {
    const { data, error } = await supabase
      .from("chat_participants")
      .insert({ room_id: roomId, user_id: userId })
      .select()

    if (error) throw error
    return data
  },

  // Remove participant from room
  removeParticipant: async (supabase: TypedSupabaseClient, roomId: string, userId: string) => {
    const { error } = await supabase.from("chat_participants").delete().eq("room_id", roomId).eq("user_id", userId)

    if (error) throw error
    return true
  },

  // Get messages for a room
  getMessages: async (supabase: TypedSupabaseClient, roomId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        sender:sender_id(user_id, full_name)
      `)
      .eq("room_id", roomId)
      .order("sent_at", { ascending: true })

    if (error) throw error
    return data
  },

  // Send a message
  sendMessage: async (supabase: TypedSupabaseClient, message: MessageInsert) => {
    const { data, error } = await supabase.from("messages").insert(message).select().single()

    if (error) throw error
    return data
  },

  // Delete a message
  deleteMessage: async (supabase: TypedSupabaseClient, messageId: string) => {
    const { error } = await supabase.from("messages").delete().eq("message_id", messageId)

    if (error) throw error
    return true
  },

  // Get or create a direct message room between two users
  getOrCreateDirectMessageRoom: async (supabase: TypedSupabaseClient, user1Id: string, user2Id: string) => {
    // First, try to find an existing DM room
    const { data: rooms } = await supabase
      .from("chat_rooms")
      .select(`
        *,
        participants:chat_participants(user_id)
      `)
      .eq("is_group", false)

    // Filter rooms that have exactly these two participants
    const dmRoom = rooms?.find((room) => {
      const participantIds = room.participants.map((p: any) => p.user_id)
      return participantIds.length === 2 && participantIds.includes(user1Id) && participantIds.includes(user2Id)
    })

    if (dmRoom) {
      return dmRoom
    }

    // If no room exists, create one
    return await chatService.createRoom(supabase, { is_group: false }, [user1Id, user2Id])
  },
}

