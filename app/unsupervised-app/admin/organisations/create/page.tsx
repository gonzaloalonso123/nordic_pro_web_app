"use client";

import { Disclaimer } from "@/components/disclaimer";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { FormWrapper } from "@/components/form/form-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { useClientData } from "@/utils/data/client";
import React from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const Page = () => {
  const { t } = useTranslation();
  const data = useClientData();
  const useCreate = data.organisations.useCreate();

  const formSchema = z.object({
    name: z.string().min(1, { message: t("Name is required") }),
  });

  return (
    <FormWrapper
      title={t("New organisation")}
      onSubmit={useCreate.mutateAsync}
      defaultValues={{ name: "" }}
      formSchema={formSchema}
    >
      {useCreate.isSuccess && (
        <Disclaimer
          variant="success"
          title={t("Organisation created!")}
          description={t(
            "Check the available organisations in the organisations list"
          )}
        />
      )}
      <FormItemWrapper
        label="Name"
        description="Enter the name of the organisation"
        name="name"
      >
        <Input type="text" placeholder="Name" />
      </FormItemWrapper>
      <SubmitButton className="mt-2" loading={useCreate.isPending}>
        {t("Create organisation")}
      </SubmitButton>
    </FormWrapper>
  );
};

export default Page;
