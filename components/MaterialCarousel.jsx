"use client";

import { useState } from "react";

export default function MaterialCarousel({ dict }) {
  const m = dict.materials;
  const [current, setCurrent] = useState(0);
  const count = m.slides.length;

  function show(index) {
    setCurrent((index + count) % count);
  }

  return (
    <div
      className="material-carousel"
      data-reveal
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          show(current - 1);
        }
        if (event.key === "ArrowRight") {
          show(current + 1);
        }
      }}
    >
      <div className="material-viewport">
        {m.slides.map((slide, index) => (
          <article
            key={slide.name}
            className={`material-slide${index === current ? " is-active" : ""}`}
            aria-hidden={index !== current}
          >
            <div className="material-copy">
              <span className="material-family">{slide.family}</span>
              <h3>{slide.name}</h3>
              <p>{slide.copy}</p>
              <dl>
                <div>
                  <dt>{m.serviceLabel}</dt>
                  <dd>{slide.service}</dd>
                </div>
                <div>
                  <dt>{m.reviewLabel}</dt>
                  <dd>{slide.review}</dd>
                </div>
              </dl>
            </div>
            <figure className="material-image">
              <img src={slide.image} alt={slide.imageAlt} />
            </figure>
          </article>
        ))}
      </div>
      <div className="material-controls">
        <p>
          <span>{String(current + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}
        </p>
        <div>
          <button type="button" aria-label={m.prevAria} onClick={() => show(current - 1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10.8 5.2 4 12l6.8 6.8 1.2-1.2-4.8-4.8H20v-1.6H7.2L12 6.4l-1.2-1.2Z" />
            </svg>
          </button>
          <button type="button" aria-label={m.nextAria} onClick={() => show(current + 1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13.2 5.2 20 12l-6.8 6.8-1.2-1.2 4.8-4.8H4v-1.6h12.8L12 6.4l1.2-1.2Z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="material-progress" aria-hidden="true">
        <i style={{ width: `${((current + 1) / count) * 100}%` }}></i>
      </div>
    </div>
  );
}
