"use client";

import { useState } from "react";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  Briefcase,
  Mail,
  Trash2,
  Check,
  X,
  Edit2,
  Save,
  XCircle,
  ChevronLeft,
} from "lucide-react";
import { getInitials } from "@/utils/get-initials";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { FormWrapper } from "@/components/form/form-wrapper";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { FormSelect } from "@/components/form/form-select";
import { roles } from "@/content/roles";
import {
  footballPositions,
  getFootballPosition,
} from "@/content/football-position";
import { Content } from "@/components/content";
import { useParams } from "next/navigation";
import { useClientData } from "@/utils/data/client";
import { DeleteConfirmationDialog } from "../components/delete-confirmation-dialog";
import { useHeader } from "@/hooks/useHeader";

export default function Page() {
  const { useHeaderConfig } = useHeader();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const clientData = useClientData();
  const params = useParams();
  const teamId = params.teamId as string;
  const userId = params.userId as string;
  const { data: team } = clientData.teams.useWithUsers(teamId);
  const updateUserInTeam = clientData.teams.useUpdateUserInTeam();
  const member = team?.users.find(
    (user: { user: { id: string } }) => user.user.id === userId
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const removeUserFromTeam = clientData.teams.useRemoveMember();

  useHeaderConfig({
    centerContent: "Manage User",
    leftContent: (
      <Button
        variant="outline"
        size="sm"
        onClick={() => history.back()}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    ),
  });

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeUserFromTeam.mutateAsync({
        teamId,
        userId,
      });
    } catch (error) {}
  };

  const updateMember = async (
    userId: string,
    updates: Partial<{
      position: string;
      role: string;
      userId: string;
    }>
  ) => {
    try {
      await updateUserInTeam.mutateAsync({
        userId: userId,
        teamId,
        updates,
      });
      toast({
        title: "Success",
        description: "Member updated successfully",
      });
    } catch (error) {
      console.error("Error updating member:", error);
      toast({
        title: "Error",
        description: "Failed to update member",
        variant: "destructive",
      });
    }
  };

  const formSchema = z.object({
    role: z.enum(["PLAYER", "COACH"], {
      required_error: t("Please select a role"),
    }),
    position: z.string().min(1, {
      message: t("Position is required"),
    }),
  });

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (values: z.infer<typeof formSchema>) => {
    setIsUpdating(true);
    try {
      await updateMember(member.user.id, values);
      setIsEditing(false);
      toast({
        title: t("Success"),
        description: t("Member updated successfully"),
      });
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to update member"),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Content>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
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
                  {getFootballPosition(member?.position)?.label}
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="shrink-0"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                {t("Edit")}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <FormWrapper
              className="space-y-4"
              title=""
              onSubmit={handleSave}
              defaultValues={{
                role: member?.role || "PLAYER",
                position: member?.position || "",
              }}
            >
              <FormItemWrapper name="role">
                <FormSelect
                  options={Object.entries(roles).map(([key, value]) => ({
                    label: value,
                    value: key,
                  }))}
                  placeholder={t("Role")}
                />
              </FormItemWrapper>

              <FormItemWrapper name="position">
                <FormSelect
                  options={footballPositions.map((pos) => ({
                    label: pos.label,
                    value: pos.value,
                  }))}
                  placeholder={t("Position")}
                />
              </FormItemWrapper>

              <div className="flex items-center space-x-2 pt-4">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isUpdating}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isUpdating ? t("Saving...") : t("Save changes")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isUpdating}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {t("Cancel")}
                </Button>
              </div>
            </FormWrapper>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">
                  {t("Email")}:
                </span>
                <span className="text-sm">{member?.user.email}</span>
              </div>

              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">
                  {t("Role")}:
                </span>
                <Badge variant={member && getRoleBadgeVariant(member.role)}>
                  {t(member?.role)}
                </Badge>
              </div>

              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">
                  {t("Position")}:
                </span>
                <span className="text-sm">
                  {getFootballPosition(member?.position)?.label}
                </span>
              </div>

              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">
                  {t("Subscription")}:
                </span>
                <div className="flex items-center space-x-1">
                  {member?.user.subscription_active ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        {t("Active")}
                      </span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">
                        {t("Inactive")}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {!isEditing && (
          <CardFooter className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("Remove Member")}
            </Button>
          </CardFooter>
        )}
      </Card>
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => handleRemoveMember(member.user.id)}
        member={member}
      />
    </Content>
  );
}
