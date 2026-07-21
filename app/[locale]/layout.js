import "../globals.css";
import { locales, isRtl } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  return (
    <html lang={locale} dir={isRtl(locale) ? "rtl" : "ltr"} className="js">
      <body>{children}</body>
    </html>
  );
}
