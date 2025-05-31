"use client";

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, UserPlus } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser'; // Your existing hook
import { useUsersByOrganisation } from '@/hooks/queries/useUsers'; // Your existing hook
import { useStartDirectChat } from '@/hooks/queries/useChatRooms'; // From your consolidated file
import type { Tables } from '@/types/database.types';
import { createClient } from '@/utils/supabase/client'; // For fetching org ID if needed
import { getInitials } from '@/utils/get-initials';

interface NewChatModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function NewChatModal({ isOpen, onOpenChange }: NewChatModalProps) {
  const { user: currentUser, isLoading: isLoadingCurrentUser } = useCurrentUser();
  const [currentUserOrganisationId, setCurrentUserOrganisationId] = useState<string | undefined>(undefined);
  const [isFetchingOrgId, setIsFetchingOrgId] = useState(true);

  // --- Fetching current user's organisation_id ---
  // This is a critical piece. Adapt this to how your application stores/retrieves
  // the primary organisation_id for the logged-in user.
  const supabaseClient = useMemo(() => createClient(), []);
  useEffect(() => {
    if (currentUser?.id && !isLoadingCurrentUser) {
      // Option 1: If organisation_id is directly on your user object (e.g., from a join in useCurrentUser)
      // This is an example, replace 'primary_organisation_id' with your actual field if it exists
      // if ((currentUser as any).primary_organisation_id) {
      //   setCurrentUserOrganisationId((currentUser as any).primary_organisation_id);
      //   setIsFetchingOrgId(false);
      //   return;
      // }

      // Option 2: Fetch it if not directly available (using users_organisations table)
      const fetchOrg = async () => {
        setIsFetchingOrgId(true);
        const { data, error } = await supabaseClient
          .from('users_organisations') // Your table linking users to organisations
          .select('organisation_id')
          .eq('user_id', currentUser.id)
          .limit(1) // Assuming one primary org for simplicity, adjust if needed
          .single();

        if (data) {
          setCurrentUserOrganisationId(data.organisation_id);
        } else {
          console.warn("NewChatModal: Could not find an organisation for the current user.", error?.message);
        }
        setIsFetchingOrgId(false);
      };
      fetchOrg();
    } else if (!isLoadingCurrentUser) {
      // If no current user and not loading, stop fetching org ID
      setIsFetchingOrgId(false);
    }
  }, [currentUser, isLoadingCurrentUser, supabaseClient]);


  const {
    data: usersInOrgData,
    isLoading: isLoadingUsersByOrgRaw, // Raw loading state from the hook
    error: usersByOrgError
  } = useUsersByOrganisation(currentUserOrganisationId); // Uses your existing hook

  const usersInOrg = useMemo(() => usersInOrgData || [], [usersInOrgData]);

  const { mutate: startDirectChat, isPending: isStartingChat } = useStartDirectChat();
  const [searchQuery, setSearchQuery] = useState('');

  // Overall loading considers current user, org ID fetching, and users list fetching
  const isLoadingUsersList = isLoadingCurrentUser || isFetchingOrgId || isLoadingUsersByOrgRaw;

  const filteredUsers = useMemo(() => {
    if (!currentUser?.id || !usersInOrg) return [];
    return usersInOrg.filter(user =>
      user.id !== currentUser.id && // Exclude current user
      `${user.first_name || ''} ${user.last_name || ''} ${user.email || ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [usersInOrg, searchQuery, currentUser]);

  const handleSelectUser = (selectedUser: Tables<'users'>) => {
    if (!currentUser || !selectedUser.id || isStartingChat) return;

    startDirectChat({
      currentUserId: currentUser.id,
      selectedUserId: selectedUser.id,
      currentUserFirstName: currentUser.first_name, // Assuming first_name is on your User object from useCurrentUser
      selectedUserFirstName: selectedUser.first_name,
    }, {
      onSuccess: () => {
        onOpenChange(false); // Close modal on success
        setSearchQuery('');   // Reset search
      },
      // onError is handled globally in useStartDirectChat (e.g., with an alert or toast)
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isStartingChat) onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[425px] md:max-w-md flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Start a new chat
          </DialogTitle>
          <DialogDescription>
            Select a user from your organization to begin a conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoadingUsersList || isStartingChat}
          />
        </div>

        <ScrollArea className="grow mb-4 pr-3 -mr-1"> {/* Added -mr-1 to visually hide scrollbar if not needed but keep space */}
          <div className="space-y-1">
            {isLoadingUsersList && (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="grow">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            )}
            {!isLoadingUsersList && usersByOrgError && (
              <p className="text-sm text-red-500 text-center py-4">Error loading users: {usersByOrgError.message}</p>
            )}
            {!isLoadingUsersList && !usersByOrgError && filteredUsers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                {!currentUserOrganisationId && !isFetchingOrgId && !isLoadingCurrentUser ? "Could not determine your organization." :
                  searchQuery ? "No users match your search." :
                    (usersInOrg.length === 0 || (usersInOrg.length === 1 && usersInOrg[0].id === currentUser?.id)) && currentUserOrganisationId ? "No other users found in your organization." :
                      "No users available to chat with."}
              </p>
            )}
            {!isLoadingUsersList && !usersByOrgError && filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer ${isStartingChat ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isStartingChat && handleSelectUser(user)}
                role="button"
                tabIndex={isStartingChat ? -1 : 0}
                onKeyDown={(e) => !isStartingChat && (e.key === 'Enter' || e.key === ' ') && handleSelectUser(user)}
                aria-disabled={isStartingChat}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar || undefined} alt={`${user.first_name} ${user.last_name}`} />
                  <AvatarFallback>
                    {getInitials({ firstName: user.first_name, lastName: user.last_name })}
                  </AvatarFallback>
                </Avatar>
                <div className="grow">
                  <p className="font-medium text-sm">{user.first_name} {user.last_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isStartingChat}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
