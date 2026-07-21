import Link from "next/link";

export default function Footer({ locale, dict }) {
  const home = `/${locale}`;
  const f = dict.footer;

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong>{f.brand}</strong>
          <p>{f.copy}</p>
        </div>
        <div>
          <span>{f.productsLabel}</span>
          {f.productLinks.map((label) => (
            <a key={label} href={`${home}#products`}>
              {label}
            </a>
          ))}
        </div>
        <div>
          <span>{f.capabilitiesLabel}</span>
          <a href={`${home}#materials`}>{f.capabilityLinks[0]}</a>
          <a href={`${home}#capabilities`}>{f.capabilityLinks[1]}</a>
          <a href={`${home}#quality`}>{f.capabilityLinks[2]}</a>
          <a href={`${home}#company`}>{f.capabilityLinks[3]}</a>
        </div>
        <div>
          <span>{f.contactLabel}</span>
          <Link href={`${home}/quote`}>{f.requestQuote}</Link>
          <a href={`mailto:${dict.rfqCta.email}`}>{f.emailSales}</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{f.copyright}</span>
        <span>{f.tagline}</span>
      </div>
    </footer>
  );
}
