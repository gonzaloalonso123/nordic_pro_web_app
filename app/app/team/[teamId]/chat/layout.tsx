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
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="text-center space-y-6 p-8">
          <div className="relative">
            <h1 className="text-7xl md:text-8xl font-bold p-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-pulse drop-shadow-2xl">
              Coming Soon
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/50 to-accent/50 rounded-xl blur-md opacity-30 animate-pulse"></div>
          </div>

          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            We're working hard to bring you something amazing.
            <span className="block mt-2 font-semibold text-foreground">Stay tuned!</span>
          </p>

          <div className="flex justify-center space-x-3 mt-12">
            <div className="w-4 h-4 bg-primary rounded-full animate-bounce shadow-lg"></div>
            <div className="w-4 h-4 bg-secondary rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-4 h-4 bg-accent rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

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
