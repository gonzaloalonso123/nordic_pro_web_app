import { useState, useEffect, useCallback, useRef } from "react";
import { Tables } from "@/types/database.types";
import type { DisplayMessage } from "@/components/chat/chat-interface";
import { useClientData } from "@/utils/data/client";

export function useMessages(
  roomId: string,
  currentUser: Tables<'users'>,
  initialMessages: DisplayMessage[] = []
) {
  const [messages, setMessages] = useState<DisplayMessage[]>(initialMessages);
  const [error, setError] = useState<string | null>(null);
  const previousMessagesRef = useRef<string[]>([]);
  const pendingRealtimeMessagesRef = useRef<Map<string, Tables<"chat_messages">>>(new Map());

  const { users, chatMessages } = useClientData();

  // Fetch messages for the room
  const { data: roomMessages, isPending } = chatMessages.useChatMessagesByRoom(roomId, {
    initialData: () => initialMessages.map(m => ({
      id: m.id,
      room_id: m.room_id,
      user_id: m.user_id,
      content: m.content,
      created_at: m.created_at,
    }))
  });

  // Setup message creation mutation
  const { mutateAsync: createMessage } = chatMessages.useCreateChatMessage({
    onError: (err) => setError(`Failed to send message: ${err.message}`)
  });

  // Get unique user IDs from messages and pending realtime messages
  const allMessages = [
    ...(roomMessages || []),
    ...Array.from(pendingRealtimeMessagesRef.current.values())
  ];

  const userIds = [...new Set(
    allMessages
      .filter(msg => msg.user_id)
      .map(msg => msg.user_id as string)
  )];

  // Fetch user data for all unique user IDs at once using useByIds
  const { data: userDataList, isPending: usersLoading } = users.useByIds(userIds);

  // Create a map of user data for easy lookup
  const userDataMap = userDataList
    ? Object.fromEntries(userDataList.map(user => [user.id, user]))
    : {};

  // Process messages and add author information
  useEffect(() => {
    if (!roomMessages || usersLoading) {
      return;
    }

    // Check if message list has changed
    const messageIds = roomMessages.map(msg => msg.id);
    const hasChanged = messageIds.length !== previousMessagesRef.current.length ||
      messageIds.some((id, i) => id !== previousMessagesRef.current[i]);

    if (!hasChanged && pendingRealtimeMessagesRef.current.size === 0) return;

    // Save current message IDs for comparison
    previousMessagesRef.current = messageIds;

    // Process both database messages and pending realtime messages
    const combinedMessages = [
      ...roomMessages,
      ...Array.from(pendingRealtimeMessagesRef.current.values())
    ];

    // Add author information to messages
    const processedMessages = combinedMessages.map(msg => {
      const existingMsg = messages.find(m => m.id === msg.id && m.author);
      if (existingMsg) return existingMsg;

      return {
        ...msg,
        author: msg.user_id ? userDataMap[msg.user_id] : undefined
      };
    });

    // Sort messages by creation time
    processedMessages.sort((a, b) => {
      return new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime();
    });

    // Clear processed realtime messages
    pendingRealtimeMessagesRef.current.clear();

    setMessages(processedMessages);
  }, [roomMessages, userDataList, usersLoading, messages]);

  const messageAlreadyExists = useCallback((messageId: Tables<"chat_messages">['id']) => {
    return messages.some(msg => msg.id === messageId);
  }, [messages]);

  const handleNewRealtimeMessage = useCallback((newMessage: Tables<"chat_messages">) => {
    if (messageAlreadyExists(newMessage.id)) return;

    if (newMessage.user_id) {
      pendingRealtimeMessagesRef.current.set(newMessage.id, newMessage);

      // Force a re-render to process the message with author data
      setMessages(prev => [...prev]);
    }
  }, [messageAlreadyExists]);

  // Send a new message
  const sendMessage = useCallback(async (content: string) => {
    if (content.trim() === "" || !currentUser || !roomId) {
      if (!currentUser) setError("You must be logged in to send messages.");
      return;
    }

    try {
      const tempId = `temp_${Date.now()}`;
      const messageContent = content.trim();

      // Add optimistic message
      const optimisticMessage = {
        room_id: roomId,
        user_id: currentUser.id,
        content: messageContent,
        id: tempId,
        created_at: new Date().toISOString(),
        author: currentUser
      };

      setMessages(prev => [...prev, optimisticMessage]);

      // Send to server
      const insertedData = await createMessage({
        room_id: roomId,
        user_id: currentUser.id,
        content: messageContent,
      });

      // Replace optimistic message with server response
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
