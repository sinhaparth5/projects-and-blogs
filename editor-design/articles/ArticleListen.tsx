"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square } from "lucide-react";

type State = "idle" | "playing" | "paused";

export default function ArticleListen({ url }: { url: string }) {
  const [state, setState] = useState<State>("idle");
  const [pct, setPct] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  function play() {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setState("playing");
      return;
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.ontimeupdate = () => {
      if (audio.duration) setPct(Math.round((audio.currentTime / audio.duration) * 100));
    };
    audio.onended = () => { setState("idle"); setPct(0); };
    audio.onerror = () => { setState("idle"); };

    audio.play().catch(() => setState("idle"));
    setState("playing");
  }

  function pause() {
    audioRef.current?.pause();
    setState("paused");
  }

  function stop() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.ontimeupdate = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    setState("idle");
    setPct(0);
  }

  const isActive = state !== "idle";

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-(--border) bg-(--surface)">
      <div className="flex items-center gap-3.5 px-4 py-3.5">
        <button
          type="button"
          onClick={state === "playing" ? pause : play}
          aria-label={state === "playing" ? "Pause" : state === "paused" ? "Resume" : "Play"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--foreground) text-(--background) transition-opacity hover:opacity-75"
        >
          {state === "playing" ? <Pause size={15} /> : <Play size={15} className="translate-x-px" />}
        </button>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-(--foreground)">
            {state === "playing" && (
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-(--foreground) animate-pulse" />
            )}
            {state === "paused" ? "Paused" : state === "playing" ? "Now listening" : "Listen to this article"}
          </p>
          <p className="mt-0.5 text-[11px] text-(--muted)">
            {isActive && pct > 0 ? `${pct}% complete` : "Hindi · Sarvam AI"}
          </p>
        </div>

        {isActive && (
          <button
            type="button"
            onClick={stop}
            aria-label="Stop"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-(--border) text-(--muted) transition-colors hover:border-(--foreground) hover:text-(--foreground)"
          >
            <Square size={11} />
          </button>
        )}
      </div>

      {isActive && (
        <div className="h-[2px] bg-(--border)">
          <div
            className="h-full bg-(--foreground) transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
