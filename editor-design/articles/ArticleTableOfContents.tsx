"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { HeadingEntry } from "@/lib/articles/html-transform";

export default function ArticleTableOfContents({
  headings,
  mobile = false,
}: {
  headings: HeadingEntry[];
  mobile?: boolean;
}) {
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  const links = (
    <ul className="space-y-0.5">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={() => mobile && setOpen(false)}
            className={[
              "block rounded py-1 text-[12px] leading-snug transition-colors",
              h.level === 3 ? "pl-2.5" : "",
              activeId === h.id
                ? "toc-link-active"
                : "text-(--muted) hover:text-(--foreground)",
            ].join(" ")}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (mobile) {
    return (
      <div className="overflow-hidden rounded-md border border-(--border) bg-(--surface)">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-[13px] font-medium text-(--foreground)"
        >
          <span>Contents</span>
          <ChevronDown
            size={14}
            className={`text-(--muted) transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div className="border-t border-(--border) px-4 pb-3 pt-2">{links}</div>
        )}
      </div>
    );
  }

  return (
    <nav aria-label="Table of contents" className="max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">
        Contents
      </p>
      {links}
    </nav>
  );
}
