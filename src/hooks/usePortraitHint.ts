"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "the-studio:portrait-hint-seen";
const VISIBLE_MS = 2400;

/**
 * Phase H.2, Part 4 — "Tap any highlighted object," shown once on a
 * visitor's first portrait visit, gone after ~2-3s, never shown again.
 * Same hydration-safe shape as every other `localStorage`-backed hook in
 * this codebase (`useAmbientAudio`/`useVisitedHotspots`/`usePlayTime`):
 * starts `false` on every render so server and client agree, then syncs
 * the real value in a post-mount effect.
 *
 * Deliberately its own tiny hook, not folded into `usePortraitMode` —
 * "is this a phone in portrait" and "has this visitor already seen the
 * hint" are independent facts with independent lifecycles (the first
 * can flip back and forth as someone rotates their phone; the second is
 * permanent once true), and conflating them would make either one
 * harder to reason about alone.
 */
export function usePortraitHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = window.localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      alreadySeen = false;
    }
    if (alreadySeen) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe localStorage sync, same justification as useAmbientAudio/useVisitedHotspots/usePlayTime.
    setVisible(true);
    window.localStorage.setItem(STORAGE_KEY, "true");
    const id = setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => clearTimeout(id);
  }, []);

  return visible;
}
