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
import {
  Search,
  GripVertical,
  X,
  Plus,
  Award,
  Loader2,
  ChevronUp,
  ChevronDown,
  Trophy,
  Users,
  UserRound,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useQuestions, useCategories } from "@/hooks/queries/useQuestions";
import {
  useForm,
  useCreateForm,
  useUpdateForm,
} from "@/hooks/queries/useForms";
import { useToast } from "@/hooks/use-toast";
import { FormVisibilityToggle } from "./form-visibility-toggle";
import { FormLabel } from "@/components/ui/form";

interface FormBuilderProps {
  formId?: string;
}

export default function FormBuilder({ formId }: FormBuilderProps) {
  const router = useRouter();
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [displayMode, setDisplayMode] = useState<"single" | "sequential">(
    "sequential"
  );
  const [totalExperience, setTotalExperience] = useState<number>(0);

  const { data: questionsData, isLoading: questionsLoading } = useQuestions();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: formData, isLoading: formLoading } = useForm(formId);
  const { toast } = useToast();
  const createForm = useCreateForm({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Form created successfully",
      });
      router.back();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create form: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateForm = useUpdateForm({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Form updated successfully",
      });
      router.back();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update form: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const questions = questionsData || [];

  useEffect(() => {
    if (formData) {
      setSelectedQuestions(formData.question_ids || []);
      setDisplayMode(
        (formData.display_mode as "single" | "sequential") || "sequential"
      );
      setTotalExperience(formData.total_experience || 0);
    }
  }, [formData]);

  const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    visibility: z
      .object({
        coach: z.boolean().default(true),
        parent: z.boolean().default(true),
        team: z.boolean().default(false),
      })
      .default({ coach: true, parent: true, team: true }),
  });

  const defaultValues = {
    id: formData?.id || "",
    title: formData?.title || "",
    description: formData?.description || "",
    visibility: {
      coach: formData?.visibility?.coach ?? true,
      parent: formData?.visibility?.parent ?? true,
      team: formData?.visibility?.team ?? false,
    },
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || question.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedQuestionObjects = questions.filter((q) =>
    selectedQuestions.includes(q.id)
  );

  const availableQuestions = filteredQuestions.filter(
    (q) => !selectedQuestions.includes(q.id)
  );

  useEffect(() => {
    const total = selectedQuestionObjects.reduce(
      (sum, q) => sum + (q.experience || 0),
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
    const formData = {
      title: values.title,
      description: values.description || "",
      question_ids: selectedQuestions,
      display_mode: displayMode,
      total_experience: totalExperience,
      organisation_id: params.organisationId as string,
      visibility: values.visibility,
    };

    if (formId) {
      updateForm.mutate({
        formId,
        updates: formData,
      });
    } else {
      createForm.mutate(formData);
    }
  };

  if (questionsLoading || categoriesLoading || (formId && formLoading)) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <FormWrapper
          title={formId ? "Edit Form" : "Create Form"}
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

          <div className="mt-6">
            <FormLabel>Who can see the form?</FormLabel>
            <div className="space-y-4 py-4">
              <FormVisibilityToggle
                name="visibility.coach"
                icon={UserRound}
                label="Coach"
              />
              <FormVisibilityToggle
                name="visibility.parent"
                icon={Users}
                label="Parent"
              />
              <FormVisibilityToggle
                name="visibility.team"
                icon={Trophy}
                label="Team"
              />
            </div>
          </div>

          <div className="space-y-3 mt-6">
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
                    {question.image_url && (
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={question.image_url || "/placeholder.svg"}
                          alt={question.question}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline">
                          {
                            categories.find(
                              (c) => c.id === question.category_id
                            )?.name
                          }
                        </Badge>
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
                        {question.input_type.charAt(0).toUpperCase() +
                          question.input_type.slice(1)}
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
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                    )}
                    {index < selectedQuestionObjects.length - 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveQuestion(index, index + 1)}
                        className="h-6 w-6"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Button
            type="submit"
            className="mt-6"
            disabled={createForm.isPending || updateForm.isPending}
          >
            {createForm.isPending || updateForm.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {formId ? "Updating..." : "Creating..."}
              </>
            ) : formId ? (
              "Update Form"
            ) : (
              "Create Form"
            )}
          </Button>
        </FormWrapper>
      </div>

      <div className="md:col-span-1">
        <Card className="sticky top-20">
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
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
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
                      {question.image_url && (
                        <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={question.image_url || "/placeholder.svg"}
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
                              {
                                categories.find(
                                  (cat) => cat.id === question.category_id
                                )?.name
                              }
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {question.input_type}
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
