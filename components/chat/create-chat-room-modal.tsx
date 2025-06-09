"use client";

import { useState, useEffect, useCallback } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { UserPlus, Users, Loader2 } from "lucide-react";
import { useUsers } from "@/hooks/queries";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";

interface CreateChatModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onChatCreated: (newRoom: Tables<"chat_rooms">) => void;
}

export default function CreateChatModal({ isOpen, onOpenChange, onChatCreated }: CreateChatModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState("");
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useCurrentUser();
  
  const { data: users } = useUsers();

  useEffect(() => {
    if (isOpen) {
      setSelectedUsers(new Set());
      setGroupName("");
      setSearchTerm("");
    }
  }, [isOpen]);

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(userId)) {
        newSelection.delete(userId);
      } else {
        newSelection.add(userId);
      }
      return newSelection;
    });
  };

  const handleCreateChat = async () => {
    if (selectedUsers.size === 0) {
      alert("Please select at least one user.");
      return;
    }
    setIsCreatingChat(true);

    const participantIds = Array.from(selectedUsers).concat(user?.id);
    const isGroup = selectedUsers.size > 1;

    if (isGroup && !groupName.trim()) {
      alert("Please enter a group name.");
      setIsCreatingChat(false);
      return;
    }

    if (!isGroup && selectedUsers.size === 1) {
      const otherUserId = Array.from(selectedUsers)[0];
      const { data: existingRooms, error: existingRoomError } = await supabase.rpc("find_existing_onetoone_chat", {
        user1_id: user?.id,
        user2_id: otherUserId,
      });

      if (existingRoomError) {
        console.error("Error checking for existing 1-on-1 chat:", existingRoomError);
      } else if (existingRooms && existingRooms.length > 0) {
        const { data: roomDetails, error: roomDetailsError } = await supabase
          .from("chat_rooms")
          .select("*, messages(*), chat_room_participants!inner(users(*))")
          .eq("id", existingRooms[0].room_id)
          .single();

        if (roomDetailsError) console.error("Error fetching existing room details", roomDetailsError);
        else if (roomDetails) {
          onChatCreated(roomDetails as Tables<"chat_rooms">);
          setIsCreatingChat(false);
          onOpenChange(false);
          return;
        }
      }
    }

    const { data: newRoomData, error: newRoomError } = await supabase
      .from("chat_rooms")
      .insert({
        name: isGroup ? groupName.trim() : null,
        is_group_chat: isGroup,
        created_by: user?.id,
      })
      .select()
      .single();

    if (newRoomError || !newRoomData) {
      console.error("Error creating new chat room:", newRoomError);
      alert("Failed to create chat room. Please try again.");
      setIsCreatingChat(false);
      return;
    }

    const newRoom = newRoomData as Tables<"chat_rooms">;

    const participantInserts = participantIds.map((userId) => ({
      room_id: newRoom.id,
      user_id: userId,
      last_read_at: userId === user?.id ? new Date().toISOString() : null,
    }));

    const { error: participantsError } = await supabase.from("chat_room_participants").insert(participantInserts);

    if (participantsError) {
      console.error("Error adding participants:", participantsError);
      await supabase.from("chat_rooms").delete().eq("id", newRoom.id);
      alert("Failed to add participants to chat room. Please try again.");
      setIsCreatingChat(false);
      return;
    }

    const { data: finalNewRoom, error: finalRoomError } = await supabase
      .from("chat_rooms")
      .select("*, messages(*), chat_room_participants!inner(user_id, users!inner(*))")
      .eq("id", newRoom.id)
      .single();

    if (finalRoomError || !finalNewRoom) {
      console.error("Error fetching newly created room details:", finalRoomError);
      onChatCreated(newRoom);
    } else {
      const processedRoom = {
        ...finalNewRoom,
        other_participants: !finalNewRoom.is_group_chat
          ? finalNewRoom.chat_room_participants
              .filter((p) => p.user_id !== user?.id)
              .map((p) => p.users as Tables<"users">)
          : [],
        unread_count: 0,
      } as Tables<"chat_rooms">;
      onChatCreated(processedRoom);
    }

    setIsCreatingChat(false);
    onOpenChange(false);
  };

  const filteredUsers =
    users?.filter((u) => u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) && user?.id != u.id) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" /> Create New Chat
          </DialogTitle>
          <DialogDescription>Select users to start a 1-on-1 or group chat.</DialogDescription>
        </DialogHeader>

        {selectedUsers.size > 1 && (
          <div className="mt-4">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              placeholder="Enter group name (e.g., Project Team)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-1"
            />
          </div>
        )}

        <div className="mt-4">
          <Input
            type="search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          <ScrollArea className="border rounded-md">
            <div className="p-2 space-y-1 max-h-[40vh]">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                  onClick={() => handleUserSelect(user.id)}
                >
                  <Checkbox
                    id={`user-${user.id}`}
                    checked={selectedUsers.has(user.id)}
                    onCheckedChange={() => handleUserSelect(user.id)}
                    className="mr-3"
                  />
                  <Avatar className="w-8 h-8 mr-3">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback>{user.first_name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <Label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer">
                    {user.first_name || "Unnamed User"}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" disabled={isCreatingChat}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleCreateChat}
            disabled={selectedUsers.size === 0 || isCreatingChat || (selectedUsers.size > 1 && !groupName.trim())}
          >
            {isCreatingChat ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : selectedUsers.size > 1 ? (
              <Users className="mr-2 h-4 w-4" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            {isCreatingChat ? "Creating..." : selectedUsers.size > 1 ? "Create Group Chat" : "Create Chat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
