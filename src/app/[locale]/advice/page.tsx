import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { PageHeader } from "@/components/PageHeader";
import { AdviceForm } from "@/components/forms/AdviceForm";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "advice" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/advice"),
  };
}

export default async function AdvicePage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("advice");

  return (
    <main className="flex-1">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="py-section">
        <div className="container-hc max-w-3xl">
          <h2 className="rule-brand font-display text-2xl text-bright">
            {t("formTitle")}
          </h2>
          <div className="mt-10">
            <AdviceForm />
          </div>
        </div>
      </section>
    </main>
  );
}
