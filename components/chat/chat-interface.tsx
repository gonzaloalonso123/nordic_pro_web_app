"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import type { Tables } from "@/types/database.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useMessages, usePaginatedMessages } from "@/hooks/use-chat-room";
import { useRealtimeChat } from "@/hooks/use-realtime-chat";
import { getInitials } from "@/utils/get-initials";
import { useMemo, useCallback } from "react";

export type UserProfileSnippet = Pick<
  Tables<"users">,
  "id" | "first_name" | "last_name" | "avatar" | "email"
>;

export type DisplayMessage = Tables<"chat_messages"> & {
  author?: UserProfileSnippet | null;
};

interface ChatInterfaceProps {
  roomId: string;
  currentUser: Tables<'users'>;
  initialMessages?: DisplayMessage[];
}

export function ChatInterface({
  roomId,
  currentUser,
  initialMessages = [],
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // First, check if we should use pagination
  const paginatedQuery = usePaginatedMessages(roomId);
  const shouldUsePagination = paginatedQuery.data?.pages?.[0]?.total > 100;

  // Use regular messages hook for small conversations
  const regularMessages = useMessages(roomId, currentUser, initialMessages);

  // Choose which data to use based on message count
  const {
    messages,
    isLoading,
    error: chatError,
    sendMessage,
    handleNewRealtimeMessage
  } = useMemo(() => {
    if (shouldUsePagination) {
      // For paginated messages, flatten all pages
      const allMessages = paginatedQuery.data?.pages?.flatMap((page: any) => page.messages) || [];
      
      return {
        messages: allMessages.map((msg: any) => ({ ...msg, author: null })) as DisplayMessage[], // We'll need to fetch user data separately
        isLoading: paginatedQuery.isLoading,
        error: paginatedQuery.error?.message || null,
        sendMessage: regularMessages.sendMessage, // Use regular send for real-time updates
        handleNewRealtimeMessage: regularMessages.handleNewRealtimeMessage
      };
    }
    
    return regularMessages;
  }, [shouldUsePagination, paginatedQuery, regularMessages]);

  const { error: realtimeError } = useRealtimeChat<Tables<"chat_messages">>(
    roomId,
    (newMessagePayload) => handleNewRealtimeMessage(newMessagePayload)
  );

  const error = chatError || realtimeError;

  // Load more messages function for pagination
  const loadMoreMessages = useCallback(() => {
    if (shouldUsePagination && paginatedQuery.hasNextPage && !paginatedQuery.isFetchingNextPage) {
      // Store current scroll position before loading more
      const scrollElement = scrollAreaRef.current;
      if (scrollElement) {
        const currentScrollHeight = scrollElement.scrollHeight;
        
        paginatedQuery.fetchNextPage().then(() => {
          // After loading, maintain scroll position relative to new content
          setTimeout(() => {
            if (scrollElement) {
              const newScrollHeight = scrollElement.scrollHeight;
              const heightDifference = newScrollHeight - currentScrollHeight;
              scrollElement.scrollTop = heightDifference;
            }
          }, 50);
        });
      } else {
        paginatedQuery.fetchNextPage();
      }
    }
  }, [shouldUsePagination, paginatedQuery]);

  // Initial scroll to bottom when component mounts or when switching to pagination
  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      // For initial load, scroll to bottom immediately
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages.length > 0]); // Only trigger on initial load

  // Auto-scroll to bottom only for new messages (when user is near bottom)
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

  const handleSendMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() === "" || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(newMessage);
      setNewMessage("");
      // Always scroll to bottom after sending a message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("ChatInterface: Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Smart scroll behavior - detect if user is near bottom
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

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Please log in to participate in the chat.
      </div>
    );
  }

  return (
    <div className="max-h-screen-without-header-mobile md:max-h-screen-without-header flex flex-col h-full bg-background">
      {error && (
        <div className="p-2 text-center text-red-600 bg-red-100 border-b border-red-200">
          {error}
        </div>
      )}
      <ScrollArea className="p-4 h-full">
        <div className="space-y-4">
          {/* Load More Messages Button */}
          {shouldUsePagination && paginatedQuery.hasNextPage && (
            <div className="flex justify-center py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadMoreMessages}
                disabled={paginatedQuery.isFetchingNextPage}
              >
                {paginatedQuery.isFetchingNextPage ? "Loading..." : "Load Earlier Messages"}
              </Button>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center h-20 text-muted-foreground">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => {
              const isCurrentUserMessage = msg.user_id === currentUser.id;
              const authorName = isCurrentUserMessage
                ? "You"
                : msg.author?.first_name ||
                msg.author?.email?.split("@")[0] ||
                `User ${msg.user_id ? msg.user_id.substring(0, 6) : "..."}`;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isCurrentUserMessage ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-end gap-2 max-w-[75%]">
                    {!isCurrentUserMessage && (
                      <div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.author?.avatar || undefined} />
                          <AvatarFallback>
                            {getInitials({ firstName: msg.author?.first_name, lastName: msg.author?.last_name })}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <div
                      className={`py-2 px-3 rounded-lg shadow-xs max-w-80 ${isCurrentUserMessage
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-slate-200 rounded-bl-none"}`}
                    >
                      {!isCurrentUserMessage && (
                        <p className="text-xs font-semibold mb-1">
                          {authorName}
                        </p>
                      )}
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                      <p className={`text-xs ${isCurrentUserMessage ? "text-muted/80" : "text-muted-foreground/80"} mt-1 text-right`}>
                        {msg.created_at
                          ? new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "Sending..."}
                      </p>
                    </div>
                    {isCurrentUserMessage && (
                      <div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={currentUser.avatar || undefined} />
                          <AvatarFallback>
                            {getInitials({ firstName: currentUser.first_name, lastName: currentUser.last_name })}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
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
          disabled={!currentUser}
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!currentUser || newMessage.trim() === ""}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
