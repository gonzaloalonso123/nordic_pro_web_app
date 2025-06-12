"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { Tables, TablesInsert } from "@/types/database.types";
import { useChatRoomWithUsers, useChatRoomMembers } from "@/hooks/queries/useChatRooms";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useClientData } from "@/utils/data/client";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";

export type ChatMessage = Tables<"messages"> & {
  author?: Tables<'users'> | null;
};

type ChatRoom = NonNullable<ReturnType<typeof useChatRoomWithUsers>['data']>;
type ChatMember = Tables<"chat_room_participants"> & {
  users?: Tables<'users'> | null;
};

export const ConnectionStatus = {
  DISCONNECTED: "DISCONNECTED",
  CONNECTING: "CONNECTING",
  CONNECTED: "SUBSCRIBED",
  RECONNECTING: "RECONNECTING",
  ERROR: "ERROR"
} as const;

export type ConnectionStatus = typeof ConnectionStatus[keyof typeof ConnectionStatus];
export interface ChatRoomData {
  room: ChatRoom | null;
  members: ChatMember[];
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  hasMoreMessages: boolean;
  loadMoreMessages: () => void;
  isLoadingMore: boolean;
}

export function useChatRoom(roomId: string): ChatRoomData {
  const { user: currentUser } = useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [realtimeMessages, setRealtimeMessages] = useState<Tables<"messages">[]>([]);

  const { users, chatMessages } = useClientData();

  const roomQuery = useChatRoomWithUsers(roomId);
  const membersQuery = useChatRoomMembers(roomId);

  const {
    messages: paginatedMessages,
    isLoading: isLoadingMessages,
    error: messagesError,
    hasMoreMessages,
    loadMoreMessages,
    isLoadingMore,
  } = chatMessages.useFlattened(roomId);

  const { mutateAsync: createMessage } = chatMessages.useCreateChatMessage({
    onError: (err) => setError(`Failed to send message: ${err.message}`)
  });

  const allMessages = useMemo(() => {
    const dbMessages = paginatedMessages || [];
    const dbMessageIds = new Set(dbMessages.map(msg => msg.id));

    // Filter out realtime messages that are already in the database
    const uniqueRealtimeMessages = realtimeMessages.filter(msg => !dbMessageIds.has(msg.id));

    return [...dbMessages, ...uniqueRealtimeMessages];
  }, [paginatedMessages, realtimeMessages]);

  const userIds = useMemo(() => {
    return [...new Set(
      allMessages
        .filter(msg => msg.sender_id)
        .map(msg => msg.sender_id as string)
    )];
  }, [allMessages]);

  const usersQuery = users.useByIds(userIds);

  // Create user lookup map
  const userMap = useMemo(() => {
    if (!usersQuery.data) return {};
    return Object.fromEntries(
      usersQuery.data.map(user => [user.id, user])
    );
  }, [usersQuery.data]);

  // Process messages with author data
  const processedMessages = useMemo(() => {
    if (!allMessages.length) return [];

    const combined = allMessages.map(msg => ({
      ...msg,
      author: msg.sender_id ? userMap[msg.sender_id] : null,
    }));

    // Sort by creation time
    return combined.sort((a, b) =>
      new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
    );
  }, [allMessages, userMap]);

  // Handle realtime messages
  const handleRealtimeMessage = useCallback((newMessage: Tables<"messages">) => {
    if (newMessage.room_id !== roomId) return;

    setRealtimeMessages(prev => {
      // Check if message already exists
      if (prev.some(msg => msg.id === newMessage.id)) {
        return prev;
      }
      return [...prev, newMessage];
    });
  }, [roomId]);

  useRealtimeChat(roomId, handleRealtimeMessage);

  useEffect(() => {
    setRealtimeMessages([]);
    setError(null);
  }, [roomId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !currentUser || !roomId || isSending) return;

    setIsSending(true);
    setError(null);


    try {
      const messageData: TablesInsert<"messages"> = {
        room_id: roomId,
        sender_id: currentUser.id,
        content: content.trim(),
      };

      await createMessage(messageData);

    } catch (err: any) {
      setError(`Failed to send message: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  }, [roomId, currentUser, createMessage, isSending]);

  const isLoading = roomQuery.isLoading || membersQuery.isLoading ||
    isLoadingMessages || usersQuery.isLoading;

  const combinedError = error ||
    roomQuery.error?.message ||
    membersQuery.error?.message ||
    messagesError?.message ||
    usersQuery.error?.message;

  return {
    room: roomQuery.data || null,
    members: membersQuery.data || [],
    messages: processedMessages,
    isLoading,
    error: combinedError || null,
    sendMessage,
    hasMoreMessages,
    loadMoreMessages,
    isLoadingMore,
  };
}
