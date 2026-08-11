import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Redirige vers la langue du navigateur (repli anglais) et préfixe toutes
 * les URLs par la langue active. Convention `proxy` de Next.js 16.
 */
export default createMiddleware(routing);

export const config = {
  // Tout sauf les routes d'API, les internes Next et les fichiers statiques.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
