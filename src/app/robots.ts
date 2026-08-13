import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Rien à indexer sur le point d'entrée des formulaires.
      disallow: "/api/",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
