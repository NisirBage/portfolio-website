"use client";

import { useEffect, useState } from "react";

const QUERY = "(orientation: portrait) and (max-width: 767px)";

/**
 * Phase H.1 — the one true gate for every portrait-specific behavior
 * this phase adds (camera resting target, label style, the first-visit
 * hint). Deliberately gated on *both* orientation and width, not
 * orientation alone: a tall, narrow desktop browser window is
 * `orientation: portrait` too, and the brief is explicit that desktop
 * and tablet layouts stay untouched regardless of window shape — width
 * is what actually distinguishes "a phone" from "a resized window." 767px
 * matches the classic phone/tablet boundary (an iPad in portrait is
 * 768px wide and must keep the existing "overview" treatment, per the
 * brief's own "preserve tablet layout" requirement).
 *
 * Starts `false` on every render (server and client agree, avoiding a
 * hydration mismatch) and syncs from `matchMedia` in an effect — the
 * same hydration-safe shape already established for `useAmbientAudio`/
 * `useVisitedHotspots`/`usePlayTime`, applied here because orientation
 * is exactly the kind of client-only fact those hooks were already
 * built to handle safely.
 */
export function usePortraitMode(): boolean {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe client-only sync, same justification as useAmbientAudio/useVisitedHotspots/usePlayTime.
    setIsPortrait(mql.matches);
    const handler = (event: MediaQueryListEvent) => setIsPortrait(event.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isPortrait;
}
