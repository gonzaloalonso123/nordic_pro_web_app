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
import { useRouter } from "next/navigation";
import { updatePassword } from "@/utils/supabase/auth-actions";
import { useTranslation } from "react-i18next";
import { FormWrapper } from "@/components/form/form-wrapper";
import { Disclaimer } from "@/components/disclaimer";

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
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    });
  }

  return (
    <FormWrapper title={t("Reset Password")} onSubmit={onSubmit}>
      <p className="text-sm text-muted-foreground">
        {t("Create a new password for your account")}
      </p>

      {error && (
        <Disclaimer
          variant="error"
          title={t("Password update failed!")}
          description={error}
        />
      )}
      {success && (
        <Disclaimer
          variant="success"
          title={t("Password updated!")}
          description={t(
            "Your password has been updated successfully. You will be redirected to the login page in 3 seconds."
          )}
        />
      )}
      <FormItemWrapper name="password" label={t("New password")}>
        <Input
          type="password"
          placeholder={t("Enter new password")}
          disabled={success}
        />
      </FormItemWrapper>

      <FormItemWrapper name="confirmPassword" label={t("Confirm new password")}>
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

      <div className="mt-4 text-center">
        <Link className="text-sm text-foreground underline" href="/login">
          {t("Back to sign in")}
        </Link>
      </div>
    </FormWrapper>
  );
}
