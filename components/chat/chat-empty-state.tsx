import { MessageCircleMore } from "lucide-react";

export function ChatEmptyState() {
  return (
    <div className="h-full flex items-center justify-center text-muted-foreground">
      <div className="text-center space-y-3 p-6">
        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MessageCircleMore size={48} className="text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Select a conversation</h3>
        <p className="text-muted-foreground max-w-sm">
          Choose a chat from the sidebar to start messaging
        </p>
      </div>
    </div>
  );
}
