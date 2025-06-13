"use client";

import { useEffect, useState } from "react";
import { Tables } from "@/types/database.types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ChatRoomList from "@/components/chat/chat-room-list";
import ChatMessageArea from "@/components/chat/chat-message-area";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
  return matches;
}

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<Tables<"chat_rooms"> | null>(null);
  const { user } = useCurrentUser();

  const isMobile = useMediaQuery("(max-width: 767px)");
  const [showRoomListMobile, setShowRoomListMobile] = useState(true);

  const handleSelectRoom = (room: Tables<"chat_rooms">) => {
    setSelectedRoom(room);
    if (isMobile) {
      setShowRoomListMobile(false);
    }
  };

  const handleBackToListMobile = () => {
    setShowRoomListMobile(true);
    setSelectedRoom(null);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden antialiased text-foreground bg-background">
        <>
          {showRoomListMobile ? (
            <ChatRoomList
              onSelectRoom={handleSelectRoom}
              selectedRoomId={selectedRoom?.id || null}
              currentUser={user}
            />
          ) : (
            <ChatMessageArea
              selectedRoom={selectedRoom}
              currentUser={user}
              onBackToList={handleBackToListMobile}
              isMobile={isMobile}
            />
          )}
        </>
      <div className="absolute top-4 right-4 z-20">
        {user && <span className="text-sm mr-3 text-muted-foreground">Hi, {user.first_name || "User"}!</span>}
      </div>
    </div>
  );
}
