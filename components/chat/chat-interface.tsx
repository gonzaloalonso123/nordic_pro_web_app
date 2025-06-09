"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import type { Tables } from "@/types/database.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { useChatRoom, type ChatMessage } from "@/hooks/useChatRoom";
import { ConnectionStatus } from "@/hooks/useChatRoom";

import { MessageItem } from "./message-item";

interface ChatInterfaceProps {
  roomId: string;
  currentUser: Tables<'users'>;
}

export function ChatInterface({
  roomId,
  currentUser,
}: ChatInterfaceProps) {
  debugger;
  const [newMessage, setNewMessage] = useState<string>("");
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
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

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    hasMoreMessages,
    loadMoreMessages,
    isLoadingMore,
    connectionStatus,
    isConnected
  } = useChatRoom(roomId);


  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages.length > 0]);

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
    if (newMessage.trim() === "") return;

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
      {connectionStatus !== ConnectionStatus.CONNECTED && (
        <div className={`p-2 text-center text-sm border-b flex items-center justify-center gap-2 ${connectionStatus === ConnectionStatus.ERROR
          ? "text-red-600 bg-red-50 border-red-200"
          : "text-yellow-600 bg-yellow-50 border-yellow-200"
          }`}>
          {isConnected ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          <span>
            {connectionStatus === ConnectionStatus.CONNECTING && "Connecting..."}
            {connectionStatus === ConnectionStatus.RECONNECTING && "Reconnecting..."}
            {connectionStatus === ConnectionStatus.ERROR && "Connection issues"}
            {connectionStatus === ConnectionStatus.DISCONNECTED && "Disconnected"}
          </span>
        </div>
      )}

      {error && (
        <div className="p-2 text-center text-red-600 bg-red-100 border-b border-red-200">
          {error}
        </div>
      )}
      <ScrollArea className="p-4 h-full">
        <div className="space-y-4">
          {hasMoreMessages && (
            <div className="flex justify-center py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadMoreMessages}
                disabled={isLoading || isLoadingMore}
              >
                {isLoadingMore ? "Loading..." : "Load Earlier Messages"}
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
            messages.map((msg: ChatMessage) => <MessageItem
              key={msg.id}
              message={msg}
              currentUser={currentUser}
            />
            )
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
