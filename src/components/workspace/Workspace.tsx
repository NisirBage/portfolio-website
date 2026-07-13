"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { ROOM_CANVAS, getDoorPlacements } from "@/lib/roomGeometry";
import { useCamera } from "@/hooks/useCamera";
import { useLayerStack } from "@/hooks/useLayerStack";
import { DURATION } from "@/lib/motion";
import { CameraContainer } from "./CameraContainer";
import { CameraTestHarness } from "./CameraTestHarness";
import { LayerPanel } from "./LayerPanel";

const DUMMY_TARGET = { x: 38.7, y: 50, scale: 2.2 };

/**
 * The establishing shot plus the camera (Milestone 3) and layer (Milestone
 * 4) systems. Layer order, bottom to top, unchanged from Milestone 2:
 *   1. Room shell (floor/wall zones)
 *   2. Door dressing (Background tier, non-interactive)
 * Camera and Layer both stay content-agnostic — Workspace is the
 * composition root that coordinates them for this one dummy trigger.
 * That coordination is intentionally inline here rather than a named
 * "Interaction Engine" module: there's exactly one consumer right now,
 * and generalizing before a second one exists would be exactly the
 * placeholder architecture the engineering rules warn against.
 *
 * LayerPanel renders as a sibling of the camera stage, not nested inside
 * it — the Layer engine and Camera engine are separate concerns per the
 * Layer Responsibilities rule, and the panel has no reason to sit inside
 * the stage's `overflow-hidden` clipping container built for the zoomed
 * pixel-art scene. This was also the fix for a real rendering bug found
 * during Milestone 4 testing (see ENGINEERING_DECISIONS.md): nesting an
 * `inert`-toggling, transform-transitioning panel inside that same
 * `overflow-hidden` container triggered a Chromium paint/layout desync
 * on unrelated siblings. Restructuring around the actual architectural
 * boundary fixed the real bug as a side effect, rather than working
 * around symptoms.
 */
export function Workspace() {
  const doors = getDoorPlacements(ASSETS.doorClosed.width, ASSETS.doorClosed.height);
  const camera = useCamera();
  const layers = useLayerStack();

  function openDummyLayer() {
    camera.focus(DUMMY_TARGET, DURATION.standard);
    layers.open("dummy");
  }

  function closeDummyLayer() {
    layers.close();
    camera.reset();
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-zinc-100 p-4 dark:bg-zinc-950">
      <div
        className="relative w-full max-w-5xl overflow-hidden"
        style={{ aspectRatio: `${ROOM_CANVAS.width} / ${ROOM_CANVAS.height}` }}
      >
        <CameraContainer target={camera.target} durationMs={camera.durationMs}>
          {/* Layer 1: room shell. `unoptimized` — see ENGINEERING_DECISIONS.md
              on why Next's image optimizer isn't used for pixel-art sprites. */}
          <Image
            src={ASSETS.roomShell.src}
            alt=""
            fill
            unoptimized
            priority
            className="pixel-art select-none"
          />

          {/* Layer 2: door dressing, decorative-tier, non-interactive. */}
          <Image
            src={ASSETS.doorClosed.src}
            alt=""
            width={ASSETS.doorClosed.width}
            height={ASSETS.doorClosed.height}
            unoptimized
            priority
            className="pixel-art absolute select-none"
            style={{
              left: `${doors.leftWall.left}%`,
              top: `${doors.leftWall.top}%`,
              width: `${doors.leftWall.width}%`,
              height: `${doors.leftWall.height}%`,
            }}
          />
          <Image
            src={ASSETS.doorClosed.src}
            alt=""
            width={ASSETS.doorClosed.width}
            height={ASSETS.doorClosed.height}
            unoptimized
            priority
            className="pixel-art absolute select-none"
            style={{
              left: `${doors.frontWall.left}%`,
              top: `${doors.frontWall.top}%`,
              width: `${doors.frontWall.width}%`,
              height: `${doors.frontWall.height}%`,
            }}
          />
        </CameraContainer>

        <CameraTestHarness onFocus={camera.focus} onReset={camera.reset} />

        <button
          type="button"
          onClick={openDummyLayer}
          className="absolute top-2 right-2 rounded border border-zinc-400 bg-white/80 px-2 py-1 text-xs dark:bg-zinc-900/80"
        >
          Open dummy layer
        </button>
      </div>

      {/* Milestone 4 proof-of-concept: one dummy Focus state with
          placeholder content, per IMPLEMENTATION_PLAN.md. Real content
          (Desk, Bookshelf, etc.) arrives in Milestones 5+. */}
      <LayerPanel isOpen={layers.activeLayer === "dummy"} title="Dummy Layer" onClose={closeDummyLayer}>
        <p>
          Placeholder content proving the Layer engine and state manager work end to end: URL-synced
          open/close, focus moves into this panel on open and returns to the trigger on close, Escape
          closes it, and the transition respects reduced motion.
        </p>
      </LayerPanel>
    </div>
  );
}
