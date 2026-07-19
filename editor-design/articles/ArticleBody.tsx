"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type LightboxState = { src: string; alt: string; caption: string } | null;

export default function ArticleBody({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const openLightbox = useCallback((img: HTMLImageElement) => {
    const figure = img.closest("figure");
    const caption = figure?.querySelector("figcaption")?.textContent?.trim() ?? "";
    setLightbox({ src: img.src, alt: img.alt ?? "", caption });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    function handleClick(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (t.tagName === "IMG") openLightbox(t as HTMLImageElement);
    }
    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [openLightbox]);

  // Inject ¶ copy-link buttons next to every h2/h3 that has an id
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const headings = container.querySelectorAll<HTMLElement>("h2[id], h3[id]");
    const timers = new Map<HTMLButtonElement, ReturnType<typeof setTimeout>>();
    const cleanups: (() => void)[] = [];

    headings.forEach((heading) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "heading-anchor";
      btn.setAttribute("aria-label", "Copy link to section");
      btn.textContent = "¶";

      function onClick(e: MouseEvent) {
        e.preventDefault();
        const url = `${window.location.origin}${window.location.pathname}#${heading.id}`;
        navigator.clipboard.writeText(url).then(() => {
          btn.textContent = "✓";
          const prev = timers.get(btn);
          if (prev) clearTimeout(prev);
          timers.set(btn, setTimeout(() => { btn.textContent = "¶"; timers.delete(btn); }, 1500));
        }).catch(() => {});
      }

      btn.addEventListener("click", onClick);
      heading.appendChild(btn);
      cleanups.push(() => {
        btn.removeEventListener("click", onClick);
        if (heading.contains(btn)) heading.removeChild(btn);
        const t = timers.get(btn);
        if (t) { clearTimeout(t); timers.delete(btn); }
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lightbox]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  const displayText = lightbox ? (lightbox.caption || lightbox.alt) : "";

  return (
    <>
      <div
        ref={containerRef}
        className="tiptap-editor article-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt || "Enlarged image"}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          <button
            type="button"
            aria-label="Close image"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>

          <div
            className="relative z-10 flex flex-col items-center gap-3 px-4"
            style={{ animation: "lb-in 180ms ease-out", maxWidth: "92vw" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              style={{ maxHeight: "82vh", maxWidth: "100%", cursor: "default", borderRadius: "8px", objectFit: "contain" }}
            />
            {displayText && (
              <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.7)", maxWidth: "60ch", lineHeight: "1.5" }}>
                {displayText}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
