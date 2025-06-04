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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Shield,
  Briefcase,
  Mail,
  Trash2,
  Check,
  X,
  Save,
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
  // Remove these lines or comment them out:
  // const [isEditing, setIsEditing] = useState(false)
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
    leftContent: "back",
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
        return "secondary";
      case "LEADER":
        return "default";
      default:
        return "outline";
    }
  };

  // const handleEdit = () => { setIsEditing(true) }
  // const handleCancel = () => { setIsEditing(false) }

  // Update handleSave to remove setIsEditing(false):
  const handleSave = async (values: z.infer<typeof formSchema>) => {
    setIsUpdating(true);
    try {
      await updateMember(member.user.id, values);
      // Remove this line: setIsEditing(false)
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

  const getSubscriptionStatusColor = (isActive: boolean) => {
    return isActive ? "text-emerald-600" : "text-rose-600";
  };

  return (
    <Content className="max-w-2xl mx-auto px-4 py-6">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-slate-100 shadow-sm">
              <AvatarFallback className="bg-slate-100 text-slate-700 text-xl font-medium">
                {member &&
                  getInitials({
                    firstName: member.user.first_name,
                    lastName: member.user.last_name,
                  })}
              </AvatarFallback>
              <AvatarImage
                src={`/placeholder.svg?height=80&width=80&query=avatar`}
                alt="User avatar"
              />
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                {member?.user.first_name} {member?.user.last_name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={member && getRoleBadgeVariant(member.role)}
                  className="font-medium"
                >
                  {t(member?.role)}
                </Badge>
                <span className="text-sm text-slate-500">
                  {getFootballPosition(member?.position)?.label}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Information Display */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <h4 className="text-lg font-semibold text-slate-900">
                  {t("Current Information")}
                </h4>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Mail className="h-5 w-5 mr-2 text-slate-500" />
                    <h5 className="font-medium text-slate-700">
                      {t("Contact")}
                    </h5>
                  </div>
                  <p className="text-sm text-slate-600 break-all pl-7">
                    {member?.user.email}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 mr-2 text-slate-500" />
                    <h5 className="font-medium text-slate-700">
                      {t("Team Role")}
                    </h5>
                  </div>
                  <div className="pl-7">
                    <Badge
                      variant={member && getRoleBadgeVariant(member.role)}
                      className="font-medium"
                    >
                      {t(member?.role)}
                    </Badge>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Briefcase className="h-5 w-5 mr-2 text-slate-500" />
                    <h5 className="font-medium text-slate-700">
                      {t("Position")}
                    </h5>
                  </div>
                  <p className="text-sm text-slate-600 pl-7">
                    {getFootballPosition(member?.position)?.label}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 mr-2 text-slate-500" />
                    <h5 className="font-medium text-slate-700">
                      {t("Subscription")}
                    </h5>
                  </div>
                  <div className="flex items-center pl-7">
                    {member?.user.subscription_active ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600 mr-1" />
                        <span
                          className={`text-sm font-medium ${getSubscriptionStatusColor(true)}`}
                        >
                          {t("Active")}
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-rose-600 mr-1" />
                        <span
                          className={`text-sm font-medium ${getSubscriptionStatusColor(false)}`}
                        >
                          {t("Inactive")}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <h4 className="text-lg font-semibold text-slate-900">
                  {t("Update Information")}
                </h4>
              </div>

              <FormWrapper
                className="space-y-5"
                title=""
                onSubmit={handleSave}
                defaultValues={{
                  role: member?.role || "PLAYER",
                  position: member?.position || "",
                }}
              >
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
                  <FormItemWrapper name="role" label={t("Role")}>
                    <FormSelect
                      options={Object.entries(roles).map(([key, value]) => ({
                        label: value,
                        value: key,
                      }))}
                      placeholder={t("Select role")}
                    />
                  </FormItemWrapper>

                  <FormItemWrapper name="position" label={t("Position")}>
                    <FormSelect
                      options={footballPositions.map((pos) => ({
                        label: pos.label,
                        value: pos.value,
                      }))}
                      placeholder={t("Select position")}
                    />
                  </FormItemWrapper>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    type="submit"
                    size="default"
                    disabled={isUpdating}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isUpdating ? t("Updating...") : t("Update Member")}
                  </Button>
                </div>
              </FormWrapper>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-6 px-6">
          <Button
            variant="destructive"
            size="default"
            onClick={() => setDeleteDialogOpen(true)}
            className="w-full sm:w-auto ml-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t("Remove from Team")}
          </Button>
        </CardFooter>
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
