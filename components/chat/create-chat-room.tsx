import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Search } from "lucide-react";
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
  isModal?: boolean;
}
export default function CreateChatRoom({
  teamId,
  onSuccess,
  onCancel,
  isModal = false,
}: CreateChatRoomProps) {
  const { user } = useCurrentUser();
  const createChatRoomMutation = useCreateChatRoom();
  const startDirectChatMutation = useStartDirectChat();
  const isMobile = useIsMobile();

  // Fetch team users
  const { data: teamUsers, isLoading: isLoadingUsers, error: usersError } = useUsersByTeam(teamId);

  const [roomName, setRoomName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Convert team users to the expected format and filter out current user
  const availableUsers = teamUsers?.filter(u => u.id !== user?.id) || [];

  // Show loading state while fetching users
  if (isLoadingUsers) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  // Show error state if users failed to load
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
    !selectedUsers.find(su => su.id === u.id) && // Exclude already selected users
    (`${u.first_name || ''} ${u.last_name || ''} ${u.email || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()))
  );

  const handleUserSelect = (selectedUser: User) => {
    setSelectedUsers(prev => [...prev, selectedUser]);
    setSearchQuery("");
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleCreateRoom = async () => {
    if (!user?.id || selectedUsers.length === 0) return;

    // If only one user selected, check if we should start a direct chat or create a group
    if (selectedUsers.length === 1) {
      // Start a direct chat - this will find existing chat or create new one
      try {
        const roomId = await startDirectChatMutation.mutateAsync({
          currentUserId: user.id,
          selectedUserId: selectedUsers[0].id,
        });
        // Reset form state
        setRoomName("");
        setSelectedUsers([]);
        setSearchQuery("");
        // Notify parent component
        onSuccess?.(roomId);
        return;
      } catch (error) {
        console.error("Failed to start direct chat:", error);
        return;
      }
    }

    // For groups (2+ users), always create a new room
    try {
      const result = await createChatRoomMutation.mutateAsync({
        name: roomName.trim() || null, // Only set name if provided
        memberIds: selectedUsers.map(u => u.id),
        currentUserId: user.id,
      });

      // Reset form state
      setRoomName("");
      setSelectedUsers([]);
      setSearchQuery("");
      // Notify parent component
      onSuccess?.(result.id);
    } catch (error) {
      console.error("Failed to create chat room:", error);
    }
  };

  const isDirectChat = selectedUsers.length === 1;
  const isLoading = createChatRoomMutation.isPending || startDirectChatMutation.isPending;

  const content = (
    <div className="space-y-4">
      {/* Selected Users */}
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
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* User Search and Selection */}
      <div className="space-y-2">
        <Label>Add Members</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <ScrollArea className="max-h-60 border rounded-md">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div
                key={user.id}
                className={`p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isLoading && handleUserSelect(user)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || undefined} alt={`${user.first_name} ${user.last_name}`} />
                  <AvatarFallback className="text-xs">
                    {getInitials(`${user.first_name} ${user.last_name}`)}
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
        </ScrollArea>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button
          onClick={handleCreateRoom}
          disabled={selectedUsers.length === 0 || isLoading}
          className="flex-1"
        >
          {isLoading
            ? (isDirectChat ? "Starting Chat..." : "Creating...")
            : (isDirectChat ? "Start Chat" : "Create Group Chat")
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

  if (isModal) {
    return (
      <div className={cn(
        "w-full",
        isMobile ? "h-full flex flex-col p-4" : ""
      )}>
        <div className={cn(
          "mb-6",
          isMobile ? "flex items-center justify-between border-b pb-4" : ""
        )}>
          <h2 className={cn(
            "text-lg font-semibold",
            isMobile ? "text-xl" : ""
          )}>Create Chat Room</h2>
          {isMobile && onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className={cn(
          isMobile ? "flex-1 overflow-y-auto" : ""
        )}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Chat Room</CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}
