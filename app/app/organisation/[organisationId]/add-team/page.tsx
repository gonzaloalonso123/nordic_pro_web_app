"use client";

import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { FormWrapper } from "@/components/form/form-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { useClientData } from "@/utils/data/client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import flags from "@/flags.json";
import { useParams, useRouter } from "next/navigation";
import { Disclaimer } from "@/components/disclaimer";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { sendTeamInvitation } from "@/utils/email/send-team-invitation";
import { toast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const CreateTeamForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const organisationId = params.organisationId as string;
  const createTeam = useClientData().teams.useCreate();
  const createInvitation = useClientData().organisationsInvitation.useCreate();
  const addTeam = useClientData().organisations.useAddTeam();
  const { data: organisation } =
    useClientData().organisations.useById(organisationId);
  const [invitees, setInvitees] = useState<string[]>([]);
  const [newInvitee, setNewInvitee] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useCurrentUser();

  const handleAddInvitee = () => {
    if (newInvitee && !invitees.includes(newInvitee)) {
      setInvitees([...invitees, newInvitee]);
      setNewInvitee("");
    }
  };

  const handleRemoveInvitee = (email: string) => {
    setInvitees(invitees.filter((e) => e !== email));
  };

  const onSubmit = async (values: { name: string }) => {
    try {
      setIsSubmitting(true);
      const team = await createTeam.mutateAsync({
        name: values.name,
      });

      await addTeam.mutateAsync({
        organisationId,
        teamId: team.id,
      });

      console.log("invitees", invitees);
      if (invitees.length > 0 && user) {
        const invitatorName =
          `${user.first_name} ${user.last_name}` || user.email;

        console.log(invitees);
        const invitationPromises = invitees.map(async (email) => {
          const invitation = await createInvitation.mutateAsync({
            user_email: email,
            organisation_id: organisationId,
          });

          console.log(invitation);
          sendTeamInvitation({
            email,
            invitatorName,
            organisationId,
            organisationName: organisation?.name || "",
            invitationId: invitation.id,
            teamName: values.name,
            teamId: team.id,
          });
        });
        await Promise.all(invitationPromises);

        toast({
          title: "Invitations sent",
          description: `Successfully sent ${invitees.length} invitations.`,
        });
      }
      router.push(`${flags.current_app}/admin/organisations/${organisationId}`);
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Error",
        description: "Failed to create team or send invitations",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <FormWrapper title={t("Create Team")} onSubmit={onSubmit}>
        <p className="text-sm text-muted-foreground mb-6">
          {t("Create a new team and invite members")}
        </p>
        {createTeam.isError && (
          <Disclaimer
            variant="error"
            title={t("Error")}
            description={createTeam.error.message}
          />
        )}
        {createTeam.isSuccess && (
          <Disclaimer
            variant="success"
            title={t("Success")}
            description={t("Team created successfully")}
          />
        )}
        <FormItemWrapper label={t("Team Name")} name="name">
          <Input placeholder={t("Enter team name")} />
        </FormItemWrapper>

        <div className="space-y-4 mt-6">
          <h3 className="font-medium">{t("Invite Team Members")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("Add email addresses of people you want to invite to this team")}
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="Email address"
              value={newInvitee}
              onChange={(e) => setNewInvitee(e.target.value)}
              type="email"
            />
            <Button
              type="button"
              onClick={handleAddInvitee}
              disabled={!newInvitee || !newInvitee.includes("@")}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("Add")}
            </Button>
          </div>

          {invitees.length > 0 && (
            <div className="border rounded-md p-4 space-y-2">
              <p className="text-sm font-medium">{t("Invitees")}:</p>
              {invitees.map((email) => (
                <div
                  key={email}
                  className="flex justify-between items-center bg-muted/50 p-2 rounded-md"
                >
                  <span>{email}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveInvitee(email)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <SubmitButton
          loading={
            isSubmitting || createTeam.isPending || createInvitation.isPending
          }
        >
          {t("Create team and send invitations")}
        </SubmitButton>
      </FormWrapper>
    </div>
  );
};

export default CreateTeamForm;
