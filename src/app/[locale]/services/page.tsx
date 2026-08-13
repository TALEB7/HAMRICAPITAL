import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { PageHeader } from "@/components/PageHeader";
import { DivisionCard } from "@/components/DivisionCard";
import { divisions } from "@/content/divisions";

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

      {/* Les huit piliers sur une seule grille : ils ont tous le même statut.
          Le site distinguait auparavant services et contenus pédagogiques. */}
      <section className="py-section">
        <div className="container-hc grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {divisions.map((d) => (
            <DivisionCard key={d.slug} division={d} />
          ))}
        </div>
      </section>
    </main>
  );
}
