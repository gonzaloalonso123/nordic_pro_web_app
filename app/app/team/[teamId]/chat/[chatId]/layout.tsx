"use client";

import BackButton from "@/components/ui/back-button";
import { useUrl } from "@/hooks/use-url";
import { useHeader } from "@/hooks/useHeader";
import { useChatRoomDisplayName } from "@/hooks/useChatRoomDisplayName";
import { useChatRoomWithUsers } from "@/hooks/queries/useChatRooms";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const path = useUrl();
  const params = useParams();
  const chatId = params.chatId as string;
  const { useHeaderConfig } = useHeader();
  const { getRoomDisplayName } = useChatRoomDisplayName();

  const { data: room } = useChatRoomWithUsers(chatId);
  const displayName = room ? getRoomDisplayName(room) : "Chat";

  useHeaderConfig({
    leftContent: <BackButton className="md:hidden" path={`${path}/chat`} />,
    centerContent: displayName,
  }, [path, displayName]);

  return children;
}
