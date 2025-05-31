"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useChatRoom, useChatMessagesByRoom, useChatRoomMembers } from "@/hooks/queries/useChatRooms";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUrl } from "@/hooks/use-url";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatInterface, DisplayMessage, UserProfileSnippet } from "@/components/chat/chat-interface";
import { useHeader } from "@/hooks/useHeader";
import { getInitials } from "@/utils/get-initials";

export default function ChatRoomPage() {
  const params = useParams();
  const { user: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const chatId = params.chatId as string;
  const path = useUrl();
  const isMobile = useIsMobile();
  const { useHeaderConfig } = useHeader();

  const { data: chatRoom, isLoading: isLoadingRoom } = useChatRoom(chatId);
  const { data: initialDbMessages = [], isLoading: isLoadingMessages } = useChatMessagesByRoom(chatId);
  const { data: roomMembers = [] } = useChatRoomMembers(chatId);

  useHeaderConfig({
    leftContent: isMobile ? <BackButton path={path} /> : undefined,
    centerContent: (
      !isLoadingRoom ? (
        <div className="flex gap-3 items-center justify-center">
          <Avatar>
            <AvatarImage
              src={chatRoom?.avatar || undefined}
              alt={chatRoom?.name || ""}
            />
            <AvatarFallback>
              {getInitials(chatRoom?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3>{chatRoom?.name || "Chat"}</h3>
            <p className="text-xs text-muted-foreground">
              {roomMembers.length > 0
                ? `${roomMembers.length} member${roomMembers.length > 1 ? "s" : ""}`
                : "No members"}
            </p>
          </div>
        </div>
      ) : (<Skeleton className="h-6 w-32" />)
    ),
  }, [isMobile, path, chatRoom?.name, isLoadingRoom, roomMembers.length]);

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

  if (isLoadingUser || isLoadingRoom || isLoadingMessages) {
    return (
      <div className="flex flex-col grow gap-4 h-full items-center justify-center pb-16 md:pb-0">
        <p className="text-muted-foreground">Loading chat...</p>
        <Skeleton className="h-6 w-2/3" />
      </div>
    );
  }

  if (!chatRoom) {
    return (
      <div className="flex flex-col h-full">
        <h2>Chat room not found.</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full pb-16 md:pb-0">
      <div className="grow overflow-hidden h-full">
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
