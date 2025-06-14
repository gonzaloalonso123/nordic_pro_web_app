"use client";

import { MessageCircleMore } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="h-full flex items-center justify-center text-muted-foreground md:hidden">
      <div className="text-center space-y-3 p-6">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MessageCircleMore size={36} className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Your Conversations</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Select a chat from your list to start messaging
        </p>
      </div>
    </div>
  );
}
