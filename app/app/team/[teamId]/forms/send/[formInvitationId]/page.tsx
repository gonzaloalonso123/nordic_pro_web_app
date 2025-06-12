"use client";

import { FormWrapper } from "@/components/form/form-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { useClientData } from "@/utils/data/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Disclaimer } from "@/components/disclaimer";
import { useToast } from "@/hooks/use-toast";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { FormSelect } from "@/components/form/form-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateSelector } from "@/components/create-event/date-selector/date-selector";
import { addHours, addMinutes } from "date-fns";
import { useUrl } from "@/hooks/use-url";
import { useRole } from "@/app/app/(role-provider)/role-provider";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useHeader } from "@/hooks/useHeader";
import { ExpireSelector } from "@/components/form/send-form/expire-button";
import { TeamUserSelectorPopup } from "@/components/form/send-form/team-user-selector/team-user-selector";
import { triggerNotification } from "@/utils/notificationService";

const SendFormPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useParams();
    const teamId = params.teamId as string;
    const formId = params.formInvitationId as string;
    const { toast } = useToast();
    const now = new Date();

    const { useHeaderConfig } = useHeader();
    useHeaderConfig({
        centerContent: "Send Form",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExpire, setIsExpire] = useState<boolean>(false);
    const { data: team, isPending: isTeamPending } = useClientData().teams.useWithUsers(teamId);
    const createFormInvitationForUsers = useClientData().formInvitations.useSendToUsers();
    const { user } = useCurrentUser();
    const teamUsersWithoutMe = team?.users.filter((u: any) => u.user.id !== user?.id).filter((user: any) => user.role !== "COACH");
    const [formConfig, setFormConfig] = useState<{ selectedUsers: string[]; expiresAt: Date | null }>({
        selectedUsers: [],
        expiresAt: null,
    });

    const handleSetExpire = (expiresAt: Date | null) => {
        setFormConfig((prev) => ({
            ...prev,
            expiresAt,
        }));
    }

    const handleToggleUser = (userId: string) => {
        if (formConfig.selectedUsers.includes(userId)) {
            setFormConfig((prev) => ({
                ...prev,
                selectedUsers: prev.selectedUsers.filter((id) => id !== userId),
            }));
        } else {
            setFormConfig((prev) => ({
                ...prev,
                selectedUsers: [...prev.selectedUsers, userId],
            }));
        }
    };

    const handleToggleAll = () => {
        if (teamUsersWithoutMe && teamUsersWithoutMe.length > 0) {
            if (formConfig.selectedUsers.length === teamUsersWithoutMe.length) {
                setFormConfig((prev) => ({
                    ...prev,
                    selectedUsers: [],
                }));
            } else {
                setFormConfig((prev) => ({
                    ...prev,
                    selectedUsers: teamUsersWithoutMe.map((user: any) => user.user.id),
                }));
            }
        }
    };

    useEffect(() => {
        handleToggleAll();
    }, [team?.users]);

    const handleSendForm = async () => {
        if (!formId || !teamId) return;

        try {
            setIsSubmitting(true);

            if (formConfig.selectedUsers.length > 0) {
                await createFormInvitationForUsers.mutateAsync({
                    formId,
                    teamId,
                    userIds: formConfig.selectedUsers,
                    expiresAt: formConfig.expiresAt?.toISOString() || null,
                });

                toast({
                    title: "Success",
                    description: `Form sent to ${formConfig.selectedUsers.length} selected user${formConfig.selectedUsers.length !== 1 ? "s" : ""} successfully`,
                });

                toast({
                    title: "Success",
                    description: "Form sent to all team members successfully",
                });

                triggerNotification({
                    recipientUserIds: formConfig.selectedUsers,
                    title: "New Form Invitation",
                    body: `You have been invited to complete a new form.`,
                    tag: "form-invitation",
                    url: `/app/team/${teamId}/dashboard`,
                });
            }
            router.back();

        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to send form invitations",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isTeamPending) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container py-4 pb-20 md:pb-4">
            <FormWrapper
                title={t("Send Form Confirmation")}
                onSubmit={handleSendForm}
                onBack={() => router.back()}
                showBackButton
            >
                {createFormInvitationForUsers.isError && (
                    <Disclaimer variant="error" title={t("Error")} description={createFormInvitationForUsers.error.message} />
                )}
                {createFormInvitationForUsers.isSuccess && (
                    <Disclaimer variant="success" title={t("Success")} description={t("Form sent successfully")} />
                )}
                <FormItemWrapper description={t("Choose who should receive this form invitation")} name="members">
                    {team?.users && team.users?.length > 0 && (
                        <TeamUserSelectorPopup
                            users={teamUsersWithoutMe}
                            selectedUsers={formConfig.selectedUsers}
                            onToggleUser={handleToggleUser}
                            onSelectAll={handleToggleAll}
                        />
                    )}
                </FormItemWrapper>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="be-there-early"
                        checked={isExpire}
                        onCheckedChange={(set) => {
                            setFormConfig((prev) => ({
                                ...prev,
                                expiresAt: set ? addHours(addMinutes(now, 30), 2) : null,
                            }));
                            setIsExpire(set ? true : false);
                        }}
                    />
                    <Label
                        htmlFor="be-there-early"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Expires
                    </Label>
                </div>
                {isExpire && <ExpireSelector expiresAt={formConfig.expiresAt} onChange={handleSetExpire} teamId={teamId} />}

                <SubmitButton disabled={isSubmitting || createFormInvitationForUsers.isPending}>
                    {isSubmitting || createFormInvitationForUsers.isPending ? t("Sending...") : t("Send")}
                </SubmitButton>
            </FormWrapper>
        </div>
    );
};

export default SendFormPage;
