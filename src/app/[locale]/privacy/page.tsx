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
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: t("title"), alternates: alternatesFor(locale, "/privacy") };
}

export default async function Privacy(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("privacy");

  return (
    <LegalPage
      eyebrow={t("eyebrow")}
      title={t("title")}
      reviewNote={t("reviewNote")}
      sections={[
        { title: t("collectTitle"), body: t("collect") },
        { title: t("purposeTitle"), body: t("purpose") },
        { title: t("storageTitle"), body: t("storage") },
        { title: t("thirdPartyTitle"), body: t("thirdParty") },
        { title: t("rightsTitle"), body: t("rights") },
        { title: t("cookiesTitle"), body: t("cookies") },
      ]}
    />
  );
}
