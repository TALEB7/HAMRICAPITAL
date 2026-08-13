import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { PageHeader } from "@/components/PageHeader";
import { ServiceRequestForm } from "@/components/forms/ServiceRequestForm";
import { divisions, getDivision } from "@/content/divisions";
import { usefulLinks } from "@/content/site";

/** Forme du contenu d'une division dans messages/<lang>/divisions.json. */
type Section = {
  heading: string;
  intro?: string;
  items: { term: string; text: string }[];
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    divisions.map((d) => ({ locale, slug: d.slug })),
  );
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const division = getDivision(slug);
  if (!division) return {};

  const t = await getTranslations({ locale, namespace: "divisions" });
  return {
    title: t(`${division.key}.title` as never),
    description: t(`${division.key}.tagline` as never),
    alternates: alternatesFor(locale, `/services/${slug}`),
  };
}

export default async function DivisionPage(props: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);

  const division = getDivision(slug);
  if (!division) notFound();

  const t = await getTranslations("divisions");
  const tServices = await getTranslations("services");
  const tCommon = await getTranslations("common");

  const title = t(`${division.key}.title` as never);
  const summary = t(`${division.key}.summary` as never);

  // Libellé d'action propre à la division ; repli sur le libellé générique
  // tant qu'une langue ne l'a pas traduit.
  const ctaKey = `${division.key}.cta`;
  const cta = t.has(ctaKey as never)
    ? t(ctaKey as never)
    : tCommon("requestService");

  // Les sections détaillées ne sont pas encore traduites dans toutes les
  // langues : `t.has` évite d'afficher une clé brute si elles manquent.
  const hasSections = t.has(`${division.key}.sections` as never);
  const sections = hasSections
    ? (t.raw(`${division.key}.sections` as never) as Section[])
    : [];
  const conclusion = t.has(`${division.key}.conclusion` as never)
    ? t(`${division.key}.conclusion` as never)
    : null;

  const editorial = division.kind === "editorial";
  // Pour les pages pédagogiques, on renvoie vers les plateformes du footer
  // plutôt que vers un formulaire.
  const related = editorial
    ? usefulLinks.filter((l) =>
        slug === "stock-market" ? l.group === "exchanges" : l.group === "trading",
      )
    : [];

  return (
    <main className="flex-1">
      <PageHeader
        eyebrow={tServices("eyebrow")}
        title={title}
        intro={t(`${division.key}.tagline` as never)}
      >
        <Link
          href="/services"
          className="mt-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-bright"
        >
          <span aria-hidden className="rtl:rotate-180">
            ←
          </span>
          {tCommon("backToServices")}
        </Link>
      </PageHeader>

      <section className="py-section">
        <div className="container-hc grid gap-14 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="eyebrow">{tServices("executiveSummary")}</h2>
            <p className="mt-4 text-lg leading-relaxed text-body">{summary}</p>

            {sections.map((section) => (
              <div key={section.heading} className="mt-14">
                <h2 className="rule-brand font-display text-2xl text-bright">
                  {section.heading}
                </h2>
                {section.intro && (
                  <p className="mt-6 text-body">{section.intro}</p>
                )}
                <dl className="mt-6 space-y-5">
                  {section.items.map((item) => (
                    <div
                      key={item.term}
                      className="border-s border-hairline ps-5"
                    >
                      <dt className="font-medium text-data">{item.term}</dt>
                      <dd className="mt-1.5 leading-relaxed text-muted">
                        {item.text}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}

            {conclusion && (
              <div className="mt-14 border-s-2 border-brand bg-elevated p-6">
                <h2 className="eyebrow">{tServices("conclusion")}</h2>
                <p className="mt-3 leading-relaxed text-body">{conclusion}</p>
              </div>
            )}
          </div>

          {/* Colonne latérale : liens utiles pour les pages pédagogiques. */}
          {editorial && related.length > 0 && (
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="font-display text-lg text-bright">
                {tServices("relatedLinks")}
              </h2>
              <ul className="mt-5 space-y-2.5">
                {related.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted transition-colors hover:text-data"
                    >
                      {link.name} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </section>

      {!editorial && (
        <section
          id="request"
          className="border-t border-hairline bg-surface py-section"
        >
          <div className="container-hc max-w-3xl">
            <h2 className="rule-brand font-display text-3xl text-bright">
              {cta}
            </h2>
            <div className="mt-10">
              <ServiceRequestForm
                divisionSlug={division.slug}
                divisionTitle={title}
                cta={cta}
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
