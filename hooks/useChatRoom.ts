"use client";

import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { Tables, TablesInsert } from "@/types/database.types";
import { useChatRoomWithUsers, useChatRoomMembers } from "@/hooks/queries/useChatRooms";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useClientData } from "@/utils/data/client";
import { useSimpleChatRealtime } from "@/hooks/useSimpleChatRealtime";

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
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  sendMessage: (content: string) => Promise<void>;
  hasMoreMessages: boolean;
  loadMoreMessages: () => void;
  isLoadingMore: boolean;
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

  // Use paginated messages
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

  // Get all unique user IDs from messages (including realtime)
  const allMessages = useMemo(() => {
    const dbMessages = paginatedMessages || [];
    const realtimeMessages = Array.from(realtimeMessagesRef.current.values());
    
    // Filter out realtime messages that already exist in paginated messages
    const dbMessageIds = new Set(dbMessages.map(msg => msg.id));
    const uniqueRealtimeMessages = realtimeMessages.filter(msg => !dbMessageIds.has(msg.id));
    
    // Clean up realtime messages that are now in the database
    realtimeMessages.forEach(msg => {
      if (dbMessageIds.has(msg.id)) {
        realtimeMessagesRef.current.delete(msg.id);
      }
    });
    
    return [...dbMessages, ...uniqueRealtimeMessages];
  }, [paginatedMessages, realtimeTrigger]);

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
    if (!paginatedMessages.length && realtimeMessagesRef.current.size === 0) return [];

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
    if (!realtimeMessagesRef.current.has(newMessage.id)) {
      realtimeMessagesRef.current.set(newMessage.id, newMessage);
      setRealtimeTrigger(prev => prev + 1);
    }
  }, [roomId]);

  // Setup realtime subscription
  const { status: realtimeStatus, isConnected } = useSimpleChatRealtime(
    roomId,
    handleRealtimeMessage
  );

  // Map status to our enum
  const connectionStatus = useMemo(() => {
    switch (realtimeStatus) {
      case "SUBSCRIBED": return ConnectionStatus.CONNECTED;
      case "CONNECTING": return ConnectionStatus.CONNECTING;
      case "CHANNEL_ERROR":
      case "TIMED_OUT": return ConnectionStatus.ERROR;
      case "CLOSED": return ConnectionStatus.DISCONNECTED;
      default: return ConnectionStatus.DISCONNECTED;
    }
  }, [realtimeStatus]);

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


    try {

      const messageData: TablesInsert<"messages"> = {
        room_id: roomId,
        sender_id: currentUser.id,
        content: content.trim(),
      };
      
      // Send to backend
      const result = await createMessage(messageData);


    } catch (err: any) {
      setError(`Failed to send message: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  }, [roomId, currentUser, createMessage, isSending]);

  // Combine loading states
  const isLoading = roomQuery.isLoading || membersQuery.isLoading ||
                   isLoadingMessages || usersQuery.isLoading;

  // Combine errors
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
    connectionStatus,
    isConnected,
    sendMessage,
    hasMoreMessages,
    loadMoreMessages,
    isLoadingMore,
  };
}
