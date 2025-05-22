"use client";

import { useState } from "react";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { FormWrapper } from "@/components/form/form-wrapper";
import { z } from "zod";
import { CompletionScreen } from "./completion-screen";
import type { Tables } from "@/types/database.types";
import SequentialForm from "./sequential-form";
import { ProgressIndicator } from "./progress-indicator";
import { QuestionRenderer } from "./question-renderer";

interface FormRendererProps {
  form: Tables<"forms"> & {
    questions: (Tables<"questions"> & {
      question_options: Tables<"question_options">;
    })[];
  };
  redirectUrl?: string;
  onSubmit?: (values: Record<string, any>) => void;
}

export default function FormRenderer({
  form,
  redirectUrl,
  onSubmit,
}: FormRendererProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [experienceEarned, setExperienceEarned] = useState(0);

  if (form.display_mode === "sequential") {
    return (
      <SequentialForm
        form={form}
        redirectUrl={redirectUrl}
        onSubmit={onSubmit}
      />
    );
  }

  const buildValidationSchema = () => {
    const schema: Record<string, any> = {};

    form.questions.forEach((question) => {
      let fieldSchema;

      switch (question.input_type) {
        case "text":
          fieldSchema = z.string();
          break;
        case "number":
          fieldSchema = z.number();
          if (question.min_value)
            fieldSchema = fieldSchema.min(question.min_value);
          if (question.max_value)
            fieldSchema = fieldSchema.max(question.max_value);
          break;
        case "emoji":
          fieldSchema = z.string();
          break;
        case "slider":
          fieldSchema = z.number();
          break;
        case "yesno":
          fieldSchema = z.boolean();
          break;
        case "multiple":
          fieldSchema = z.array(z.string()).min(1);
          break;
        default:
          fieldSchema = z.string();
      }

      if (question.required) {
        schema[question.id] = fieldSchema;
      } else {
        schema[question.id] = fieldSchema.optional();
      }
    });

    return z.object(schema);
  };

  const formSchema = buildValidationSchema();

  const handleFormSubmit = (values: any) => {
    let totalExperience = 0;
    Object.keys(values).forEach((questionId) => {
      const question = form.questions.find((q) => q.id === questionId);
      if (question) {
        totalExperience += question.experience;
      }
    });

    if (onSubmit) {
      onSubmit(values);
    }
    console.log(values);
    setFormValues(values);
    setExperienceEarned(totalExperience);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <CompletionScreen
        formTitle={form.title}
        earnedExperience={experienceEarned}
        answeredQuestions={Object.keys(formValues).length}
        totalQuestions={form.questions.length}
        redirectUrl={redirectUrl || "/"}
      />
    );
  }

  const progressPercentage = 0;

  return (
    <div className="relative">
      <ProgressIndicator
        totalQuestions={form.questions.length}
        earnedExperience={0}
        progressPercentage={progressPercentage}
      />

      <FormWrapper
        title={form.title}
        onSubmit={handleFormSubmit}
        formSchema={formSchema}
      >
        {form.description && (
          <p className="text-sm text-muted-foreground mb-6">
            {form.description}
          </p>
        )}

        {form.questions.map((question) => (
          <div key={question.id} className="mb-8 pb-8 border-b last:border-0">
            <FormItemWrapper
              name={question.id}
              label=""
              description=""
              className="space-y-0"
            >
              {(field) => (
                <QuestionRenderer
                  question={question}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            </FormItemWrapper>
          </div>
        ))}
      </FormWrapper>
    </div>
  );
}
