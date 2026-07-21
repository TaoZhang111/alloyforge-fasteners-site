"use client";

import { useEffect } from "react";

export default function BodyClass({ className }) {
  useEffect(() => {
    document.body.classList.add(className);
    return () => document.body.classList.remove(className);
  }, [className]);

  return null;
}
