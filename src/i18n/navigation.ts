import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Remplaçants de next/link et next/navigation qui conservent la langue
 * active. À utiliser partout dans l'application plutôt que les originaux.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
