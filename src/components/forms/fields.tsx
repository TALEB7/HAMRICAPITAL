"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import type { FieldError } from "react-hook-form";

/**
 * Champs de formulaire partagés par les cinq formulaires du site.
 *
 * Les messages d'erreur remontés par Zod sont des *clés* : ces composants les
 * traduisent dans la langue active. Chaque champ en erreur porte
 * `aria-invalid` et pointe vers son message via `aria-describedby`, pour que
 * l'erreur soit annoncée et pas seulement colorée en rouge.
 */

function useFieldError() {
  const t = useTranslations("forms.errors");
  return (error?: FieldError) => {
    if (!error) return null;
    const key = error.message;
    if (!key) return t("generic");
    // Une clé inconnue (message brut d'un navigateur, par exemple) est
    // affichée telle quelle plutôt que remplacée par un texte générique.
    return t.has(key as never) ? t(key as never) : key;
  };
}

const baseInput =
  "w-full rounded-sm border bg-ink px-4 py-3 text-sm text-bright placeholder:text-muted/60 transition-colors focus:outline-none focus:border-brand";

function Shell({
  id,
  label,
  optional,
  hint,
  message,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  message: string | null;
  children: React.ReactNode;
}) {
  const t = useTranslations("forms");

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted"
      >
        {label}
        {optional && (
          <span className="ms-2 normal-case tracking-normal text-muted/70">
            ({t("optional")})
          </span>
        )}
      </label>
      {children}
      {hint && !message && (
        <p className="mt-2 text-xs text-muted/80">{hint}</p>
      )}
      {message && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-brand-hot">
          {message}
        </p>
      )}
    </div>
  );
}

type BaseProps = {
  label: string;
  error?: FieldError;
  optional?: boolean;
  hint?: string;
};

export function TextField({
  label,
  error,
  optional,
  hint,
  ...input
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const message = useFieldError()(error);

  return (
    <Shell id={id} label={label} optional={optional} hint={hint} message={message}>
      <input
        {...input}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${baseInput} ${error ? "border-brand" : "border-hairline"}`}
      />
    </Shell>
  );
}

export function TextAreaField({
  label,
  error,
  optional,
  hint,
  ...input
}: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const message = useFieldError()(error);

  return (
    <Shell id={id} label={label} optional={optional} hint={hint} message={message}>
      <textarea
        {...input}
        id={id}
        rows={input.rows ?? 6}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${baseInput} resize-y ${error ? "border-brand" : "border-hairline"}`}
      />
    </Shell>
  );
}

export function FileField({
  label,
  error,
  optional,
  hint,
  ...input
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const message = useFieldError()(error);

  return (
    <Shell id={id} label={label} optional={optional} hint={hint} message={message}>
      <input
        {...input}
        type="file"
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${baseInput} py-2.5 file:me-4 file:cursor-pointer file:rounded-sm file:border-0 file:bg-elevated file:px-4 file:py-2 file:text-xs file:font-medium file:uppercase file:tracking-wider file:text-bright ${
          error ? "border-brand" : "border-hairline"
        }`}
      />
    </Shell>
  );
}

/** Champ piège anti-robot : hors écran, jamais atteint au clavier. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
      <label htmlFor="website">Website</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function SubmitButton({
  pending,
  children,
  full,
}: {
  pending: boolean;
  children: React.ReactNode;
  full?: boolean;
}) {
  const t = useTranslations("common");

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-sm bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-hot disabled:cursor-not-allowed disabled:opacity-60 ${
        full ? "w-full" : ""
      }`}
    >
      {pending ? t("sending") : children}
    </button>
  );
}

/**
 * Affiche l'erreur globale renvoyée par le serveur (limite de débit,
 * reCAPTCHA, panne d'envoi). Une clé inconnue retombe sur un message générique
 * plutôt que d'afficher la clé brute au visiteur.
 */
export function FormError({ errorKey }: { errorKey: string }) {
  const t = useTranslations("forms.errors");
  return (
    <FormMessage
      tone="error"
      title={t.has(errorKey as never) ? t(errorKey as never) : t("generic")}
    />
  );
}

export function FormMessage({
  tone,
  title,
  body,
}: {
  tone: "success" | "error";
  title: string;
  body?: string;
}) {
  return (
    <div
      role="status"
      className={`rounded-sm border p-5 ${
        tone === "success"
          ? "border-data/40 bg-data/5"
          : "border-brand/50 bg-brand/5"
      }`}
    >
      <p
        className={`font-display text-lg ${
          tone === "success" ? "text-data" : "text-brand-hot"
        }`}
      >
        {title}
      </p>
      {body && <p className="mt-2 text-sm text-body">{body}</p>}
    </div>
  );
}
