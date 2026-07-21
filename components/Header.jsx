"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "@/lib/i18n";

const LANGUAGE_LABELS = { en: "EN", ar: "عربي", es: "ES" };

export default function Header({ locale, dict, solid = false, onQuotePage = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const home = `/${locale}`;
  const headerClass = ["site-header", solid ? "is-solid" : "", scrolled ? "is-scrolled" : ""]
    .filter(Boolean)
    .join(" ");

  function localePath(target) {
    const rest = pathname.replace(new RegExp(`^/(${locales.join("|")})`), "");
    return `/${target}${rest}` || `/${target}`;
  }

  return (
    <header className={headerClass}>
      <Link className="brand" href={home} aria-label={dict.header.homeAria}>
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img">
            <path d="M7.2 3.8 3.8 7.2v9.6l3.4 3.4h9.6l3.4-3.4V7.2l-3.4-3.4H7.2Zm.8 3h8l1.2 1.2v8l-1.2 1.2H8L6.8 16V8L8 6.8Zm1.8 3.4v3.6h4.4v-3.6H9.8Z" />
          </svg>
        </span>
        <span>
          <strong>{dict.header.brand}</strong>
          <small>{dict.header.brandTag}</small>
        </span>
      </Link>

      <button
        className="nav-toggle"
        type="button"
        aria-label={open ? dict.header.menuClose : dict.header.menuOpen}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
      </button>

      <nav
        className={`site-nav${open ? " is-open" : ""}`}
        aria-label={dict.header.navAria}
        onClick={(event) => {
          if (event.target.closest("a")) {
            setOpen(false);
          }
        }}
      >
        <a href={`${home}#products`}>{dict.header.nav.products}</a>
        <a href={`${home}#materials`}>{dict.header.nav.materials}</a>
        <a href={`${home}#capabilities`}>{dict.header.nav.capabilities}</a>
        <a href={`${home}#quality`}>{dict.header.nav.quality}</a>
        <Link className="nav-cta" href={`${home}/quote`} aria-current={onQuotePage ? "page" : undefined}>
          {dict.header.nav.cta}
        </Link>
        <span className="lang-switch" aria-label="Language">
          {locales.map((code) => (
            <Link
              key={code}
              href={localePath(code)}
              lang={code}
              aria-current={code === locale ? "true" : undefined}
            >
              {LANGUAGE_LABELS[code]}
            </Link>
          ))}
        </span>
      </nav>
    </header>
  );
}
