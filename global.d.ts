import type common from "./messages/en/common.json";
import type divisions from "./messages/en/divisions.json";
import type { routing } from "@/i18n/routing";

/**
 * Rend les clés de traduction typées : une clé absente des fichiers anglais
 * devient une erreur TypeScript plutôt qu'un texte manquant en production.
 */
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof common & { divisions: typeof divisions };
  }
}
