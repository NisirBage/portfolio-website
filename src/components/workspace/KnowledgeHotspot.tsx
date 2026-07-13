"use client";

import { KNOWLEDGE_HOTSPOT } from "@/lib/roomGeometry";

/**
 * The Bookshelf (Knowledge) hotspot — Milestone 7. Follows DeskHotspot's
 * pattern (idle-pulse discovery affordance, generous click target beyond
 * the underlying sprite). Sized smaller than the Desk's own hotspot since
 * a bookshelf reads as a narrower, taller object in the source room shell
 * — a reasonable-effort estimate, not a pixel-verified sprite footprint
 * (see roomGeometry.ts's honesty note on KNOWLEDGE_HOTSPOT/RESEARCH_HOTSPOT).
 */

interface KnowledgeHotspotProps {
  onOpen: () => void;
}

export function KnowledgeHotspot({ onOpen }: KnowledgeHotspotProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open the Bookshelf — knowledge"
      className="idle-pulse absolute flex items-center justify-center rounded-sm border-2 border-amber-400/70 bg-amber-200/20 outline-offset-2 hover:bg-amber-200/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500"
      style={{
        left: `${KNOWLEDGE_HOTSPOT.centerXPercent}%`,
        top: `${KNOWLEDGE_HOTSPOT.centerYPercent}%`,
        width: "9%",
        height: "20%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
