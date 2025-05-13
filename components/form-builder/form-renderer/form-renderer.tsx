"use client";

import { Badge } from "@/components/ui/badge";

import { useEffect, useState } from "react";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { FormWrapper } from "@/components/form/form-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Award, Check } from "lucide-react";
import type { FormWithQuestions, Question } from "../types";
import { z } from "zod";
import EmojiPicker from "../input-types/emoji-picker";
import Image from "next/image";
import SequentialForm from "./sequential-form";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tables } from "@/database.types";

interface FormRendererProps {
  form: Tables<"forms"> & {
    questions: (Tables<"questions"> & {
      question_options: Tables<"question_options">;
    })[];
  };
}

export default function FormRenderer({ form }: FormRendererProps) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [experienceEarned, setExperienceEarned] = useState(0);

  if (form.display_mode === "sequential") {
    return <SequentialForm form={form} />;
  }

  useEffect(() => {
    console.log("form", form);
  }, [form]);
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
    setFormValues(values);
    setSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const renderQuestionInput = (question: Question) => {
    switch (question.input_type) {
      case "text":
        return <Input placeholder="Enter your answer" />;

      case "number":
        return (
          <Input
            type="number"
            placeholder="Enter a number"
            min={question.min}
            max={question.max}
          />
        );

      case "emoji":
        return (field: any) => {
          const emojiValue = field.value?.emoji || field.value;
          return (
            <EmojiPicker
              value={emojiValue}
              customOptions={question.emojiOptions}
              onChange={(emoji, numericValue) => {
                field.onChange(
                  question.emojiOptions ? { emoji, value: numericValue } : emoji
                );
              }}
            />
          );
        };

      case "slider":
        return (field: any) => (
          <div className="pt-4 pb-2">
            <Slider
              value={[field.value || question.min || 0]}
              min={question.min || 0}
              max={question.max || 100}
              step={question.step || 1}
              onValueChange={(value) => field.onChange(value[0])}
            />
          </div>
        );

      case "yesno":
        return (field: any) => (
          <RadioGroup
            value={field.value?.toString()}
            onValueChange={(value) => field.onChange(value === "true")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${question.id}-yes`} />
              <Label htmlFor={`${question.id}-yes`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${question.id}-no`} />
              <Label htmlFor={`${question.id}-no`}>No</Label>
            </div>
          </RadioGroup>
        );

      case "multiple":
        return (field: any) => (
          <div className="space-y-2">
            {question.question_options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={(field.value || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = field.value || [];
                    if (checked) {
                      field.onChange([...currentValues, option.value]);
                    } else {
                      field.onChange(
                        currentValues.filter((v: string) => v !== option.value)
                      );
                    }
                  }}
                />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </div>
        );

      default:
        return <Input placeholder="Enter your answer" />;
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex justify-center items-center">
            <Check className="h-6 w-6 text-green-500 mr-2" />
            Form Completed!
          </CardTitle>
          <CardDescription>
            Great job completing the {form.title} form!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-50 text-green-600">
              <Award className="h-12 w-12" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Experience Earned</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-amber-500">
                +{experienceEarned}
              </span>
              <span className="text-xl font-semibold">XP</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Questions Answered</p>
            <p className="text-xl font-semibold">
              {Object.keys(formValues).length} / {form.questions.length}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              router.push("/app/admin/organisations/forms/forms")
            }
          >
            Back to Forms
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Form completion</p>
          <div className="flex items-center gap-1.5">
            <Award className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-700">
              Earn {form.totalExperience} XP
            </span>
          </div>
        </div>
        <Progress value={0} className="h-2" />
      </div>

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
            {question.imageUrl && (
              <div className="relative w-full h-48 sm:h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={question.image_Url || "/placeholder.svg"}
                  alt={question.question}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <FormItemWrapper
                  name={question.id}
                  label={question.question}
                  description={question.description}
                >
                  {renderQuestionInput(question)}
                </FormItemWrapper>
              </div>

              <div className="ml-2 mt-6">
                <Badge variant="outline" className="bg-amber-50">
                  <Award className="h-3.5 w-3.5 mr-1 text-amber-500" />
                  {question.experience} XP
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </FormWrapper>
    </div>
  );
}
