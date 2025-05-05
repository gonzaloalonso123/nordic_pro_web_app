"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Search, Award } from "lucide-react"
import type { Question } from "../types"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface QuestionListProps {
  questions: Question[]
  categories: string[]
  onDelete: (id: string) => Promise<void>
}

export default function QuestionList({ questions, categories, onDelete }: QuestionListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || question.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getInputTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      text: "Text",
      number: "Number",
      emoji: "Emoji",
      slider: "Slider",
      yesno: "Yes/No",
      multiple: "Multiple Choice",
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Question Bank</h1>
        <Button onClick={() => router.push("/unsupervised-app/admin/organisations/forms/questions/create")}>
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

      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No questions found. Create your first question!</p>
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
                    className="object-cover"
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
                      <DropdownMenuItem onClick={() => router.push(`/unsupervised-app/admin/organisations/forms/questions/edit/${question.id}`)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => onDelete(question.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-base mt-2">{question.question}</CardTitle>
                {question.description && (
                  <CardDescription className="text-xs mt-1">{question.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary">{getInputTypeLabel(question.inputType)}</Badge>
                  {question.required && <Badge variant="outline">Required</Badge>}
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
                  onClick={() => router.push(`/unsupervised-app/admin/organisations/forms/questions/edit/${question.id}`)}
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
  )
}
