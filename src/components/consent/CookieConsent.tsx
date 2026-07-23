"use client";

import { useEffect, useState } from "react";
import { getStoredConsent, setStoredConsent } from "@/lib/consent";
import styles from "./cookie-consent.module.css";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
  }, []);

  function respond(value: "granted" | "denied") {
    setStoredConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className={styles.banner}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <p className={styles.text}>
        This site uses cookies for analytics to understand how it's used. We
        only set them with your permission.
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => respond("denied")}
        >
          Decline
        </button>
        <button
          type="button"
          className={styles.primary}
          onClick={() => respond("granted")}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
