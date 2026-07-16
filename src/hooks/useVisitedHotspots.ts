"use client";

import { useCallback, useEffect, useState } from "react";
import { HOTSPOT_IDS, VISITED_STORAGE_KEY, isHotspotId, type HotspotId } from "@/lib/visited";

/**
 * Every id starts unvisited — derived from `HOTSPOT_IDS` rather than
 * hardcoded per-key, so a new hotspot (Phase D added three) only needs
 * an entry in that one array, not a second manually-kept-in-sync object
 * here.
 */
function emptyVisitedState(): Record<HotspotId, boolean> {
  return Object.fromEntries(HOTSPOT_IDS.map((id) => [id, false])) as Record<HotspotId, boolean>;
}

/**
 * Phase B, Part 8. Same hydration-safe shape as `useAmbientAudio`:
 * initialize to "nothing visited" on every render (server or client) so
 * the first client render matches the server-rendered HTML, then re-sync
 * from `localStorage` in a post-mount effect. A returning visitor's
 * checkmarks appear one tick after paint rather than risking a hydration
 * mismatch — the same tradeoff already made and documented for audio.
 */
export function useVisitedHotspots() {
  const [visited, setVisited] = useState<Record<HotspotId, boolean>>(emptyVisitedState);

  useEffect(() => {
    let stored: unknown;
    try {
      stored = JSON.parse(window.localStorage.getItem(VISITED_STORAGE_KEY) ?? "[]");
    } catch {
      stored = [];
    }
    if (!Array.isArray(stored)) return;
    const next = emptyVisitedState();
    for (const id of stored) {
      if (typeof id === "string" && isHotspotId(id)) next[id] = true;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe localStorage sync, same justification as useAmbientAudio.
    setVisited(next);
  }, []);

  const markVisited = useCallback((id: string) => {
    if (!isHotspotId(id)) return;
    setVisited((current) => {
      if (current[id]) return current;
      const next = { ...current, [id]: true };
      const stored = HOTSPOT_IDS.filter((hotspotId) => next[hotspotId]);
      window.localStorage.setItem(VISITED_STORAGE_KEY, JSON.stringify(stored));
      return next;
    });
  }, []);

  return { visited, markVisited };
}
