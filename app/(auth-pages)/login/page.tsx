"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormLabel } from "@/components/ui/form";
import { useTransition, useState, useEffect, use } from "react";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { useRouter } from "next/navigation";
import { signIn } from "@/utils/supabase/auth-actions";
import { useTranslation } from "react-i18next";
import { FormWrapper } from "@/components/form/form-wrapper";
import { Disclaimer } from "@/components/disclaimer";
import { useClientData } from "@/utils/data/client";
import { Content } from "@/components/content";

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
    <Content>
      <FormWrapper title={t("Log in")} onSubmit={onSubmit}>
        <DontHaveAccount />
        {error && (
          <Disclaimer
            variant="error"
            title={t("Login failed!")}
            description={error}
          />
        )}
        <FormItemWrapper name="email" label={t("Email")}>
          <Input placeholder={t("you@example.com")} />
        </FormItemWrapper>
        <FormItemWrapper name="password" label={t("Password")}>
          <Input type="password" placeholder={t("Your password")} />
        </FormItemWrapper>
        <div className="flex justify-between items-center">
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            {t("Forgot Password?")}
          </Link>
          <SubmitButton
            disabled={isPending}
            loading={isPending}
            className="mt-2"
          >
            {isPending ? t("Loging in...") : t("Log in")}
          </SubmitButton>
        </div>
      </FormWrapper>
    </Content>
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
