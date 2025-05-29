"use client";

import Link from 'next/link';
import { User as UserIcon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/utils/get-initials';
import { signOut } from '@/utils/supabase/auth-actions';
import { Tables } from '@/types/database.types';

interface ProfileMenuProps {
  user: Tables<'users'>;
}

export const ProfileMenu = ({ user }: ProfileMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label="User menu"
      >
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={user.avatar ?? undefined}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
          />
          <AvatarFallback>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {getInitials({ firstName: user.first_name, lastName: user.last_name })}
            </div>
          </AvatarFallback>
        </Avatar>
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
      <DropdownMenuItem className="cursor-pointer asChild">
        <Link className="flex gap-2 justify-start align-middle w-full" href={`/app/user/${user.id}`}>
          <UserIcon className="h-4 w-4" />
          <span>Profile</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer asChild">
        <Link className="flex gap-2 justify-start align-middle w-full" href={`/app/user/${user.id}/edit`}>
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer" onSelect={(e) => { e.preventDefault(); signOut(); }}>
        <span className="flex w-full cursor-pointer">
          Log out
        </span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);