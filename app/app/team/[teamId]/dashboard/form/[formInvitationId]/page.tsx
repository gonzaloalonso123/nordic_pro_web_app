"use client";

import ExperienceProgress from "@/components/form-builder/experience-progress";
import FormRenderer from "@/components/form-builder/form-renderer/form-renderer";
import { Button } from "@/components/ui/button";
import { useFormWithQuestions } from "@/hooks/queries";
import { useUrl } from "@/hooks/use-url";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHeader } from "@/hooks/useHeader";
import { useClientData } from "@/utils/data/client";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default () => {
  const params = useParams();
  const formInvitationId = params.formInvitationId as string;
  const router = useRouter();
  const path = useUrl();
  const { user } = useCurrentUser();
  const { data: invitation } = useClientData().formInvitations.useById(formInvitationId);
  const updateInvitation = useClientData().formInvitations.useUpdate();
  const createFormResponse = useClientData().formResponses.useSubmit();
  const { useHeaderConfig } = useHeader();
  useHeaderConfig({
    leftContent: "back",
  });

  const { data: formWithQuestions, isPending, isError } = useFormWithQuestions(invitation?.form_id);

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading form</div>;
  }

  const onSubmit = (values: any, experience: number) => {
    updateInvitation.mutate({
      id: formInvitationId,
      updates: {
        completed: true,
      },
    });
    createFormResponse.mutate({
      formId: invitation?.form_id as string,
      answers: values,
      earnedExperience: experience,
      invitationId: invitation?.id as string,
      userId: user?.id as string,
    });
  };

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <FormRenderer onSubmit={onSubmit} form={formWithQuestions} redirectUrl={`${path}/dashboard`} />
        </div>
        <div className="md:col-span-1">
          <ExperienceProgress />
        </div>
      </div>
    </div>
  );
};
