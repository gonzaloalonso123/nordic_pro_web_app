"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { chatMessagesService } from "@/utils/supabase/services";
import { supabase } from "@/utils/supabase/client";
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

type ChatMessage = Tables<"messages"> & {
  users?: Pick<Tables<"users">, "id" | "first_name" | "last_name" | "avatar"> | null;
};

interface MessagePage {
  messages: ChatMessage[];
  nextCursor?: string;
  hasMore: boolean;
}

interface UseChatMessagesPaginatedOptions {
  limit?: number;
  enabled?: boolean;
}

export const useChatMessagesByRoom = <TData = ChatMessageRow[]>(
  roomId: string | undefined,
  options?: Omit<
    UseQueryOptions<ChatMessageRow[], Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
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
  return useMutation<ChatMessageRow, Error, ChatMessageInsert>({
    mutationFn: (message: ChatMessageInsert) =>
      chatMessagesService.create(supabase, message),
    onSuccess: (data, variables, context) => {
      // Don't invalidate queries since we're using realtime subscriptions
      // The message will appear via the realtime subscription
      // Only invalidate if explicitly needed for other components
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateChatMessage = (
  options?: Omit<
    UseMutationOptions<
      ChatMessageRow,
      Error,
      { messageId: string; updates: ChatMessageUpdate; roomId?: string }
    >,
    "mutationFn"
  >
) => {
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
        queryClient.invalidateQueries({
          queryKey: ["chatMessages", "paginated", variables.roomId],
        });
      } else if (data?.room_id) {
        // Fallback to room_id from response if available
        queryClient.invalidateQueries({
          queryKey: ["chatMessages", "room", data.room_id],
        });
        queryClient.invalidateQueries({
          queryKey: ["chatMessages", "paginated", data.room_id],
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
          queryClient.invalidateQueries({
            queryKey: ["chatMessages", "paginated", variables.roomId],
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
  const queryClient = useQueryClient();

  return useMutation<MessageReadRow, Error, MessageReadInsert>({
    mutationFn: (messageRead: MessageReadInsert) =>
      chatMessagesService.markAsRead(supabase, messageRead),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["messageReads", variables.message_id, variables.user_id],
      });
      queryClient.invalidateQueries({ queryKey: ["unreadMessages"] }); // General unread count

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
