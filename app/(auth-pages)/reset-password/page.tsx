"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { useTransition, useState } from "react";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/utils/supabase/auth-actions";
import { useTranslation } from "react-i18next";

export default function ResetPassword() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const formSchema = z
    .object({
      password: z
        .string()
        .min(6, { message: t("Password must be at least 6 characters") }),
      confirmPassword: z
        .string()
        .min(6, { message: t("Password must be at least 6 characters") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("Passwords do not match"),
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    startTransition(async () => {
      const result = await updatePassword(values.password);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(true);
        form.reset();

        // Redirect to login after successful password reset
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    });
  }

  return (
    <Card className="flex flex-col w-full max-w-xl p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{t("Set a new password")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("Create a new password for your account")}
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>
              {t(
                "Your password has been updated successfully! Redirecting to login page..."
              )}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-2"
          >
            <FormItemWrapper name="password" label={t("New password")}>
              <Input
                type="password"
                placeholder={t("Enter new password")}
                disabled={success}
              />
            </FormItemWrapper>

            <FormItemWrapper
              name="confirmPassword"
              label={t("Confirm new password")}
            >
              <Input
                type="password"
                placeholder={t("Confirm new password")}
                disabled={success}
              />
            </FormItemWrapper>

            <SubmitButton
              disabled={isPending || success}
              loading={isPending}
              className="mt-2"
            >
              {isPending ? t("Updating password...") : t("Update password")}
            </SubmitButton>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <Link className="text-sm text-foreground underline" href="/login">
            {t("Back to sign in")}
          </Link>
        </div>
      </div>
    </Card>
  );
}
