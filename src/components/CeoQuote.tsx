import Image from "next/image";
import { useTranslations } from "next-intl";
import { site } from "@/content/site";

/**
 * Citation du CEO, accompagnée de son portrait.
 *
 * Utilisée à l'identique sur l'accueil et sur la page À propos : le texte est
 * long, et le dupliquer dans deux mises en page distinctes finissait par les
 * faire diverger.
 *
 * Le portrait est en `figure` avec la citation : il illustre le propos, il ne
 * se lit pas seul. D'où un `alt` qui nomme la personne plutôt que de décrire
 * la scène.
 */
export function CeoQuote() {
  const t = useTranslations("home.quote");

  return (
    <div className="container-hc">
      <p className="eyebrow">{t("eyebrow")}</p>

      <figure className="mt-8 grid gap-10 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-14 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <div className="relative w-full max-w-xs md:max-w-none">
          <Image
            src={site.ceoPhoto}
            alt={`${t("author")}, ${t("role")}`}
            width={596}
            height={745}
            sizes="(min-width: 1024px) 18rem, (min-width: 768px) 15rem, 20rem"
            // Légère désaturation : la photo est prise sous un éclairage
            // chaud, qui jurait avec le noir et le rouge du reste du site.
            className="w-full rounded-sm border border-hairline object-cover saturate-[0.8] contrast-[1.05] brightness-[0.95]"
          />
          {/* Filet rouge, écho de celui des titres de section. */}
          <span
            aria-hidden
            className="absolute -bottom-px start-0 h-0.5 w-16 bg-brand"
          />
        </div>

        <div>
          <blockquote className="font-display text-xl leading-relaxed text-bright md:text-2xl">
            “{t("text")}”
          </blockquote>
          {/* La déclinaison « flotte » porte déjà le slogan et la signature :
              elle remplace donc l'attribution et le slogan composés en texte.
              Son `alt` restitue les deux, faute de quoi l'attribution de la
              citation disparaîtrait pour un lecteur d'écran. */}
          <figcaption className="mt-8">
            <Image
              src={site.fleet}
              alt={`“${site.tagline}” — ${t("author")}, ${t("role")}`}
              width={699}
              height={350}
              sizes="(min-width: 768px) 26rem, 20rem"
              className="h-auto w-full max-w-md"
            />
          </figcaption>
        </div>
      </figure>
    </div>
  );
}
