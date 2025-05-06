"use client";

import FormRenderer from "@/components/form-builder/form-renderer/form-renderer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ExperienceProgress from "@/components/form-builder/experience-progress";
import { useFormWithQuestions } from "@/hooks/queries";
import { useParams, useRouter } from "next/navigation";

export default function PreviewFormPage() {
  const params = useParams();
  const formId = params.formId as string;
  const router = useRouter();
  const {
    data: formWithQuestions,
    isPending,
    isError,
  } = useFormWithQuestions(formId);

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading form</div>;
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <FormRenderer form={formWithQuestions} />
        </div>
        <div className="md:col-span-1">
          <ExperienceProgress />
        </div>
      </div>
    </div>
  );
}
