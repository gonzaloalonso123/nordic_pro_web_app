"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Tables } from "@/types/database.types";
import ChatMessageItem from "./chat-message-item";
import { Content } from "../content";
import { useHeader } from "@/hooks/useHeader";
import BackButton from "../ui/back-button";
import { SupabaseClient } from "@supabase/supabase-js";
import { useChatRoomMessages } from "@/hooks/use-chat-room";

interface ChatMessageAreaProps {
  selectedRoom: Tables<"chat_rooms"> | null;
  currentUser: Tables<"users"> | null | undefined;
  onBackToList: () => void;
  isMobile: boolean;
}

export default function ChatMessageArea({ selectedRoom, currentUser, onBackToList, isMobile }: ChatMessageAreaProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { useHeaderConfig } = useHeader();

  const roomId = selectedRoom?.id ?? null;

  useHeaderConfig({
    centerContent: selectedRoom?.name || "Chat",
    leftContent: isMobile ? <BackButton onClick={onBackToList} /> : null,
  });

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    setTimeout(() => scrollToBottom("auto"), 0);
  }, [scrollToBottom]);

  const { messages, loading, sending, sendMessage } = useChatRoomMessages({
    roomId: roomId!,
    currentUser: currentUser!,
  });

  useEffect(() => {
    scrollToBottom("auto");
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(newMessage);
    setNewMessage("");
  };

  if (!selectedRoom || !currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-muted/30 p-4 text-center">
        <Users className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Select a chat to start messaging.</p>
        <p className="text-sm text-muted-foreground/80">Or create a new one!</p>
      </div>
    );
  }

  return (
    <div className="pb-[76px] px-0 w-full">
      <div className="flex-1 flex flex-col h-full bg-background">
        <ScrollArea className="flex-1 px-2" ref={scrollAreaRef}>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`flex items-center space-x-2 ${i % 2 === 0 ? "" : "justify-end"}`}>
                  {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                  <Skeleton className={`h-12 ${i % 2 === 0 ? "w-3/4" : "w-2/3"}`} />
                  {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-3">
              <MessageSquareText className="w-12 h-12 mb-2" />
              <p>No messages yet.</p>
              <p className="text-sm">Be the first to send a message!</p>
            </div>
          ) : (
            <div className="space-y-3 p-3">
              {messages.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} currentUserId={currentUser.id} />
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-3 border-t sticky bottom-0 w-full bg-white border">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              disabled={sending || loading}
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim() || sending || loading}>
              <SendHorizonal className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

const MessageSquareText = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    <line x1="9" y1="10" x2="15" y2="10"></line>
    <line x1="9" y1="14" x2="13" y2="14"></line>
  </svg>
);
