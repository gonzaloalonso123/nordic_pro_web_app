"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Tables } from "@/types/database.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useMarkRoomAsRead } from "@/hooks/queries/useChatRooms";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { MessageItem } from "./message-item";
import { ChatInput } from "./chat-input";
import type { ChatMessageWithDetails } from "@/utils/supabase/services";

interface ChatInterfaceProps {
  roomId: string;
  currentUser: Tables<'users'>;
  initialMessages: ChatMessageWithDetails[];
  initialUsers: ChatMessageWithDetails['users'][];
}

export function ChatInterface({
  roomId,
  currentUser,
  initialMessages = [],
  initialUsers = [],
}: ChatInterfaceProps) {
  const [isInitialLoading, setIsInitialLoading] = useState(initialMessages.length === 0);

  useEffect(() => {
    if (initialMessages.length > 0) {
      setIsInitialLoading(false);
    }
  }, [initialMessages.length]);

  if (!roomId || !currentUser) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
          <p>Invalid chat configuration</p>
        </div>
      </div>
    );
  }

  const [messages, setMessages] = useState<(ChatMessageWithDetails)[]>(initialMessages);
  const [userCache, setUserCache] = useState<Map<string, ChatMessageWithDetails['users']>>(new Map());
  const { messagesEndRef, scrollAreaRef, scrollToBottom } = useAutoScroll();

  const { mutate: markRoomAsRead } = useMarkRoomAsRead({
    onError: (error) => {
      console.error("Failed to mark room as read:", error);
    }
  });
  useEffect(() => {
    if (roomId && currentUser?.id) {
      markRoomAsRead({ roomId, userId: currentUser.id });
    }
  }, [roomId, currentUser?.id, markRoomAsRead]);

  const userCacheMap = useMemo(() => {
    const initialUserMap = new Map<string, ChatMessageWithDetails['users']>();

    // Add users from initial messages
    initialMessages.forEach(message => {
      if (message.users && message.sender_id) {
        initialUserMap.set(message.sender_id, message.users);
      }
    });

    // Add all chat users
    initialUsers.forEach(user => {
      initialUserMap.set(user.id, user);
    });

    // Always include current user in cache
    initialUserMap.set(currentUser.id, currentUser);

    return initialUserMap;
  }, [initialMessages, initialUsers, currentUser]);

  useEffect(() => {
    setUserCache(userCacheMap);
  }, [userCacheMap]);

  const handleNewMessage = useCallback((newMessage: Tables<"messages">) => {
    setMessages(prev => {
      if (prev.some(msg => msg.id === newMessage.id)) {
        return prev;
      }

      const user = userCache.get(newMessage.sender_id);
      if (!user) {
        console.warn(`User not found in cache for sender_id: ${newMessage.sender_id}`);
        return prev;
      }

      const messageWithDetails: ChatMessageWithDetails = {
        ...newMessage,
        users: user,
        message_reads: []
      };

      if (roomId && currentUser?.id && document.hasFocus()) {
        markRoomAsRead({ roomId, userId: currentUser.id });
      }
      setIsInitialLoading(false);
      return [...prev, messageWithDetails];
    });
  }, [userCache, roomId, currentUser?.id, markRoomAsRead]);

  // Hooks for separate concerns
  const { sendMessage, error, isSending } = useSendMessage(roomId, currentUser.id);
  useRealtimeChat(roomId, handleNewMessage);

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
    setTimeout(() => scrollToBottom(), 100);
  };

  return (
    <div className="max-h-screen-without-header-mobile md:max-h-screen-without-header flex flex-col h-full bg-background">
      <ScrollArea ref={scrollAreaRef} className="h-full">
        <div className="space-y-4">
          {isInitialLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`flex items-end gap-2 max-w-[75%] ${i % 2 === 0 ? "" : "justify-end"}`}>
                  {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />}
                  <div className="space-y-1">
                    <Skeleton className={`h-12 ${i % 2 === 0 ? "w-48" : "w-40"} rounded-lg`} />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
                currentUserId={currentUser.id}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <ChatInput
        onSendMessage={handleSendMessage}
        isSending={isSending}
        error={error}
      />
    </div>
  );
}
