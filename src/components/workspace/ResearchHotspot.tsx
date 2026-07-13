"use client";

import { RESEARCH_HOTSPOT } from "@/lib/roomGeometry";

/**
 * The Research Journal hotspot — Milestone 7. Follows DeskHotspot's
 * pattern. Sized smaller than the Bookshelf's hotspot since the journal
 * reads as a small item (a notebook), not a furniture piece — a
 * reasonable-effort estimate, not a pixel-verified sprite footprint (see
 * roomGeometry.ts's honesty note on KNOWLEDGE_HOTSPOT/RESEARCH_HOTSPOT).
 */

interface ResearchHotspotProps {
  onOpen: () => void;
}

export function ResearchHotspot({ onOpen }: ResearchHotspotProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open the Research Journal"
      className="idle-pulse absolute flex items-center justify-center rounded-sm border-2 border-amber-400/70 bg-amber-200/20 outline-offset-2 hover:bg-amber-200/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500"
      style={{
        left: `${RESEARCH_HOTSPOT.centerXPercent}%`,
        top: `${RESEARCH_HOTSPOT.centerYPercent}%`,
        width: "6%",
        height: "8%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
