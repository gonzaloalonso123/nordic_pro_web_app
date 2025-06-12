# Chat Pagination Implementation Plan

## Overview
This document outlines how to implement efficient pagination for the chat interface once we have the basic server-side data fetching working with all messages loaded initially.

## Current Architecture (All Messages)
```typescript
// Server Component - loads ALL messages
const initialMessages = await serverData.chatRooms.getMessagesByRoom(chatId);

// Client Component - displays all messages + real-time updates
const [messages, setMessages] = useState(initialMessages);
```

## Future Pagination Architecture

### 1. Server Component Updates
```typescript
// app/[teamId]/chat/[chatId]/page.tsx
export default async function ChatRoomPage({ params }: { params: { chatId: string } }) {
  const [
    currentUser,
    room,
    initialMessages, // Only recent messages
    members
  ] = await Promise.all([
    serverData.auth.getCurrentDBUser(),
    serverData.chatRooms.getById(chatId),
    serverData.chatRooms.getMessagesByRoom(chatId, {
      limit: 50,      // Only last 50 messages
      offset: 0,      // Start from most recent
      order: 'desc'   // Newest first
    }),
    serverData.chatRooms.getChatRoomMembers(chatId)
  ]);

  return (
    <ChatInterface
      roomId={chatId}
      currentUser={currentUser}
      initialRoom={room}
      initialMessages={initialMessages}
      initialMembers={members}
      hasMoreMessages={initialMessages.length === 50} // If we got 50, there might be more
    />
  );
}
```

### 2. Server Data Service Updates
```typescript
// utils/data/server.ts
chatRooms: {
  getMessagesByRoom: async (roomId: string, options?: {
    limit?: number;
    offset?: number;
    order?: 'asc' | 'desc';
  }) => {
    const supabase = await createClient();
    const { limit = 50, offset = 0, order = 'desc' } = options || {};

    return services.chatRoomsService.getMessagesByRoom(supabase, roomId, {
      limit,
      offset,
      order
    });
  },
}
```

### 3. API Route for Client-Side Pagination
```typescript
// app/api/chat/[roomId]/messages/route.ts
export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get('offset') || '0');
  const limit = parseInt(searchParams.get('limit') || '50');

  const messages = await serverData.chatRooms.getMessagesByRoom(params.roomId, {
    limit,
    offset,
    order: 'desc'
  });

  return Response.json({ messages, hasMore: messages.length === limit });
}
```

### 4. Client Component with Pagination
```typescript
// components/chat/chat-interface.tsx
interface ChatInterfaceProps {
  roomId: string;
  currentUser: Tables<'users'>;
  initialRoom: Tables<'chat_rooms'>;
  initialMessages: ChatMessage[];
  initialMembers: Tables<'chat_room_participants'>[];
  hasMoreMessages?: boolean; // New prop
}

export function ChatInterface({
  roomId,
  currentUser,
  initialRoom,
  initialMessages,
  initialMembers,
  hasMoreMessages: initialHasMore = false
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [hasMoreMessages, setHasMoreMessages] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Load more messages function
  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasMoreMessages) return;

    setIsLoadingMore(true);
    try {
      const response = await fetch(
        `/api/chat/${roomId}/messages?offset=${messages.length}&limit=50`
      );
      const { messages: olderMessages, hasMore } = await response.json();

      // Prepend older messages (they come in desc order, so reverse them)
      setMessages(prev => [...olderMessages.reverse(), ...prev]);
      setHasMoreMessages(hasMore);
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Real-time updates append new messages
  const { sendMessage, error } = useChatRoom(roomId, {
    onNewMessage: (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    }
  });

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        {/* Load More Button */}
        {hasMoreMessages && (
          <div className="flex justify-center py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadMoreMessages}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "Loading..." : "Load Earlier Messages"}
            </Button>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            currentUser={currentUser}
          />
        ))}
      </ScrollArea>

      {/* Message Input */}
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
}
```

### 5. Simplified useChatRoom Hook
```typescript
// hooks/useChatRoom.ts - Simplified for real-time only
export function useChatRoom(
  roomId: string,
  options: {
    onNewMessage: (message: Tables<"messages">) => void;
  }
) {
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Real-time subscription
  const handleRealtimeMessage = useCallback((newMessage: Tables<"messages">) => {
    if (newMessage.room_id !== roomId) return;
    options.onNewMessage(newMessage);
  }, [roomId, options.onNewMessage]);

  useRealtimeChat(roomId, handleRealtimeMessage);

  // Send message function
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isSending) return;

    setIsSending(true);
    setError(null);

    try {
      const messageData: TablesInsert<"messages"> = {
        room_id: roomId,
        sender_id: currentUser.id,
        content: content.trim(),
      };

      await createMessage(messageData);
    } catch (err: any) {
      setError(`Failed to send message: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  }, [roomId, isSending]);

  return {
    sendMessage,
    error,
    isSending
  };
}
```

## Implementation Benefits

1. **Fast Initial Load**: Only loads recent messages on server-side
2. **Smooth Pagination**: Load older messages on demand
3. **Real-time Updates**: New messages still appear instantly
4. **Memory Efficient**: Don't load thousands of messages unnecessarily
5. **Simple State Management**: Messages are just local component state
6. **Easy to Implement**: Minimal changes to current architecture

## Migration Strategy

1. **Phase 1**: Get current all-messages approach working
2. **Phase 2**: Add pagination API route
3. **Phase 3**: Update server component to limit initial messages
4. **Phase 4**: Add load more functionality to client
5. **Phase 5**: Add infinite scroll (optional)

## Performance Considerations

- **Database**: Add indexes on `room_id` and `created_at` for efficient pagination
- **Caching**: Consider caching recent messages in Redis
- **Virtual Scrolling**: For very active chats, implement virtual scrolling
- **Message Limits**: Set reasonable limits (50-100 messages per request)

---

*This document can be referenced when implementing pagination once the basic chat functionality is working with all messages loaded initially.*
