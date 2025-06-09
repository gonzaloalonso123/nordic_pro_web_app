"use client";

import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { Tables, TablesInsert } from "@/types/database.types";
import { useChatRoomWithUsers, useChatRoomMembers } from "@/hooks/queries/useChatRooms";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useClientData } from "@/utils/data/client";
import { useRealtimeChat, ConnectionStatus } from "@/hooks/use-realtime-chat";

export type ChatMessage = Tables<"messages"> & {
  author?: Tables<'users'> | null;
};

type ChatRoom = NonNullable<ReturnType<typeof useChatRoomWithUsers>['data']>;
type ChatMember = NonNullable<ReturnType<typeof useChatRoomMembers>['data']>[0];
export interface ChatRoomData {
  room: ChatRoom | null;
  members: ChatMember[];
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  sendMessage: (content: string) => Promise<void>;
  hasMoreMessages: boolean;
  loadMoreMessages: () => void;
}

export function useChatRoom(roomId: string): ChatRoomData {
  const { user: currentUser } = useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // State for managing realtime messages
  const realtimeMessagesRef = useRef<Map<string, Tables<"messages">>>(new Map());
  const [realtimeTrigger, setRealtimeTrigger] = useState(0);

  const { users, chatMessages } = useClientData();

  // Parallel data fetching - all coordinated with React Query cache
  const roomQuery = useChatRoomWithUsers(roomId);
  const membersQuery = useChatRoomMembers(roomId);

  const messagesQuery = chatMessages.useChatMessagesByRoom(roomId);

  const { mutateAsync: createMessage } = chatMessages.useCreateChatMessage({
    onError: (err) => setError(`Failed to send message: ${err.message}`)
  });

  // Get all unique user IDs from messages (including realtime)
  const allMessages = useMemo(() => {
    const dbMessages = messagesQuery.data || [];
    const realtimeMessages = Array.from(realtimeMessagesRef.current.values());
    return [...dbMessages, ...realtimeMessages];
  }, [messagesQuery.data, realtimeTrigger]);

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
    if (!messagesQuery.data && realtimeMessagesRef.current.size === 0) return [];

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

    // Check if message already exists
    const exists = realtimeMessagesRef.current.has(newMessage.id);

    if (!exists) {
      realtimeMessagesRef.current.set(newMessage.id, newMessage);
      setRealtimeTrigger(prev => prev + 1);
    }
  }, [roomId]);

  // Setup realtime subscription
  const { status: connectionStatus, error: realtimeError, isConnected } = useRealtimeChat(
    roomId,
    handleRealtimeMessage
  );

  // Clear realtime messages when room changes
  useEffect(() => {
    realtimeMessagesRef.current.clear();
    setError(null);
    setRealtimeTrigger(0);
  }, [roomId]);

  // Send message function with optimistic updates
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !currentUser || !roomId || isSending) return;

    setIsSending(true);
    setError(null);

    const tempId = `temp_${Date.now()}`;

    try {
      const now = new Date().toISOString();
      const optimisticMessage: Tables<"messages"> = {
        id: tempId,
        room_id: roomId,
        sender_id: currentUser.id,
        content: content.trim(),
        created_at: now,
        updated_at: now,
      };

      // Add optimistic message
      realtimeMessagesRef.current.set(tempId, optimisticMessage);
      setRealtimeTrigger(prev => prev + 1);

      const messageData: TablesInsert<"messages"> = {
        room_id: roomId,
        sender_id: currentUser.id,
        content: content.trim(),
      };
      // Send to backend
      const result = await createMessage(messageData);

      // Replace optimistic message with real one
      realtimeMessagesRef.current.delete(tempId);
      if (result) {
        realtimeMessagesRef.current.set(result.id, result);
      }
      setRealtimeTrigger(prev => prev + 1);

    } catch (err: any) {
      // Remove failed optimistic message
      realtimeMessagesRef.current.delete(tempId);
      setRealtimeTrigger(prev => prev + 1);
      setError(`Failed to send message: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  }, [roomId, currentUser, createMessage, isSending]);

  // Combine loading states
  const isLoading = roomQuery.isLoading || membersQuery.isLoading ||
                   messagesQuery.isLoading || usersQuery.isLoading;

  // Combine errors
  const combinedError = error || realtimeError ||
                       roomQuery.error?.message ||
                       membersQuery.error?.message ||
                       messagesQuery.error?.message ||
                       usersQuery.error?.message;

  return {
    room: roomQuery.data || null,
    members: membersQuery.data || [],
    messages: processedMessages,
    isLoading,
    error: combinedError || null,
    connectionStatus,
    isConnected,
    sendMessage,
    hasMoreMessages: false, // Will implement virtual scrolling later
    loadMoreMessages: () => {}, // Placeholder for virtual scrolling
  };
}
