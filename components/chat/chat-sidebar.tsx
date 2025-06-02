import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import {
  useChatRoomsByUser,
  useUnreadMessageCountBatch,
} from "@/hooks/queries/useChatRooms";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";
import { useUrl } from "@/hooks/use-url";
import { getInitials } from "@/utils/get-initials";
import { LoadingLink } from "../ui/loading-link";

export default function ChatListSidebar() {
  const { user } = useCurrentUser();
  const { data: chatRooms, isLoading } = useChatRoomsByUser(user?.id);
  const [searchQuery, setSearchQuery] = useState("");

  const path = useUrl();
  const roomIds = useMemo(
    () => chatRooms?.map((room) => room.id) || [],
    [chatRooms]
  );

  const { data: unreadCounts = {} } = useUnreadMessageCountBatch(
    roomIds,
    user?.id
  );

  const filteredRooms =
    chatRooms?.filter((room) =>
      room.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="px-4 py-3 border-b shrink-0">
        <div className="relative">
          <Input
            placeholder="Search chats..."
            icon={<Search className="h-4 w-4 text-muted-foreground" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-y-auto grow">
        <div className="divide-y">
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="grow">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))
          ) : filteredRooms.length > 0 ? (
            filteredRooms.map((room) => {
              const unreadCount = unreadCounts[room.id] || 0;

              return (
                <LoadingLink
                  unstyled
                  href={`${path}/chat/${room.id}`}
                  key={room.id}
                  className="flex min-h-18 justify-center items-center"
                >
                  <div className="flex w-full items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={room.avatar_url}
                          alt={room.name || ""}
                        />
                        <AvatarFallback>
                          {getInitials(room.name)}
                        </AvatarFallback>
                      </Avatar>
                      {room.is_active && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                      )}
                    </div>
                    <div className="grow min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm truncate">
                          {room.name || "Unnamed Chat"}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {room.updated_at
                            ? new Date(room.updated_at).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {room.last_message || "No recent messages"}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <Badge
                        variant="default"
                        className="rounded-full h-5 w-5 p-0 flex items-center justify-center"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                </LoadingLink>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500">
              {searchQuery
                ? "No matching chat rooms found"
                : "No chat rooms available"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
