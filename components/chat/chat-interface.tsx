"use client";

import { useState, useEffect, useRef, FormEvent, useCallback } from "react";
import type { Tables } from "@/types/database.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, AlertCircle } from "lucide-react";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { useSendMessage } from "@/hooks/useSendMessage";
import { MessageItem } from "./message-item";
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
  const [newMessage, setNewMessage] = useState<string>("");
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [messages, setMessages] = useState<(ChatMessageWithDetails | Tables<'messages'>)[]>(initialMessages);
  const [userCache, setUserCache] = useState<Map<string, ChatMessageWithDetails['users']>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  // Initialize user cache with chat members
  useEffect(() => {
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

    setUserCache(initialUserMap);
  }, [initialMessages, initialUsers, currentUser]);

  // Simple real-time handler - users should be in cache
  const handleNewMessage = useCallback((newMessage: Tables<"messages">) => {
    setMessages(prev => {
      if (prev.some(msg => msg.id === newMessage.id)) {
        return prev;
      }

      // Look up user from cache
      const user = newMessage.sender_id ? userCache.get(newMessage.sender_id) || null : null;

      return [...prev, {
        ...newMessage,
        users: user,
        message_reads: []
      }];
    });
  }, [userCache]);

  // Hooks for separate concerns
  const { sendMessage, error, isSending } = useSendMessage(roomId, currentUser.id);
  useRealtimeChat(roomId, handleNewMessage);

  // Auto-scroll effects
  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages.length]);

  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current && messages.length > 0) {
      const scrollElement = scrollAreaRef.current;
      if (scrollElement) {
        const { scrollTop, scrollHeight, clientHeight } = scrollElement;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

        if (isNearBottom) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [messages, shouldAutoScroll]);

  // Handle scroll for auto-scroll behavior
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isNearBottom);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() === "" || isSending) return;

    try {
      await sendMessage(newMessage);
      setNewMessage("");
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("ChatInterface: Error sending message:", err);
    }
  };

  return (
    <div className="max-h-screen-without-header-mobile md:max-h-screen-without-header flex flex-col h-full bg-background">
      {error && (
        <div className="p-2 text-center text-red-600 bg-red-100 border-b border-red-200">
          {error}
        </div>
      )}

      <ScrollArea ref={scrollAreaRef} className="p-4 h-full">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg: ChatMessageWithDetails) => (
              <MessageItem
                key={msg.id}
                message={msg}
                currentUser={currentUser}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSendMessageSubmit}
        className="p-4 border-t bg-background flex items-center gap-2"
      >
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message"
          className="grow"
          disabled={isSending}
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isSending || newMessage.trim() === ""}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
}
