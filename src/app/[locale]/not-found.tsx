import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Page 404 à l'intérieur du layout localisé : le visiteur garde le header, le
 * footer et sa langue, au lieu de tomber sur une page nue hors du site.
 */
export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="container-hc flex flex-1 flex-col justify-center py-section">
      <p className="eyebrow tabular">{t("eyebrow")}</p>
      <h1 className="rule-brand mt-4 font-display text-4xl text-bright md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-8 max-w-xl leading-relaxed text-body">{t("body")}</p>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/"
          className="rounded-sm bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-hot"
        >
          {t("cta")}
        </Link>
        <Link
          href="/services"
          className="rounded-sm border border-hairline px-6 py-3 text-sm font-medium text-bright transition-colors hover:border-bright"
        >
          {t("services")}
        </Link>
      </div>
    </main>
  );
}
