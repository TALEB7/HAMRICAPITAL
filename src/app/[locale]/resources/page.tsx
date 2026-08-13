import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { PageHeader } from "@/components/PageHeader";
import { usefulLinks } from "@/content/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "resources" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/resources"),
  };
}

const groups = ["exchanges", "trading", "media"] as const;

export default async function ResourcesPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("resources");

  return (
    <main className="flex-1">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="py-section">
        <div className="container-hc space-y-14">
          {groups.map((group) => (
            <div key={group}>
              <h2 className="rule-brand font-display text-2xl text-bright">
                {t(`groups.${group}`)}
              </h2>
              <ul className="mt-8 grid gap-px overflow-hidden rounded-sm border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
                {usefulLinks
                  .filter((link) => link.group === group)
                  .map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 bg-elevated px-6 py-5 text-bright transition-colors hover:bg-surface hover:text-data"
                      >
                        {link.name}
                        <span aria-hidden className="text-xs text-muted">
                          ↗
                        </span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
