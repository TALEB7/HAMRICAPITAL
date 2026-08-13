import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { LegalPage } from "@/components/LegalPage";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("title"), alternates: alternatesFor(locale, "/legal") };
}

export default async function Legal(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("legal");

  return (
    <LegalPage
      eyebrow={t("eyebrow")}
      title={t("title")}
      reviewNote={t("reviewNote")}
      sections={[
        { title: t("publisherTitle"), body: t("publisher") },
        { title: t("directorTitle"), body: t("director") },
        { title: t("hostingTitle"), body: t("hosting") },
        { title: t("ipTitle"), body: t("ip") },
        { title: t("disclaimerTitle"), body: t("disclaimer") },
      ]}
    />
  );
}
