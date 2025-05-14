"use client";

import { useState, useEffect, useRef, FormEvent, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Tables, TablesInsert } from "@/types/database.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send } from "lucide-react";

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
  const supabase = useMemo(() => createClient(), []);
  const [messages, setMessages] = useState<DisplayMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const userProfilesCache = useRef<Record<string, UserProfileSnippet>>({});
  const username = useMemo(() => {
    return currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "Unknown User";
  }, [currentUser]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchUserProfile = async (
    userId: string
  ): Promise<UserProfileSnippet | null> => {
    if (!userId) return null;
    if (userProfilesCache.current[userId]) {
      return userProfilesCache.current[userId];
    }
    try {
      const { data, error: profileError } = await supabase
        .from("users")
        .select("id, first_name, last_name, email, avatar")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.warn(
          `ChatInterface: Could not fetch profile for user ${userId}:`,
          profileError.message
        );
        return null;
      }
      if (data) {
        const profile = data as UserProfileSnippet;
        userProfilesCache.current[userId] = profile;
        return profile;
      }
    } catch (e) {
      console.error("ChatInterface: Exception fetching profile:", e);
    }
    return null;
  };

  useEffect(() => {
    const processInitialMessages = async () => {
      if (initialMessages.length > 0 && !initialMessages.some(msg => msg.author !== undefined)) {
        const processedMessages = await Promise.all(
          initialMessages.map(async (msg) => {
            if (msg.user_id && msg.author === undefined) {
              const authorProfile = await fetchUserProfile(msg.user_id);
              return { ...msg, author: authorProfile };
            }
            return msg;
          })
        );
        setMessages(processedMessages);
      } else {
        setMessages(initialMessages);
      }
    };
    processInitialMessages();
  }, [initialMessages]);

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(roomId)
      .on<Tables<"chat_messages">>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const newMessagePayload = payload.new;

          if (messages.find(msg => msg.id === newMessagePayload.id)) {
            return;
          }

          if (newMessagePayload.user_id) {
            const authorProfile = await fetchUserProfile(
              newMessagePayload.user_id
            );
            const messageWithAuthor: DisplayMessage = {
              ...newMessagePayload,
              author: authorProfile,
            };
            setMessages((prevMessages) => [...prevMessages, messageWithAuthor]);
          } else {
            console.warn(
              "ChatInterface: Received new message without user_id:",
              newMessagePayload
            );
          }
        }
      )
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setError(
            `Real-time connection issue: ${err?.message || "Subscription " + status.toLowerCase()}`
          );
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !currentUser || !roomId) {
      if (!currentUser) setError("You must be logged in to send messages.");
      return;
    }

    try {
      const tempId = `temp_${Date.now()}`;
      const messageContent = newMessage.trim();

      const optimisticMessage: DisplayMessage = {
        room_id: roomId,
        user_id: currentUser.id,
        content: messageContent,
        id: tempId,
        created_at: new Date().toISOString(),
        author: userProfilesCache.current[currentUser.id] || {
          id: currentUser.id,
          email: currentUser.email || "you@example.com",
          first_name: "You",
          last_name: "",
          avatar: null,
        }
      };

      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage("");

      const messageInsert: TablesInsert<"chat_messages"> = {
        room_id: roomId,
        user_id: currentUser.id,
        content: messageContent,
      };

      const { error: insertError, data: insertedData } = await supabase
        .from("chat_messages")
        .insert(messageInsert)
        .select()
        .single();

      if (insertError) {
        setError(`Failed to send message: ${insertError.message}`);
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
        throw insertError;
      }

      if (insertedData) {
        const finalMessage: DisplayMessage = {
          ...(insertedData as Tables<'chat_messages'>),
          author: optimisticMessage.author
        }
        setMessages(prev => prev.map(msg => msg.id === tempId ? finalMessage : msg));
      }
    } catch (err: any) {
      console.error("ChatInterface: Error sending message:", err);
      if (!error && !(err.message && err.message.includes(error))) {
        setError(`Failed to send message: ${err.message}`);
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Please log in to participate in the chat.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {error && (
        <div className="p-2 text-center text-red-600 bg-red-100 border-b border-red-200">
          {error}
        </div>
      )}
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((msg) => {
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
                          {authorName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div
                    className={`py-2 px-3 rounded-lg shadow-sm ${isCurrentUserMessage
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
                          {currentUser.first_name.substring(0, 1).toUpperCase()}
                          {currentUser.last_name.substring(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t bg-background flex items-center gap-2"
      >
        <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-primary">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message"
          className="flex-grow"
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

