"use client";

import { useState } from "react";
import Link from "next/link";

export default function IndustryAccordion({ locale, dict }) {
  const [active, setActive] = useState(0);

  return (
    <div className="industry-accordion">
      {dict.industries.panels.map((panel, index) => (
        <article
          key={panel.name}
          className={`industry-panel${index === active ? " is-active" : ""}`}
          tabIndex={0}
          style={{ "--panel-image": `url('${panel.image}')` }}
          onMouseEnter={() => setActive(index)}
          onFocus={() => setActive(index)}
          onClick={(event) => {
            if (!event.target.closest("a")) {
              setActive(index);
            }
          }}
        >
          <div>
            <span>{panel.tag}</span>
            <h3>{panel.name}</h3>
            <p>{panel.copy}</p>
            <Link href={`/${locale}/quote`}>
              {dict.industries.discuss} <b aria-hidden="true">&rarr;</b>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
