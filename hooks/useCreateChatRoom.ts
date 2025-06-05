import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { chatRoomsService } from "@/utils/supabase/services";
import type { TablesInsert } from "@/types/database.types";

interface CreateChatRoomVariables {
  name?: string | null; // Optional name - if not provided, will show member names
  memberIds: string[]; // Array of user IDs to add to the room
  currentUserId: string;
}

export const useCreateChatRoom = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, memberIds, currentUserId }: CreateChatRoomVariables) => {
      // Validate inputs
      if (!memberIds.length) {
        throw new Error("At least one member must be added to the chat room");
      }

      if (!memberIds.includes(currentUserId)) {
        memberIds.push(currentUserId);
      }

      // Create the room
      const roomData: TablesInsert<"chat_rooms"> = {
        name: name?.trim() || null, // Only set name if provided and not empty
      };

      const newRoom = await chatRoomsService.create(supabase, roomData);

      // Add all members to the room
      await Promise.all(
        memberIds.map(memberId =>
          chatRoomsService.addChatRoomMember(supabase, {
            room_id: newRoom.id,
            user_id: memberId,
          })
        )
      );

      return newRoom;
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      queryClient.invalidateQueries({
        queryKey: ["chatRooms", "user", variables.currentUserId],
      });
    },
    onError: (error) => {
      console.error("Error creating chat room:", error);
    },
  });
};