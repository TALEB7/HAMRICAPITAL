import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";

/**
 * Verrou de marque : le bateau rouge + le lettrage « HamriCapital ».
 *
 * Le lettrage est composé en Playfair plutôt qu'importé en image, pour rester
 * net à toute taille, lisible par les moteurs de recherche et cohérent avec les
 * titres du site. Le bateau, lui, est l'asset fourni par le client.
 */
export function Logo({
  size = "default",
  showTagline = true,
}: {
  size?: "default" | "large";
  showTagline?: boolean;
}) {
  const boat = size === "large" ? 72 : 40;

  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
      aria-label={`${site.name} — ${site.tagline}`}
    >
      <Image
        src={site.logo}
        alt=""
        width={boat}
        height={boat}
        priority
        className="h-auto w-auto transition-transform duration-500 group-hover:-translate-y-0.5"
        style={{ width: boat, height: "auto" }}
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-bold tracking-tight text-bright ${
            size === "large" ? "text-3xl" : "text-xl"
          }`}
        >
          Hamri<span className="text-brand">Capital</span>
        </span>
        {showTagline && (
          <span className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-muted">
            Investment Management Company
          </span>
        )}
      </span>
    </Link>
  );
}
