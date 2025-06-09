"use client";

import { useParams } from "next/navigation";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUrl } from "@/hooks/use-url";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useHeader } from "@/hooks/useHeader";
import BackButton from "@/components/ui/back-button";
import { useChatRoomAvatar } from "@/hooks/useChatRoomAvatar";
import { ChatErrorBoundary } from "@/components/chat/chat-error-boundary";
import { useChatRoom } from "@/hooks/useChatRoom";

export default function ChatRoomPage() {
  const params = useParams();
  const chatId = params.chatId as string;

  if (!chatId || typeof chatId !== 'string') {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Invalid Chat</h2>
        <p className="text-gray-600">The chat ID is invalid or missing.</p>
      </div>
    );
  }

  const { user: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const path = useUrl();
  const { useHeaderConfig } = useHeader();
  const { getChatAvatarInfo } = useChatRoomAvatar();

  const { room: chatRoom, members: roomMembers, isLoading: isLoadingRoom } = useChatRoom(chatId);

  const avatarInfo = chatRoom ? getChatAvatarInfo(chatRoom) : null;

  useHeaderConfig({
    leftContent: <BackButton className="md:hidden" path={`${path}/chat`} />,
    centerContent: (
      !isLoadingRoom && avatarInfo ? (
        <div className="flex gap-3 items-center justify-center">
          <Avatar>
            <AvatarImage
              src={avatarInfo.avatarUrl || undefined}
              alt={avatarInfo.displayName}
            />
            <AvatarFallback>
              {avatarInfo.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3>{avatarInfo.displayName}</h3>
            <p className="text-xs text-muted-foreground">
              {roomMembers.length > 2
                ? `${roomMembers.length} member${roomMembers.length > 1 ? "s" : ""}`
                : null}
            </p>
          </div>
        </div>
      ) : (<Skeleton className="h-6 w-32" />)
    ),
  }, [path, avatarInfo?.displayName, avatarInfo?.avatarUrl, avatarInfo?.initials, isLoadingRoom, roomMembers.length]);

  if (isLoadingUser || isLoadingRoom) {
    return (
      <div className="flex flex-col grow gap-4 h-full items-center justify-center">
        <p className="text-muted-foreground">Loading chat...</p>
        <Skeleton className="h-6 w-2/3" />
      </div>
    );
  }

  if (!chatRoom) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Chat room not found</h2>
        <p className="text-gray-600">This chat room may have been deleted or you don't have access.</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-muted-foreground">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Authentication required</h2>
        <p className="text-gray-600">Please log in to view this chat.</p>
      </div>
    );
  }

  return (
    <ChatErrorBoundary>
      <ChatInterface
        roomId={chatId}
        currentUser={currentUser}
      />
    </ChatErrorBoundary>
  );
}
