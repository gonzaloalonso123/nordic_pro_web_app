"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Form, FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodSchema } from "zod";

interface FormWrapperProps {
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  onBack?: () => void;
  className?: string;
  contentClassName?: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  defaultValues?: Record<string, any>;
  formSchema?: ZodSchema<any>;
  onSubmit?: (values: any) => void;
  form?: UseFormReturn<any>;
}

export function FormWrapper({
  title,
  children,
  onClose,
  onBack,
  className,
  contentClassName,
  showBackButton = false,
  showCloseButton = false,
  defaultValues,
  onSubmit,
  formSchema,
  form,
}: FormWrapperProps) {
  const isMobile = useIsMobile();
  const f =
    form ||
    useForm({
      defaultValues,
      resolver: formSchema ? zodResolver(formSchema) : undefined,
    });

  return (
    <div
      className={cn(
        "flex flex-col w-full bg-white rounded-lg overflow-hidden",
        "border shadow-sm",
        isMobile ? "max-w-full" : "max-w-2xl mx-auto",
        className
      )}
    >
      {title && (
        <FormHeader
          title={title}
          onClose={showCloseButton ? onClose : undefined}
          onBack={showBackButton ? onBack : undefined}
        />
      )}
      <div
        className={cn(
          "flex-1 overflow-y-auto p-4 md:p-6",
          "webkit-overflow-scrolling-touch",
          contentClassName
        )}
      >
        <FormProvider {...f}>
          <form
            onSubmit={f.handleSubmit((values) => onSubmit?.(values))}
            className="flex flex-col gap-4 mt-2"
          >
            {children}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

interface FormHeaderProps {
  title: string;
  onClose?: () => void;
  onBack?: () => void;
  actions?: ReactNode;
}

export function FormHeader({
  title,
  onClose,
  onBack,
  actions,
}: FormHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b bg-card sticky top-0 z-10">
      <div className="flex items-center gap-2">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-1 h-8 w-8 md:h-9 md:w-9"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        )}
        <h2 className="text-lg md:text-xl font-semibold truncate">{title}</h2>
      </div>

      <div className="flex items-center gap-2">
        {actions}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 md:h-9 md:w-9"
            aria-label="Close"
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}

interface FormActionsProps {
  children: ReactNode;
  className?: string;
  sticky?: boolean;
}

export function FormActions({
  children,
  className,
  sticky = true,
}: FormActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-3 px-4 py-3 md:px-6 md:py-4 border-t bg-card",
        sticky && "sticky bottom-0 z-10",
        className
      )}
    >
      {children}
    </div>
  );
}

interface FormItemProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  className?: string;
  children: ReactNode;
  description?: string;
  required?: boolean;
}

export function FormItem({
  label,
  htmlFor,
  error,
  className,
  children,
  description,
  required = false,
}: FormItemProps) {
  return (
    <div className={cn("mb-4 md:mb-6", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium mb-1.5 text-foreground"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {description && (
        <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={cn("mb-6 md:mb-8", className)}>
      {title && (
        <h3 className="text-base md:text-lg font-medium mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}
