"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTransition, useState } from "react";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp } from "@/utils/supabase/auth-actions";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@/components/ui/date-picker";
import { FormSelect } from "@/components/form/form-select";
import { FormWrapper } from "@/components/form/form-wrapper";
import { Disclaimer } from "@/components/disclaimer";
import { useClientData } from "@/utils/data/client";
import { Content } from "@/components/content";

export default function Register() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("invitationId");
  const acceptInvitation = useClientData().organisationsInvitation.useAccept();
  const formSchema = z
    .object({
      firstName: z
        .string()
        .min(2, { message: t("First name must be at least 2 characters") }),
      lastName: z
        .string()
        .min(2, { message: t("Last name must be at least 2 characters") }),
      gender: z.enum(["MAN", "WOMAN"], {
        required_error: t("Please select a gender"),
      }),
      birthDate: z.date(),
      address: z.string().min(2, {
        message: t("Address must be at least 2 characters"),
      }),
      email: z
        .string()
        .email({ message: t("Please enter a valid email address") }),
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    startTransition(async () => {
      const result = await signUp(values.email, values.password, {
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        birthDate: values.birthDate,
        address: values.address,
      });
      if (result.error) {
        console.log(result);
        setError(result.error);
      } else if (result.user) {
        if (invitationId) {
          try {
            await acceptInvitation.mutateAsync({
              invitationId,
              userId: result.user.id,
            });
          } catch (e) {
            console.log(e);
          }
        }
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    });
  }

  return (
    <Content>
      <FormWrapper
        defaultValues={{
          firstName: "",
          lastName: "",
          email: "",
          gender: "MAN",
          birthDate: new Date(),
          address: "",
          password: "",
          confirmPassword: "",
        }}
        formSchema={formSchema}
        title={t("Register")}
        onSubmit={onSubmit}
      >
        <AlreadyHaveAccount />
        {error && (
          <Disclaimer
            variant="error"
            title={t("Registration failed!")}
            description={error}
            className="mt-4"
          />
        )}

        {success && (
          <Disclaimer
            variant="success"
            title={t("Registration successful!")}
            description={t(
              "Please check your email to confirm your account. Redirecting to login page..."
            )}
            className="mt-4"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItemWrapper name="firstName" label={t("First name")}>
            <Input placeholder={t("John")} />
          </FormItemWrapper>

          <FormItemWrapper name="lastName" label={t("Last name")}>
            <Input placeholder={t("Doe")} />
          </FormItemWrapper>
          <FormItemWrapper name="gender" label={t("Gender")}>
            <FormSelect
              placeholder={t("Select a gender")}
              options={[
                {
                  label: t("Man"),
                  value: "MAN",
                },
                {
                  label: t("Woman"),
                  value: "WOMAN",
                },
              ]}
            />
          </FormItemWrapper>
          <FormItemWrapper name="birthDate" label={t("Birth date")}>
            <DatePicker enableYearNavigation maxDate={new Date()} />
          </FormItemWrapper>
          <FormItemWrapper name="address" label={t("Address")}>
            <Input placeholder={t("123 Main St")} />
          </FormItemWrapper>
        </div>

        <FormItemWrapper name="email" label={t("Email")}>
          <Input placeholder={t("you@example.com")} />
        </FormItemWrapper>

        <FormItemWrapper name="password" label={t("Password")}>
          <Input type="password" placeholder={t("Create a password")} />
        </FormItemWrapper>

        <FormItemWrapper name="confirmPassword" label={t("Confirm password")}>
          <Input type="password" placeholder={t("Confirm your password")} />
        </FormItemWrapper>

        <SubmitButton
          disabled={isPending || success}
          loading={isPending}
          className="mt-2"
        >
          {isPending ? t("Creating account...") : t("Sign up")}
        </SubmitButton>
      </FormWrapper>
    </Content>
  );
}

const AlreadyHaveAccount = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground">
        {t("Already have an account")}?{" "}
        <Link className="text-foreground font-medium underline" href="/login">
          {t("Sign in")}
        </Link>
      </p>
    </div>
  );
};
