"use client";

import { Cookie } from "lucide-react";
import { useEffect, useState } from "react";
import {
  applyConsentUpdate,
  type ConsentValue,
  getStoredConsent,
  setStoredConsent,
} from "@/lib/consent";
import styles from "./cookie-consent.module.css";

export default function CookieConsent() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(getStoredConsent() === null);
    setReady(true);
  }, []);

  function respond(value: ConsentValue) {
    setStoredConsent(value);
    applyConsentUpdate(value);
    setOpen(false);
  }

  if (!ready) return null;

  if (!open) {
    return (
      <button
        type="button"
        className={styles.manageButton}
        onClick={() => setOpen(true)}
        aria-label="Manage cookie preferences"
      >
        <Cookie aria-hidden="true" size={18} />
      </button>
    );
  }

  return (
    <div
      className={styles.banner}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <p className={styles.text}>
        This site uses cookies for analytics to understand how it's used. We
        only set them with your permission, and you can change your choice any
        time from the cookie icon.
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
