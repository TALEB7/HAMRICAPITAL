import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { divisions } from "@/content/divisions";
import { site } from "@/content/site";

/** Chemins statiques du site, hors sous-pages de division. */
const staticPaths = [
  "",
  "/about",
  "/services",
  "/industries",
  "/community",
  "/careers",
  "/advice",
  "/contact",
  "/resources",
  "/legal",
  "/privacy",
];

/**
 * Sitemap multilingue.
 *
 * Chaque URL déclare ses équivalents dans les autres langues via `alternates`,
 * ce qui produit les balises hreflang attendues et évite que les quatre
 * versions d'une même page soient vues comme du contenu dupliqué.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...divisions.map((d) => `/services/${d.slug}`),
  ];

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${site.url}/${l}${path}`]),
        ),
      },
    })),
  );
}
