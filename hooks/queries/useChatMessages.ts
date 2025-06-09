"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { chatMessagesService } from "@/utils/supabase/services";
import { createClient } from "@/utils/supabase/client";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";

type ChatMessageRow = Tables<"messages">;
type ChatMessageInsert = TablesInsert<"messages">;
type ChatMessageUpdate = TablesUpdate<"messages">;

type MessageReadRow = Tables<"message_reads">;
type MessageReadInsert = TablesInsert<"message_reads">;

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
      roomId ? chatMessagesService.getByRoom(supabase, roomId) : [],
    enabled: !!roomId,
    ...options,
  });
};

// Hook to get a single chat message by ID
export const useChatMessageById = <TData = ChatMessageRow | null>(
  messageId: string | undefined,
  options?: Omit<
    UseQueryOptions<ChatMessageRow | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<ChatMessageRow | null, Error, TData>({
    queryKey: ["chatMessages", messageId],
    queryFn: () =>
      messageId ? chatMessagesService.getById(supabase, messageId) : null,
    enabled: !!messageId,
    ...options,
  });
};

// Hook to create (send) a chat message
export const useCreateChatMessage = (
  options?: Omit<
    UseMutationOptions<ChatMessageRow, Error, ChatMessageInsert>,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<ChatMessageRow, Error, ChatMessageInsert>({
    mutationFn: (message: ChatMessageInsert) =>
      chatMessagesService.create(supabase, message),
    onSuccess: (data, variables, context) => {
      // Invalidate queries for the room's messages
      if (variables.room_id) {
        queryClient.invalidateQueries({
          queryKey: ["chatMessages", "room", variables.room_id],
        });
        // If chat rooms are fetched with messages, invalidate that too
        queryClient.invalidateQueries({
          queryKey: ["chatRooms", variables.room_id, "messages"],
        });
        // Potentially invalidate unread counts for the room
        // queryClient.invalidateQueries({ queryKey: ["unreadMessages", variables.room_id] });
      }
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Hook to update a chat message
export const useUpdateChatMessage = (
  options?: Omit<
    UseMutationOptions<
      ChatMessageRow,
      Error,
      { messageId: string; updates: ChatMessageUpdate; roomId?: string } // roomId for invalidation
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    ChatMessageRow,
    Error,
    { messageId: string; updates: ChatMessageUpdate; roomId?: string }
  >({
    mutationFn: ({ messageId, updates }) =>
      chatMessagesService.update(supabase, messageId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", variables.messageId],
      });
      if (variables.roomId) {
        queryClient.invalidateQueries({
          queryKey: ["chatMessages", "room", variables.roomId],
        });
      } else if (data?.room_id) {
        // Fallback to room_id from response if available
         queryClient.invalidateQueries({
          queryKey: ["chatMessages", "room", data.room_id],
        });
      }
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Hook to delete a chat message
export const useDeleteChatMessage = (
  options?: Omit<
    UseMutationOptions<
      boolean, // Assuming delete returns boolean for success
      Error,
      { messageId: string; roomId?: string } // roomId for invalidation
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    boolean,
    Error,
    { messageId: string; roomId?: string }
  >({
    mutationFn: ({ messageId }) =>
      chatMessagesService.delete(supabase, messageId),
    onSuccess: (data, variables, context) => {
      if (data) { // If deletion was successful
        queryClient.invalidateQueries({
          queryKey: ["chatMessages", variables.messageId],
        });
         if (variables.roomId) {
          queryClient.invalidateQueries({
            queryKey: ["chatMessages", "room", variables.roomId],
          });
        }
      }
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Hook to mark a message as read
export const useMarkMessageAsRead = (
  options?: Omit<
    UseMutationOptions<MessageReadRow, Error, MessageReadInsert>,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<MessageReadRow, Error, MessageReadInsert>({
    mutationFn: (messageRead: MessageReadInsert) =>
      chatMessagesService.markAsRead(supabase, messageRead),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["messageReads", variables.message_id, variables.user_id],
      });
      queryClient.invalidateQueries({ queryKey: ["unreadMessages"] }); // General unread count

      // To invalidate specific room unread count, you might need room_id.
      // This could be fetched or passed if available.
      // Example: if (variables.room_id) {
      //   queryClient.invalidateQueries({ queryKey: ["unreadMessages", variables.room_id, variables.user_id] });
      //   queryClient.invalidateQueries({ queryKey: ["chatRoomUnreadCount", variables.room_id, variables.user_id] });
      // }
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
