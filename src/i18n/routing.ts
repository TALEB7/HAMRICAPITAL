import { defineRouting } from "next-intl/routing";

export const locales = ["en", "fr", "ar", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Langues en écriture droite-à-gauche : la mise en page est mise en miroir. */
export const rtlLocales: Locale[] = ["ar"];

export function getDirection(locale: string) {
  return rtlLocales.includes(locale as Locale) ? "rtl" : "ltr";
}

/** Libellés affichés dans le sélecteur de langue, chacun dans sa propre langue. */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
  zh: "中文",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Toutes les langues sont préfixées (/en, /fr, /ar, /zh) : les balises
  // hreflang restent sans ambiguïté et aucune URL n'a deux formes valides.
  localePrefix: "always",
  localeDetection: true,
});
