"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react";
import {
  DataTable,
  type ResponsiveColumnDef,
  SortableHeader,
} from "@/components/data-table/data-table";
import { getInitials } from "@/utils/get-initials";
import { useTranslation } from "react-i18next";
import { getFootballPosition } from "@/content/football-position";
import { responsiveBreakpoints } from "@/components/data-table/lib/table-utils";

type Member = {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    subscription_active: boolean;
  };
  role: "COACH" | "LEADER" | "PLAYER";
  position?: string;
};

interface MembersTableProps {
  members: Member[];
  isLoading: boolean;
  onViewDetails: (member: Member) => void;
}

export function MembersTable({
  members,
  isLoading,
  onViewDetails,
}: MembersTableProps) {
  const { t } = useTranslation();

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

  // Column definitions with responsive behavior
  const columns: ResponsiveColumnDef<Member>[] = [
    {
      accessorKey: "user" as keyof Member,
      id: "member",
      mobilePriority: 1,
      header: ({ column }) => (
        <SortableHeader column={column}>{t("Member")}</SortableHeader>
      ),
      skeleton: {
        type: "avatar",
        width: "w-40",
      },
      cell: ({ row }) => {
        const member = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={member.user.avatar || undefined} />
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
              {member.user.email && (
                <p className="text-sm text-muted-foreground truncate">
                  {member.user.email}
                </p>
              )}
            </div>
          </div>
        );
      },
      // Custom sorting function for names
      sortingFn: (rowA, rowB) => {
        const nameA = `${rowA.original.user.first_name} ${rowA.original.user.last_name}`;
        const nameB = `${rowB.original.user.first_name} ${rowB.original.user.last_name}`;
        return nameA.localeCompare(nameB);
      },
    },
    {
      accessorKey: "role" as keyof Member,
      responsive: responsiveBreakpoints.hiddenMobile,
      header: ({ column }) => (
        <SortableHeader column={column}>{t("Role")}</SortableHeader>
      ),
      skeleton: {
        type: "badge",
      },
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <Badge variant={getRoleBadgeVariant(role)} className="text-xs">
            {t(role)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "position" as keyof Member,
      responsive: responsiveBreakpoints.hiddenMobile,
      header: ({ column }) => (
        <SortableHeader column={column}>{t("Position")}</SortableHeader>
      ),
      skeleton: {
        type: "default",
        width: "w-24",
      },
      cell: ({ row }) => {
        const position = row.getValue("position") as string;
        return (
          <span className="text-sm">
            {position ? getFootballPosition(position)?.label : "-"}
          </span>
        );
      },
    },
    {
      accessorFn: (row) => row.user.subscription_active,
      id: "subscription",
      responsive: responsiveBreakpoints.hiddenMobile,
      header: ({ column }) => (
        <SortableHeader column={column}>{t("Subscription")}</SortableHeader>
      ),
      skeleton: {
        type: "badge",
      },
      cell: ({ row }) => {
        const isActive = row.original.user.subscription_active;
        return (
          <div className="flex items-center space-x-1">
            {isActive ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">{t("Paid")}</span>
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">{t("Unpaid")}</span>
              </>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      skeleton: {
        type: "button",
      },
      cell: ({ row }) => {
        const member = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(member);
            }}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">{t("View details")}</span>
          </Button>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={members}
        isLoading={isLoading}
        skeletonRows={5}
        className="cursor-pointer"
      />

      {!isLoading && members.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {t("No team members found. Add your first member to get started.")}
        </div>
      )}
    </div>
  );
}
