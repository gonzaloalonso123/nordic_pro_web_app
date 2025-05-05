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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  Eye,
  BarChart,
} from "lucide-react";
import type { Form } from "../types";
import { useRouter } from "next/navigation";

interface FormListProps {
  forms: Form[];
  onDelete: (id: string) => Promise<void>;
}

export default function FormList({ forms, onDelete }: FormListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Forms</h1>
        <Button onClick={() => router.push("/forms/create")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Form
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search forms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      {filteredForms.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">
            No forms found. Create your first form!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredForms.map((form) => (
            <Card key={form.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{form.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {form.questions.length} questions
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/unsupervised-app/admin/organisations/forms/forms/preview/${form.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/forms/analytics/${form.id}`)
                        }
                      >
                        <BarChart className="h-4 w-4 mr-2" />
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push(`/unsupervised-app/admin/organisations/forms/forms/edit/${form.id}`)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(form.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {form.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {form.description}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <p className="text-xs text-muted-foreground">
                  Updated {formatDate(form.updatedAt)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/unsupervised-app/admin/organisations/forms/analytics/${form.id}`)}
                  >
                    <BarChart className="h-3.5 w-3.5 mr-1.5" />
                    Analytics
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/unsupervised-app/admin/organisations/forms/forms/preview/${form.id}`)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    Preview
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
