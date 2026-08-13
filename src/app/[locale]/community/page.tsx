import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { routing, type Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { NotifyForm } from "@/components/forms/NotifyForm";
import { site } from "@/content/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "community" });
  return {
    title: `${t("title")} — ${t("comingSoon")}`,
    description: t("intro"),
    alternates: alternatesFor(locale, "/community"),
  };
}

const pillars = ["networking", "mentoring", "training", "sponsoring"] as const;

/**
 * Page teaser du VIP Business Club.
 *
 * Volontairement sans détail fonctionnel : la Communauté n'est pas développée
 * en V1, la page n'annonce donc que les quatre piliers prévus et recueille les
 * adresses email des personnes à prévenir au lancement.
 */
export default async function CommunityPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("community");

  return (
    <main className="flex flex-1 items-center py-section">
      <div className="container-hc max-w-3xl text-center">
        <Image
          src={site.logo}
          alt=""
          width={88}
          height={88}
          className="mx-auto h-auto"
          style={{ width: 88, height: "auto" }}
        />

        <p className="eyebrow mt-10">{t("eyebrow")}</p>
        <h1 className="mt-4 font-display text-4xl text-bright md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-5 inline-block border border-data/40 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-data">
          {t("comingSoon")}
        </p>

        <p className="mt-10 text-lg leading-relaxed text-body">{t("intro")}</p>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-sm border border-hairline bg-hairline sm:grid-cols-4">
          {pillars.map((key) => (
            <li
              key={key}
              className="bg-elevated px-4 py-6 font-display text-lg text-bright"
            >
              {t(`pillars.${key}`)}
            </li>
          ))}
        </ul>

        <div className="mt-16 border-t border-hairline pt-12 text-start">
          <h2 className="font-display text-2xl text-bright">
            {t("notifyTitle")}
          </h2>
          <p className="mt-3 text-muted">{t("notifyBody")}</p>
          <div className="mt-8">
            <NotifyForm />
          </div>
        </div>
      </div>
    </main>
  );
}
