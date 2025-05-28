"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateFormProgram } from "@/hooks/queries/useFormPrograms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormWrapper } from "@/components/form/form-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import type { TablesInsert } from "@/types/database.types";
import { FormSelect } from "../form/form-select";
import { FormItemWrapper } from "../form/form-item-wrapper";
import { Content } from "../content";
import { useCategories } from "@/hooks/queries";

type FormProgramInsert = TablesInsert<"form_program">;

export default function CreateFormProgram() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormProgramInsert>({
    name: "",
    description: "",
    category_id: null,
  });

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const createProgram = useCreateFormProgram({
    onSuccess: () => {
      router.push("/app/admin/programs");
      router.refresh();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProgram.mutateAsync(formData);
  };

  return (
    <Content>
      <FormWrapper title="Create New Form Program" onSubmit={handleSubmit}>
        <FormItemWrapper label="Name" name="name">
          <Input />
        </FormItemWrapper>
        <FormItemWrapper label="Description" name="description">
          <Textarea rows={4} />
        </FormItemWrapper>
        <FormItemWrapper label="Category" name="category">
          <FormSelect
            placeholder="Select Category"
            value={formData.category_id || ""}
            options={
              categories?.map((cat) => ({
                label: cat.name,
                value: cat.id,
              })) || []
            }
            onChange={(value) =>
              setFormData({ ...formData, category_id: value })
            }
          />
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
