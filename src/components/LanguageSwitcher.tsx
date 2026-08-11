"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeLabels, type Locale } from "@/i18n/routing";

/**
 * Bascule de langue. Conserve la page courante : passer de /fr/services à
 * l'arabe mène à /ar/services, pas à l'accueil.
 */
export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onChange(next: string) {
    startTransition(() => {
      // `usePathname` de next-intl renvoie le chemin sans préfixe de langue,
      // segments dynamiques déjà résolus : rejouer ce chemin avec une autre
      // langue mène donc à la traduction de la page courante, pas à l'accueil.
      router.replace(pathname, { locale: next as Locale });
    });
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        onChange={(e) => onChange(e.target.value)}
        disabled={isPending}
        className="cursor-pointer appearance-none rounded-sm border border-hairline bg-transparent py-1.5 ps-3 pe-8 text-xs uppercase tracking-widest text-body transition-colors hover:border-brand hover:text-bright focus:border-brand disabled:opacity-50"
      >
        {locales.map((l) => (
          <option key={l} value={l} className="bg-elevated text-body">
            {localeLabels[l]}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute end-3 text-[0.6rem] text-muted"
      >
        ▼
      </span>
    </label>
  );
}
