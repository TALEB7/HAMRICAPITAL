import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { PageHeader } from "@/components/PageHeader";
import { ServiceRequestForm } from "@/components/forms/ServiceRequestForm";
import { divisions, getDivision } from "@/content/divisions";

/** Forme du contenu d'un pilier dans messages/<lang>/divisions.json. */
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

  // Le contenu détaillé n'est pas traduit dans toutes les langues : `t.has`
  // évite d'afficher une clé brute là où il manque.
  const sections = t.has(`${division.key}.sections` as never)
    ? (t.raw(`${division.key}.sections` as never) as Section[])
    : [];
  const conclusion = t.has(`${division.key}.conclusion` as never)
    ? t(`${division.key}.conclusion` as never)
    : null;

  // Libellé d'action propre au pilier ; repli sur le libellé générique tant
  // qu'une langue ne l'a pas traduit.
  const ctaKey = `${division.key}.cta`;
  const cta = t.has(ctaKey as never)
    ? t(ctaKey as never)
    : tCommon("requestService");

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
        <div className="container-hc max-w-4xl">
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
                  <div key={item.term} className="border-s border-hairline ps-5">
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
      </section>

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
    </main>
  );
}
