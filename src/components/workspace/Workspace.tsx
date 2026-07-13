"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { ROOM_CANVAS, getDoorPlacements } from "@/lib/roomGeometry";
import { useCamera } from "@/hooks/useCamera";
import { CameraContainer } from "./CameraContainer";
import { CameraTestHarness } from "./CameraTestHarness";

/**
 * The establishing shot plus the camera system (Milestone 3). Layer
 * order, bottom to top, unchanged from Milestone 2:
 *   1. Room shell (floor/wall zones)
 *   2. Door dressing (Background tier, non-interactive)
 * The camera itself knows nothing about either — it's a generic
 * translate/scale system CameraTestHarness happens to be driving right
 * now. Hotspots, layers, and content still belong to later milestones.
 */
export function Workspace() {
  const doors = getDoorPlacements(ASSETS.doorClosed.width, ASSETS.doorClosed.height);
  const camera = useCamera();

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-zinc-100 p-4 dark:bg-zinc-950">
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
      </div>
    </div>
  );
}
