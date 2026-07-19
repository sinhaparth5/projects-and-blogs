"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mic } from "lucide-react";

type State = "idle" | "loading" | "done" | "error";

export default function AdminGenerateAudio({ slug }: { slug: string }) {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function generate() {
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/articles/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        setState("done");
        router.refresh();
      } else {
        const { error } = await res.json() as { error?: string };
        setErrorMsg(error ?? "Unknown error");
        setState("error");
      }
    } catch {
      setErrorMsg("Request failed");
      setState("error");
    }
  }

  return (
    <div className="mb-3 flex items-center gap-2.5 rounded-lg border border-dashed border-(--border) px-3.5 py-2.5 text-[12px]">
      <span className="shrink-0 rounded bg-(--surface) px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-(--muted)">
        Admin
      </span>
      <span className="text-(--muted)">Hindi audio</span>
      <button
        type="button"
        onClick={generate}
        disabled={state === "loading" || state === "done"}
        className="ml-auto flex items-center gap-1.5 rounded-md border border-(--border) bg-(--surface) px-2.5 py-1 text-[12px] text-(--foreground) transition-colors hover:border-(--foreground) disabled:pointer-events-none disabled:opacity-50"
      >
        {state === "loading" ? (
          <><Loader2 size={11} className="animate-spin" /> Generating…</>
        ) : state === "done" ? (
          "Generated ✓"
        ) : (
          <><Mic size={11} /> {state === "error" ? "Retry" : "Generate"}</>
        )}
      </button>
      {state === "error" && errorMsg && (
        <span className="text-[11px] text-red-500 truncate max-w-[200px]" title={errorMsg}>
          {errorMsg}
        </span>
      )}
    </div>
  );
}
