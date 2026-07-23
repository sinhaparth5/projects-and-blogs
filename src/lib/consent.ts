export const CONSENT_STORAGE_KEY = "cookie-consent";
export const CONSENT_EVENT = "cookie-consent-change";

export type ConsentValue = "granted" | "denied";

export const CONSENT_FIELDS = [
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
  "analytics_storage",
] as const;

type ConsentField = (typeof CONSENT_FIELDS)[number];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function consentParams(
  value: ConsentValue,
): Record<ConsentField, ConsentValue> {
  return Object.fromEntries(
    CONSENT_FIELDS.map((field) => [field, value]),
  ) as Record<ConsentField, ConsentValue>;
}

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function setStoredConsent(value: ConsentValue) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  window.dispatchEvent(
    new CustomEvent<ConsentValue>(CONSENT_EVENT, { detail: value }),
  );
}

/** Sends a Consent Mode v2 update; the Google tag is loaded on every page
 * with `consent: default` denied (or granted, if already stored), so this
 * only needs to fire when the user actively makes or changes a choice. */
export function applyConsentUpdate(value: ConsentValue) {
  if (typeof window === "undefined" || typeof window.gtag !== "function")
    return;
  window.gtag("consent", "update", consentParams(value));
}
