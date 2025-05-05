"use client";

import { useEffect, useState } from "react";
import FormList from "@/components/form-builder/form-manager/form-list";
import type { Form } from "@/components/form-builder/types";

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    // Load forms from localStorage
    const storedForms = localStorage.getItem("form-builder-forms");
    if (storedForms) {
      const parsedForms = JSON.parse(storedForms);
      // Convert date strings back to Date objects
      const formsWithDates = parsedForms.map((form: any) => ({
        ...form,
        createdAt: new Date(form.createdAt),
        updatedAt: new Date(form.updatedAt),
      }));
      setForms(formsWithDates);
    }
  }, []);

  const handleDeleteForm = async (id: string) => {
    const updatedForms = forms.filter((form) => form.id !== id);
    setForms(updatedForms);
    localStorage.setItem("form-builder-forms", JSON.stringify(updatedForms));
    return Promise.resolve();
  };

  return (
    <div className="container py-8">
      <FormList forms={forms} onDelete={handleDeleteForm} />
    </div>
  );
}
