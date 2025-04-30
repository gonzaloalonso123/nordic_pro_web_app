"use client";

import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { FormWrapper } from "@/components/form/form-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { useClientData } from "@/utils/data/client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import flags from "@/flags.json";
import { Disclaimer } from "@/components/disclaimer";

const AddInvitationForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const organisationId = params.organisationId as string;
  const createInvitation = useClientData().organisationsInvitation.useCreate();

  const onSubmit = async (values: { email: string }) => {
    await createInvitation.mutateAsync({
      user_email: values.email,
      organisation_id: params.organisationId as string,
    });
    setTimeout(() => {
      router.push(`${flags.current_app}/admin/organisations/${organisationId}`);
    }, 1000);
  };

  return (
    <div className="container">
      <FormWrapper title={t("Invite to organisation")} onSubmit={onSubmit}>
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
        <SubmitButton>{t("Invite to organisation")}</SubmitButton>
      </FormWrapper>
    </div>
  );
};

export default AddInvitationForm;
