import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Division } from "@/content/divisions";

/**
 * Carte de division : titre, accroche, et lien vers la sous-page.
 *
 * Les divisions éditoriales (Forex, Crypto, Marchés boursiers) sont signalées
 * par un liseré or plutôt que rouge, pour que la différence entre « service à
 * la demande » et « contenu pédagogique » se lise avant même le clic.
 */
export function DivisionCard({ division }: { division: Division }) {
  const t = useTranslations("divisions");
  const common = useTranslations("common");
  const editorial = division.kind === "editorial";

  // Chaque division a son propre libellé d'action (« Demander un accès aux
  // Hedge Funds » plutôt qu'un générique) ; le libellé commun reste le repli
  // pour une langue où il n'est pas encore traduit.
  const ctaKey = `${division.key}.cta`;
  const divisionCta = t.has(ctaKey as never)
    ? t(ctaKey as never)
    : common("requestService");

  return (
    <Link
      href={`/services/${division.slug}`}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-sm border border-hairline bg-elevated p-6 transition-colors hover:border-brand ${
        editorial ? "hover:border-data" : ""
      }`}
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 start-0 w-0.5 transition-all group-hover:w-1 ${
          editorial ? "bg-data" : "bg-brand"
        }`}
      />

      <div>
        <h3 className="font-display text-xl text-bright">
          {t(`${division.key}.title` as never)}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {t(`${division.key}.tagline` as never)}
        </p>
      </div>

      <span
        className={`mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest transition-colors ${
          editorial
            ? "text-muted group-hover:text-data"
            : "text-muted group-hover:text-brand-hot"
        }`}
      >
        {editorial ? common("learnMore") : divisionCta}
        <span aria-hidden className="rtl:rotate-180">
          →
        </span>
      </span>
    </Link>
  );
}
