import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { ROOM_CANVAS, getDoorPlacements } from "@/lib/roomGeometry";
import { CameraContainer } from "./CameraContainer";

/**
 * The static establishing shot (SPATIAL_BLUEPRINT.md), Milestone 2 scope
 * only: room shell + door dressing, no hotspots, no lighting, no
 * animation. Layer order, bottom to top:
 *   1. Room shell (floor/wall zones)
 *   2. Door dressing (Background tier, non-interactive)
 * Furniture, hotspots, and everything above this belongs to later
 * milestones per IMPLEMENTATION_PLAN.md.
 */
export function Workspace() {
  const doors = getDoorPlacements(ASSETS.doorClosed.width, ASSETS.doorClosed.height);

  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-100 p-4 dark:bg-zinc-950">
      <div
        className="relative w-full max-w-5xl"
        style={{ aspectRatio: `${ROOM_CANVAS.width} / ${ROOM_CANVAS.height}` }}
      >
        <CameraContainer>
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
      </div>
    </div>
  );
}
