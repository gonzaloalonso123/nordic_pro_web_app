import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { chatRoomsService, ChatRoomWithDetails, type ChatRoomWithMessagesAndMembers } from "@/utils/supabase/services";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";

type ChatRoomRow = Tables<"chat_rooms">;
type ChatRoomInsert = TablesInsert<"chat_rooms">;
type ChatRoomUpdate = TablesUpdate<"chat_rooms">;
type ChatMessageRow = Tables<"messages">;
type ChatMessageInsert = TablesInsert<"messages">;
type ChatRoomMemberRow = Tables<"chat_room_participants">;
type ChatRoomMemberInsert = TablesInsert<"chat_room_participants">;
type MessageReadRow = Tables<"message_reads">;
type MessageReadInsert = TablesInsert<"message_reads">;

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

export const useChatRoomsByUser = <TData = ChatRoomWithDetails[]>(
  userId: string | undefined,
  options?: Omit<
    UseQueryOptions<ChatRoomWithDetails[], Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<ChatRoomWithDetails[], Error, TData>({
    queryKey: ["chatRooms", "user", userId],
    queryFn: () =>
      userId ? chatRoomsService.getByUser(supabase, userId) : [],
    enabled: !!userId,
    ...options,
  });
};

export const useChatRoomWithMessages = <TData = ChatRoomWithMessagesAndMembers>(
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
      unknown // Context type
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<ChatMessageRow, Error, ChatMessageInsert, unknown>({
    mutationFn: (message) => chatRoomsService.sendMessage(supabase, message),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", "room", variables.room_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["chatRooms", variables.room_id, "messages"],
      });
      options?.onSuccess?.(data, variables, context);
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
      unknown // Context type
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<ChatRoomMemberRow, Error, ChatRoomMemberInsert, unknown>({
    mutationFn: (member) =>
      chatRoomsService.addChatRoomMember(supabase, member),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["chatRoomMembers", variables.room_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["chatRooms", variables.room_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["chatRooms", variables.room_id, "users"],
      }); // If room details include users
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Remove chat room member mutation
export const useRemoveChatRoomMember = (
  options?: Omit<
    UseMutationOptions<
      void, // Assuming your service.remove returns void or similar
      Error,
      { roomId: string; userId: string },
      unknown // Context type
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { roomId: string; userId: string }, unknown>({
    mutationFn: ({ roomId, userId }) =>
      chatRoomsService.removeChatRoomMember(supabase, roomId, userId),
    onSuccess: (_data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["chatRoomMembers", variables.roomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chatRooms", variables.roomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chatRooms", variables.roomId, "users"],
      });
      options?.onSuccess?.(_data, variables, context);
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
      unknown // Context type
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<MessageReadRow, Error, MessageReadInsert, unknown>({
    mutationFn: (messageRead) =>
      chatRoomsService.markMessageAsRead(supabase, messageRead),
    onSuccess: (data, variables, context) => {
      // Invalidate queries related to message read status or unread counts
      queryClient.invalidateQueries({
        queryKey: ["messageReads", data.message_id],
      }); // If you query individual read receipts
      queryClient.invalidateQueries({ queryKey: ["unreadMessages"] }); // General key for unread counts
      // Potentially invalidate specific room's unread count if you have such a query
      // queryClient.invalidateQueries({ queryKey: ["unreadMessages", variables.room_id_from_message_or_context, variables.user_id] });
      options?.onSuccess?.(data, variables, context);
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

// Get unread counts for multiple rooms at once
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

      return await chatRoomsService.getUnreadCountsBatch(
        supabase,
        roomIds,
        userId
      );
    },
    enabled: !!roomIds?.length && !!userId,
    staleTime: 30000, // 30 seconds
    ...options,
  });
};

// Mark room as read mutation
export const useMarkRoomAsRead = (
  options?: Omit<
    UseMutationOptions<void, Error, { roomId: string; userId: string }>,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { roomId: string; userId: string }>({
    mutationFn: ({ roomId, userId }) =>
      chatRoomsService.markRoomAsRead(supabase, roomId, userId),
    onSuccess: (_, { roomId, userId }) => {
      queryClient.invalidateQueries({
        queryKey: ["unreadMessages", roomId, userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["unreadMessages", "batch"],
      });
      queryClient.invalidateQueries({
        queryKey: ["chatRooms", "user", userId],
      });
    },
    ...options,
  });
};

interface StartDirectChatVariables {
  currentUserId: string;
  selectedUserId: string;
}

async function findOrCreateDirectChatRoomLogic(
  supabaseClient: ReturnType<typeof createClient>,
  createChatRoomMutationAsync: ReturnType<
    typeof useCreateChatRoom
  >["mutateAsync"],
  addChatRoomMemberMutationAsync: ReturnType<
    typeof useAddChatRoomMember
  >["mutateAsync"],
  variables: StartDirectChatVariables
): Promise<string> {
  // Returns the roomId
  const { currentUserId, selectedUserId } = variables;

  if (currentUserId === selectedUserId) {
    throw new Error("Cannot start a chat with yourself.");
  }

  const { data: existingRooms, error: findError } = await supabaseClient
    .rpc('find_existing_onetoone_chat', {
      user1_id: currentUserId,
      user2_id: selectedUserId
    });

  if (findError) {
    console.error('Error finding existing chat:', findError);
  } else if (existingRooms && existingRooms.length > 0) {
    console.log(`Found existing direct chat room: ${existingRooms[0].room_id}`);
    return existingRooms[0].room_id;
  }

  console.log('No existing 1-on-1 chat found. Creating new direct chat room...');

  const newRoomData: ChatRoomInsert = await createChatRoomMutationAsync({
    name: null,
    is_group_chat: false,
    created_by: currentUserId,
  });

  if (!newRoomData || !newRoomData.id) {
    throw new Error("Failed to create new room or room ID is missing from mutation response.");
  }
  const newRoomId = newRoomData.id;
  console.log(`New room created: ${newRoomId}. Adding members...`);

  await addChatRoomMemberMutationAsync({
    room_id: newRoomId,
    user_id: currentUserId,
  });
  console.log(`Added current user ${currentUserId} to room ${newRoomId}`);

  try {
    await addChatRoomMemberMutationAsync({
      room_id: newRoomId,
      user_id: selectedUserId,
    });
    console.log(`Added selected user ${selectedUserId} to room ${newRoomId}`);
  } catch (memberError) {
    console.error(
      `Error adding selected user ${selectedUserId} to room ${newRoomId}:`,
      memberError
    );
    try {
      const { error: deleteError } = await supabaseClient
        .from("chat_rooms")
        .delete()
        .eq("id", newRoomId);
      if (deleteError)
        console.error(
          `Failed to cleanup (delete) room ${newRoomId}:`,
          deleteError
        );
      else console.log(`Cleaned up room ${newRoomId} after member add error.`);
    } catch (cleanupCatchError) {
      console.error(
        `Exception during room cleanup for ${newRoomId}:`,
        cleanupCatchError
      );
    }
    throw memberError;
  }

  console.log(`Successfully created new direct chat room: ${newRoomId}`);
  return newRoomId;
}

export function useStartDirectChat() {
  const supabaseClient = createClient();
  const queryClient = useQueryClient();

  // Get the mutateAsync functions from your existing hooks
  const { mutateAsync: createChatRoomMutateAsync } = useCreateChatRoom();
  const { mutateAsync: addChatRoomMemberMutateAsync } = useAddChatRoomMember();

  return useMutation<string, Error, StartDirectChatVariables>({
    mutationFn: (variables) =>
      findOrCreateDirectChatRoomLogic(
        supabaseClient,
        createChatRoomMutateAsync,
        addChatRoomMemberMutateAsync,
        variables
      ),
    onSuccess: (roomId, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      queryClient.invalidateQueries({
        queryKey: ["chatRooms", "user", variables.currentUserId],
      });
      // You might also want to invalidate the specific room query if it could have been fetched before
      // queryClient.invalidateQueries({ queryKey: ['chatRooms', roomId] });
    },
    onError: (error) => {
      console.error("useStartDirectChat - Error:", error.message);
      alert(`Error starting chat: ${error.message}. Please try again.`);
    },
  });
}
