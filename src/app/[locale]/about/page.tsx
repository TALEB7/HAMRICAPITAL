import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/content/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/about"),
  };
}

const values = ["clientService", "excellence", "integrity", "teamwork"] as const;
const pillars = ["vision", "mission", "partnerships", "commitment"] as const;

export default async function AboutPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const tHome = await getTranslations("home");

  return (
    <main className="flex-1">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
      />

      {/* Vision, mission, partenariats, engagement */}
      <section className="py-section">
        <div className="container-hc grid gap-px overflow-hidden rounded-sm border border-hairline bg-hairline md:grid-cols-2">
          {pillars.map((key) => (
            <div key={key} className="bg-elevated p-8">
              <h2 className="font-display text-xl text-brand-hot">
                {tHome(`pillars.${key}.label`)}
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                {tHome(`pillars.${key}.text`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Les quatre valeurs fondamentales */}
      <section className="border-t border-hairline bg-surface py-section">
        <div className="container-hc">
          <h2 className="rule-brand font-display text-3xl text-bright">
            {t("valuesTitle")}
          </h2>
          <p className="mt-6 max-w-3xl text-body">{t("valuesIntro")}</p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {values.map((key, index) => (
              <div
                key={key}
                className="border-s-2 border-brand bg-elevated p-6"
              >
                <span className="tabular font-display text-3xl text-data">
                  0{index + 1}
                </span>
                <h3 className="mt-3 font-display text-xl text-bright">
                  {t(`values.${key}.title`)}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">
                  {t(`values.${key}.text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citation du CEO */}
      <section className="py-section">
        <div className="container-hc">
          <figure className="border-s-2 border-brand ps-6 md:ps-10">
            <blockquote className="max-w-4xl font-display text-xl leading-relaxed text-bright md:text-2xl">
              “{tHome("quote.text")}”
            </blockquote>
            <figcaption className="mt-8 text-sm">
              <span className="font-medium text-data">
                {tHome("quote.author")}
              </span>
              <span className="text-muted"> — {tHome("quote.role")}</span>
            </figcaption>
          </figure>
          <p className="mt-12 font-display text-2xl italic text-brand-hot">
            “{site.tagline}”
          </p>
        </div>
      </section>
    </main>
  );
}
