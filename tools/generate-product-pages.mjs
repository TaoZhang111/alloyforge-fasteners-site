import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { productCategories, sharedProductProperties, siteOrigin } from "../data/product-catalog.mjs";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function json(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function head({ title, description, path, image, type = "website", structuredData = null }) {
  const canonical = `${siteOrigin}${path}`;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
    <meta name="theme-color" content="#10171d" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/styles.css" />
    <link rel="stylesheet" href="/prototype.css" />
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${siteOrigin}${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    ${structuredData ? `<script type="application/ld+json">${json(structuredData)}</script>` : ""}
    <script src="/assets/vendor/gsap.min.js" defer></script>
    <script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
    <script src="/script.js" defer></script>
  </head>`;
}

function header() {
  return `<header class="site-header is-solid" data-header>
    <a class="brand" href="/" aria-label="BYBOLT home"><span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7.2 3.8 3.8 7.2v9.6l3.4 3.4h9.6l3.4-3.4V7.2l-3.4-3.4H7.2Zm.8 3h8l1.2 1.2v8l-1.2 1.2H8L6.8 16V8L8 6.8Zm1.8 3.4v3.6h4.4v-3.6H9.8Z" /></svg></span><span class="brand-copy"><strong>BYBOLT</strong><small>built by bolt, made to endure</small></span></a>
    <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" data-nav-toggle><span></span><span></span></button>
    <nav class="site-nav" data-nav aria-label="Primary navigation"><a aria-current="page" href="/products/">Products</a><a href="/materials/">Materials</a><a href="/#capabilities">Capabilities</a><a href="/#quality">Quality</a><a class="nav-cta" href="/quote.html">Request a Quote</a></nav>
  </header>`;
}

function footer() {
  return `<footer class="site-footer light-footer"><div class="container footer-grid"><div><strong>BYBOLT</strong><p>High-temperature alloy fasteners for international industrial procurement.</p></div><div><span>Products</span><a href="/products/">All Products</a><a href="/products/bolts/">Bolts</a><a href="/products/studs/">Studs</a></div><div><span>Technical</span><a href="/materials/">Materials</a><a href="/#quality">Quality &amp; Inspection</a></div><div><span>Contact</span><a href="/quote.html">Request a Quote</a><a href="mailto:sales@bybolt.com">Email Sales</a></div></div><div class="container footer-bottom"><span>&copy; 2026 BYBOLT</span><span>built by bolt, made to endure</span></div></footer>`;
}

function breadcrumbs(items) {
  const content = items.map((item, index) => {
    const last = index === items.length - 1;
    return `${index ? "<span>/</span>" : ""}${last ? `<span aria-current="page">${escapeHtml(item.name)}</span>` : `<a href="${item.href}">${escapeHtml(item.name)}</a>`}`;
  }).join("");
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${content}</nav>`;
}

function marquee() {
  const labels = ["Nickel alloys", "Drawing-based supply", "Critical service", "Inspection aligned", "Export ready"];
  const set = labels.map((label) => `<span>${label}</span><i></i>`).join("");
  return `<div class="product-marquee" aria-hidden="true"><div class="product-marquee-track">${set}${set}</div></div>`;
}

function productDirectoryPage() {
  const cards = productCategories.map((category) => `<a class="product-family-card" href="/products/${category.slug}/" data-reveal>
    <img src="${category.image}" alt="${escapeHtml(category.alt)}" width="1536" height="1024" ${category.index === "01" ? "" : 'loading="lazy"'} />
    <span class="product-family-shade" aria-hidden="true"></span>
    <span class="product-family-number">${category.index}</span>
    <span class="product-family-copy"><small>${category.models.length} product types</small><strong>${escapeHtml(category.name)}</strong><em>${escapeHtml(category.summary)}</em><b>View range <span aria-hidden="true">&rarr;</span></b></span>
  </a>`).join("\n");

  const directoryData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "High-Temperature Alloy Fastener Products",
    url: `${siteOrigin}/products/`,
    mainEntity: { "@type": "ItemList", itemListElement: productCategories.map((category, index) => ({ "@type": "ListItem", position: index + 1, name: category.name, url: `${siteOrigin}/products/${category.slug}/` })) }
  };

  return `${head({ title: "High-Temperature Alloy Fastener Products | BYBOLT", description: "Explore BYBOLT bolts, nuts, studs, washers, screws and custom alloy fastener products for heat, corrosion and pressure-critical applications.", path: "/products/", image: productCategories[0].image, structuredData: directoryData })}
  <body class="prototype-page content-page product-directory-page">${header()}<main>
    <section class="product-directory-hero" aria-labelledby="page-title"><div class="container">${breadcrumbs([{ name: "Home", href: "/" }, { name: "Products" }])}<div class="directory-hero-grid"><div><p class="eyebrow dark">Product directory / 06 families</p><h1 id="page-title">Fasteners arranged around the way engineers specify.</h1></div><div class="directory-hero-aside"><span>01-06</span><p>Move from product family to model, then open a dedicated technical page for dimensional, material and weight review.</p><a class="text-link" href="/quote.html">Send a requirement <span aria-hidden="true">&rarr;</span></a></div></div></div></section>
    ${marquee()}
    <section class="product-family-section" aria-label="Fastener product families"><div class="container product-family-grid">${cards}</div></section>
    <section class="section final-action light-chapter"><div class="container final-action-grid"><div><p class="eyebrow dark">A drawing is enough to begin</p><h2>Not in the catalogue? Define the joint, not the category.</h2></div><div class="final-action-links"><a class="button dark-button" href="/quote.html">Request a Quote &rarr;</a><a href="mailto:sales@bybolt.com">sales@bybolt.com</a></div></div></section>
  </main>${footer()}</body></html>`;
}

function pairModels(models) {
  const pairs = [];
  for (let index = 0; index < models.length; index += 2) {
    pairs.push(models.slice(index, index + 2));
  }
  return pairs;
}

function categoryPage(category) {
  const chapters = pairModels(category.models).map((pair, pairIndex) => `<section class="model-chapter" aria-label="${escapeHtml(pair.map((model) => model.name).join(" and "))}"><div class="container model-pair">
    ${pair.map((model, modelIndex) => `<article class="model-card" data-reveal>
      <a class="model-card-media" href="/products/${category.slug}/${model.slug}/" aria-label="View ${escapeHtml(model.name)} technical details"><img src="${category.image}" alt="${escapeHtml(model.name)} in high-temperature alloy" width="1536" height="1024" ${pairIndex || modelIndex ? 'loading="lazy"' : ""} /><span>${String(pairIndex * 2 + modelIndex + 1).padStart(2, "0")}</span></a>
      <div class="model-card-copy"><div><p class="eyebrow dark">${escapeHtml(model.eyebrow)}</p><h2>${escapeHtml(model.name)}</h2><p>${escapeHtml(model.description)}</p></div><dl><div><dt>Size</dt><dd>${escapeHtml(model.size)}</dd></div><div><dt>Standard</dt><dd>${escapeHtml(model.standard)}</dd></div></dl><a class="model-card-link" href="/products/${category.slug}/${model.slug}/">Technical details <span aria-hidden="true">&rarr;</span></a></div>
    </article>`).join("\n")}
  </div></section>`).join("\n");

  const categoryData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} | BYBOLT`,
    url: `${siteOrigin}/products/${category.slug}/`,
    mainEntity: { "@type": "ItemList", itemListElement: category.models.map((model, index) => ({ "@type": "ListItem", position: index + 1, name: model.name, url: `${siteOrigin}/products/${category.slug}/${model.slug}/` })) }
  };

  return `${head({ title: `${category.name} | High-Temperature Alloy Fasteners | BYBOLT`, description: `${category.intro} Explore ${category.models.map((model) => model.name).join(", ")}.`, path: `/products/${category.slug}/`, image: category.image, structuredData: categoryData })}
  <body class="prototype-page content-page category-product-page">${header()}<main>
    <section class="category-hero" aria-labelledby="category-title"><div class="container">${breadcrumbs([{ name: "Home", href: "/" }, { name: "Products", href: "/products/" }, { name: category.name }])}<div class="category-hero-grid"><div data-category-pin><p class="eyebrow dark">Product family ${category.index}</p><h1 id="category-title">${escapeHtml(category.name)}</h1><p data-scrub-copy>${escapeHtml(category.intro)}</p><div class="category-hero-actions"><a class="button dark-button" href="/quote.html?product=${encodeURIComponent(category.name)}">Request this range</a><a class="text-link" href="#models">View ${category.models.length} product types <span aria-hidden="true">&darr;</span></a></div></div><figure><img src="${category.image}" alt="${escapeHtml(category.alt)}" width="1536" height="1024" fetchpriority="high" /></figure></div></div></section>
    ${marquee()}
    <div id="models" class="model-chapters">${chapters}</div>
    <section class="category-end"><div class="container"><p>${escapeHtml(category.name)} / end of range</p><a class="button dark-button" href="/products/">Back to all products</a></div></section>
  </main>${footer()}</body></html>`;
}

function detailPage(category, model) {
  const related = category.models.filter((item) => item.slug !== model.slug).slice(0, 3);
  const properties = [
    ["Typical size range", model.size],
    [category.slug === "washers" ? "Thickness / form" : "Typical length range", model.length],
    ["Thread series", model.threads],
    ["Dimensional basis", model.standard],
    ["Configuration", model.configuration],
    ["Material options", sharedProductProperties.materials],
    ["Dimensional control", sharedProductProperties.dimensionalControl],
    ["Inspection & testing", sharedProductProperties.inspection],
    ["Documentation", sharedProductProperties.documentation]
  ];
  const propertyRows = properties.map(([name, value]) => `<div><dt>${escapeHtml(name)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("");
  const productData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: model.name,
    image: `${siteOrigin}${category.image}`,
    url: `${siteOrigin}/products/${category.slug}/${model.slug}/`,
    description: model.description,
    brand: { "@type": "Brand", name: "BYBOLT" },
    category: category.name,
    material: "Nickel-based high-temperature alloys",
    additionalProperty: properties.slice(0, 7).map(([name, value]) => ({ "@type": "PropertyValue", name, value }))
  };
  const relatedCards = related.map((item) => `<a class="related-product-card" href="/products/${category.slug}/${item.slug}/"><span>${escapeHtml(category.name)}</span><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.description)}</p><b aria-hidden="true">&rarr;</b></a>`).join("");

  return `${head({ title: `${model.name} | Sizes, Materials & Specifications | BYBOLT`, description: `${model.description} Review typical sizes, thread options, materials, inspection scope and unit-weight calculation basis.`, path: `/products/${category.slug}/${model.slug}/`, image: category.image, type: "product", structuredData: productData })}
  <body class="prototype-page content-page product-detail-page">${header()}<main>
    <section class="technical-hero" aria-labelledby="product-title"><div class="container">${breadcrumbs([{ name: "Home", href: "/" }, { name: "Products", href: "/products/" }, { name: category.name, href: `/products/${category.slug}/` }, { name: model.name }])}<div class="technical-hero-grid"><div class="technical-hero-copy"><p class="eyebrow dark">${escapeHtml(category.name)} / ${escapeHtml(model.eyebrow)}</p><h1 id="product-title">${escapeHtml(model.name)}</h1><p data-scrub-copy>${escapeHtml(model.description)}</p><div class="technical-hero-actions"><a class="button dark-button" href="/quote.html?product=${encodeURIComponent(model.name)}">Request this product</a><a href="#specifications">Review specifications <span aria-hidden="true">&darr;</span></a></div></div><figure class="technical-hero-media"><img src="${category.image}" alt="${escapeHtml(model.name)} manufactured in high-temperature alloy" width="1536" height="1024" fetchpriority="high" /><figcaption><span>BYBOLT / ${escapeHtml(category.name)}</span><span>Build-to-specification</span></figcaption></figure><div class="technical-hero-index" aria-hidden="true">${category.index}</div></div></div></section>
    <section id="specifications" class="specification-section technical-specs" aria-labelledby="spec-title"><div class="container specification-grid"><aside data-spec-pin><p class="eyebrow dark">Technical overview</p><h2 id="spec-title">Parameters that move with the requirement.</h2><p>Ranges below define a typical enquiry envelope, not a stock commitment. Final dimensions, tolerances and acceptance criteria are confirmed during quotation.</p></aside><dl class="spec-list">${propertyRows}</dl></div></section>
    <section class="weight-section" aria-labelledby="weight-title"><div class="container weight-grid"><div><p class="eyebrow">Weight &amp; logistics</p><h2 id="weight-title">Unit weight is calculated, not guessed.</h2><p>${escapeHtml(sharedProductProperties.unitWeight)}. ${escapeHtml(sharedProductProperties.packaging)}.</p></div><ol class="weight-flow"><li><span>01</span><strong>Final geometry</strong><p>Diameter, length, head or body profile and thread allowance.</p></li><li><span>02</span><strong>Alloy density</strong><p>The selected material grade is applied to the finished net volume.</p></li><li><span>03</span><strong>Quotation schedule</strong><p>Net piece weight, order weight and estimated packed weight are listed.</p></li></ol></div></section>
    <section class="related-products" aria-labelledby="related-title" data-product-carousel><div class="container"><div class="related-heading"><div><p class="eyebrow dark">Continue the range</p><h2 id="related-title">Related ${escapeHtml(category.name.toLowerCase())}</h2></div><div class="carousel-controls"><button type="button" aria-label="Previous related products" data-product-prev>&larr;</button><button type="button" aria-label="Next related products" data-product-next>&rarr;</button></div></div><div class="related-product-track" data-product-track>${relatedCards}</div></div></section>
    <section class="section final-action light-chapter"><div class="container final-action-grid"><div><p class="eyebrow dark">Ready for engineering review</p><h2>Send the drawing, size or operating requirement.</h2></div><div class="final-action-links"><a class="button dark-button" href="/quote.html?product=${encodeURIComponent(model.name)}">Request a Quote &rarr;</a><a href="mailto:sales@bybolt.com">sales@bybolt.com</a></div></div></section>
  </main>${footer()}</body></html>`;
}

async function writePage(root, relativePath, content) {
  const directory = join(root, relativePath);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "index.html"), content, "utf8");
}

export async function generateProductPages(outputRoot = projectRoot, { clean = true } = {}) {
  const productsRoot = join(outputRoot, "products");
  if (clean) {
    await rm(productsRoot, { recursive: true, force: true });
  }
  await writePage(outputRoot, "products", productDirectoryPage());
  for (const category of productCategories) {
    await writePage(outputRoot, join("products", category.slug), categoryPage(category));
    for (const model of category.models) {
      await writePage(outputRoot, join("products", category.slug, model.slug), detailPage(category, model));
    }
  }
  await writePage(outputRoot, join("products", "nickel-alloy-hex-bolts"), `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex,follow"><link rel="canonical" href="${siteOrigin}/products/bolts/hex-bolts/"><meta http-equiv="refresh" content="0; url=/products/bolts/hex-bolts/"><title>Hex Bolts | BYBOLT</title></head><body><p>This product page has moved to <a href="/products/bolts/hex-bolts/">Hex Bolts</a>.</p></body></html>`);
  const sitemapPaths = ["/", "/products/", "/materials/", "/materials/inconel-625/", "/quote.html"];
  for (const category of productCategories) {
    sitemapPaths.push(`/products/${category.slug}/`);
    for (const model of category.models) {
      sitemapPaths.push(`/products/${category.slug}/${model.slug}/`);
    }
  }
  const lastModified = new Date().toISOString().slice(0, 10);
  const sitemapEntries = sitemapPaths.map((path) => `  <url><loc>${siteOrigin}${path}</loc><lastmod>${lastModified}</lastmod></url>`).join("\n");
  await writeFile(join(outputRoot, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`, "utf8");
  await writeFile(join(outputRoot, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`, "utf8");
  return productCategories.reduce((total, category) => total + category.models.length, 0);
}

if (typeof process !== "undefined" && process.argv?.[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const count = await generateProductPages();
  console.log(`Generated 6 category pages and ${count} product detail pages.`);
}
