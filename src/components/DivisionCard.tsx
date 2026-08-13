import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Division } from "@/content/divisions";

/** Carte d'un pilier de service : titre, accroche et lien vers la sous-page. */
export function DivisionCard({ division }: { division: Division }) {
  const t = useTranslations("divisions");
  const common = useTranslations("common");

  // Chaque pilier a son propre libellé d'action (« Demander un accès aux
  // Hedge Funds » plutôt qu'un générique) ; le libellé commun reste le repli
  // pour une langue où il n'est pas encore traduit.
  const ctaKey = `${division.key}.cta`;
  const cta = t.has(ctaKey as never)
    ? t(ctaKey as never)
    : common("requestService");

  return (
    <Link
      href={`/services/${division.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-hairline bg-elevated p-6 transition-colors hover:border-brand"
    >
      <span
        aria-hidden
        className="absolute inset-y-0 start-0 w-0.5 bg-brand transition-all group-hover:w-1"
      />

      <div>
        <h3 className="font-display text-xl text-bright">
          {t(`${division.key}.title` as never)}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {t(`${division.key}.tagline` as never)}
        </p>
      </div>

      {/* Libellés en bas de casse : les intitulés par pilier sont longs
          (« Demander un accompagnement en Gestion d'Actifs & de Patrimoine »)
          et devenaient illisibles en majuscules espacées sur trois lignes. */}
      <span className="mt-6 inline-flex items-start gap-2 text-sm font-medium text-muted transition-colors group-hover:text-brand-hot">
        {cta}
        <span aria-hidden className="mt-0.5 shrink-0 rtl:rotate-180">
          →
        </span>
      </span>
    </Link>
  );
}
