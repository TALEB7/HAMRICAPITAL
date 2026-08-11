"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";

/** `key` doit être une clé existante de `nav` dans les fichiers de traduction. */
type NavItem = {
  key: Parameters<ReturnType<typeof useTranslations<"nav">>>[0];
  href: string;
};

/** Navigation principale. */
const navItems: NavItem[] = [
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "industries", href: "/industries" },
  { key: "community", href: "/community" },
  { key: "resources", href: "/resources" },
  { key: "contact", href: "/contact" },
];

/** Liens visibles seulement dans le menu mobile (et dans le footer). */
const mobileOnlyItems: NavItem[] = [
  { key: "careers", href: "/careers" },
  { key: "advice", href: "/advice" },
];

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Le header devient opaque dès que l'on quitte le haut de page, pour rester
  // lisible par-dessus la vidéo du hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Referme le menu à chaque navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Neutralise le défilement du corps tant que le menu plein écran est ouvert.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-hairline bg-ink/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-hc flex h-20 items-center justify-between gap-6">
        <Logo showTagline={false} />

        <nav
          aria-label={t("menu")}
          className="hidden items-center gap-7 lg:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative text-sm transition-colors after:absolute after:-bottom-1.5 after:start-0 after:h-px after:bg-brand after:transition-all ${
                isActive(item.href)
                  ? "text-bright after:w-full"
                  : "text-body after:w-0 hover:text-bright hover:after:w-full"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <Link
            href="/advice"
            className="hidden rounded-sm bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hot lg:inline-block"
          >
            {t("advice")}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-hairline text-bright lg:hidden"
          >
            <span className="sr-only">{open ? t("close") : t("menu")}</span>
            <span aria-hidden className="text-lg leading-none">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 top-20 overflow-y-auto border-t border-hairline bg-ink lg:hidden"
        >
          <nav className="container-hc flex flex-col gap-1 py-8">
            {[...navItems, ...mobileOnlyItems].map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`border-b border-hairline py-4 font-display text-2xl transition-colors ${
                  isActive(item.href) ? "text-brand" : "text-bright"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="pt-8 sm:hidden">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
