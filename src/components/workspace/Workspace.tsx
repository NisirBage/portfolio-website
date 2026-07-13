"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { ROOM_CANVAS, DESK_HOTSPOT, getDoorPlacements } from "@/lib/roomGeometry";
import { useCamera } from "@/hooks/useCamera";
import { useLayerStack } from "@/hooks/useLayerStack";
import { DURATION } from "@/lib/motion";
import { PersistentActions } from "@/components/PersistentActions";
import { CameraContainer } from "./CameraContainer";
import { CameraTestHarness } from "./CameraTestHarness";
import { LayerPanel } from "./LayerPanel";
import { DeskHotspot } from "./DeskHotspot";
import { DeskPanel } from "./DeskPanel";

/**
 * The establishing shot plus the camera (Milestone 3), layer (Milestone
 * 4), and now the first real hotspot with real content (Milestone 5).
 * Layer order, bottom to top:
 *   1. Room shell (floor/wall zones)
 *   2. Door dressing (Background tier, non-interactive)
 *   3. Desk hotspot (Milestone 5's first real, content-backed hotspot)
 * Camera and Layer both stay content-agnostic — Workspace is the
 * composition root that coordinates them. The Milestone 4 "dummy layer"
 * proof-of-concept is retired now that a real consumer (Desk) exists;
 * keeping both would be exactly the placeholder architecture the
 * engineering rules warn against.
 */
export function Workspace() {
  const doors = getDoorPlacements(ASSETS.doorClosed.width, ASSETS.doorClosed.height);
  const camera = useCamera();
  const layers = useLayerStack();

  function openDesk() {
    camera.focus(
      { x: DESK_HOTSPOT.centerXPercent, y: DESK_HOTSPOT.centerYPercent, scale: DESK_HOTSPOT.cameraScale },
      DURATION.standard,
    );
    layers.open("desk");
  }

  function closeLayer() {
    layers.close();
    camera.reset();
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-zinc-100 p-4 dark:bg-zinc-950">
      <PersistentActions />

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

          {/* Layer 3: the Desk hotspot — real content, Milestone 5. */}
          <DeskHotspot onOpen={openDesk} />
        </CameraContainer>

        <CameraTestHarness onFocus={camera.focus} onReset={camera.reset} />
      </div>

      <LayerPanel isOpen={layers.activeLayer === "desk"} title="Desk" onClose={closeLayer}>
        <DeskPanel />
      </LayerPanel>
    </div>
  );
}
