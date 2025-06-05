"use client";

import type React from "react";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { FormWrapper } from "@/components/form/form-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "@/components/form/form-select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Upload, ImageIcon } from "lucide-react";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import type { InputType } from "../types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCategories,
  useCreateQuestion,
  useUpdateQuestion,
  useQuestion,
} from "@/hooks/queries/useQuestions";
import { useEffect } from "react";

const inputTypeOptions = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "emoji", label: "Emoji" },
  { value: "slider", label: "Slider" },
  { value: "yesno", label: "Yes/No" },
  { value: "multiple", label: "Multiple Choice" },
];

interface QuestionFormProps {
  questionId?: string;
}

const questionSchema = z.object({
  id: z.string(),
  category: z.string().min(1, "Category is required"),
  question: z.string().min(1, "Question is required"),
  inputType: z.enum(["text", "number", "emoji", "slider", "yesno", "multiple"]),
  required: z.boolean(),
  description: z.string().optional(),
  experience: z.string(),
  options: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1, "Option label is required"),
        value: z.string().min(1, "Option value is required"),
      })
    )
    .optional(),
  min_value: z.string().optional(),
  max_value: z.string().optional(),
  step_value: z.string().optional(),
  imageUrl: z.string().optional(),
  imagePreview: z.string().nullable().optional(),
});

export default function QuestionForm({ questionId }: QuestionFormProps) {
  const router = useRouter();

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: questionData, isLoading: questionLoading } =
    useQuestion(questionId);

  const createQuestion = useCreateQuestion({
    onSuccess: () => {
      router.back();
    },
  });

  const updateQuestion = useUpdateQuestion();
  //   {
  //   onSuccess: () => {
  //     toast({
  //       title: "Success",
  //       description: "Question updated successfully",
  //     });
  //     router.back();
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: "Error",
  //       description: `Failed to update question: ${error.message}`,
  //       variant: "destructive",
  //     });
  //   },
  // }

  const form = useForm({
    defaultValues: {
      id: uuidv4(),
      category: "",
      question: "",
      inputType: "text" as InputType,
      required: false,
      description: "",
      options: [],
      experience: 10,
      min_value: "",
      max_value: "",
      step_value: "",
      imageUrl: "",
      imagePreview: null,
    },
    resolver: zodResolver(questionSchema),
  });

  const { control, setValue, getValues } = form;
  const inputType = useWatch({ control, name: "inputType" });
  const options = useWatch({ control, name: "options" }) || [];
  const imageUrl = useWatch({ control, name: "imageUrl" });

  useEffect(() => {
    if (questionData) {
      const question = questionData;
      form.reset({
        ...question,
        category: question.category_id,
        inputType: question.input_type as InputType,
        imageUrl: question.image_url || "",
        options: question.question_options || [],
        min_value:
          question.input_type === "slider" || question.input_type === "number"
            ? question.min_value?.toString()
            : "",
        max_value:
          question.input_type === "slider" || question.input_type === "number"
            ? question.max_value?.toString()
            : "",
        step_value:
          question.input_type === "slider"
            ? question.step_value?.toString()
            : "",
      });
    }
  }, [questionData, form]);

  const handleAddOption = () => {
    const currentOptions = getValues("options") || [];
    setValue("options", [
      ...currentOptions,
      { id: uuidv4(), label: "", value: "" },
    ]);
  };

  const handleRemoveOption = (id: string) => {
    const currentOptions = getValues("options") || [];
    setValue(
      "options",
      currentOptions.filter((option) => option.id !== id)
    );
  };

  const handleOptionChange = (
    id: string,
    field: "label" | "value",
    value: string
  ) => {
    const currentOptions = getValues("options") || [];
    setValue(
      "options",
      currentOptions.map((option) =>
        option.id === id ? { ...option, [field]: value } : option
      )
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setValue("imageUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setValue("imageUrl", "");
  };

  const handleSubmit = async (values: any) => {
    const formData = { ...values };

    const questionData = {
      category_id: formData.category,
      question: formData.question,
      input_type: formData.inputType,
      required: formData.required,
      description: formData.description || null,
      experience: formData.experience ? Number(formData.experience) : null,
      min_value:
        formData.inputType === "slider" || formData.inputType === "number"
          ? Number(formData.min_value)
          : null,
      max_value:
        formData.inputType === "slider" || formData.inputType === "number"
          ? Number(formData.max_value)
          : null,
      step_value:
        formData.inputType === "slider" ? Number(formData.step_value) : null,
      image_url: formData.imageUrl || null,
    };

    const questionOptions =
      formData.inputType === "multiple"
        ? formData.options.map((opt: any) => ({
            question_id: formData.id,
            label: opt.label,
            value: opt.value,
          }))
        : [];

    if (questionId) {
      updateQuestion.mutate({
        questionId,
        updates: questionData,
        options: {
          questionOptions,
        },
      });
    } else {
      createQuestion.mutate({
        question: {
          id: formData.id,
          ...questionData,
        },
        options: {
          questionOptions,
        },
      });
    }
  };

  if (questionId && questionLoading) {
    return <div>Loading question data...</div>;
  }

  return (
    <FormWrapper
      title={questionId ? "Edit Question" : "Create Question"}
      onSubmit={handleSubmit}
      showBackButton
      onBack={() => router.back()}
      form={form}
    >
      <FormItemWrapper label="Category" name="category">
        <FormSelect
          placeholder="Select a category"
          options={
            categories?.map((cat) => ({
              value: cat.id,
              label: cat.name,
            })) || []
          }
        />
      </FormItemWrapper>

      <FormItemWrapper label="Question" name="question">
        <Input placeholder="Enter your question" />
      </FormItemWrapper>

      <FormItemWrapper label="Description (optional)" name="description">
        <Textarea placeholder="Add additional context or instructions" />
      </FormItemWrapper>

      <FormItemWrapper label="Experience Points" name="experience">
        <Input
          type="number"
          min="1"
          placeholder="Points awarded for answering this question"
        />
      </FormItemWrapper>

      <div className="space-y-3">
        <Label htmlFor="image-upload">Question Image (optional)</Label>
        <div className="grid gap-3">
          {imageUrl ? (
            <div className="relative rounded-md overflow-hidden h-48 bg-muted">
              <Image
                src={imageUrl}
                alt="Question image"
                fill
                className="object-contain w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={handleRemoveImage}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <ImageIcon className="h-10 w-10 opacity-50" />
              <p className="text-sm">
                Upload an image to display with this question
              </p>
              <div className="mt-2">
                <Label
                  htmlFor="image-upload"
                  className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm cursor-pointer flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Choose Image
                </Label>
              </div>
            </div>
          )}
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      <FormItemWrapper label="Input Type" name="inputType">
        <FormSelect
          placeholder="Select input type"
          options={inputTypeOptions}
        />
      </FormItemWrapper>

      <div className="flex items-center space-x-2 py-2">
        <FormItemWrapper name="required">
          {(field) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              id="required"
            />
          )}
        </FormItemWrapper>
        <Label htmlFor="required">Required field</Label>
      </div>

      {(inputType === "number" || inputType === "slider") && (
        <div className="grid grid-cols-2 gap-4">
          <FormItemWrapper label="Minimum Value" name="min_value">
            <Input type="number" placeholder="Min value" />
          </FormItemWrapper>
          <FormItemWrapper label="Maximum Value" name="max_value">
            <Input type="number" placeholder="Max value" />
          </FormItemWrapper>
          {inputType === "slider" && (
            <FormItemWrapper label="Step" name="step_value">
              <Input type="number" placeholder="Step value" />
            </FormItemWrapper>
          )}
        </div>
      )}

      {inputType === "multiple" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Options</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>

          {options.map((option, index) => (
            <div key={option.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <Input
                  placeholder="Option label"
                  value={option.label}
                  onChange={(e) =>
                    handleOptionChange(option.id, "label", e.target.value)
                  }
                  className="mb-2"
                />
                <Input
                  placeholder="Option value"
                  value={option.value}
                  onChange={(e) =>
                    handleOptionChange(option.id, "value", e.target.value)
                  }
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(option.id)}
                className="mt-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {options.length === 0 && (
            <div className="text-sm text-muted-foreground py-4 text-center border rounded-md">
              No options added yet. Click "Add Option" to create options.
            </div>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="mt-4"
        disabled={createQuestion.isPending || updateQuestion.isPending}
      >
        {createQuestion.isPending || updateQuestion.isPending
          ? "Saving..."
          : questionId
            ? "Update Question"
            : "Create Question"}
      </Button>
    </FormWrapper>
  );
}

// Add this after your other useEffect
