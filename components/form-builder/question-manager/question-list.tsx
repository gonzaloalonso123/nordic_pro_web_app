"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  Award,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  useQuestions,
  useCategories,
  useDeleteQuestion,
} from "@/hooks/queries/useQuestions";

export default function QuestionList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const params = useParams();
  const baseUrl = `/app/admin/forms/questions`;

  const {
    data: questionsData,
    isLoading: questionsLoading,
    isError: questionsError,
  } = useQuestions();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const categories = categoriesData?.map((cat) => cat.name) || [];
  const deleteQuestion = useDeleteQuestion();
  // {
  //   onSuccess: () => {
  //     toast({
  //       title: "Success",
  //       description: "Question deleted successfully",
  //     });
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: "Error",
  //       description: `Failed to delete question: ${error.message}`,
  //       variant: "destructive",
  //     });
  //   },
  // }

  const onDelete = (questionId: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteQuestion.mutate(questionId);
    }
  };

  const questions =
    questionsData?.map((q) => ({
      id: q.id,
      question: q.question,
      description: q.description || "",
      category: categories.find((c) => c === q.category_id),
      inputType: q.input_type,
      required: q.required,
      experience: q.experience || 0,
      imageUrl: q.image_url || null,
    })) || [];

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || question.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getInputTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      text: "Text",
      number: "Number",
      emoji: "Emoji",
      slider: "Slider",
      yesno: "Yes/No",
      multiple: "Multiple Choice",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon" aria-label="Back">
            <Link href={`/app/admin/forms`} className="p-3">
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Question Bank</h1>
        </div>
        <Button onClick={() => router.push(`${baseUrl}/create`)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Question
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[180px]">
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
      </div>

      {questionsLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading questions...</span>
        </div>
      ) : questionsError ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-red-500">
            Error loading questions. Please try again.
          </p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">
            No questions found. Create your first question!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="overflow-hidden">
              {question.imageUrl && (
                <div className="relative w-full h-32">
                  <Image
                    src={question.imageUrl || "/placeholder.svg"}
                    alt={question.question}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline">{question.category}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`${baseUrl}/edit/${question.id}`)
                        }
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(question.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-base mt-2">
                  {question.question}
                </CardTitle>
                {question.description && (
                  <CardDescription className="text-xs mt-1">
                    {question.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary">
                    {getInputTypeLabel(question.inputType)}
                  </Badge>
                  {question.required && (
                    <Badge variant="outline">Required</Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Award className="h-4 w-4 mr-1.5 text-amber-500" />
                  <span>{question.experience} XP</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push(`${baseUrl}/edit/${question.id}`)}
                >
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Edit Question
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
