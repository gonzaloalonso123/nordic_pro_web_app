"use client";

import { useHeader } from "@/hooks/useHeader";
import { usePathname } from "next/navigation";
import { useState, type ReactNode, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PlusSquare } from "lucide-react";
import CreateChatRoom from "@/components/chat/create-chat-room";
import { useUrl } from "@/hooks/use-url";
import { useRole } from "@/app/app/(role-provider)/role-provider";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import ChatList from "@/components/chat/chat-list";
import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { cn } from "@/lib/utils";

export default function ChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { useHeaderConfig } = useHeader();
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const { team: { id: teamId, role } } = useRole();
  const isCoach = role === "COACH";

  const openModal = useCallback(() => setIsNewChatModalOpen(true), []);
  const closeModal = useCallback(() => setIsNewChatModalOpen(false), []);

  const pathname = usePathname();
  const path = useUrl();
  const isChatRoom = useMemo(() => pathname !== `${path}/chat`, [pathname, path]);

  useHeaderConfig({
    centerContent: "Chat",
    rightContent: isCoach ? (
      <Button
        variant="ghost"
        size="icon"
        onClick={openModal}
        title="Start new chat"
        aria-label="Start new chat"
      >
        <PlusSquare className="h-5 w-5" />
      </Button>
    ) : null,
  }, [openModal, isCoach]);

  return (
    <div className="flex h-full w-full">
      <div
        className={cn(
          "h-full",
          "md:flex md:flex-col md:border-r md:basis-[320px] md:shrink-0",
          isChatRoom ? "hidden" : "w-full md:w-auto"
        )}
      >
        <ChatList />
      </div>

      <div className={cn(
        "h-full flex-1",
        isChatRoom ? "block" : "hidden md:block"
      )}>
        {isChatRoom ? children : <ChatEmptyState />}
      </div>

      <Dialog open={isNewChatModalOpen} onOpenChange={setIsNewChatModalOpen}>
        <VisuallyHidden>
          <DialogTitle>
            Start New Chat
          </DialogTitle>
        </VisuallyHidden>
        <DialogContent className="max-w-md">
          <CreateChatRoom
            teamId={teamId}
            onSuccess={closeModal}
            onCancel={closeModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
