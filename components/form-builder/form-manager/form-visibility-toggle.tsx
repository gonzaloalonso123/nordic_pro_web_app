"use client";

import { useFormContext } from "react-hook-form";
import type { LucideIcon } from "lucide-react";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { VisibilityToggle } from "./visibility-toggle";

interface FormVisibilityToggleProps {
  name: string;
  icon: LucideIcon;
  label: string;
}

export function FormVisibilityToggle({
  name,
  icon,
  label,
}: FormVisibilityToggleProps) {
  const { setValue, watch } = useFormContext();
  const value = watch(name) ?? true;

  return (
    <FormItemWrapper name={name}>
      <VisibilityToggle
        icon={icon}
        label={label}
        checked={value}
        onCheckedChange={(checked) =>
          setValue(name, checked, { shouldValidate: true })
        }
      />
    </FormItemWrapper>
  );
}
