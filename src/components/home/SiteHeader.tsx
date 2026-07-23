"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/app/page.module.css";

function Spark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 66 99" aria-hidden="true" focusable="false" {...props}>
      <path d="M66 49.5C54 45.96 39 24.75 33 0 27 24.75 15 44.79 0 49.5 18 56.57 25 82.5 33 99 39 84.86 48 56.57 66 49.5Z" />
    </svg>
  );
}

const navItems = [
  { href: "/", label: "Home", active: true, prefetch: undefined },
  { href: "/shine/", label: "Shine", active: false, prefetch: false },
  { href: "/parth/", label: "Parth", active: false, prefetch: false },
  { href: "/pb/blogs/", label: "Writing", active: false, prefetch: undefined },
] as const;

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={styles.siteHeader}>
      <Link
        className={styles.brand}
        href="/"
        aria-label="Projects and Blogs home"
        onClick={() => setOpen(false)}
      >
        <Spark aria-hidden="true" />
        P&B
      </Link>

      <nav className={styles.desktopNav} aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            className={item.active ? styles.activeLink : undefined}
            href={item.href}
            prefetch={item.prefetch}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className={styles.navToggle}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <X aria-hidden="true" size={20} />
        ) : (
          <Menu aria-hidden="true" size={20} />
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className={styles.navBackdrop}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav
            id="mobile-nav"
            className={styles.mobileNav}
            aria-label="Primary navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                className={item.active ? styles.activeLink : undefined}
                href={item.href}
                prefetch={item.prefetch}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}
