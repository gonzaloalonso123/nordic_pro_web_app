"use client";

import Link from "next/link";
import {
  Bell,
  MessageSquare,
  Search,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { signOut } from "@/utils/supabase/auth-actions";
import { Tables } from "@/types/database.types";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function PlatformHeader() {
  const isMobile = useIsMobile();
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex h-16 items-center justify-between px-6">
        {!isMobile && <NavBar />}
        <RightMenu />
      </div>
    </header>
  );
}

const NavBar = () => (
  <div className="flex items-center">
    <Link
      href="/platform"
      className="font-montserrat font-bold text-2xl text-primary mr-8"
    >
      NordicPro
    </Link>
    <div className="hidden md:flex relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search..."
        className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
      />
    </div>
  </div>
);

const RightMenu = () => {
  const user = useCurrentUser();

  return (
    <div className="flex items-center gap-4">
      {/* <NotificationsButton
        notifications={allNotifications as unknown as Notification[]}
      /> */}
      {/* <MessagesButton messages={allMessages as unknown as Notification[]} /> */}
      {user.isAuthenticated && !user.isLoading && user.user && (
        <ProfileMenu user={user.user} />
      )}
    </div>
  );
};

const NotificationsButton = ({
  notifications,
}: {
  notifications: Notification[];
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5 text-gray-600" />
      {notifications.length > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center">
          {notifications.length}
        </span>
      )}
    </Button>
  );
};

const MessagesButton = ({ messages }: { messages: Notification[] }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      aria-label="Messages"
    >
      <MessageSquare className="h-5 w-5 text-gray-600" />
      {messages.length > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center">
          {messages.length}
        </span>
      )}
    </Button>
  );
};

const ProfileMenu = ({ user }: { user: Tables<"users"> }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
          {`${user.first_name[0]}${user.last_name[0]}`.toUpperCase()}
        </div>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>
        <div className="flex flex-col">
          <span className="font-medium">{user?.email}</span>
          <span className="text-xs text-gray-500">{user.is_admin ? 'Admin' : 'User'}</span>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <UserIcon className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer">
        <label onClick={signOut} className="flex w-full cursor-pointer">
          Log out
        </label>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
