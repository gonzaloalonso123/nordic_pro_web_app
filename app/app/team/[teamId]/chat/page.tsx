"use client";

export default function ChatPage() {
  return (
    <div className="h-full flex items-center justify-center text-muted-foreground md:hidden">
      <div className="text-center space-y-3 p-6">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">Your Conversations</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Select a chat from your list to start messaging
        </p>
      </div>
    </div>
  );
}
