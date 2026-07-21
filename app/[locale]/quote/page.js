import { getDictionary } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BodyClass from "@/components/BodyClass";
import RfqForm from "@/components/RfqForm";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.quote.title,
    description: dict.meta.quote.description,
    icons: { icon: "/assets/favicon.svg" }
  };
}

export default async function QuotePage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const q = dict.quotePage;

  return (
    <>
      <BodyClass className="page-quote" />
      <Header locale={locale} dict={dict} solid onQuotePage />

      <main className="quote-main">
        <section className="quote-hero" aria-labelledby="quote-title">
          <div className="container quote-hero-grid">
            <div>
              <p className="eyebrow">{q.eyebrow}</p>
              <h1 id="quote-title">{q.title}</h1>
              <p>{q.copy}</p>
            </div>
            <div className="response-promise" aria-label={q.responseAria}>
              <span>{q.responseLabel}</span>
              <strong>{q.responseValue}</strong>
            </div>
          </div>
        </section>

        <section className="quote-workspace">
          <div className="container quote-layout">
            <aside className="quote-aside">
              <div>
                <p className="eyebrow dark">{q.aside.eyebrow}</p>
                <h2>{q.aside.title}</h2>
                <p>{q.aside.copy}</p>
              </div>
              <ol className="quote-guide">
                {q.aside.steps.map((step, index) => (
                  <li key={step.name}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{step.name}</strong>
                      <small>{step.copy}</small>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="aside-contact">
                <span>{q.aside.preferEmail}</span>
                <a href={`mailto:${q.aside.email}`}>{q.aside.email}</a>
              </div>
            </aside>

            <div className="rfq-panel">
              <RfqForm locale={locale} dict={dict} />
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  );
}
