"use client";

import type React from "react";

import { useEffect } from "react";
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
import type { InputType, Question } from "../types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import EmojiOptionsEditor from "../input-types/emoji-options-editor";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const inputTypeOptions = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "emoji", label: "Emoji" },
  { value: "slider", label: "Slider" },
  { value: "yesno", label: "Yes/No" },
  { value: "multiple", label: "Multiple Choice" },
];

interface QuestionFormProps {
  initialQuestion?: Question;
  categories: string[];
  onSave: (question: Question) => Promise<void>;
}

const questionSchema = z.object({
  id: z.string(),
  category: z.string().min(1, "Category is required"),
  question: z.string().min(1, "Question is required"),
  inputType: z.enum(["text", "number", "emoji", "slider", "yesno", "multiple"]),
  required: z.boolean(),
  description: z.string().optional(),
  experience: z.number().min(1, "Experience points are required"),
  options: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1, "Option label is required"),
        value: z.string().min(1, "Option value is required"),
      })
    )
    .optional(),
  emojiOptions: z.array(z.any()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  imageUrl: z.string().optional(),
  imagePreview: z.string().nullable().optional(),
});

export default function QuestionForm({
  initialQuestion,
  categories,
  onSave,
}: QuestionFormProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      id: initialQuestion?.id || uuidv4(),
      category: initialQuestion?.category || "",
      question: initialQuestion?.question || "",
      inputType: initialQuestion?.inputType || ("text" as InputType),
      required: initialQuestion?.required || false,
      description: initialQuestion?.description || "",
      options: initialQuestion?.options || [],
      emojiOptions: initialQuestion?.emojiOptions || [],
      experience: initialQuestion?.experience || 10,
      min: initialQuestion?.min,
      max: initialQuestion?.max,
      step: initialQuestion?.step,
      imageUrl: initialQuestion?.imageUrl || "",
      imagePreview: initialQuestion?.imageUrl || null,
    },
    resolver: zodResolver(questionSchema),
  });

  const { control, setValue, getValues } = form;
  const inputType = useWatch({ control, name: "inputType" });
  const options = useWatch({ control, name: "options" }) || [];
  const imagePreview = useWatch({ control, name: "imagePreview" });

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
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setValue("imagePreview", result);
        setValue("imageUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setValue("imagePreview", null);
    setValue("imageUrl", "");
  };

  const handleSubmit = async (values: any) => {
    const questionData: Question = {
      ...values,
      // Only include relevant fields based on input type
      options: values.inputType === "multiple" ? values.options : undefined,
      emojiOptions:
        values.inputType === "emoji" ? values.emojiOptions : undefined,
    };

    delete questionData.imageUrl;

    await onSave(questionData);
    router.back();
  };

  useEffect(() => {
    console.log(inputType);
  }, [inputType]);

  return (
    <FormWrapper
      title={initialQuestion ? "Edit Question" : "Create Question"}
      onSubmit={handleSubmit}
      formSchema={questionSchema}
      showBackButton
      onBack={() => router.back()}
      form={form}
    >
      <FormItemWrapper label="Category" name="category">
        <FormSelect
          placeholder="Select a category"
          options={categories.map((cat) => ({ value: cat, label: cat }))}
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
          {imagePreview ? (
            <div className="relative rounded-md overflow-hidden h-48 bg-muted">
              <Image
                src={imagePreview || "/placeholder.svg"}
                alt="Question image"
                fill
                className="object-cover"
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
          <FormItemWrapper label="Minimum Value" name="min">
            <Input type="number" placeholder="Min value" />
          </FormItemWrapper>
          <FormItemWrapper label="Maximum Value" name="max">
            <Input type="number" placeholder="Max value" />
          </FormItemWrapper>
          {inputType === "slider" && (
            <FormItemWrapper label="Step" name="step">
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

      {inputType === "emoji" && (
        <div className="space-y-4 mt-4">
          <EmojiOptionsEditor
            options={getValues("emojiOptions") || []}
            onChange={(newOptions) => setValue("emojiOptions", newOptions)}
          />
        </div>
      )}

      <Button type="submit" className="mt-4">
        {initialQuestion ? "Update Question" : "Create Question"}
      </Button>
    </FormWrapper>
  );
}
