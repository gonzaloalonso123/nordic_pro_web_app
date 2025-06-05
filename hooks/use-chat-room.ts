import { useState, useEffect, useCallback, useRef } from "react";
import { Tables } from "@/types/database.types";
import type { DisplayMessage } from "@/components/chat/chat-interface";
import { useClientData } from "@/utils/data/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { chatRoomsService } from "@/utils/supabase/services";

export function useMessages(
  roomId: string,
  currentUser: Tables<'users'>,
  initialMessages: DisplayMessage[] = []
) {
  const [messages, setMessages] = useState<DisplayMessage[]>(initialMessages);
  const [error, setError] = useState<string | null>(null);
  const [realtimeTrigger, setRealtimeTrigger] = useState(0);
  const previousMessagesRef = useRef<string[]>([]);
  const pendingRealtimeMessagesRef = useRef<Map<string, Tables<"chat_messages">>>(new Map());

  const { users, chatMessages } = useClientData();

  const { data: roomMessages, isPending } = chatMessages.useChatMessagesByRoom(roomId, {
    initialData: () => initialMessages.map(m => ({
      id: m.id,
      room_id: m.room_id,
      user_id: m.user_id,
      content: m.content,
      created_at: m.created_at,
    }))
  });

  const { mutateAsync: createMessage } = chatMessages.useCreateChatMessage({
    onError: (err) => setError(`Failed to send message: ${err.message}`)
  });

  const allMessages = [
    ...(roomMessages || []),
    ...Array.from(pendingRealtimeMessagesRef.current.values())
  ];

  const userIds = [...new Set(
    allMessages
      .filter(msg => msg.user_id)
      .map(msg => msg.user_id as string)
  )];

  const { data: userDataList, isPending: usersLoading } = users.useByIds(userIds);

  const userDataMap = userDataList
    ? Object.fromEntries(userDataList.map(user => [user.id, user]))
    : {};

  useEffect(() => {
    if (!roomMessages || usersLoading) {
      return;
    }

    const messageIds = roomMessages.map(msg => msg.id);
    const hasChanged = messageIds.length !== previousMessagesRef.current.length ||
      messageIds.some((id, i) => id !== previousMessagesRef.current[i]);

    if (!hasChanged && pendingRealtimeMessagesRef.current.size === 0) return;

    previousMessagesRef.current = messageIds;

    const combinedMessages = [
      ...roomMessages,
      ...Array.from(pendingRealtimeMessagesRef.current.values())
    ];

    const processedMessages = combinedMessages.map(msg => {
      return {
        ...msg,
        author: msg.user_id ? userDataMap[msg.user_id] : undefined
      };
    });

    processedMessages.sort((a, b) => {
      return new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime();
    });

    pendingRealtimeMessagesRef.current.clear();

    setMessages(processedMessages);
  }, [roomMessages, userDataList, usersLoading, userDataMap, realtimeTrigger]);

  const handleNewRealtimeMessage = useCallback((newMessage: Tables<"chat_messages">) => {
    const messageExists = pendingRealtimeMessagesRef.current.has(newMessage.id);

    if (messageExists) {
      return;
    }

    if (newMessage.user_id) {
      pendingRealtimeMessagesRef.current.set(newMessage.id, newMessage);

      setRealtimeTrigger(prev => prev + 1);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (content.trim() === "" || !currentUser || !roomId) {
      if (!currentUser) setError("You must be logged in to send messages.");
      return;
    }

    try {
      const tempId = `temp_${Date.now()}`;
      const messageContent = content.trim();

      const optimisticMessage = {
        room_id: roomId,
        user_id: currentUser.id,
        content: messageContent,
        id: tempId,
        created_at: new Date().toISOString(),
        author: currentUser
      };

      setMessages(prev => [...prev, optimisticMessage]);

      const insertedData = await createMessage({
        room_id: roomId,
        user_id: currentUser.id,
        content: messageContent,
      });

      if (insertedData) {
        setMessages(prev => prev.map(msg =>
          msg.id === tempId ? { ...insertedData, author: currentUser } : msg
        ));
      }
    } catch (err: any) {
      console.error("Error sending message:", err);
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp_')));
      if (!error) setError(`Failed to send message: ${err.message}`);
    }
  }, [roomId, currentUser, createMessage, error]);

  return {
    messages,
    isLoading: isPending || usersLoading,
    error,
    sendMessage,
    handleNewRealtimeMessage
  };
}

// Types for paginated messages
type PaginatedMessageResult = {
  messages: Tables<"chat_messages">[];
  hasMore: boolean;
  total: number;
  nextOffset?: number;
};

// New hook for paginated message loading
export function usePaginatedMessages(roomId: string | undefined) {
  const supabase = createClient();

  return useInfiniteQuery<PaginatedMessageResult, Error, any, any[], number>({
    queryKey: ["chatMessages", "paginated", roomId],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      if (!roomId) throw new Error("Room ID is required");
      
      const result = await chatRoomsService.getMessagesByRoomPaginated(
        supabase,
        roomId,
        {
          limit: 100,
          offset: pageParam * 100
        }
      );
      
      return {
        ...result,
        nextOffset: result.hasMore ? pageParam + 1 : undefined
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: PaginatedMessageResult) => lastPage.nextOffset,
    enabled: !!roomId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
