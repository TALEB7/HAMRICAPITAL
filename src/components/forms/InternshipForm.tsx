"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { internshipSchema, type Internship } from "@/lib/forms";
import { useFormPost } from "./useFormPost";
import {
  TextField,
  TextAreaField,
  FileField,
  Honeypot,
  SubmitButton,
  FormMessage,
  FormError,
} from "./fields";

/** Candidature de stage — routée vers le département RH. */
export function InternshipForm() {
  const t = useTranslations("forms");
  const common = useTranslations("common");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Internship>({
    resolver: zodResolver(internshipSchema),
    defaultValues: { kind: "internship" },
  });

  const { status, errorKey, submit } = useFormPost<Internship>("internship");

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
      <TextField
        label={t("labels.phone")}
        type="tel"
        autoComplete="tel"
        error={errors.phone}
        {...register("phone")}
      />
      <TextField
        label={t("labels.school")}
        error={errors.school}
        {...register("school")}
      />
      <div className="sm:col-span-2">
        <TextField
          label={t("labels.field")}
          error={errors.field}
          {...register("field")}
        />
      </div>
      <div className="sm:col-span-2">
        <FileField
          label={t("labels.cv")}
          hint={t("cvHint")}
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          // `setValueAs` extrait le fichier de la FileList : le schéma Zod
          // valide un File, pas la liste renvoyée par le navigateur.
          error={errors.cv}
          {...register("cv", { setValueAs: (v: FileList | File) => (v instanceof FileList ? v[0] : v) })}
        />
      </div>
      <div className="sm:col-span-2">
        <TextAreaField
          label={t("labels.message")}
          optional
          rows={5}
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
