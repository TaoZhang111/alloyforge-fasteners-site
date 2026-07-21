# AlloyForge Fasteners

Marketing site for high-temperature alloy fasteners, built with Next.js (App Router, static export) in three languages: English, Arabic (RTL) and Spanish.

## Routes

| Path | Page |
| --- | --- |
| `/` | Language detection redirect (`public/index.html`) |
| `/en/`, `/ar/`, `/es/` | Home |
| `/en/quote/`, `/ar/quote/`, `/es/quote/` | RFQ form |

## Development

```bash
npm install
npm run dev      # http://localhost:3000/en/
```

## Production build

```bash
npm run build    # static export to out/
```

The `out/` directory is fully static and can be hosted on GitHub Pages, Nginx or any CDN — no server required.

## Structure

- `app/[locale]/` — pages; the locale segment drives `lang`/`dir` (Arabic renders right-to-left)
- `dictionaries/{en,ar,es}.json` — all site copy; add a language by adding a dictionary and listing the code in `lib/i18n.js`
- `components/` — header/footer, WebGL hero canvas, material carousel, industry accordion, RFQ form, GSAP scroll effects
- `app/globals.css` — original design system, converted to CSS logical properties for RTL support

## Notes

- The RFQ form submission is still simulated client-side (no backend); wire it to a real endpoint before production use.
- Form select values (product, testing) stay in English internally so inquiries arrive in a consistent format regardless of UI language.
