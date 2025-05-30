"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import * as z from "zod";
import { useTransition, useState } from "react";
import { FormItemWrapper } from "@/components/form/form-item-wrapper";
import { SubmitButton } from "@/components/form/submit-button";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, signUpWithPhone } from "@/utils/supabase/auth-actions";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@/components/ui/date-picker";
import { FormSelect } from "@/components/form/form-select";
import { FormWrapper } from "@/components/form/form-wrapper";
import { Disclaimer } from "@/components/disclaimer";
import { useClientData } from "@/utils/data/client";
import { Content } from "@/components/content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone } from "lucide-react";

export default function Register() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("invitationId");
  const teamCode = searchParams.get("teamCode");
  const acceptInvitation = useClientData().organisationsInvitation.useAccept();
  const acceptQrCodeInvitation =
    useClientData().organisationsInvitation.useAcceptQrType();
  const createCalendar = useClientData().calendars.useCreate();

  const baseSchema = {
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
    password: z
      .string()
      .min(6, { message: t("Password must be at least 6 characters") }),
    confirmPassword: z
      .string()
      .min(6, { message: t("Password must be at least 6 characters") }),
  };

  const emailFormSchema = z
    .object({
      ...baseSchema,
      email: z
        .string()
        .email({ message: t("Please enter a valid email address") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("Passwords do not match"),
      path: ["confirmPassword"],
    });

  const phoneFormSchema = z
    .object({
      ...baseSchema,
      phone: z
        .string()
        .min(10, { message: t("Please enter a valid phone number") })
        .regex(/^\+?[\d\s\-$$$$]+$/, {
          message: t("Invalid phone number format"),
        }),
      email: z
        .string()
        .email({ message: t("Please enter a valid email address") })
        .optional()
        .or(z.literal("")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("Passwords do not match"),
      path: ["confirmPassword"],
    });

  const formSchema = authMethod === "email" ? emailFormSchema : phoneFormSchema;

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    startTransition(async () => {
      let result;

      if (authMethod === "email") {
        if (!values.email) return;

        result = await signUp(values.email!, values.password, {
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender,
          birthDate: values.birthDate,
          address: values.address,
        });
      } else {
        const phoneValues = values as z.infer<typeof phoneFormSchema>;
        result = await signUpWithPhone(phoneValues.phone, values.password, {
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender,
          birthDate: values.birthDate,
          address: values.address,
          email: phoneValues.email || "",
        });
      }
      await createCalendar.mutateAsync({
        user_id: result.user?.id!,
        entity_type: "USER",
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
        if (teamCode) {
          try {
            await acceptQrCodeInvitation.mutateAsync({
              userId: result.user.id,
              teamId: teamCode,
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

  const getDefaultValues = () => {
    const base = {
      firstName: "",
      lastName: "",
      gender: "MAN" as const,
      birthDate: new Date(),
      address: "",
      password: "",
      confirmPassword: "",
    };

    if (authMethod === "email") {
      return { ...base, email: "" };
    } else {
      return { ...base, phone: "", email: "" };
    }
  };

  return (
    <Content>
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{t("Register")}</h1>
          <p className="text-muted-foreground">{t("Create your account")}</p>
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
              title={
                authMethod === "email"
                  ? t("Sign up with email")
                  : t("Sign up with phone")
              }
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
                    authMethod === "email"
                      ? "Please check your email to confirm your account. Redirecting to login page..."
                      : "Please check your phone for verification. Redirecting to login page..."
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
              </div>

              <FormItemWrapper name="address" label={t("Address")}>
                <Input placeholder={t("123 Main St")} />
              </FormItemWrapper>

              {authMethod === "email" ? (
                <FormItemWrapper name="email" label={t("Email")}>
                  <Input type="email" placeholder={t("you@example.com")} />
                </FormItemWrapper>
              ) : (
                <>
                  <FormItemWrapper name="phone" label={t("Phone number")}>
                    <Input type="tel" placeholder={t("+1 (555) 123-4567")} />
                  </FormItemWrapper>
                  <FormItemWrapper name="email" label={t("Email (optional)")}>
                    <Input
                      type="email"
                      placeholder={t("you@example.com (optional)")}
                    />
                  </FormItemWrapper>
                </>
              )}

              <FormItemWrapper name="password" label={t("Password")}>
                <Input type="password" placeholder={t("Create a password")} />
              </FormItemWrapper>

              <FormItemWrapper
                name="confirmPassword"
                label={t("Confirm password")}
              >
                <Input
                  type="password"
                  placeholder={t("Confirm your password")}
                />
              </FormItemWrapper>

              <SubmitButton
                disabled={isPending || success}
                loading={isPending}
                className="mt-2"
              >
                {isPending ? t("Creating account...") : t("Sign up")}
              </SubmitButton>
            </FormWrapper>
          </TabsContent>
        </Tabs>
      </div>
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
