"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import * as z from "zod";
import { useTransition, useState } from "react";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { useRouter } from "next/navigation";
import { signIn, signInWithPhone } from "@/utils/supabase/auth-actions";
import { useTranslation } from "react-i18next";
import { FormWrapper } from "@/components/form/form-wrapper";
import { Disclaimer } from "@/components/disclaimer";
import { Content } from "@/components/content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone } from "lucide-react";

export default function Login() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const router = useRouter();

  const emailFormSchema = z.object({
    email: z
      .string()
      .email({ message: t("Please enter a valid email address") }),
    password: z.string().min(1, { message: t("Password is required") }),
  });

  const phoneFormSchema = z.object({
    phone: z
      .string()
      .min(10, { message: t("Please enter a valid phone number") })
      .regex(/^\+?[\d\s\-$$$$]+$/, {
        message: t("Invalid phone number format"),
      }),
    password: z.string().min(1, { message: t("Password is required") }),
  });

  const formSchema = authMethod === "email" ? emailFormSchema : phoneFormSchema;

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    startTransition(async () => {
      let result;

      if (authMethod === "email") {
        const emailValues = values as z.infer<typeof emailFormSchema>;
        result = await signIn(emailValues.email, emailValues.password);
      } else {
        const phoneValues = values as z.infer<typeof phoneFormSchema>;
        result = await signInWithPhone(phoneValues.phone, phoneValues.password);
      }

      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        router.push("/");
      }
    });
  }

  const getDefaultValues = () => {
    if (authMethod === "email") {
      return { email: "", password: "" };
    } else {
      return { phone: "", password: "" };
    }
  };

  return (
    <Content>
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{t("Sign In")}</h1>
          <p className="text-muted-foreground">{t("Welcome back")}</p>
        </div>

        <Tabs
          value={authMethod}
          onValueChange={(value) => setAuthMethod(value as "email" | "phone")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {t("Email")}
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {t("Phone")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={authMethod} className="space-y-4">
            <FormWrapper
              key={authMethod}
              defaultValues={getDefaultValues()}
              formSchema={formSchema}
              onSubmit={onSubmit}
              title={t("Sign in")}
            >
              <DontHaveAccount />

              {error && (
                <Disclaimer
                  variant="error"
                  title={t("Sign in failed!")}
                  description={error}
                  className="mt-4"
                />
              )}

              {authMethod === "email" ? (
                <FormItemWrapper name="email" label={t("Email")}>
                  <Input type="email" placeholder={t("you@example.com")} />
                </FormItemWrapper>
              ) : (
                <FormItemWrapper name="phone" label={t("Phone number")}>
                  <Input type="tel" placeholder={t("+1 (555) 123-4567")} />
                </FormItemWrapper>
              )}

              <FormItemWrapper name="password" label={t("Password")}>
                <Input type="password" placeholder={t("Enter your password")} />
              </FormItemWrapper>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  {t("Forgot password?")}
                </Link>
              </div>

              <SubmitButton
                disabled={isPending}
                loading={isPending}
                className="mt-2"
              >
                {isPending ? t("Signing in...") : t("Sign in")}
              </SubmitButton>
            </FormWrapper>
          </TabsContent>
        </Tabs>
      </div>
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
