import { routing, type Locale } from "@/i18n/routing";

/**
 * Construit `canonical` et les `hreflang` d'une page.
 *
 * À déclarer sur chaque page : posé une seule fois dans le layout, il ferait
 * pointer les alternatives de toutes les sous-pages vers l'accueil.
 *
 * @param path chemin sans préfixe de langue, ex. "/services/hedge-funds"
 */
export function alternatesFor(locale: Locale, path = "") {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
      "x-default": `/${routing.defaultLocale}${path}`,
    },
  };
}
