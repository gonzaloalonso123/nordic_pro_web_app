"use client";

import { useHeader } from "@/hooks/useHeader";
import { NewChatModal } from "@/components/chat/new-chat-modal";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import ChatListSidebar from "@/components/chat/chat-sidebar";
import { useUrl } from "@/hooks/use-url";

export default function ChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const { useHeaderConfig } = useHeader();

  useHeaderConfig({
    centerContent: "Chat",
    rightContent: (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsNewChatModalOpen(true)}
        title="Start new chat"
        aria-label="Start new chat"
      >
        <PlusSquare className="h-5 w-5" />
      </Button>
    ),
  }, [setIsNewChatModalOpen]);

  const pathname = usePathname();
  const path = useUrl();
  const isChatRoom = pathname !== `${path}/chat`;
  return (
    <div className="flex flex-col h-full w-full">
      <div className="md:hidden h-full">{children}</div>
      <div className="hidden md:flex h-full">
        <div className={`w-1/3 border-r ${isChatRoom ? "block" : "hidden md:block"}`} >
          {!isChatRoom && children}
          {isChatRoom && <ChatListSidebar />}
        </div>
        <div className={`flex-1 ${isChatRoom ? "block" : "hidden md:block"}`}>
          {isChatRoom && children}
          {!isChatRoom && (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onOpenChange={setIsNewChatModalOpen}
      />
    </div>
  );
}
