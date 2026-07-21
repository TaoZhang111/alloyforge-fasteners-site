import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BodyClass from "@/components/BodyClass";
import HeroCanvas from "@/components/HeroCanvas";
import HomeEffects from "@/components/HomeEffects";
import MaterialCarousel from "@/components/MaterialCarousel";
import IndustryAccordion from "@/components/IndustryAccordion";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    icons: { icon: "/assets/favicon.svg" }
  };
}

const ARROW = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13.2 5.2 20 12l-6.8 6.8-1.2-1.2 4.8-4.8H4v-1.6h12.8L12 6.4l1.2-1.2Z" />
  </svg>
);

export default async function HomePage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const quoteHref = `/${locale}/quote`;

  return (
    <>
      <BodyClass className="page-home" />
      <HomeEffects />
      <Header locale={locale} dict={dict} />

      <main className="site-main" id="home">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true">
            <img className="hero-poster" src="/assets/images/fastener-hero-poster.jpg" alt="" />
            <HeroCanvas />
          </div>
          <div className="hero-overlay" aria-hidden="true"></div>
          <div className="container hero-content">
            <p className="eyebrow">{dict.hero.eyebrow}</p>
            <h1 id="hero-title">{dict.hero.title}</h1>
            <p className="hero-copy">{dict.hero.copy}</p>
            <div className="hero-actions">
              <Link className="button primary" href={quoteHref}>
                {dict.hero.requestQuote}
                {ARROW}
              </Link>
              <a className="button secondary" href="#products">
                {dict.hero.explore}
              </a>
            </div>
          </div>
          <a className="scroll-cue" href="#products" aria-label={dict.hero.scrollAria}>
            <span>{dict.hero.scroll}</span>
            <i aria-hidden="true"></i>
          </a>
        </section>

        <section className="section products-section" id="products" aria-labelledby="products-title">
          <div className="container">
            <div className="section-heading split" data-reveal>
              <div>
                <p className="eyebrow dark">{dict.products.eyebrow}</p>
                <h2 id="products-title">
                  {dict.products.titleBefore} <span className="inline-heading-image" aria-hidden="true"></span>{" "}
                  {dict.products.titleAfter}
                </h2>
              </div>
              <Link className="text-link" href={quoteHref}>
                {dict.products.sendSpecs}
                {ARROW}
              </Link>
            </div>

            <div className="product-layout">
              <figure className="product-photo media-frame" data-scale-media>
                <img src="/assets/product-fasteners.png" alt={dict.products.photoAlt} />
              </figure>
              <div className="product-cards" aria-label={dict.products.listAria}>
                {dict.products.cards.map((card, index) => (
                  <Link
                    key={card.value}
                    className={`product-card${index === dict.products.cards.length - 1 ? " product-card-wide" : ""}`}
                    href={`${quoteHref}?product=${encodeURIComponent(card.value)}`}
                    data-reveal
                  >
                    <span className="product-type">{card.type}</span>
                    <div>
                      <h3>{card.name}</h3>
                      <p>{card.copy}</p>
                      <span className="card-link">
                        {card.link} <b aria-hidden="true">&rarr;</b>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section materials-section" id="materials" aria-labelledby="materials-title">
          <div className="container">
            <div className="section-heading split" data-reveal>
              <div>
                <p className="eyebrow dark">{dict.materials.eyebrow}</p>
                <h2 id="materials-title">{dict.materials.title}</h2>
              </div>
              <p className="heading-note">{dict.materials.note}</p>
            </div>

            <MaterialCarousel dict={dict} />
          </div>
        </section>

        <section className="section capability-section" id="capabilities" aria-labelledby="capabilities-title">
          <div className="container capability-grid">
            <div className="capability-copy" data-capability-copy>
              <p className="eyebrow">{dict.capabilities.eyebrow}</p>
              <h2 id="capabilities-title">{dict.capabilities.title}</h2>
              <p>{dict.capabilities.copy}</p>
              <Link className="button light" href={quoteHref}>
                {dict.capabilities.cta}
              </Link>
            </div>
            <div className="capability-list" aria-label={dict.capabilities.listAria}>
              {dict.capabilities.items.map((item) => (
                <article key={item.name} data-capability-item>
                  <small>{item.stage}</small>
                  <strong>{item.name}</strong>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section quality-section" id="quality" aria-labelledby="quality-title">
          <div className="container quality-grid">
            <figure className="quality-photo media-frame" data-scale-media>
              <img src="/assets/quality-inspection.png" alt={dict.quality.photoAlt} />
            </figure>
            <div className="quality-content" data-reveal>
              <p className="eyebrow">{dict.quality.eyebrow}</p>
              <h2 id="quality-title">{dict.quality.title}</h2>
              <p>{dict.quality.copy}</p>
              <div className="check-list">
                {dict.quality.checks.map((check) => (
                  <span key={check}>{check}</span>
                ))}
              </div>
              <p className="quality-note">{dict.quality.note}</p>
            </div>
          </div>
        </section>

        <section className="section industries-section" id="industries" aria-labelledby="industries-title">
          <div className="container">
            <div className="section-heading split" data-reveal>
              <div>
                <p className="eyebrow dark">{dict.industries.eyebrow}</p>
                <h2 id="industries-title">{dict.industries.title}</h2>
              </div>
              <p className="heading-note">{dict.industries.note}</p>
            </div>
            <IndustryAccordion locale={locale} dict={dict} />
          </div>
        </section>

        <section className="section company-capability-section" id="company" aria-labelledby="company-title">
          <div className="container">
            <div className="company-grid">
              <div className="company-copy" data-reveal>
                <p className="eyebrow dark">{dict.company.eyebrow}</p>
                <h2 id="company-title">{dict.company.title}</h2>
                <p>{dict.company.copy}</p>
                <ul className="plain-list">
                  {dict.company.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
              <figure className="company-photo media-frame" data-scale-media>
                <img src="/assets/hero-fasteners.png" alt={dict.company.photoAlt} />
              </figure>
            </div>

            <div className="company-process">
              <div className="company-process-heading" data-reveal>
                <p className="eyebrow dark">{dict.company.processEyebrow}</p>
                <h3>{dict.company.processTitle}</h3>
                <p>{dict.company.processCopy}</p>
              </div>
              <div className="process-stack">
                {dict.company.steps.map((step, index) => (
                  <article key={step.name} className="stack-card" data-stack-card style={{ "--stack-order": index }}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h4>{step.name}</h4>
                      <p>{step.copy}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section rfq-section" id="rfq" aria-labelledby="rfq-title">
          <div className="container final-cta" data-reveal>
            <div>
              <p className="eyebrow">{dict.rfqCta.eyebrow}</p>
              <h2 id="rfq-title">{dict.rfqCta.title}</h2>
              <p>{dict.rfqCta.copy}</p>
            </div>
            <div className="final-cta-actions">
              <Link className="button light" href={quoteHref}>
                {dict.rfqCta.button}
                {ARROW}
              </Link>
              <a className="business-email" href={`mailto:${dict.rfqCta.email}`}>
                {dict.rfqCta.email}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  );
}
