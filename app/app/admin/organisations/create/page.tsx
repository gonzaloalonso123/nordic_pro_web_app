"use client";

import { Content } from "@/components/content";
import { Disclaimer } from "@/components/disclaimer";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { FormWrapper } from "@/components/form/form-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { useClientData } from "@/utils/data/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const Page = () => {
  const { t } = useTranslation();
  const data = useClientData();
  const router = useRouter();
  const useCreate = data.organisations.useCreate();

  const formSchema = z.object({
    name: z.string().min(1, { message: t("Name is required") }),
  });

  const submit = async (values: z.infer<typeof formSchema>) => {
    await useCreate.mutateAsync(values);
    router.back();
  };

  return (
    <Content>
      <FormWrapper
        title={t("New organisation")}
        onSubmit={submit}
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
        <SubmitButton
          className="mt-2"
          loading={useCreate.isPending}
          disabled={useCreate.isPending}
        >
          {useCreate.isPending
            ? t("Creating organisation")
            : t("Create organisation")}
        </SubmitButton>
      </FormWrapper>
    </Content>
  );
};

export default Page;
