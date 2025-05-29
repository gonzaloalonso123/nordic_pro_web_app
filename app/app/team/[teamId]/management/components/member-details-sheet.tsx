"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Briefcase, Mail, Trash2, Check, X } from "lucide-react";
import { getInitials } from "@/utils/get-initials";

interface MemberDetailsSheetProps {
  member: any;
  onClose: () => void;
  onRemove: (member: any) => void;
}

export function MemberDetailsSheet({
  member,
  onClose,
  onRemove,
}: MemberDetailsSheetProps) {
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
    <Sheet open={!!member} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {member?.user.first_name} {member?.user.last_name}
          </SheetTitle>
          <SheetDescription>{member?.position}</SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Member Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarFallback>
                      {member &&
                        getInitials({
                          firstName: member.user.first_name,
                          lastName: member.user.last_name,
                        })}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {member?.user.first_name} {member?.user.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {member?.position}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground mr-2">
                      Email:
                    </span>
                    <span className="text-sm">{member?.user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground mr-2">
                      Role:
                    </span>
                    <Badge variant={member && getRoleBadgeVariant(member.role)}>
                      {member?.role}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground mr-2">
                      Position:
                    </span>
                    <span className="text-sm">{member?.position}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground mr-2">
                      Subscription:
                    </span>
                    <div className="flex items-center space-x-1">
                      {member?.user.subscription_active ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600">Inactive</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemove(member)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove from Team
              </Button>
            </CardFooter>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
