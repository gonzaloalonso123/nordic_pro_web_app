import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateChatRoom } from "@/hooks/useCreateChatRoom";
import { useStartDirectChat } from "@/hooks/queries/useChatRooms";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUsersByTeam } from "@/hooks/queries/useUsers";
import { getInitials } from "@/utils/get-initials";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { Tables } from "@/types/database.types";

type User = Partial<Tables<"users">> & Pick<Tables<"users">, "id" | "first_name" | "last_name" | "email">;

interface CreateChatRoomProps {
  teamId: string;
  onSuccess?: (roomId: string) => void;
  onCancel?: () => void;
}
export default function CreateChatRoom({
  teamId,
  onSuccess,
  onCancel,
}: CreateChatRoomProps) {
  const { user } = useCurrentUser();
  const createChatRoomMutation = useCreateChatRoom();
  const startDirectChatMutation = useStartDirectChat();
  const isMobile = useIsMobile();

  const { data: teamUsers, isLoading: isLoadingUsers, error: usersError } = useUsersByTeam(teamId);

  const [roomName, setRoomName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const availableUsers = teamUsers?.filter(u => u.id !== user?.id) || [];

  const resetState = () => {
    setRoomName("");
    setSelectedUsers([]);
    setSearchQuery("");
  }

  if (isLoadingUsers) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">Failed to load team members. Please try again.</p>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    );
  }
  const filteredUsers = availableUsers.filter(u =>
    !selectedUsers.find(su => su.id === u.id) &&
    (`${u.first_name || ''} ${u.last_name || ''} ${u.email || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()))
  );

  const handleUserSelect = (selectedUser: User) => {
    setSelectedUsers(prev => [...prev, selectedUser]);
    setSearchQuery("");
  };

  const handleUserRemove = (userId: User['id']) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  const createInduvidualChat = (userId: User['id']) => {
    if (!user?.id || !userId) return;

    startDirectChatMutation.mutate({
      currentUserId: user.id,
      selectedUserId: userId,
    }, {
      onSuccess: (roomId) => {
        resetState();
        onSuccess?.(roomId);
      },
      onError: (error) => {
        console.error("Failed to start direct chat:", error);
      },
    });
  }

  const handleCreateRoom = async () => {
    if (!user?.id || selectedUsers.length === 0) return;

    if (selectedUsers.length === 1) {
      createInduvidualChat(selectedUsers[0].id);
    } else {
      try {
        const result = await createChatRoomMutation.mutateAsync({
          name: roomName.trim() || null, // Only set name if provided
          memberIds: selectedUsers.map(u => u.id),
          currentUserId: user.id,
        });

        resetState();
        onSuccess?.(result.id);
      } catch (error) {
        console.error("Failed to create chat room:", error);
      }
    }
  };

  const isGroupChat = selectedUsers.length > 1;
  const isLoading = createChatRoomMutation.isPending || startDirectChatMutation.isPending;

  const content = (
    <div className="space-y-4">
      {selectedUsers.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Members ({selectedUsers.length})</Label>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map(user => (
              <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                {user.first_name} {user.last_name}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleUserRemove(user.id)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* User Search and Selection */}
      <div className="flex flex-col gap-2 space-y-2">
        <Label>Add Members</Label>
        <Input
          placeholder="Search users by name or email..."
          icon={<Search className="h-4 w-4 text-muted-foreground" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading}
        />
        <div className="border rounded-md">
          <ScrollArea className="h-60">
            <div className="p-1">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className={`p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3 rounded-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !isLoading && handleUserSelect(user)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || undefined} alt={`${user.first_name} ${user.last_name}`} />
                      <AvatarFallback className="text-xs">
                        {getInitials({ firstName: user.first_name, lastName: user.last_name })}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Plus className="h-4 w-4" />
                  </div>
                ))
              ) : searchQuery ? (
                <div className="p-2 text-sm text-muted-foreground">No users found</div>
              ) : (
                <div className="p-2 text-sm text-muted-foreground">All team members are already selected</div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          onClick={handleCreateRoom}
          disabled={selectedUsers.length === 0 || isLoading}
          className="flex-1"
        >
          {isLoading
            ? (isGroupChat ? "Creating..." : "Starting...")
            : (isGroupChat ? "Create Group Chat" : "Start Chat" )
          }
        </Button>
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className={cn("w-full", isMobile && "h-full flex flex-col p-4")}>
      <div className={cn("mb-6", isMobile && "border-b pb-4")}>
        <h2 className={cn("text-lg font-semibold", isMobile && "text-xl")}>
          Create Chat Room
        </h2>
      </div>
      <div className={cn(isMobile && "flex-1 overflow-y-auto")}>
        {content}
      </div>
    </div>
  );
}
