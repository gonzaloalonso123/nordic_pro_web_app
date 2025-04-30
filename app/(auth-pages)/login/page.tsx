"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormLabel } from "@/components/ui/form";
import { useTransition, useState } from "react";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { signIn } from "@/utils/supabase/auth-actions";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const formSchema = z.object({
    email: z
      .string()
      .email({ message: t("Please enter a valid email address") }),
    password: z
      .string()
      .min(6, { message: t("Password must be at least 6 characters") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    startTransition(async () => {
      const result = await signIn(values.email, values.password);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    });
  }

  return (
    <Card className="flex flex-col w-full max-w-xl p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{t("Sign in")}</h1>
        <DontHaveAccount />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-2"
          >
            <FormItemWrapper name="email" label={t("Email")}>
              <Input placeholder={t("you@example.com")} />
            </FormItemWrapper>
            <PasswordLabel />
            <FormItemWrapper name="password">
              <Input type="password" placeholder={t("Your password")} />
            </FormItemWrapper>
            <SubmitButton
              disabled={isPending}
              loading={isPending}
              className="mt-2"
            >
              {isPending ? t("Signing in...") : t("Sign in")}
            </SubmitButton>
          </form>
        </Form>
      </div>
    </Card>
  );
}

const DontHaveAccount = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground">
        {t("Don't have an account")}?{" "}
        <Link
          className="text-foreground font-medium underline"
          href="/register"
        >
          {t("Sign up")}
        </Link>
      </p>
    </div>
  );
};

const PasswordLabel = () => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between items-center mt-2">
      <FormLabel>{t("Password")}</FormLabel>
      <Link
        className="text-xs text-foreground underline"
        href="/forgot-password"
      >
        {t("Forgot Password?")}
      </Link>
    </div>
  );
};
