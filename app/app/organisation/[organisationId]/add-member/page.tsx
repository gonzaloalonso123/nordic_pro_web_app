"use client";

import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { FormWrapper } from "@/components/form/form-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { useClientData } from "@/utils/data/client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import flags from "@/flags.json";
import { Disclaimer } from "@/components/disclaimer";
import { sendTeamInvitation } from "@/utils/email/send-team-invitation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Content } from "@/components/content";

const AddInvitationForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const organisationId = params.organisationId as string;
  const { data: organisation } =
    useClientData().organisations.useById(organisationId);
  const createInvitation = useClientData().organisationsInvitation.useCreate();
  const { user } = useCurrentUser();
  const [disabled, setDisabled] = useState(false);

  const onSubmit = async ({ email }: { email: string }) => {
    setDisabled(true);
    if (user) {
      const invitation = await createInvitation.mutateAsync({
        user_email: email,
        organisation_id: organisationId,
      });
      const invitatorName =
        `${user.first_name} ${user.last_name}` || user.email;
      sendTeamInvitation({
        email,
        invitatorName,
        organisationId,
        organisationName: organisation?.name || "",
        invitationId: invitation.id,
      });
      setTimeout(() => {
        router.push(`${flags.current_app}/organisation/${organisationId}`);
        setDisabled(false);
      }, 1000);
    }
  };

  return (
    <Content>
      <FormWrapper
        title={t("Invite to organisation")}
        onSubmit={onSubmit}
        defaultValues={{
          email: "",
        }}
      >
        <p className="text-sm text-muted-foreground">
          {t("Send an invitation to join your organisation")}
        </p>
        {createInvitation.isError && (
          <Disclaimer
            variant="error"
            title={t("Error")}
            description={createInvitation.error.message}
          />
        )}
        {createInvitation.isSuccess && (
          <Disclaimer
            variant="success"
            title={t("Success")}
            description={t("Invitation sent successfully")}
          />
        )}
        <FormItemWrapper label={t("Email")} name="email">
          <Input placeholder={t("Email")} />
        </FormItemWrapper>
        <SubmitButton disabled={disabled} loading={disabled}>
          {t("Invite to organisation")}
        </SubmitButton>
      </FormWrapper>
    </Content>
  );
};

export default AddInvitationForm;
