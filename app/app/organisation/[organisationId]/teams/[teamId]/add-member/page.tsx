"use client";

import { FormWrapper } from "@/components/form/form-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { useClientData } from "@/utils/data/client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import flags from "@/flags.json";
import { Disclaimer } from "@/components/disclaimer";
import { useToast } from "@/hooks/use-toast";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { FormSelect } from "@/components/form/form-select";
import { footballPositions } from "@/content/football-position";

const roleOptions = [
  { value: "COACH", label: "Coach" },
  { value: "PLAYER", label: "Player" },
];

const AddTeamMemberPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;
  const organisationId = params.organisationId as string;
  const { toast } = useToast();

  const { data: team } = useClientData().teams.useWithUsers(teamId);
  const { data: organisationUsers } =
    useClientData().users.useByOrganisation(organisationId);
  const addUserToTeam = useClientData().teams.useAddMember();

  const handleAddExistingUser = async ({
    user_id,
    role,
    position,
  }: {
    user_id: string;
    role: string;
    position: string;
  }) => {
    try {
      await addUserToTeam.mutateAsync({
        teamId,
        userId: user_id,
        role,
        position: position.trim() || "PLAYER",
      });
      toast({
        title: "Success",
        description: "User added to team successfully",
      });
      router.push(
        `${flags.current_app}/admin/organisations/${organisationId}/teams/${teamId}`
      );
    } catch (error) {
      console.error("Error adding user to team:", error);
      toast({
        title: "Error",
        description: "Failed to add user to team",
        variant: "destructive",
      });
    }
  };

  const availableUsers =
    organisationUsers?.filter(
      (user) => !team?.users?.some((ut: any) => ut.user.id === user.id)
    ) || [];

  const RoleAndPositionFields = () => (
    <>
      <FormItemWrapper name="role">
        <FormSelect
          placeholder={t("Select a role")}
          options={roleOptions.map((option) => ({
            value: option.value,
            label: t(option.label),
          }))}
        />
      </FormItemWrapper>
      <FormItemWrapper name="position">
        <FormSelect
          placeholder={t("Select a position")}
          options={footballPositions.map((option) => ({
            value: option.value,
            label: t(option.label),
          }))}
        />
      </FormItemWrapper>
    </>
  );

  return (
    <div className="container py-4">
      <FormWrapper
        title={t("Add Member to Team")}
        onSubmit={handleAddExistingUser}
        onBack={() => router.back()}
        showBackButton
      >
        {addUserToTeam.isError && (
          <Disclaimer
            variant="error"
            title={t("Error")}
            description={addUserToTeam.error.message}
          />
        )}
        {addUserToTeam.isSuccess && (
          <Disclaimer
            variant="success"
            title={t("Success")}
            description={t("User added to team successfully")}
          />
        )}

        <FormItemWrapper name="user_id">
          <FormSelect
            placeholder={t("Select a user")}
            options={availableUsers.map((user) => ({
              value: user.id,
              label: `${user.first_name} ${user.last_name} (${user.email})`,
            }))}
          />
        </FormItemWrapper>
        <RoleAndPositionFields />
        <SubmitButton disabled={addUserToTeam.isPending}>
          {addUserToTeam.isPending ? t("Adding...") : t("Add to Team")}
        </SubmitButton>
      </FormWrapper>
    </div>
  );
};

export default AddTeamMemberPage;
