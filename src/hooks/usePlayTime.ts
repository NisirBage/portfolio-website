"use client";

import { useEffect, useState } from "react";

export const PLAY_TIME_STORAGE_KEY = "the-studio:play-time-seconds";

function formatPlayTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/**
 * Phase G — Save Slot's "Play Time" counter. Same hydration-safe shape as
 * `useAmbientAudio`/`useVisitedHotspots`: starts at 0 on every render
 * (server and client agree), then restores the real total from
 * `localStorage` in a post-mount effect, so a returning visitor's saved
 * time appears one tick after paint rather than risking a mismatch.
 *
 * Ticks every second while mounted — not gated on
 * `document.visibilitychange`. Two reasons, not one: the brief's own
 * spec ("increment while the visitor remains on the website... reset
 * only when localStorage is cleared") reads as "the page is open," not
 * "the tab has focus," and gating on visibility would make this
 * un-verifiable in this project's own Browser-pane tool, which has
 * reported `document.hidden: true` for the entire session regardless of
 * actual fronting state since Phase C (see `ENGINEERING_DECISIONS.md`).
 *
 * Persisted every tick, not throttled — a `setInterval` firing once a
 * second is cheap enough that batching writes to save on `localStorage`
 * calls isn't worth the small window of drift it would introduce between
 * the displayed value and the last-saved one on an unexpected refresh.
 */
export function usePlayTime() {
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(PLAY_TIME_STORAGE_KEY));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe localStorage sync, same justification as useAmbientAudio/useVisitedHotspots.
    setTotalSeconds(Number.isFinite(stored) && stored > 0 ? stored : 0);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTotalSeconds((current) => {
        const next = current + 1;
        window.localStorage.setItem(PLAY_TIME_STORAGE_KEY, String(next));
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return { totalSeconds, formatted: formatPlayTime(totalSeconds) };
}
