"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { contactSchema, type Contact } from "@/lib/forms";
import { useFormPost } from "./useFormPost";
import {
  TextField,
  TextAreaField,
  Honeypot,
  SubmitButton,
  FormMessage,
  FormError,
} from "./fields";

/** Contact général et réclamations — routé vers le département Legal. */
export function ContactForm() {
  const t = useTranslations("forms");
  const common = useTranslations("common");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Contact>({
    resolver: zodResolver(contactSchema),
    defaultValues: { kind: "contact" },
  });

  const { status, errorKey, submit } = useFormPost<Contact>("contact");

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

      <TextField
        label={t("labels.name")}
        autoComplete="name"
        error={errors.name}
        {...register("name")}
      />
      <TextField
        label={t("labels.email")}
        type="email"
        autoComplete="email"
        error={errors.email}
        {...register("email")}
      />
      <div className="sm:col-span-2">
        <TextField
          label={t("labels.subject")}
          error={errors.subject}
          {...register("subject")}
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
          {common("submit")}
        </SubmitButton>
        <p className="text-xs leading-relaxed text-muted">{t("privacy")}</p>
      </div>
    </form>
  );
}
