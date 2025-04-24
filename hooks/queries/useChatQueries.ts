import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import useSupabaseBrowser from "@/utils/supabase/client"
import { chatService } from "@/utils/supabase/services"
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/database.types"

type ChatRoomRow = Tables<"chat_rooms">
type ChatRoomInsert = TablesInsert<"chat_rooms">
type ChatRoomUpdate = TablesUpdate<"chat_rooms">
type MessageRow = Tables<"messages">
type MessageInsert = TablesInsert<"messages">
type ChatParticipantRow = Tables<"chat_participants">
type ChatParticipantInsert = TablesInsert<"chat_participants">

// Get chat room by ID
export const useChatRoom = <TData = ChatRoomRow>(
  roomId: string | undefined,
  options?: Omit<UseQueryOptions<ChatRoomRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<ChatRoomRow | null, Error, TData>({
    queryKey: ["chatRooms", roomId],
    queryFn: () => (roomId ? chatService.getRoomById(supabase, roomId) : null),
    enabled: !!roomId,
    ...options,
  })
}

// Get chat rooms for a user
export const useChatRoomsByUser = <TData = any[]>(
  userId: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["chatRooms", "user", userId],
    queryFn: () => (userId ? chatService.getRoomsByUser(supabase, userId) : null),
    enabled: !!userId,
    ...options,
  })
}

// Get room participants
export const useRoomParticipants = <TData = any[]>(
  roomId: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["chatRooms", roomId, "participants"],
    queryFn: () => (roomId ? chatService.getRoomParticipants(supabase, roomId) : null),
    enabled: !!roomId,
    ...options,
  })
}

// Get messages for a room
export const useMessages = <TData = any[]>(
  roomId: string | undefined,
  options?: Omit<UseQueryOptions<any[] | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<any[] | null, Error, TData>({
    queryKey: ["chatRooms", roomId, "messages"],
    queryFn: () => (roomId ? chatService.getMessages(supabase, roomId) : null),
    enabled: !!roomId,
    ...options,
  })
}

// Get or create a direct message room between two users
export const useDirectMessageRoom = <TData = ChatRoomRow>(
  user1Id: string | undefined,
  user2Id: string | undefined,
  options?: Omit<UseQueryOptions<ChatRoomRow | null, Error, TData>, "queryKey" | "queryFn" | "enabled">,
) => {
  const supabase = useSupabaseBrowser()
  return useQuery<ChatRoomRow | null, Error, TData>({
    queryKey: ["chatRooms", "direct", user1Id, user2Id],
    queryFn: () => (user1Id && user2Id ? chatService.getOrCreateDirectMessageRoom(supabase, user1Id, user2Id) : null),
    enabled: !!(user1Id && user2Id),
    ...options,
  })
}

// Create a chat room mutation
export const useCreateRoom = (
  options?: Omit<
    UseMutationOptions<ChatRoomRow, Error, { room: ChatRoomInsert; participantIds: string[] }>,
    "mutationFn"
  >,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<ChatRoomRow, Error, { room: ChatRoomInsert; participantIds: string[] }>({
    mutationFn: ({ room, participantIds }) => chatService.createRoom(supabase, room, participantIds),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms", data.room_id] })
      queryClient.invalidateQueries({ queryKey: ["chatRooms", "user"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Update a chat room mutation
export const useUpdateRoom = (
  options?: Omit<UseMutationOptions<ChatRoomRow, Error, { roomId: string; updates: ChatRoomUpdate }>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<ChatRoomRow, Error, { roomId: string; updates: ChatRoomUpdate }>({
    mutationFn: ({ roomId, updates }) => chatService.updateRoom(supabase, roomId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms", data.room_id] })
      queryClient.invalidateQueries({ queryKey: ["chatRooms", "user"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Delete a chat room mutation
export const useDeleteRoom = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, string>({
    mutationFn: (roomId: string) => chatService.deleteRoom(supabase, roomId),
    onSuccess: (data, roomId, context) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms", roomId] })
      queryClient.invalidateQueries({ queryKey: ["chatRooms", "user"] })
      options?.onSuccess?.(data, roomId, context)
    },
    ...options,
  })
}

// Add participant to room mutation
export const useAddParticipant = (
  options?: Omit<UseMutationOptions<any, Error, { roomId: string; userId: string }>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<any, Error, { roomId: string; userId: string }>({
    mutationFn: ({ roomId, userId }) => chatService.addParticipant(supabase, roomId, userId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms", variables.roomId] })
      queryClient.invalidateQueries({ queryKey: ["chatRooms", variables.roomId, "participants"] })
      queryClient.invalidateQueries({ queryKey: ["chatRooms", "user", variables.userId] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Remove participant from room mutation
export const useRemoveParticipant = (
  options?: Omit<UseMutationOptions<boolean, Error, { roomId: string; userId: string }>, "mutationFn">,
) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, { roomId: string; userId: string }>({
    mutationFn: ({ roomId, userId }) => chatService.removeParticipant(supabase, roomId, userId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms", variables.roomId] })
      queryClient.invalidateQueries({ queryKey: ["chatRooms", variables.roomId, "participants"] })
      queryClient.invalidateQueries({ queryKey: ["chatRooms", "user", variables.userId] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Send a message mutation
export const useSendMessage = (options?: Omit<UseMutationOptions<MessageRow, Error, MessageInsert>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<MessageRow, Error, MessageInsert>({
    mutationFn: (message: MessageInsert) => chatService.sendMessage(supabase, message),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms", data.room_id, "messages"] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// Delete a message mutation
export const useDeleteMessage = (options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">) => {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, string>({
    mutationFn: (messageId: string) => chatService.deleteMessage(supabase, messageId),
    onSuccess: (data, messageId, context) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] })
      options?.onSuccess?.(data, messageId, context)
    },
    ...options,
  })
}

