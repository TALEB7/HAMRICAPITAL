"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Limite d'erreur du segment localisé. Une exception de rendu affiche cette
 * page plutôt qu'un écran blanc, et `reset()` permet de retenter sans
 * recharger tout le site.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    // Le detail de l'erreur n'est jamais montré au visiteur : il part dans les
    // journaux du serveur, où l'équipe peut le relier via `digest`.
    console.error("[render]", error);
  }, [error]);

  return (
    <main className="container-hc flex flex-1 flex-col justify-center py-section">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="rule-brand mt-4 font-display text-4xl text-bright md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-8 max-w-xl leading-relaxed text-body">{t("body")}</p>

      <div className="mt-10 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-sm bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-hot"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="rounded-sm border border-hairline px-6 py-3 text-sm font-medium text-bright transition-colors hover:border-bright"
        >
          {t("cta")}
        </Link>
      </div>

      {error.digest && (
        <p className="tabular mt-8 text-xs text-muted/70">ref. {error.digest}</p>
      )}
    </main>
  );
}
