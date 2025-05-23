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
import { useTranslation } from "react-i18next";
import { resetPassword } from "@/utils/supabase/auth-actions";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formSchema = z.object({
    email: z
      .string()
      .email({ message: t("Please enter a valid email address") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    startTransition(async () => {
      const result = await resetPassword(values.email);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(true);
        form.reset();
      }
    });
  }

  return (
    <Card className="flex flex-col w-full max-w-xl p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{t("Reset your password")}</h1>
        <p className="text-sm text-muted-foreground">
          {t(
            "Enter your email address and we'll send you a link to reset your password"
          )}
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
                "If an account exists with that email, we've sent a password reset link. Please check your email."
              )}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-2"
          >
            <FormItemWrapper name="email" label={t("Email")}>
              <Input placeholder={t("you@example.com")} disabled={success} />
            </FormItemWrapper>

            <SubmitButton
              disabled={isPending || success}
              loading={isPending}
              className="mt-2"
            >
              {isPending ? t("Sending reset link...") : t("Send reset link")}
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
