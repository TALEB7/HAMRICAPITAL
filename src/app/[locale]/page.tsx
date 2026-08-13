import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { HeroVideo } from "@/components/HeroVideo";
import { CeoQuote } from "@/components/CeoQuote";
import { Counter } from "@/components/Counter";
import { DivisionCard } from "@/components/DivisionCard";
import { divisions, flagshipDivisions } from "@/content/divisions";

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  return { alternates: alternatesFor(locale) };
}

export default async function HomePage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tIndustries = await getTranslations("industries");

  const industries = tIndustries.raw("list") as string[];
  const pillars = ["vision", "mission", "partnerships", "commitment"] as const;

  return (
    <main className="flex-1">
      {/* ---------- Hero ---------- */}
      <section className="relative flex min-h-[85vh] items-center">
        <HeroVideo />

        <div className="container-hc relative z-10 py-24">
          <p className="eyebrow">{t("hero.eyebrow")}</p>
          <h1 className="mt-5 max-w-4xl font-display text-4xl leading-[1.08] text-bright sm:text-5xl lg:text-7xl">
            {t("hero.title")}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-body">
            {t("hero.subtitle")}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/services"
              className="rounded-sm bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-hot"
            >
              {t("hero.primaryCta")}
            </Link>
            <Link
              href="/advice"
              className="rounded-sm border border-hairline px-6 py-3 text-sm font-medium text-bright transition-colors hover:border-bright"
            >
              {t("hero.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Positionnement + piliers ---------- */}
      <section className="border-t border-hairline bg-surface py-section">
        <div className="container-hc grid gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow">{t("intro.eyebrow")}</p>
            <h2 className="rule-brand mt-4 text-3xl md:text-4xl">
              {t("intro.title")}
            </h2>
            <p className="mt-8 leading-relaxed text-body">{t("intro.body")}</p>
            <p className="mt-6 font-display text-xl italic text-data">
              {t("intro.discover")}
            </p>
          </div>

          <dl className="grid gap-px overflow-hidden rounded-sm border border-hairline bg-hairline sm:grid-cols-2">
            {pillars.map((key) => (
              <div key={key} className="bg-elevated p-6">
                <dt className="font-display text-lg text-brand-hot">
                  {t(`pillars.${key}.label`)}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">
                  {t(`pillars.${key}.text`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Chiffres clés ---------- */}
      <section className="py-section">
        <div className="container-hc">
          <h2 className="sr-only">{t("stats.title")}</h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <Counter value={divisions.length} label={t("stats.divisions")} />
            <Counter value={industries.length} label={t("stats.industries")} />
            {/* Canada, États-Unis, Maroc — cf. « Our Partnerships » du dossier. */}
            <Counter value={3} label={t("stats.countries")} />
            <Counter value={4} label={t("stats.values")} />
          </div>
        </div>
      </section>

      {/* ---------- Citation du CEO ---------- */}
      <section className="border-y border-hairline bg-surface py-section">
        <CeoQuote />
      </section>

      {/* ---------- Divisions phares ---------- */}
      <section className="py-section">
        <div className="container-hc">
          <p className="eyebrow">{t("divisionsSection.eyebrow")}</p>
          <h2 className="rule-brand mt-4 text-3xl md:text-4xl">
            {t("divisionsSection.title")}
          </h2>
          <p className="mt-6 max-w-2xl text-body">
            {t("divisionsSection.body")}
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {flagshipDivisions.map((d) => (
              <DivisionCard key={d.slug} division={d} />
            ))}
          </div>

          <Link
            href="/services"
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-brand-hot transition-colors hover:text-bright"
          >
            {t("divisionsSection.viewAll")}
            <span aria-hidden className="rtl:rotate-180">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* ---------- Industries ---------- */}
      <section className="border-t border-hairline bg-surface py-section">
        <div className="container-hc">
          <p className="eyebrow">{t("industriesSection.eyebrow")}</p>
          <h2 className="rule-brand mt-4 text-3xl md:text-4xl">
            {t("industriesSection.title")}
          </h2>
          <p className="mt-6 max-w-2xl text-body">
            {t("industriesSection.body")}
          </p>

          <ul className="mt-10 flex flex-wrap gap-2.5">
            {industries.map((industry) => (
              <li
                key={industry}
                className="rounded-sm border border-hairline px-3 py-1.5 text-sm text-muted"
              >
                {industry}
              </li>
            ))}
          </ul>

          <Link
            href="/industries"
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-data transition-colors hover:text-bright"
          >
            {t("industriesSection.viewAll")}
            <span aria-hidden className="rtl:rotate-180">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* ---------- Appel à l'action ---------- */}
      <section className="py-section">
        <div className="container-hc flex flex-col items-start gap-6 rounded-sm border border-hairline bg-elevated p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl text-bright md:text-3xl">
              {t("cta.title")}
            </h2>
            <p className="mt-3 text-muted">{t("cta.body")}</p>
          </div>
          <Link
            href="/advice"
            className="shrink-0 rounded-sm bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-hot"
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>
    </main>
  );
}
