"use client";

import { useParams } from "next/navigation";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useClientData } from "@/utils/data/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ChatErrorBoundary } from "@/components/chat/chat-error-boundary";
import { useHeader } from "@/hooks/useHeader";
import BackButton from "@/components/ui/back-button";
import { useUrl } from "@/hooks/use-url";

export default function ChatRoomPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const { useHeaderConfig } = useHeader();
  const path = useUrl();

  if (!chatId || typeof chatId !== 'string') {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Invalid Chat</h2>
        <p className="text-gray-600">The chat ID is invalid or missing.</p>
      </div>
    );
  }

  const { user: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { chatRooms } = useClientData();

  // Just check if room exists, don't subscribe to realtime
  const { data: room, isLoading: isLoadingRoom } = chatRooms.useById(chatId);


  // Simple header config
  useHeaderConfig({
    leftContent: <BackButton className="md:hidden" path={`${path}/chat`} />,
    centerContent: "Chat",
  }, [path]);

  if (isLoadingUser || isLoadingRoom) {
    return (
      <div className="flex flex-col grow gap-4 h-full items-center justify-center">
        <p className="text-muted-foreground">Loading chat...</p>
        <Skeleton className="h-6 w-2/3" />
      </div>
    );
  }

  if (!room) {
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
