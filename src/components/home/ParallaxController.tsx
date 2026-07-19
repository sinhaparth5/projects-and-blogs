"use client";

import { useEffect } from "react";

export default function ParallaxController() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const layers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    );
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewportCenter = window.innerHeight / 2;
      for (const layer of layers) {
        const speed = Number(layer.dataset.speed ?? 0);
        const rect = layer.getBoundingClientRect();
        const distance = rect.top + rect.height / 2 - viewportCenter;
        const offset = Math.max(-64, Math.min(64, distance * speed));
        layer.style.translate = `0 ${offset}px`;
      }
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      for (const layer of layers) layer.style.removeProperty("translate");
    };
  }, []);

  return null;
}
