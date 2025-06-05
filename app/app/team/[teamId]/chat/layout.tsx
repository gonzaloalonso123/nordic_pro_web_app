"use client";

import { useHeader } from "@/hooks/useHeader";
import { usePathname } from "next/navigation";
import { useState, type ReactNode, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PlusSquare } from "lucide-react";
import ChatListSidebar from "@/components/chat/chat-sidebar";
import CreateChatRoom from "@/components/chat/create-chat-room";
import { useUrl } from "@/hooks/use-url";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRole } from "@/app/app/(role-provider)/role-provider";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function ChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { useHeaderConfig } = useHeader();
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const { team: { id: teamId } } = useRole();

  const handleCreateRoomSuccess = useCallback(() => {
    setIsNewChatModalOpen(false);
  }, []);

  const handleCreateRoomCancel = useCallback(() => {
    setIsNewChatModalOpen(false);
  }, []);

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
  }, []);

  const pathname = usePathname();
  const path = useUrl();
  const isChatRoom = pathname !== `${path}/chat`;

  return (
    <>
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
      </div>

      <Dialog open={isNewChatModalOpen} onOpenChange={setIsNewChatModalOpen}>
        <VisuallyHidden>
          <DialogTitle >
            Start New Chat
          </DialogTitle>
        </VisuallyHidden>
        <DialogContent className={cn(
          isMobile
            ? "fixed inset-0 max-w-none w-full h-full max-h-none p-0 translate-x-0 translate-y-0 border-0 data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom"
            : "max-w-md"
        )}>
          <CreateChatRoom
            teamId={teamId}
            onSuccess={handleCreateRoomSuccess}
            onCancel={handleCreateRoomCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
