import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { socialLinks } from "@/content/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/contact"),
  };
}

const departments = ["info", "hr", "legal", "ceo"] as const;

export default async function ContactPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  const tFooter = await getTranslations("footer");
  const activeSocials = socialLinks.filter((s) => s.href);

  return (
    <main className="flex-1">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="py-section">
        <div className="container-hc grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="rule-brand font-display text-2xl text-bright">
              {t("formTitle")}
            </h2>
            <div className="mt-10">
              <ContactForm />
            </div>
          </div>

          <aside>
            <h2 className="font-display text-xl text-bright">
              {t("departmentsTitle")}
            </h2>
            <dl className="mt-6 space-y-5">
              {departments.map((key) => (
                <div key={key} className="border-s border-hairline ps-5">
                  <dt className="text-xs font-semibold uppercase tracking-widest text-data">
                    {key}
                  </dt>
                  <dd className="mt-1.5 text-sm text-muted">
                    {t(`departments.${key}`)}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs leading-relaxed text-muted/80">
              {t("addressesNote")}
            </p>

            {activeSocials.length > 0 && (
              <>
                <h2 className="mt-12 font-display text-xl text-bright">
                  {tFooter("connect")}
                </h2>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {activeSocials.map((s) => (
                    <li key={s.name}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted transition-colors hover:text-brand-hot"
                      >
                        {s.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
