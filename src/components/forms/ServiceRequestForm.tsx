"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { serviceRequestSchema, type ServiceRequest } from "@/lib/forms";
import { useFormPost } from "./useFormPost";
import {
  TextField,
  TextAreaField,
  Honeypot,
  SubmitButton,
  FormMessage,
  FormError,
} from "./fields";

/**
 * Formulaire « Demander ce service », un par division.
 *
 * La division n'est pas choisie par le visiteur : elle est pré-remplie depuis
 * la page courante et transmise en champ caché, ce qui évite une erreur de
 * saisie et permet de router l'email vers le bon département.
 */
export function ServiceRequestForm({
  divisionSlug,
  divisionTitle,
}: {
  divisionSlug: string;
  divisionTitle: string;
}) {
  const t = useTranslations("forms");
  const common = useTranslations("common");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ServiceRequest>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: { kind: "service", division: divisionSlug },
  });

  const { status, errorKey, submit } = useFormPost<ServiceRequest>("service");

  if (status === "success") {
    return (
      <FormMessage
        tone="success"
        title={t("success.title")}
        body={t("success.body")}
      />
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => submit(values, setError))}
      className="relative grid gap-5 sm:grid-cols-2"
    >
      <Honeypot />
      <input type="hidden" {...register("division")} />

      <div className="sm:col-span-2">
        <p className="text-xs uppercase tracking-wider text-muted">
          {t("labels.division")}
        </p>
        <p className="mt-1 font-display text-lg text-data">{divisionTitle}</p>
      </div>

      <TextField
        label={t("labels.name")}
        autoComplete="name"
        error={errors.name}
        {...register("name")}
      />
      <TextField
        label={t("labels.company")}
        optional
        autoComplete="organization"
        error={errors.company}
        {...register("company")}
      />
      <TextField
        label={t("labels.email")}
        type="email"
        autoComplete="email"
        error={errors.email}
        {...register("email")}
      />
      <TextField
        label={t("labels.phone")}
        type="tel"
        autoComplete="tel"
        error={errors.phone}
        {...register("phone")}
      />
      <div className="sm:col-span-2">
        <TextField
          label={t("labels.country")}
          autoComplete="country-name"
          error={errors.country}
          {...register("country")}
        />
      </div>
      <div className="sm:col-span-2">
        <TextAreaField
          label={t("labels.message")}
          error={errors.message}
          {...register("message")}
        />
      </div>

      {status === "error" && (
        <div className="sm:col-span-2">
          <FormError errorKey={errorKey} />
        </div>
      )}

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <SubmitButton pending={status === "pending"}>
          {common("requestService")}
        </SubmitButton>
        <p className="text-xs leading-relaxed text-muted">{t("privacy")}</p>
      </div>
    </form>
  );
}
