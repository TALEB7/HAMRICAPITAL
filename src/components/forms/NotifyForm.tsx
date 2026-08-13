"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { notifySchema, type Notify } from "@/lib/forms";
import { useFormPost } from "./useFormPost";
import {
  TextField,
  Honeypot,
  SubmitButton,
  FormMessage,
  FormError,
} from "./fields";

/**
 * Inscription à l'annonce de lancement de La Communauté (VIP Business Club).
 * Un seul champ, routé vers le CEO.
 */
export function NotifyForm() {
  const t = useTranslations("forms");
  const common = useTranslations("common");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Notify>({
    resolver: zodResolver(notifySchema),
    defaultValues: { kind: "notify" },
  });

  const { status, errorKey, submit } = useFormPost<Notify>("notify");

  if (status === "success") {
    return <FormMessage tone="success" title={t("success.notify")} />;
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => submit(values, setError))}
      className="relative"
    >
      <Honeypot />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <TextField
            label={t("labels.email")}
            type="email"
            autoComplete="email"
            error={errors.email}
            {...register("email")}
          />
        </div>
        {/* Aligné sur le champ, dont le label occupe la première ligne. */}
        <div className="sm:mt-[1.85rem]">
          <SubmitButton pending={status === "pending"}>
            {common("submit")}
          </SubmitButton>
        </div>
      </div>

      {status === "error" && (
        <div className="mt-4">
          <FormError errorKey={errorKey} />
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("privacy")}</p>
    </form>
  );
}
