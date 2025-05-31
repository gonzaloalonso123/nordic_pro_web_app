"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateFormProgram,
  useFormProgram,
} from "@/hooks/queries/useFormPrograms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormWrapper } from "@/components/form/form-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import type { TablesInsert } from "@/types/database.types";
import { useCategories } from "@/hooks/queries";
import { useClientData } from "@/utils/data/client";
import { Check, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Content } from "../content";
import { FormItemWrapper } from "../form/form-item-wrapper";
import { FormSelect } from "../form/form-select";
import { useUrl } from "@/hooks/use-url";
import { Tables } from "@/database.types";
import { C } from "@fullcalendar/core/internal-common";

type FormProgramInsert = TablesInsert<"form_program">;

export default function CreateFormProgram({
  form,
}: {
  form?: Tables<"form_program"> & {
    forms: Tables<"forms">[];
  };
}) {
  const router = useRouter();
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [showFormSelector, setShowFormSelector] = useState(false);
  const path = useUrl();

  useEffect(() => {
    if (form) {
      console.log('form', form);
      setSelectedForms(form.forms_form_programs.map((f) => f.form_id));
    }
  }, [form]);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: forms } = useClientData().forms.useAll();

  const createProgram = useCreateFormProgram({
    onSuccess: () => {
      router.push(`${path}/forms/programs`);
      router.refresh();
    },
  });

  const handleSubmit = async (values: FormProgramInsert) => {
    await createProgram.mutateAsync({
      ...values,
      forms: selectedForms,
    });
  };

  const toggleFormSelection = (formId: string) => {
    if (selectedForms.includes(formId)) {
      setSelectedForms(selectedForms.filter((id) => id !== formId));
    } else {
      setSelectedForms([...selectedForms, formId]);
    }
  };

  return (
    <Content>
      <FormWrapper
        defaultValues={form || {}}
        title="Create New Form Program"
        onSubmit={handleSubmit}
      >
        <FormItemWrapper label="Name" name="name">
          <Input />
        </FormItemWrapper>

        <FormItemWrapper label="Description" name="description">
          <Textarea rows={4} />
        </FormItemWrapper>

        <FormItemWrapper label="Category" name="category_id">
          <FormSelect
            placeholder="Select Category"
            options={
              categories?.map((cat) => ({
                label: cat.name,
                value: cat.id,
              })) || []
            }
          />
        </FormItemWrapper>

        <FormItemWrapper label="Color" name="color">
          <div className="flex items-center gap-3">
            <Input type="color" className="w-16 h-10 p-1 cursor-pointer" />
          </div>
        </FormItemWrapper>

        <FormItemWrapper label="Forms" name="forms">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {selectedForms.length > 0 ? (
                forms
                  ?.filter((form) => selectedForms.includes(form.id))
                  .map((form) => (
                    <Badge
                      key={form.id}
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {form.title}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer"
                        onClick={() => toggleFormSelection(form.id)}
                      />
                    </Badge>
                  ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No forms selected
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowFormSelector(!showFormSelector)}
            >
              <Plus className="w-4 h-4 mr-1" />
              {showFormSelector ? "Hide Form List" : "Add Forms"}
            </Button>

            {showFormSelector && (
              <ScrollArea className="h-60 border rounded-md p-2">
                <div className="space-y-1">
                  {forms?.map((form) => (
                    <div
                      key={form.id}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted ${
                        selectedForms.includes(form.id) ? "bg-muted" : ""
                      }`}
                      onClick={() => toggleFormSelection(form.id)}
                    >
                      <span>{form.title}</span>
                      {selectedForms.includes(form.id) && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </FormItemWrapper>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <SubmitButton loading={createProgram.isPending}>
            Create Program
          </SubmitButton>
        </div>
      </FormWrapper>
    </Content>
  );
}
