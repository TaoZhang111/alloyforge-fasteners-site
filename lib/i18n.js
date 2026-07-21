export const locales = ["en", "ar", "es"];
export const defaultLocale = "en";

const rtlLocales = new Set(["ar"]);

export function isRtl(locale) {
  return rtlLocales.has(locale);
}

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  ar: () => import("@/dictionaries/ar.json").then((m) => m.default),
  es: () => import("@/dictionaries/es.json").then((m) => m.default)
};

export function getDictionary(locale) {
  const load = dictionaries[locale] || dictionaries[defaultLocale];
  return load();
}
