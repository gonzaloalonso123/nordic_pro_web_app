"use client";

import { Content } from "@/components/content";
import CreateFormProgram from "@/components/create-form-program/page";
import { useFormProgram } from "@/hooks/queries/useFormPrograms";
import { useParams } from "next/navigation";

export default function EditFormPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: form } = useFormProgram(id);
  return (
    <Content>
      <CreateFormProgram form={form} />
    </Content>
  );
}
