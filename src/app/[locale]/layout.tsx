import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Inter, Playfair_Display, Noto_Sans_Arabic } from "next/font/google";
import { routing, getDirection, type Locale } from "@/i18n/routing";
import { site } from "@/content/site";
import { Ticker } from "@/components/Ticker";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "../globals.css";

/** Serif de titrage, cohérente avec le lettrage « HamriCapital ». */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

/** Sans-serif de lecture. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Pile arabe dédiée : Inter ne couvre pas l'écriture arabe. */
const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${t("titleSuffix")}`,
      template: `%s — ${site.name}`,
    },
    description: t("description"),
    openGraph: {
      siteName: site.name,
      title: `${site.name} — ${t("titleSuffix")}`,
      description: t("description"),
      locale,
      type: "website",
    },
    alternates: {
      canonical: `/${locale}`,
      // hreflang pour chaque langue + repli x-default sur l'anglais.
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
        "x-default": `/${routing.defaultLocale}`,
      },
    },
  };
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Permet le rendu statique des pages sous ce layout.
  setRequestLocale(locale as Locale);

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={`${playfair.variable} ${inter.variable} ${notoArabic.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-ink text-body">
        <NextIntlClientProvider>
          <Ticker />
          <Header />
          {props.children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
