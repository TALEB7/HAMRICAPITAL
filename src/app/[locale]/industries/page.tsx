import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { PageHeader } from "@/components/PageHeader";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "industries" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/industries"),
  };
}

export default async function IndustriesPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("industries");
  const list = t.raw("list") as string[];

  return (
    <main className="flex-1">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
      />

      {/* Grille de tags, sans formulaire dédié : cette page est un panorama. */}
      <section className="py-section">
        <ul className="container-hc grid gap-px overflow-hidden rounded-sm border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {list.map((industry, index) => (
            <li
              key={industry}
              className="flex items-baseline gap-4 bg-elevated px-6 py-5 transition-colors hover:bg-surface"
            >
              <span className="tabular text-xs text-data">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-bright">{industry}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
