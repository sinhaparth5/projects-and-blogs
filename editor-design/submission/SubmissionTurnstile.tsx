"use client";

import Script from "next/script";
import { DEFAULT_SCRIPT_ID, SCRIPT_URL, Turnstile } from "@marsidev/react-turnstile";
import styles from "./SubmissionTurnstile.module.css";

type SubmissionTurnstileProps = {
  siteKey: string;
};

export default function SubmissionTurnstile({ siteKey }: SubmissionTurnstileProps) {
  return (
    <div className={styles.root}>
      <Script id={DEFAULT_SCRIPT_ID} src={SCRIPT_URL} strategy="afterInteractive" />
      <Turnstile
        siteKey={siteKey}
        injectScript={false}
        options={{
          theme: "auto",
          size: "flexible",
          responseField: true,
          responseFieldName: "cf-turnstile-response",
        }}
      />
    </div>
  );
}
