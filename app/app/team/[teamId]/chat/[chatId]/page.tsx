"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MoreVertical } from "lucide-react";

// Hooks
import { useChatRoom, useChatMessagesByRoom, useChatRoomMembers } from "@/hooks/queries/useChatRooms";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUrl } from "@/hooks/use-url";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatInterface, DisplayMessage, UserProfileSnippet } from "@/components/chat/chat-interface";

export default function ChatRoomPage() {
  // Hooks
  const params = useParams();
  const { user: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const chatId = params.chatId as string;
  const path = useUrl();
  const isMobile = useIsMobile();

  // Data fetching
  const { data: chatRoom, isLoading: isLoadingRoom } = useChatRoom(chatId);
  const { data: initialDbMessages = [], isLoading: isLoadingMessages } = useChatMessagesByRoom(chatId);
  const { data: roomMembers = [] } = useChatRoomMembers(chatId);

  // Transform messages for the chat interface
  const initialMessagesForInterface: DisplayMessage[] = useMemo(() => {
    return initialDbMessages.map((msg: any) => {
      let author: UserProfileSnippet | null = null;

      if (msg.users) {
        author = {
          id: msg.users.id,
          first_name: msg.users.first_name,
          last_name: msg.users.last_name,
          email: msg.users.email,
          avatar: msg.users.avatar,
        };
      }

      return {
        id: msg.id,
        content: msg.content,
        created_at: msg.created_at,
        room_id: msg.room_id,
        user_id: msg.user_id,
        author: author,
      };
    });
  }, [initialDbMessages]);

  // Loading state
  if (isLoadingUser || isLoadingRoom || isLoadingMessages) {
    return (
      <div className="flex flex-col h-full pb-16 md:pb-0">
        <ChatRoomHeader isMobile={isMobile} path={path} isLoading={true} />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  // Error state - chat room not found
  if (!chatRoom) {
    return (
      <div className="flex flex-col h-full">
        <Card className="rounded-none border-x-0 border-t-0">
          <CardHeader className="px-4 py-3 flex flex-row items-center space-y-0 gap-3 border-b">
            {isMobile && <BackButton path={path} />}
            <p>Chat room not found.</p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Main chat view
  return (
    <div className="flex flex-col h-full pb-16 md:pb-0">
      <ChatRoomHeader
        isMobile={isMobile}
        path={path}
        chatRoom={chatRoom}
        roomMembers={roomMembers}
      />
      <div className="flex-grow overflow-hidden h-full">
        {currentUser && chatRoom && (
          <ChatInterface
            roomId={chatId}
            currentUser={currentUser}
            initialMessages={initialMessagesForInterface}
          />
        )}
        {!currentUser && !isLoadingUser && (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Please log in to view this chat.
          </div>
        )}
      </div>
    </div>
  );
}

function BackButton({ path }: { path: string }) {
  return (
    <Link href={`${path}/chat`} className="md:hidden">
      <Button variant="ghost" size="icon" className="mr-2">
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </Link>
  );
}

interface ChatRoomHeaderProps {
  isMobile: boolean;
  path: string;
  isLoading?: boolean;
  chatRoom?: any;
  roomMembers?: any[];
}

function ChatRoomHeader({ isMobile, path, isLoading, chatRoom, roomMembers = [] }: ChatRoomHeaderProps) {
  if (isLoading) {
    return (
      <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader className="px-4 py-3 flex flex-row items-center space-y-0 gap-3 border-b">
          {isMobile && <BackButton path={path} />}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </CardHeader>
      </Card>
    );
  }

  if (!chatRoom) return null;

  return (
    <Card className="max-h-screen rounded-none border-x-0 border-t-0 flex-shrink-0">
      <CardHeader className="px-4 py-3 flex flex-row items-center space-y-0 gap-3 border-b">
        {isMobile && <BackButton path={path} />}
        <Avatar>
          <AvatarImage
            src={chatRoom?.avatar_url || undefined}
            alt={chatRoom?.name || ""}
          />
          <AvatarFallback>
            {chatRoom?.name
              ? chatRoom.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
              : "CR"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-base">
            {chatRoom?.name || "Chat"}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {roomMembers.length > 0
              ? `${roomMembers.length} member${roomMembers.length > 1 ? "s" : ""}`
              : "No members"}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </CardHeader>
    </Card>
  );
}
