import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("home.hero");

  return (
    <main className="container-hc flex flex-1 flex-col justify-center py-24">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="rule-brand mt-4 max-w-3xl text-4xl md:text-6xl">
        {t("title")}
      </h1>
      <p className="mt-8 max-w-2xl text-lg text-muted">{t("subtitle")}</p>
    </main>
  );
}
