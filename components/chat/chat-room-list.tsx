"use client";

import { useState, useEffect, useCallback } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import ChatRoomListItem from "./chat-room-list-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, MessageSquareText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/types/database.types";
import CreateChatModal from "./create-chat-room-modal";
import { createClient, supabase } from "@/utils/supabase/client";
import { useRole } from "@/app/app/(role-provider)/role-provider";
import { useHeader } from "@/hooks/useHeader";

interface ChatRoomListProps {
  supabase: SupabaseClient<any, "public", any>;
  onSelectRoom: (
    room: Tables<"chat_rooms"> & {
      other_participants: Tables<"users">[];
      unread_count?: number;
      messages?: Tables<"messages">[];
    }
  ) => void;
  selectedRoomId: string | null;
  currentUser: Tables<"users"> | null | undefined;
}

export default function ChatRoomList({ onSelectRoom, selectedRoomId, currentUser }: ChatRoomListProps) {
  const [chatRooms, setChatRooms] = useState<Tables<"chat_rooms">[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const { team } = useRole();
  const isCoach = team.role === "COACH";
  const { useHeaderConfig } = useHeader();

  useHeaderConfig({
    centerContent: "Chat",
    rightContent: isCoach ? (
      <Button onClick={() => setIsCreateChatModalOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
      </Button>
    ) : null,
  });

  const fetchChatRooms = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    const { data: participantEntries, error: participantError } = await supabase
      .from("chat_room_participants")
      .select("room_id")
      .eq("user_id", currentUser.id);

    if (participantError) {
      console.error("Error fetching user room participations:", participantError);
      setLoading(false);
      return;
    }

    const roomIds = participantEntries.map((p) => p.room_id);
    if (roomIds.length === 0) {
      setChatRooms([]);
      setLoading(false);
      return;
    }

    const { data: roomsData, error: roomsError } = await supabase
      .from("chat_rooms")
      .select(
        `
        *,
        chat_room_participants!inner (
          user_id,
          users (id, first_name, avatar)
        ),
        messages (
          id, content, created_at, sender_id,
          users (id, first_name, avatar)
        )
      `
      )
      .in("id", roomIds)
      .order("created_at", { foreignTable: "messages", ascending: false, nullsFirst: false });

    if (roomsError) {
      console.error("Error fetching chat rooms:", roomsError);
      setChatRooms([]);
    } else {
      const processedRooms = await Promise.all(
        roomsData.map(async (room) => {
          const { data: unreadData, error: unreadError } = await supabase.rpc("get_unread_message_count", {
            p_room_id: room.id,
            p_user_id: currentUser.id,
          });
          if (unreadError) console.error("Error fetching unread count for room", room.id, unreadError);
          let otherParticipants: Tables<"users">[] = [];
          if (!room.is_group_chat) {
            otherParticipants = room.chat_room_participants
              .filter((p) => p.user_id !== currentUser.id && p.users)
              .map((p) => p.users as Tables<"users">);
          }
          const lastMessage =
            room.messages && room.messages.length > 0
              ? room.messages.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())[0]
              : null;

          return {
            ...room,
            unread_count: unreadData || 0,
            other_participants: otherParticipants,
            messages: lastMessage ? [lastMessage] : [],
          } as Tables<"chat_rooms">;
        })
      );
      setChatRooms(
        processedRooms.sort((a, b) => {
          const aLastMsgTime = a.messages?.[0]?.created_at ? new Date(a.messages[0].created_at).getTime() : 0;
          const bLastMsgTime = b.messages?.[0]?.created_at ? new Date(b.messages[0].created_at).getTime() : 0;
          return bLastMsgTime - aLastMsgTime;
        })
      );
    }
    setLoading(false);
  }, [supabase, currentUser]);

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  useEffect(() => {
    if (!supabase || !currentUser?.id) return;

    const roomParticipantChanges = supabase
      .channel("public:chat_room_participants")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_room_participants", filter: `user_id=eq.${currentUser.id}` },
        (payload) => {
          fetchChatRooms();
        }
      )
      .subscribe();

    const messageChanges = supabase
      .channel("public:messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, async (payload) => {
        const roomParticipant = chatRooms.find((room) => room.id === payload.new.room_id);
        if (roomParticipant) {
          fetchChatRooms();
        }
      })
      .subscribe();

    const roomChanges = supabase
      .channel("public:chat_rooms")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_rooms" }, (payload) => {
        fetchChatRooms();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(roomParticipantChanges);
      supabase.removeChannel(messageChanges);
      supabase.removeChannel(roomChanges);
    };
  }, [supabase, currentUser, fetchChatRooms, chatRooms]);

  const filteredRooms = chatRooms.filter((room) => {
    const name =
      !room.is_group_chat && room.other_participants && room.other_participants.length > 0
        ? room.other_participants.map((p) => p.username).join(", ")
        : room.name;
    return name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreateNewChat = () => {
    setIsCreateChatModalOpen(true);
  };

  return (
    <div className="w-full md:w-80 lg:w-96 border-r flex flex-col bg-muted/20">
      <div className="p-3 border-b sticky top-0 bg-muted/20 z-10">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search chats..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1 p-2">
        {loading ? (
          <div className="space-y-2 p-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
            <MessageSquareText className="w-12 h-12 mb-2" />
            <p>No chats found.</p>
            {searchTerm ? (
              <p className="text-sm">Try a different search term.</p>
            ) : (
              <p className="text-sm">Create a new chat to get started!</p>
            )}
          </div>
        ) : (
          filteredRooms.map((room) => (
            <ChatRoomListItem
              key={room.id}
              room={room}
              isSelected={room.id === selectedRoomId}
              currentUserId={currentUser?.id}
              onClick={() => onSelectRoom(room)}
            />
          ))
        )}
      </ScrollArea>
      {isCreateChatModalOpen && (
        <CreateChatModal
          isOpen={isCreateChatModalOpen}
          onOpenChange={setIsCreateChatModalOpen}
          onChatCreated={(newRoom) => {
            fetchChatRooms();
            onSelectRoom(newRoom);
            setIsCreateChatModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
