"use client";

import { signUpAction } from "@/app/actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { useTransition, useEffect, useState } from "react";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function SignUp() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for messages in URL parameters
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      setMessage({ type: "success", text: decodeURIComponent(success) });
    } else if (error) {
      setMessage({ type: "error", text: decodeURIComponent(error) });
    }
  }, [searchParams]);

  const formSchema = z
    .object({
      firstName: z.string().min(2, { message: t("First name is required") }),
      lastName: z.string().min(2, { message: t("Last name is required") }),
      email: z
        .string()
        .email({ message: t("Please enter a valid email address") }),
      password: z
        .string()
        .min(6, { message: t("Password must be at least 6 characters") }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("Passwords don't match"),
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      signUpAction(values);
    });
  }

  return (
    <Card className="flex flex-col w-full max-w-xl p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{t("Sign up")}</h1>
        <AlreadyHaveAccount />

        {message && <StatusMessage message={message} />}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-8"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormItemWrapper name="firstName" label={t("First Name")}>
                <Input placeholder={t("John")} />
              </FormItemWrapper>
              <FormItemWrapper name="lastName" label={t("Last Name")}>
                <Input placeholder={t("Doe")} />
              </FormItemWrapper>
            </div>
            <FormItemWrapper name="email" label={t("Email")}>
              <Input placeholder={t("you@example.com")} />
            </FormItemWrapper>
            <FormItemWrapper name="password" label={t("Password")}>
              <Input type="password" placeholder={t("Create a password")} />
            </FormItemWrapper>
            <FormItemWrapper
              name="confirmPassword"
              label={t("Confirm Password")}
            >
              <Input type="password" placeholder={t("Confirm your password")} />
            </FormItemWrapper>
            <SubmitButton
              disabled={isPending}
              loading={isPending}
              className="mt-2"
            >
              {isPending ? t("Creating account...") : t("Create account")}
            </SubmitButton>
          </form>
        </Form>
      </div>
    </Card>
  );
}

type MessageProps = {
  type: "success" | "error";
  text: string;
};

const StatusMessage = ({ message }: { message: MessageProps }) => {
  return (
    <Alert
      className={
        message.type === "success"
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-800"
      }
    >
      {message.type === "success" ? (
        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
      ) : (
        <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
      )}
      <AlertDescription>{message.text}</AlertDescription>
    </Alert>
  );
};

const AlreadyHaveAccount = () => {
  const { t } = useTranslation();
  return (
    <p className="text-sm text-foreground">
      {t("Already have an account")}?{" "}
      <Link className="text-foreground font-medium underline" href="/sign-in">
        {t("Sign in")}
      </Link>
    </p>
  );
};
