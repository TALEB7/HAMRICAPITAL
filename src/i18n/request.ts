import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import enCommon from "../../messages/en/common.json";
import enDivisions from "../../messages/en/divisions.json";

type Messages = Record<string, unknown>;

/** Assemble les fichiers de traduction d'une langue en un seul objet. */
async function load(locale: string): Promise<Messages> {
  const [common, divisions] = await Promise.all([
    import(`../../messages/${locale}/common.json`),
    import(`../../messages/${locale}/divisions.json`),
  ]);

  return { ...common.default, divisions: divisions.default };
}

const english: Messages = { ...enCommon, divisions: enDivisions };

/**
 * Fusionne les traductions d'une langue par-dessus l'anglais. Une clé pas
 * encore traduite s'affiche en anglais plutôt que de casser la page — ce qui
 * permet de livrer l'arabe et le chinois par vagues sans jamais laisser de
 * texte manquant à l'écran.
 */
function withEnglishFallback(base: Messages, override: Messages): Messages {
  const merged: Messages = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const current = merged[key];
    const bothPlainObjects =
      current !== null &&
      typeof current === "object" &&
      !Array.isArray(current) &&
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value);

    merged[key] = bothPlainObjects
      ? withEnglishFallback(current as Messages, value as Messages)
      : value;
  }

  return merged;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages:
      locale === "en"
        ? english
        : withEnglishFallback(english, await load(locale)),
  };
});
