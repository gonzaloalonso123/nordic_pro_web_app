"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import React, { useEffect } from "react";

export const FormItemWrapper = ({
  name,
  children,
  description,
  label,
}: {
  name: string;
  children: React.ReactNode | ((field: any) => React.ReactNode);
  description?: string;
  label?: string;
}) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {typeof children === "function"
              ? children(field)
              : React.cloneElement(children as React.ReactElement, {
                  ...field,
                })}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
