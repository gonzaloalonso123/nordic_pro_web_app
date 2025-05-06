"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FormAnalyticsDashboard } from "@/components/form-builder/analytics/form-analytics-dashboard";
import type { Form, Question } from "@/components/form-builder/types";

export default function FormAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Load form and questions from localStorage
    const storedForms = localStorage.getItem("form-builder-forms");
    const storedQuestions = localStorage.getItem("form-builder-questions");

    if (storedForms && storedQuestions) {
      const parsedForms = JSON.parse(storedForms);
      const parsedQuestions = JSON.parse(storedQuestions);

      // Find the form
      const foundForm = parsedForms.find((f: Form) => f.id === formId);
      if (foundForm) {
        // Convert date strings back to Date objects
        setForm({
          ...foundForm,
          createdAt: new Date(foundForm.createdAt),
          updatedAt: new Date(foundForm.updatedAt),
        });

        // Get all questions
        setQuestions(parsedQuestions);
      } else {
        // Form not found, redirect back to forms list
        router.push("/forms");
      }
    }
  }, [formId, router]);

  if (!form) {
    return <div className="container py-8">Loading...</div>;
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

      <FormAnalyticsDashboard form={form} questions={questions} />
    </div>
  );
}
