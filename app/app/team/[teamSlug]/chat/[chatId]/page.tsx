"use client";

import { useParams } from "next/navigation";
import {
  useChatRoom,
  useChatMessagesByRoom,
  useSendChatMessage,
  useMarkMessageAsRead,
  useChatRoomMembers,
} from "@/hooks/queries/useChatRooms";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { RealtimeChat } from "@/components/realtime-chat";
import { useMemo } from "react";
import { type ChatMessage } from "@/hooks/use-realtime-chat";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChatPage() {
  const params = useParams();
  const { user } = useCurrentUser();
  const chatId = params.chatId as string;
  const { data: chatRoom, isLoading: isLoadingRoom } = useChatRoom(chatId);
  const { data: chatMessages = [], isLoading: isLoadingMessages } =
    useChatMessagesByRoom(chatId);
  const { data: roomMembers = [] } = useChatRoomMembers(chatId);
  const { mutate: sendMessage } = useSendChatMessage();
  const { mutate: markAsRead } = useMarkMessageAsRead();
  const isMobile = useIsMobile();
  const username = useMemo(() => {
    return user ? `${user.first_name} ${user.last_name}` : "Unknown User";
  }, [user]);

  // const formattedMessages = useMemo(() => {
  //   return chatMessages.map((msg) => ({
  //     id: msg.id,
  //     content: msg.content,
  //     createdAt: msg.created_at || new Date().toISOString(),
  //     user: {
  //       id: msg.user_id || "",
  //       name:
  //         msg.users?.first_name && msg.users?.last_name
  //           ? `${msg.users.first_name} ${msg.users.last_name}`
  //           : "Unknown User",
  //       avatar: msg.users?.avatar || "",
  //     },
  //   }));
  // }, [chatMessages]);

  // // Mark messages as read
  // useEffect(() => {
  //   if (!user || !chatId || chatMessages.length === 0) return;
  //   const unreadMessages = chatMessages.filter((msg) => {
  //     if (msg.user_id === user.id) return false;
  //     const hasRead = msg.message_reads?.some(
  //       (read) => read.user_id === user.id
  //     );
  //     return !hasRead;
  //   });
  //   unreadMessages.forEach((msg) => {
  //     markAsRead({
  //       message_id: msg.id,
  //       user_id: user.id,
  //       read_at: new Date().toISOString(),
  //     });
  //   });
  // }, [chatMessages, user, chatId, markAsRead]);

  // Handle new messages from the realtime chat
  const handleNewMessage = (message: ChatMessage, messageId: string) => {
    if (!user) return;
    sendMessage({
      id: `db_${messageId}`,
      content: message.content,
      user_id: user.id,
      room_id: chatId,
      created_at: message.createdAt,
    });
  };

  return (
    <div className="flex flex-col h-full pb-16 md:pb-0">
      <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader className="px-4 py-3 flex flex-row items-center space-y-0 gap-3 border-b">
          {isMobile && (
            <Link href="/app/chat" className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {isLoadingRoom ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-5 w-40" />
            </div>
          ) : (
            <>
              <Avatar>
                <AvatarImage
                  src={chatRoom?.avatar_url}
                  alt={chatRoom?.name || ""}
                />
                <AvatarFallback>
                  {chatRoom?.name
                    ? chatRoom.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "CH"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-base">
                  {chatRoom?.name || "Chat"}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {roomMembers.length > 0
                    ? `${roomMembers.length} members`
                    : "No members"}
                </p>
              </div>
            </>
          )}

          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </CardHeader>
      </Card>
      <div className="overflow-y-auto h-full">
        {user && chatRoom && (
          <RealtimeChat
            roomName={chatId}
            username={username}
            messages={[]}
            // onMessage={handleNewMessage}
          />
        )}
      </div>
    </div>
  );
}
