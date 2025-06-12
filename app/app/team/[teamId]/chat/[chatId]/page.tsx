import { ChatInterface } from "@/components/chat/chat-interface";
import { ChatErrorBoundary } from "@/components/chat/chat-error-boundary";
import { serverData } from "@/utils/data/server";

export default async function ChatRoomPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;

  if (!chatId || typeof chatId !== 'string') {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Invalid Chat</h2>
        <p className="text-gray-600">The chat ID is invalid or missing.</p>
      </div>
    );
  }

  const [
    currentUser,
    roomWithData,
  ] = await Promise.all([
    serverData.auth.getCurrentDBUser(),
    serverData.chatRooms.getWithMessages(chatId),
  ]);

  if (!currentUser) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Authentication required</h2>
        <p className="text-gray-600">Please log in to view this chat.</p>
      </div>
    );
  }

  if (!roomWithData) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Chat room not found</h2>
        <p className="text-gray-600">This chat room may have been deleted or you don't have access.</p>
      </div>
    );
  }

  const initialMessages = roomWithData.messages || [];
  const chatUsers = roomWithData.chat_room_participants
    .map(participant => participant.users)
    .filter((user): user is NonNullable<typeof user> => user !== null);

  return (
    <ChatErrorBoundary>
      <ChatInterface
        roomId={chatId}
        currentUser={currentUser}
        initialMessages={initialMessages}
        initialUsers={chatUsers}
      />
    </ChatErrorBoundary>
  );
}
