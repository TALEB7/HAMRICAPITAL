"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import type { UseFormSetError, FieldValues, Path } from "react-hook-form";
import type { FormKind } from "@/lib/forms";
import { getRecaptchaToken } from "./recaptcha";

type Status = "idle" | "pending" | "success" | "error";

/**
 * Envoi partagé par les cinq formulaires.
 *
 * Sérialise les valeurs en `multipart/form-data` (le seul format qui accepte
 * aussi le CV), ajoute le jeton reCAPTCHA et la langue active, puis renvoie
 * les erreurs de validation du serveur sur les champs concernés — de sorte
 * qu'une validation contournée côté client s'affiche quand même correctement.
 */
export function useFormPost<
  TValues extends FieldValues,
  /** Type des valeurs détenues par le formulaire, quand il diffère du type
   *  validé — c'est le cas du CV, `FileList` à la saisie et `File` après
   *  validation. */
  TInput extends FieldValues = TValues,
>(kind: FormKind) {
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<string>("generic");

  async function submit(values: TValues, setError: UseFormSetError<TInput>) {
    setStatus("pending");

    const body = new FormData();
    body.set("kind", kind);
    body.set("locale", locale);

    for (const [key, value] of Object.entries(values)) {
      if (value === undefined || value === null) continue;
      if (value instanceof FileList) {
        if (value[0]) body.set(key, value[0]);
      } else if (value instanceof File) {
        body.set(key, value);
      } else {
        body.set(key, String(value));
      }
    }

    const token = await getRecaptchaToken(kind);
    if (token) body.set("recaptchaToken", token);

    try {
      const response = await fetch("/api/forms", { method: "POST", body });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fields?: Record<string, string>;
      };

      if (response.ok && result.ok) {
        setStatus("success");
        return;
      }

      if (result.fields) {
        for (const [field, message] of Object.entries(result.fields)) {
          setError(field as Path<TInput>, { type: "server", message });
        }
      }

      setErrorKey(result.error ?? "generic");
      setStatus("error");
    } catch {
      setErrorKey("generic");
      setStatus("error");
    }
  }

  return { status, errorKey, submit, reset: () => setStatus("idle") };
}
