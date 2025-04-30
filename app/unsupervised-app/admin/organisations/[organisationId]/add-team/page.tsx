"use client";

import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { FormWrapper } from "@/components/form/form-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { useClientData } from "@/utils/data/client";
import React from "react";
import { useTranslation } from "react-i18next";
import flags from "@/flags.json";
import { useParams, useRouter } from "next/navigation";
import { Disclaimer } from "@/components/disclaimer";

const CreateTeamForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const organisationId = params.organisationId as string;
  const createTeam = useClientData().teams.useCreate();
  const addTeam = useClientData().organisations.useAddTeam();

  const onSubmit = async (values: { name: string }) => {
    const team = await createTeam.mutateAsync({
      name: values.name,
    });
    await addTeam.mutateAsync({
      organisationId,
      teamId: team.id,
    });
    setTimeout(() => {
      router.push(`${flags.current_app}/admin/organisations/${organisationId}`);
    }, 1000);
  };

  return (
    <div className="container">
      <FormWrapper title={t("Create Team")} onSubmit={onSubmit}>
        <p className="text-sm text-muted-foreground">
          {t("Create a new team")}
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
        <FormItemWrapper label={t("Name")} name="name">
          <Input placeholder={t("Name")} />
        </FormItemWrapper>
        <SubmitButton loading={createTeam.isPending}>
          {t("Create team")}
        </SubmitButton>
      </FormWrapper>
    </div>
  );
};

export default CreateTeamForm;
