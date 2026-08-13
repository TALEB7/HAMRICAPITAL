import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { PageHeader } from "@/components/PageHeader";
import { DivisionCard } from "@/components/DivisionCard";
import { serviceDivisions, editorialDivisions } from "@/content/divisions";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/services"),
  };
}

export default async function ServicesPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("services");

  return (
    <main className="flex-1">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
      />

      <section className="py-section">
        <div className="container-hc">
          <h2 className="font-display text-2xl text-bright">
            {t("servicesGroup")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceDivisions.map((d) => (
              <DivisionCard key={d.slug} division={d} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-hairline bg-surface py-section">
        <div className="container-hc">
          <h2 className="font-display text-2xl text-bright">
            {t("editorialGroup")}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
            {t("editorialNote")}
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {editorialDivisions.map((d) => (
              <DivisionCard key={d.slug} division={d} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
