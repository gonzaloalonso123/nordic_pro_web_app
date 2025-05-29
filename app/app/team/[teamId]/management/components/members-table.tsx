"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Trash2, Check, X } from "lucide-react";
import { getInitials } from "@/utils/get-initials";

interface MembersTableProps {
  members: any[];
  isLoading: boolean;
  onViewDetails: (member: any) => void;
  onRemove: (member: any) => void;
}

export function MembersTable({
  members,
  isLoading,
  onViewDetails,
  onRemove,
}: MembersTableProps) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "COACH":
        return "default";
      case "LEADER":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-4 border rounded-lg"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header - Hidden on mobile */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-4">Member</div>
        <div className="col-span-2">Role</div>
        <div className="col-span-2">Position</div>
        <div className="col-span-2">Subscription</div>
        <div className="col-span-2">Actions</div>
      </div>

      {/* Rows */}
      {members.map((member) => (
        <div
          key={member.user.id}
          className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          {/* Member Info */}
          <div className="flex items-center space-x-3 sm:col-span-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-sm">
                {getInitials({
                  firstName: member.user.first_name,
                  lastName: member.user.last_name,
                })}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">
                {member.user.first_name} {member.user.last_name}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {member.user.email}
              </p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center sm:col-span-2">
            <span className="text-sm text-muted-foreground sm:hidden mr-2">
              Role:
            </span>
            <Badge
              variant={getRoleBadgeVariant(member.role)}
              className="text-xs"
            >
              {member.role}
            </Badge>
          </div>

          {/* Position */}
          <div className="flex items-center sm:col-span-2">
            <span className="text-sm text-muted-foreground sm:hidden mr-2">
              Position:
            </span>
            <span className="text-sm">{member.position}</span>
          </div>

          {/* Subscription Status */}
          <div className="flex items-center sm:col-span-2">
            <span className="text-sm text-muted-foreground sm:hidden mr-2">
              Subscription:
            </span>
            <div className="flex items-center space-x-1">
              {member.user.subscription_active ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Paid</span>
                </>
              ) : (
                <>
                  <X className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">Unpaid</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:col-span-2 sm:justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(member)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View details</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(member)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove member</span>
            </Button>
          </div>
        </div>
      ))}

      {members.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No team members found. Add your first member to get started.
        </div>
      )}
    </div>
  );
}
