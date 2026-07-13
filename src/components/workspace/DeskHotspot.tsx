"use client";

import { DESK_HOTSPOT } from "@/lib/roomGeometry";

/**
 * The first real hotspot (Milestone 5) — everything before this was
 * either room dressing or temporary test scaffolding. Renders inside
 * CameraContainer so it pans/zooms with the room like any other layer.
 *
 * The idle pulse (`.idle-pulse`, globals.css) is the discovery-mechanism
 * fix from DESIGN_DEBT.md Finding #2 — something moves without requiring
 * a hover, so a first-time visitor has a reason to believe the scene is
 * interactive at all.
 */

interface DeskHotspotProps {
  onOpen: () => void;
}

export function DeskHotspot({ onOpen }: DeskHotspotProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open the Desk — projects"
      className="idle-pulse absolute flex items-center justify-center rounded-sm border-2 border-amber-400/70 bg-amber-200/20 outline-offset-2 hover:bg-amber-200/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500"
      style={{
        left: `${DESK_HOTSPOT.centerXPercent}%`,
        top: `${DESK_HOTSPOT.centerYPercent}%`,
        width: "12%",
        height: "22%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
