"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function initRevealAnimations(reduceMotion) {
  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  if (!revealItems.length) {
    return () => {};
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" }
  );

  revealItems.forEach((item) => observer.observe(item));
  return () => observer.disconnect();
}

function initTasteMotion() {
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("gsap-enabled");

  const context = gsap.context(() => {
    gsap.utils.toArray("[data-scale-media]").forEach((media) => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: media,
            start: "top 94%",
            end: "bottom 8%",
            scrub: 1.1
          }
        })
        .fromTo(media, { scale: 0.86, opacity: 0.3 }, { scale: 1, opacity: 1, duration: 0.46, ease: "none" })
        .to(media, { scale: 0.96, opacity: 0.22, duration: 0.54, ease: "none" });
    });

    const stackCards = gsap.utils.toArray("[data-stack-card]");
    const stackMedia = gsap.matchMedia();

    stackMedia.add("(min-width: 761px)", () => {
      stackCards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.36, y: 110, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 94%",
              end: "top 56%",
              scrub: 0.9
            }
          }
        );
      });
    });
  });

  return () => {
    context.revert();
    document.documentElement.classList.remove("gsap-enabled");
  };
}

export default function HomeEffects() {
  useEffect(() => {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanupReveal = () => {};
    let cleanupMotion = null;

    function sync() {
      cleanupReveal();
      cleanupReveal = initRevealAnimations(reduceMotionQuery.matches);
      if (reduceMotionQuery.matches) {
        cleanupMotion?.();
        cleanupMotion = null;
      } else if (!cleanupMotion) {
        cleanupMotion = initTasteMotion();
      }
    }

    sync();
    reduceMotionQuery.addEventListener?.("change", sync);

    return () => {
      reduceMotionQuery.removeEventListener?.("change", sync);
      cleanupReveal();
      cleanupMotion?.();
    };
  }, []);

  return null;
}
