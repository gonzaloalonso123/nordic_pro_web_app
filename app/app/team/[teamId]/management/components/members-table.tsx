"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Check, X, Edit2 } from "lucide-react";
import { getInitials } from "@/utils/get-initials";
import { useTranslation } from "react-i18next";
import { getFootballPosition } from "@/content/football-position";
import Image from "next/image";

interface MembersTableProps {
  members: any[];
  isLoading: boolean;
  onViewDetails: (member: any) => void;
}

export function MembersTable({ members, onViewDetails }: MembersTableProps) {
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

  return (
    <div>
      <div className="hidden sm:grid sm:grid-cols-10 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-4">{t("Member")}</div>
        <div className="col-span-2">{t("Role")}</div>
        <div className="col-span-2">{t("Position")}</div>
        <div className="col-span-2">{t("Subscription")}</div>
      </div>

      {members.map((member) => (
        <div key={member.user.id}>
          <div
            className="flex sm:hidden items-center space-x-3 p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer active:bg-muted"
            onClick={() => onViewDetails(member)}
          >
            <Avatar className="h-10 w-10 shrink-0">
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

          <div
            className="hidden cursor-pointer sm:grid sm:grid-cols-10 border-b gap-4 p-4 hover:bg-muted/50 transition-colors"
            onClick={() => onViewDetails(member)}
          >
            <div className="flex items-center space-x-3 col-span-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-sm">
                  {getInitials({
                    firstName: member.user.first_name,
                    lastName: member.user.last_name,
                  })}
                </AvatarFallback>
                <AvatarImage src={member.user.avatar || undefined} />
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

            <div className="flex items-center col-span-2">
              <Badge
                variant={getRoleBadgeVariant(member.role)}
                className="text-xs"
              >
                {t(member.role)}
              </Badge>
            </div>

            <div className="flex items-center col-span-2">
              <span className="text-sm">
                {getFootballPosition(member.position)?.label}
              </span>
            </div>

            <div className="flex items-center col-span-2">
              <div className="flex items-center space-x-1">
                {member.user.subscription_active ? (
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
            </div>
          </div>
        </div>
      ))}

      {members.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {t("No team members found. Add your first member to get started.")}
        </div>
      )}
    </div>
  );
}
