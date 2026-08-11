import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { site, socialLinks, usefulLinks, partners } from "@/content/site";
import { divisions } from "@/content/divisions";

const groupOrder = ["exchanges", "trading", "media"] as const;

export function Footer() {
  const t = useTranslations();
  // Les réseaux dont l'URL n'est pas encore connue restent masqués plutôt que
  // d'exposer des liens morts.
  const activeSocials = socialLinks.filter((s) => s.href);

  return (
    <footer className="mt-auto border-t border-hairline bg-surface">
      <div className="container-hc grid gap-12 py-16 lg:grid-cols-[1.2fr_1fr_1fr_1.4fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-xs font-display text-lg italic text-data">
            “{site.tagline}”
          </p>
          <p className="mt-2 text-sm text-muted">
            {site.ceo} — {t("footer.ceoTitle")}
          </p>
        </div>

        <nav aria-labelledby="footer-services">
          <h2
            id="footer-services"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-bright"
          >
            {t("nav.services")}
          </h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {divisions.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/services/${d.slug}`}
                  className="text-muted transition-colors hover:text-brand-hot"
                >
                  {t(`divisions.${d.key}.title` as never)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-company">
          <h2
            id="footer-company"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-bright"
          >
            {t("footer.company")}
          </h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {[
              { key: "about", href: "/about" },
              { key: "industries", href: "/industries" },
              { key: "community", href: "/community" },
              { key: "careers", href: "/careers" },
              { key: "advice", href: "/advice" },
              { key: "contact", href: "/contact" },
              { key: "resources", href: "/resources" },
            ].map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="text-muted transition-colors hover:text-brand-hot"
                >
                  {t(`nav.${item.key}` as never)}
                </Link>
              </li>
            ))}
          </ul>

          {activeSocials.length > 0 && (
            <>
              <h2 className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-bright">
                {t("footer.connect")}
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
        </nav>

        <nav aria-labelledby="footer-links">
          <h2
            id="footer-links"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-bright"
          >
            {t("footer.usefulLinks")}
          </h2>
          {groupOrder.map((group) => (
            <ul
              key={group}
              className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm"
            >
              {usefulLinks
                .filter((l) => l.group === group)
                .map((l) => (
                  <li key={l.name}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted transition-colors hover:text-data"
                    >
                      {l.name}
                    </a>
                  </li>
                ))}
            </ul>
          ))}

          <h2 className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-bright">
            {t("footer.partners")}
          </h2>
          <ul className="mt-5 flex flex-wrap gap-4 text-sm">
            {partners.map((p) => (
              <li
                key={p.name}
                className="rounded-sm border border-hairline px-3 py-2 text-muted"
              >
                {p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-bright"
                  >
                    {p.name}
                  </a>
                ) : (
                  p.name
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-hairline">
        <div className="container-hc flex flex-col gap-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. {t("footer.rights")}
          </p>
          <div className="flex gap-6">
            <Link href="/legal" className="transition-colors hover:text-bright">
              {t("footer.legal")}
            </Link>
            <Link
              href="/privacy"
              className="transition-colors hover:text-bright"
            >
              {t("footer.privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
