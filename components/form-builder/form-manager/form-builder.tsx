"use client";

import { useState, useEffect } from "react";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { FormWrapper } from "@/components/form/form-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, GripVertical, X, Plus, Award } from "lucide-react";
import type { Form, Question } from "../types";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface FormBuilderProps {
  questions: Question[];
  categories: string[];
  initialForm?: Form;
  onSave: (form: Form) => Promise<void>;
}

export default function FormBuilder({
  questions,
  categories,
  initialForm,
  onSave,
}: FormBuilderProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>(
    initialForm?.questions || []
  );
  const [displayMode, setDisplayMode] = useState<"single" | "sequential">(
    initialForm?.displayMode || "sequential"
  );
  const [totalExperience, setTotalExperience] = useState<number>(
    initialForm?.totalExperience || 0
  );

  const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
  });

  const defaultValues = initialForm || {
    id: Math.random().toString(36).substring(2, 15),
    title: "",
    description: "",
    questions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    displayMode: "sequential",
    totalExperience: 0,
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || question.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedQuestionObjects = questions.filter((q) =>
    selectedQuestions.includes(q.id)
  );

  const availableQuestions = filteredQuestions.filter(
    (q) => !selectedQuestions.includes(q.id)
  );

  // Calculate total experience whenever selected questions change
  useEffect(() => {
    const total = selectedQuestionObjects.reduce(
      (sum, q) => sum + q.experience,
      0
    );
    setTotalExperience(total);
  }, [selectedQuestionObjects]);

  const handleAddQuestion = (questionId: string) => {
    setSelectedQuestions([...selectedQuestions, questionId]);
  };

  const handleRemoveQuestion = (questionId: string) => {
    setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
  };

  const handleMoveQuestion = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= selectedQuestions.length) return;

    const newOrder = [...selectedQuestions];
    const [removed] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, removed);

    setSelectedQuestions(newOrder);
  };

  const handleSubmit = async (values: any) => {
    const formData: Form = {
      ...values,
      id: initialForm?.id || Math.random().toString(36).substring(2, 15),
      questions: selectedQuestions,
      createdAt: initialForm?.createdAt || new Date(),
      updatedAt: new Date(),
      displayMode,
      totalExperience,
    };

    await onSave(formData);
    router.push("/unsupervised-app/admin/organisations/forms/forms");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <FormWrapper
          title={initialForm ? "Edit Form" : "Create Form"}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          formSchema={formSchema}
          showBackButton
          onBack={() => router.back()}
        >
          <FormItemWrapper label="Form Title" name="title">
            <Input placeholder="Enter form title" />
          </FormItemWrapper>

          <FormItemWrapper label="Description (optional)" name="description">
            <Textarea placeholder="Add form description or instructions" />
          </FormItemWrapper>

          <div className="space-y-3 mt-4">
            <Label>Display Mode</Label>
            <RadioGroup
              value={displayMode}
              onValueChange={(value) =>
                setDisplayMode(value as "single" | "sequential")
              }
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="display-single" />
                <Label htmlFor="display-single">
                  Single Page (All questions on one screen)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sequential" id="display-sequential" />
                <Label htmlFor="display-sequential">
                  Sequential (One question at a time)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <h3 className="text-lg font-medium">Selected Questions</h3>
            <div className="ml-auto flex items-center text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              <Award className="h-4 w-4 mr-1.5" />
              <span>Total: {totalExperience} XP</span>
            </div>
          </div>

          {selectedQuestionObjects.length === 0 ? (
            <div className="text-center py-8 border rounded-lg mt-4">
              <p className="text-muted-foreground">
                No questions selected. Add questions from the panel on the
                right.
              </p>
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              {selectedQuestionObjects.map((question, index) => (
                <Card key={question.id} className="relative">
                  <div className="absolute left-2 top-0 bottom-0 flex items-center cursor-move opacity-50 hover:opacity-100">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <CardHeader className="pl-10 pb-2 pr-10 flex flex-row gap-4">
                    {question.imageUrl && (
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={question.imageUrl || "/placeholder.svg"}
                          alt={question.question}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline">{question.category}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveQuestion(question.id)}
                          className="h-6 w-6 absolute right-2 top-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle className="text-base mt-1">
                        {question.question}
                      </CardTitle>
                      {question.description && (
                        <CardDescription className="text-xs">
                          {question.description}
                        </CardDescription>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3 pl-10">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary">
                        {question.inputType.charAt(0).toUpperCase() +
                          question.inputType.slice(1)}
                      </Badge>
                      {question.required && (
                        <Badge variant="outline">Required</Badge>
                      )}
                      <Badge variant="outline" className="bg-amber-50">
                        <Award className="h-3.5 w-3.5 mr-1 text-amber-500" />
                        {question.experience} XP
                      </Badge>
                    </div>
                  </CardContent>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 hover:opacity-100">
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveQuestion(index, index - 1)}
                        className="h-6 w-6"
                      >
                        <span className="sr-only">Move up</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-chevron-up"
                        >
                          <path d="m18 15-6-6-6 6" />
                        </svg>
                      </Button>
                    )}
                    {index < selectedQuestionObjects.length - 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveQuestion(index, index + 1)}
                        className="h-6 w-6"
                      >
                        <span className="sr-only">Move down</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-chevron-down"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Button type="submit" className="mt-6">
            {initialForm ? "Update Form" : "Create Form"}
          </Button>
        </FormWrapper>
      </div>

      <div className="md:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Question Bank</CardTitle>
            <CardDescription>Add questions to your form</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="max-h-[500px] overflow-y-auto border rounded-md">
              {availableQuestions.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">
                    No questions available
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {availableQuestions.map((question) => (
                    <div
                      key={question.id}
                      className="p-3 hover:bg-muted/50 flex items-start gap-3"
                    >
                      {question.imageUrl && (
                        <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={question.imageUrl || "/placeholder.svg"}
                            alt={question.question}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div>
                          <p className="font-medium text-sm">
                            {question.question}
                          </p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {question.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {question.inputType}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs bg-amber-50"
                            >
                              <Award className="h-3 w-3 mr-1 text-amber-500" />
                              {question.experience} XP
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAddQuestion(question.id)}
                        className="h-6 w-6 flex-shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
