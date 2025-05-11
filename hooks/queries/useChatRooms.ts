import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { chatRoomsService } from "@/utils/supabase/services";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/utils/database.types";
import { createClient } from "@/utils/supabase/client";

type ChatRoomRow = Tables<"chat_rooms">;
type ChatRoomInsert = TablesInsert<"chat_rooms">;
type ChatRoomUpdate = TablesUpdate<"chat_rooms">;
// Add these types
type ChatMessageRow = Tables<"chat_messages">;
type ChatMessageInsert = TablesInsert<"chat_messages">;
type ChatRoomMemberRow = Tables<"chat_room_members">;
type ChatRoomMemberInsert = TablesInsert<"chat_room_members">;
type MessageReadRow = Tables<"message_reads">;
type MessageReadInsert = TablesInsert<"message_reads">;

// Get all chat rooms
export const useChatRooms = <TData = ChatRoomRow[]>(
  options?: Omit<
    UseQueryOptions<ChatRoomRow[], Error, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const supabase = createClient();
  return useQuery<ChatRoomRow[], Error, TData>({
    queryKey: ["chatRooms"],
    queryFn: () => chatRoomsService.getAll(supabase),
    ...options,
  });
};

// Get chat room by ID
export const useChatRoom = <TData = ChatRoomRow>(
  chatRoomId: string | undefined,
  options?: Omit<
    UseQueryOptions<ChatRoomRow | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<ChatRoomRow | null, Error, TData>({
    queryKey: ["chatRooms", chatRoomId],
    queryFn: () =>
      chatRoomId ? chatRoomsService.getById(supabase, chatRoomId) : null,
    enabled: !!chatRoomId,
    ...options,
  });
};

// Get chat rooms by user
export const useChatRoomsByUser = <TData = ChatRoomRow[]>(
  userId: string | undefined,
  options?: Omit<
    UseQueryOptions<ChatRoomRow[] | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<ChatRoomRow[] | null, Error, TData>({
    queryKey: ["chatRooms", "user", userId],
    queryFn: () =>
      userId ? chatRoomsService.getByUser(supabase, userId) : null,
    enabled: !!userId,
    ...options,
  });
};

// Get chat room with messages
export const useChatRoomWithMessages = <TData = any>(
  chatRoomId: string | undefined,
  options?: Omit<
    UseQueryOptions<any | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<any | null, Error, TData>({
    queryKey: ["chatRooms", chatRoomId, "messages"],
    queryFn: () =>
      chatRoomId
        ? chatRoomsService.getWithMessages(supabase, chatRoomId)
        : null,
    enabled: !!chatRoomId,
    ...options,
  });
};

// Get chat room with users
export const useChatRoomWithUsers = <TData = any>(
  chatRoomId: string | undefined,
  options?: Omit<
    UseQueryOptions<any | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<any | null, Error, TData>({
    queryKey: ["chatRooms", chatRoomId, "users"],
    queryFn: () =>
      chatRoomId ? chatRoomsService.getWithUsers(supabase, chatRoomId) : null,
    enabled: !!chatRoomId,
    ...options,
  });
};

// Create chat room mutation
export const useCreateChatRoom = (
  options?: Omit<
    UseMutationOptions<ChatRoomRow, Error, ChatRoomInsert>,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<ChatRoomRow, Error, ChatRoomInsert>({
    mutationFn: (chatRoom: ChatRoomInsert) =>
      chatRoomsService.create(supabase, chatRoom),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Update chat room mutation
export const useUpdateChatRoom = (
  options?: Omit<
    UseMutationOptions<
      ChatRoomRow,
      Error,
      { chatRoomId: string; updates: ChatRoomUpdate }
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    ChatRoomRow,
    Error,
    { chatRoomId: string; updates: ChatRoomUpdate }
  >({
    mutationFn: ({ chatRoomId, updates }) =>
      chatRoomsService.update(supabase, chatRoomId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      queryClient.invalidateQueries({
        queryKey: ["chatRooms", variables.chatRoomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chatRooms", variables.chatRoomId, "messages"],
      });
      queryClient.invalidateQueries({
        queryKey: ["chatRooms", variables.chatRoomId, "users"],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Delete chat room mutation
export const useDeleteChatRoom = (
  options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (chatRoomId: string) =>
      chatRoomsService.delete(supabase, chatRoomId),
    onSuccess: (data, chatRoomId, context) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      queryClient.invalidateQueries({ queryKey: ["chatRooms", chatRoomId] });
      options?.onSuccess?.(data, chatRoomId, context);
    },
    ...options,
  });
};

// Get messages by room
export const useChatMessagesByRoom = <TData = ChatMessageRow[]>(
  roomId: string | undefined,
  options?: Omit<
    UseQueryOptions<ChatMessageRow[], Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<ChatMessageRow[], Error, TData>({
    queryKey: ["chatMessages", "room", roomId],
    queryFn: () =>
      roomId ? chatRoomsService.getMessagesByRoom(supabase, roomId) : [],
    enabled: !!roomId,
    ...options,
  });
};

// Send a message mutation
export const useSendChatMessage = (
  options?: Omit<
    UseMutationOptions<
      ChatMessageRow,
      Error,
      ChatMessageInsert,
      unknown
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    ChatMessageRow,
    Error,
    ChatMessageInsert,
    unknown
  >({
    mutationFn: (message) => chatRoomsService.sendMessage(supabase, message),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["chatMessages", "room", variables.room_id] });
      queryClient.invalidateQueries({ queryKey: ["chatRooms", variables.room_id, "messages"] });
    },
    ...options,
  });
};

// Get chat room members
export const useChatRoomMembers = <TData = ChatRoomMemberRow[]>(
  roomId: string | undefined,
  options?: Omit<
    UseQueryOptions<ChatRoomMemberRow[], Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<ChatRoomMemberRow[], Error, TData>({
    queryKey: ["chatRoomMembers", roomId],
    queryFn: () =>
      roomId ? chatRoomsService.getChatRoomMembers(supabase, roomId) : [],
    enabled: !!roomId,
    ...options,
  });
};

// Add chat room member mutation
export const useAddChatRoomMember = (
  options?: Omit<
    UseMutationOptions<
      ChatRoomMemberRow,
      Error,
      ChatRoomMemberInsert,
      unknown
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    ChatRoomMemberRow,
    Error,
    ChatRoomMemberInsert,
    unknown
  >({
    mutationFn: (member) => chatRoomsService.addChatRoomMember(supabase, member),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["chatRoomMembers", variables.room_id] });
      queryClient.invalidateQueries({ queryKey: ["chatRooms", variables.room_id] });
    },
    ...options,
  });
};

// Remove chat room member mutation
export const useRemoveChatRoomMember = (
  options?: Omit<
    UseMutationOptions<
      void,
      Error,
      { roomId: string; userId: string },
      unknown
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { roomId: string; userId: string },
    unknown
  >({
    mutationFn: ({ roomId, userId }) => 
      chatRoomsService.removeChatRoomMember(supabase, roomId, userId),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["chatRoomMembers", variables.roomId] });
      queryClient.invalidateQueries({ queryKey: ["chatRooms", variables.roomId] });
    },
    ...options,
  });
};

// Mark message as read mutation
export const useMarkMessageAsRead = (
  options?: Omit<
    UseMutationOptions<
      MessageReadRow,
      Error,
      MessageReadInsert,
      unknown
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    MessageReadRow,
    Error,
    MessageReadInsert,
    unknown
  >({
    mutationFn: (messageRead) => 
      chatRoomsService.markMessageAsRead(supabase, messageRead),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["messageReads", data.message_id] });
      queryClient.invalidateQueries({ queryKey: ["unreadMessages"] });
    },
    ...options,
  });
};

// Get unread message count
export const useUnreadMessageCount = (
  roomId: string | undefined,
  userId: string | undefined,
  options?: Omit<
    UseQueryOptions<number, Error, number>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<number, Error, number>({
    queryKey: ["unreadMessages", roomId, userId],
    queryFn: () =>
      roomId && userId 
        ? chatRoomsService.getUnreadMessageCount(supabase, roomId, userId) 
        : 0,
    enabled: !!roomId && !!userId,
    ...options,
  });
};

// Add this new hook to get unread counts for multiple rooms at once
export const useUnreadMessageCountBatch = (
  roomIds: string[] | undefined,
  userId: string | undefined,
  options?: Omit<
    UseQueryOptions<Record<string, number>, Error, Record<string, number>>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<Record<string, number>, Error, Record<string, number>>({
    queryKey: ["unreadMessages", "batch", roomIds, userId],
    queryFn: async () => {
      if (!roomIds || !roomIds.length || !userId) return {};
      
      // Create an object to store counts for each room
      const counts: Record<string, number> = {};
      
      // Get counts for each room
      await Promise.all(
        roomIds.map(async (roomId) => {
          const count = await chatRoomsService.getUnreadMessageCount(supabase, roomId, userId);
          counts[roomId] = count;
        })
      );
      
      return counts;
    },
    enabled: !!roomIds?.length && !!userId,
    ...options,
  });
};
