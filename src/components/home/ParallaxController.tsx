"use client";

import { useEffect } from "react";

interface ParallaxLayer {
  layer: HTMLElement;
  center: number;
  speed: number;
}

export default function ParallaxController() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const layers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    );
    let bases: ParallaxLayer[] = [];
    let frame = 0;

    // Measure untransformed positions once; reading rects after writing
    // translate feeds the offset back into the next measurement.
    const measure = () => {
      for (const layer of layers) layer.style.removeProperty("translate");
      bases = layers.map((layer) => {
        const rect = layer.getBoundingClientRect();
        return {
          layer,
          center: rect.top + window.scrollY + rect.height / 2,
          speed: Number(layer.dataset.speed ?? 0),
        };
      });
    };

    const update = () => {
      frame = 0;
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      for (const { layer, center, speed } of bases) {
        const offset = Math.max(
          -96,
          Math.min(96, (center - viewportCenter) * speed),
        );
        layer.style.translate = `0 ${offset.toFixed(1)}px`;
      }
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const handleResize = () => {
      measure();
      requestUpdate();
    };

    measure();
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", handleResize);
      if (frame) window.cancelAnimationFrame(frame);
      for (const layer of layers) layer.style.removeProperty("translate");
    };
  }, []);

  return null;
}
