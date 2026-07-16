"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import {
  ROOM_CANVAS,
  DESK_HOTSPOT,
  KNOWLEDGE_HOTSPOT,
  RESEARCH_HOTSPOT,
  LEADERSHIP_HOTSPOT,
  CLOCK_HOTSPOT,
  COFFEE_HOTSPOT,
  WINDOW_HOTSPOT,
  ROLODEX_HOTSPOT,
  PORTFOLIO_HOTSPOT,
  PORTRAIT_CAMERA_REST,
  getDoorPlacements,
  getSpritePlacement,
} from "@/lib/roomGeometry";
import { useCamera, type CameraTarget } from "@/hooks/useCamera";
import { useLayerStack } from "@/hooks/useLayerStack";
import { useVisitedHotspots } from "@/hooks/useVisitedHotspots";
import { usePopupAudio } from "@/hooks/usePopupAudio";
import { useToast } from "@/hooks/useToast";
import { usePortraitMode } from "@/hooks/usePortraitMode";
import { DURATION } from "@/lib/motion";
import { CameraContainer } from "./CameraContainer";
import { LayerPanel } from "./LayerPanel";
import { DeskHotspot } from "./DeskHotspot";
import { DeskPanel } from "./DeskPanel";
import { DeskDressing } from "./DeskDressing";
import { KnowledgeHotspot } from "./KnowledgeHotspot";
import { KnowledgePanel } from "./KnowledgePanel";
import { ResearchHotspot } from "./ResearchHotspot";
import { ResearchPanel } from "./ResearchPanel";
import { LeadershipHotspot } from "./LeadershipHotspot";
import { LeadershipPanel } from "./LeadershipPanel";
import { ClockHotspot } from "./ClockHotspot";
import { TimelinePanel } from "./TimelinePanel";
import { CorkboardHotspot } from "./CorkboardHotspot";
import { AboutMePanel } from "./AboutMePanel";
import { WindowHotspot } from "./WindowHotspot";
import { FuturePanel } from "./FuturePanel";
import { RolodexHotspot } from "./RolodexHotspot";
import { ContactPanel } from "./ContactPanel";
import { PortfolioHotspot } from "./PortfolioHotspot";
import { ResumePanel } from "./ResumePanel";
import { Toast } from "./Toast";
import { Gramophone } from "./Gramophone";
import { PortraitHeader } from "./PortraitHeader";
import { PortraitFooter } from "./PortraitFooter";

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
  // *Revised, Phase B (Camera Audit):* the camera used to be moved
  // exclusively by the four `openX` onClick handlers below, each
  // bundling a `cameraFocus` call together with `layersOpen`. That
  // worked for clicks, but the camera had no other tie to which layer
  // is actually open — it was a plain `useState`, not derived from
  // `layers.activeLayer` the way `LayerPanel`'s own `isOpen` prop is.
  // Any path that changed `activeLayer` without going through one of
  // those exact handlers (browser Back/Forward, a direct `?panel=X`
  // deep link, forward navigation) left the camera exactly where it
  // was, desynced from whichever panel the URL says is open —
  // reproduced and confirmed live: opening Leadership via its hotspot
  // correctly zoomed the camera, then pressing browser Back correctly
  // closed the panel but left the camera at the Leadership zoom, never
  // reset. This is what was reported as "the camera doesn't return to
  // the exact establishing shot" — not accumulated transform drift (the
  // reset target is a fixed constant, verified byte-identical across
  // repeated cycles in Phase A), but a genuine architecture gap: two
  // pieces of state that only stayed in sync when one specific function
  // was the one that changed them.
  //
  // Fixed by making the camera a *consequence* of `activeLayer`, not a
  // side effect of a click: the effect below re-derives the camera
  // target from `layers.activeLayer` on every change, regardless of
  // what caused it. `openDesk` etc. now only call `layersOpen`; the
  // effect handles the camera uniformly for hotspot clicks, browser
  // navigation, and deep links alike. See CAMERA_AUDIT.md.
  const doors = getDoorPlacements(ASSETS.doorClosed.width, ASSETS.doorClosed.height);
  const camera = useCamera();
  // Phase H.1 — the only other consumer of "is this a phone in
  // portrait" besides the hotspot labels. `useCamera`/`cameraTransform`
  // themselves are untouched (the brief's own "camera logic... must
  // remain untouched"); this just decides *which* target the existing,
  // unmodified `focus`/`reset` functions are pointed at.
  const isPortrait = usePortraitMode();
  const layers = useLayerStack();
  const { visited, markVisited } = useVisitedHotspots();
  // Phase F.1, Parts 2-4: one popup open/close SFX pair, watching
  // `activeLayer` itself rather than any one panel's `isOpen` — see
  // `usePopupAudio.ts` for why that distinction is what keeps a direct
  // panel-to-panel switch from playing both a close and an open sound
  // at once.
  usePopupAudio(layers.activeLayer);
  // Phase F.1, Part 6: the Rolodex's copy/open actions surface a toast.
  // Lifted to `Workspace` (not local to `ContactPanel`) so the toast, a
  // fixed-position element independent of any one panel, keeps rendering
  // even mid-close-animation rather than unmounting with its trigger.
  const { toast, showToast } = useToast();
  // Destructured so the useCallback deps below reference the stable
  // functions directly, not the containing `camera`/`layers` objects —
  // those are new object literals every render (`useCamera`/
  // `useLayerStack` don't memoize their return value), so depending on
  // them would silently defeat the memoization. See
  // ENGINEERING_DECISIONS.md's Production Hardening entry.
  const { focus: cameraFocus, reset: cameraReset } = camera;
  const { open: layersOpen, close: layersClose } = layers;

  /**
   * Pure decorative dressing (VISUAL_PUNCHLIST.md P1, Phase 1 reuse pass)
   * — no hotspot, no click handler.
   *
   * *Revised, Concept Reconciliation:* the walnut bookshelf's original
   * position (centerX 51%, native size) genuinely overlapped Knowledge's
   * oak bookshelf (55.5%) — their footprints spanned 42.32%-59.68% and
   * 47.34%-63.66% respectively, a real ~12-point overlap, not a rendering
   * artifact. Fixed by (1) moving it right, past Knowledge's own right
   * edge with a visible gap, and (2) scaling it down to read as the
   * secondary/smaller of the two shelves — the concept requires "one
   * dominant, one secondary," and Knowledge's oak shelf is the dominant,
   * interactive one. Displayed at ~0.64x native size (32x31 vs native
   * 50x48) rather than native, both dimensions scaled together to avoid
   * distorting the pixel art. See ENGINEERING_DECISIONS.md for the full
   * footprint math (gap ≈ 3.3% of canvas width, no overlap at either
   * scale).
   *
   * *Revised, Version 1 Launch Readiness (Visual Art Direction pass):*
   * centerY moved from 50 to 56.25 — a grounding fix, paired with the
   * same adjustment to `RESEARCH_HOTSPOT` (see roomGeometry.ts). At 50%
   * this sprite's base sat 9px higher than the oak bookshelf's own base
   * despite standing on the same floor, a measured "floating" defect.
   * 56.25% aligns this sprite's base to the oak bookshelf's base exactly
   * (both now bottom out at canvas y=96.5px).
   */
  const WALNUT_BOOKSHELF_DISPLAY_WIDTH = 32;
  const WALNUT_BOOKSHELF_DISPLAY_HEIGHT = 31;
  const walnutBookshelfPlacement = getSpritePlacement(
    72.5,
    56.25,
    WALNUT_BOOKSHELF_DISPLAY_WIDTH,
    WALNUT_BOOKSHELF_DISPLAY_HEIGHT,
  );

  // The single source of truth for "what camera target does each layer
  // correspond to" — used only by the sync effect below. Not exported;
  // roomGeometry.ts's own hotspot constants remain the real source of
  // truth for each target's numbers, this just maps the URL's string id
  // to the right one.
  const cameraTargetsByLayer: Record<string, CameraTarget> = {
    desk: { x: DESK_HOTSPOT.centerXPercent, y: DESK_HOTSPOT.centerYPercent, scale: DESK_HOTSPOT.cameraScale },
    knowledge: {
      x: KNOWLEDGE_HOTSPOT.centerXPercent,
      y: KNOWLEDGE_HOTSPOT.centerYPercent,
      scale: KNOWLEDGE_HOTSPOT.cameraScale,
    },
    research: {
      x: RESEARCH_HOTSPOT.centerXPercent,
      y: RESEARCH_HOTSPOT.centerYPercent,
      scale: RESEARCH_HOTSPOT.cameraScale,
    },
    leadership: {
      x: LEADERSHIP_HOTSPOT.centerXPercent,
      y: LEADERSHIP_HOTSPOT.centerYPercent,
      scale: LEADERSHIP_HOTSPOT.cameraScale,
    },
    // Phase D — Clock (Timeline), Coffee Corner (About Me), Window (Future).
    clock: { x: CLOCK_HOTSPOT.centerXPercent, y: CLOCK_HOTSPOT.centerYPercent, scale: CLOCK_HOTSPOT.cameraScale },
    coffee: {
      x: COFFEE_HOTSPOT.centerXPercent,
      y: COFFEE_HOTSPOT.centerYPercent,
      scale: COFFEE_HOTSPOT.cameraScale,
    },
    window: {
      x: WINDOW_HOTSPOT.centerXPercent,
      y: WINDOW_HOTSPOT.centerYPercent,
      scale: WINDOW_HOTSPOT.cameraScale,
    },
    // Phase F.1 — Rolodex (Contact), Leather Portfolio (Resume).
    contact: {
      x: ROLODEX_HOTSPOT.centerXPercent,
      y: ROLODEX_HOTSPOT.centerYPercent,
      scale: ROLODEX_HOTSPOT.cameraScale,
    },
    resume: {
      x: PORTFOLIO_HOTSPOT.centerXPercent,
      y: PORTFOLIO_HOTSPOT.centerYPercent,
      scale: PORTFOLIO_HOTSPOT.cameraScale,
    },
  };

  // The camera fix itself: derive the target from `activeLayer` every
  // time it changes, for any reason — a hotspot click, browser Back/
  // Forward, or a deep link landing directly on `?panel=X`. This is the
  // one place the camera is ever moved now; `openDesk` etc. below only
  // touch the URL, and this effect reacts to that, rather than the two
  // being separately triggered by the same handler and only staying in
  // sync when nothing else changes the URL.
  useEffect(() => {
    const target = layers.activeLayer ? cameraTargetsByLayer[layers.activeLayer] : undefined;
    if (target) {
      cameraFocus(target, DURATION.camera);
    } else if (isPortrait) {
      // Phase H.1, Part 2: "when it closes, return to the portrait
      // resting camera, not necessarily the desktop resting camera."
      // `cameraReset()` always targets the fixed `CAMERA_IDENTITY`
      // constant inside `useCamera.ts` — untouched, per the brief's own
      // "camera logic must remain untouched." This branch just chooses
      // a different, equally real target for the *same* unmodified
      // `cameraFocus` function to animate to.
      cameraFocus(PORTRAIT_CAMERA_REST, DURATION.camera);
    } else {
      cameraReset(DURATION.camera);
    }
    // `cameraTargetsByLayer` is a fresh object every render (it's built
    // from `roomGeometry.ts` constants that never change), so it's
    // deliberately left out of the dependency array rather than
    // recreated with `useMemo` for a value that's already cheap to
    // build and never actually varies — only `layers.activeLayer`
    // (the real trigger), `isPortrait`, and the two stable camera
    // functions are real dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers.activeLayer, isPortrait, cameraFocus, cameraReset]);

  // Phase B, Part 8: mark a hotspot visited the moment its layer becomes
  // active — reachable the same way the camera-sync effect above is,
  // covering a hotspot click, a deep link, and browser Back/Forward
  // landing on `?panel=X` alike, not just clicks. `markVisited` is a
  // no-op after the first visit (see the hook), so this is safe to fire
  // on every `activeLayer` change without an extra guard here.
  useEffect(() => {
    if (layers.activeLayer) markVisited(layers.activeLayer);
  }, [layers.activeLayer, markVisited]);

  // Wrapped in useCallback (Production Hardening performance pass) — these
  // are passed as `onClose`/`onOpen` props, and `closeLayer` specifically
  // sits in `LayerPanel`'s Escape-listener `useEffect` dependency array.
  // Unmemoized, that effect tore down and re-added a document-level
  // keydown listener on every Workspace render (any camera or layer
  // change), not just on actual open/close — cheap per-call, but real,
  // identified via reading the effect's own dependency array rather than
  // profiled, since no profiler is available in this environment. See
  // ENGINEERING_DECISIONS.md's Production Hardening entry.
  //
  // *Revised, Phase B:* these no longer touch the camera directly — see
  // the sync effect above for why. Each one is now just a named,
  // readable wrapper around `layersOpen(id)`; kept as separate functions
  // (rather than inlining `() => layersOpen("desk")` at each call site)
  // because the per-hotspot names document intent at the JSX call site
  // and match the existing convention every other pass on this project
  // has followed.
  const openDesk = useCallback(() => layersOpen("desk"), [layersOpen]);
  const openKnowledge = useCallback(() => layersOpen("knowledge"), [layersOpen]);
  const openResearch = useCallback(() => layersOpen("research"), [layersOpen]);
  const openLeadership = useCallback(() => layersOpen("leadership"), [layersOpen]);
  const openClock = useCallback(() => layersOpen("clock"), [layersOpen]);
  const openCoffee = useCallback(() => layersOpen("coffee"), [layersOpen]);
  const openWindow = useCallback(() => layersOpen("window"), [layersOpen]);
  const openContact = useCallback(() => layersOpen("contact"), [layersOpen]);
  const openResume = useCallback(() => layersOpen("resume"), [layersOpen]);

  const closeLayer = useCallback(() => {
    layersClose();
  }, [layersClose]);

  return (
    <div
      className="relative flex w-full flex-1 flex-col overflow-x-hidden bg-zinc-100 p-4 dark:bg-[radial-gradient(ellipse_at_center,_#3b2c1f_0%,_#241a12_65%,_#1a120c_100%)]"
    >
      {/* Phase H.2 fix: this used to be `h-full` — a percentage height.
          Its parent (`AppShell`'s wrapper) only reaches its own 844px-ish
          height via `flex-1` growth inside `<main>`, never an explicit
          `height` value, and `height: 100%` measured live against that
          chain silently resolved to 0/auto (confirmed via
          `getBoundingClientRect()`: this div was collapsing to its own
          content height, ~297px on a 844px-tall phone, leaving the room
          pinned near the top instead of filling/centering in the
          viewport — present before this phase's header/footer edit too,
          just unnoticed since the dark backdrop made the shortfall hard
          to see by eye). `flex-1` matches the sizing strategy already
          used one level up and one level down (the room's own centering
          wrapper), and — unlike a percentage — doesn't depend on the
          parent's height being "definite" by the CSS spec's stricter
          definition. */}
      {/* Phase B, Part 3: the previous `dark:bg-zinc-950` read as harsh
          near-black against the warm pixel-art room. Replaced with a warm
          walnut-brown radial vignette (never pure black/grey) — darkens
          gently toward the edges like a museum spotlight, keeping the
          room itself the brightest, most central thing on the page. */}
      {/* Phase F.1, Part 6/7: `PersistentActions` (the screen-fixed
          Contact/Resume corner links) is deleted — the Rolodex and
          Leather Portfolio hotspots below are its replacement, per "the
          room itself should remain the navigation surface, no duplicate
          controls." */}
      <Toast toast={toast} />

      {/* Phase H.2, Part 1/2: the root changed from a single-row
          centering flex to a column with the room's own centering
          wrapper as its one real flex item — on desktop/landscape
          (`isPortrait` false, header/footer both null), `Toast` is
          `position: fixed` and doesn't participate in flex layout, so
          this collapses to exactly the same "one flex-1 item, centered
          both axes" result the original single-row flex produced.
          Verified live at 1920/1440/1024/768px and both landscape phone
          sizes — byte-for-byte identical room position and size to
          before this change. On portrait, the header/footer become real
          siblings and the room's wrapper shares the remaining height
          with them instead of claiming all of it. */}
      {isPortrait && <PortraitHeader />}

      <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
        <div
          className="relative w-full max-w-5xl overflow-hidden"
          style={{
            aspectRatio: `${ROOM_CANVAS.width} / ${ROOM_CANVAS.height}`,
            // Phase H.1, Part 1: on portrait, the frame's own on-page
            // footprint grows — not just the camera's content zoom — or
            // "reduce dead space" would be a no-op (a zoomed *view*
            // through an unchanged-size frame doesn't shrink the
            // whitespace around the frame itself). `transform: scale`, not
            // `width` — this element is a flex item of the wrapper above,
            // and a percentage `width` here gets silently shrunk back down
            // by the flex algorithm's default `flex-shrink: 1` the moment
            // it would exceed the container's available space (confirmed
            // live: `width: 108%` computed back down to exactly 100% in
            // the rendered box). `transform` doesn't participate in flex
            // sizing at all, so it isn't fighting that negotiation.
            // 1.05 is half of the real, live-verified safe combined zoom
            // (see `PORTRAIT_CAMERA_REST`'s own comment for why the first
            // attempt, 1.08/1.08, clipped 2px off the Window hotspot on a
            // real measurement) — the other half is spent on the camera's
            // own zoom below, so the two compound rather than each
            // independently spending the full budget and cropping a
            // hotspot for real. The outer wrapper's existing
            // `overflow-x-hidden` (unchanged) clips the symmetric excess
            // this produces; centered via the same unchanged
            // `items-center justify-center` on that wrapper.
            transform: isPortrait ? "scale(1.05)" : undefined,
          }}
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
          <DeskHotspot onOpen={openDesk} visited={visited.desk} />

          {/* Layer 4: Bookshelf (Knowledge) and Research Journal — Milestone
              7's peer evidence surfaces, per the Knowledge ≠ Research split
              in NARRATIVE_SYSTEM.md. */}
          <KnowledgeHotspot onOpen={openKnowledge} visited={visited.knowledge} />
          <ResearchHotspot onOpen={openResearch} visited={visited.research} />

          {/* Layer 5: Leadership Wall — Milestone 8, grid fallback. */}
          <LeadershipHotspot onOpen={openLeadership} visited={visited.leadership} />

          {/* Layer 6: pure decorative dressing, non-interactive
              (VISUAL_PUNCHLIST.md P1, Phase 1 reuse pass). Displayed at a
              scaled-down size (see WALNUT_BOOKSHELF_DISPLAY_* above) so it
              reads as secondary to Knowledge's dominant oak bookshelf. */}
          <Image
            src={ASSETS.walnutBookshelf.src}
            alt=""
            width={WALNUT_BOOKSHELF_DISPLAY_WIDTH}
            height={WALNUT_BOOKSHELF_DISPLAY_HEIGHT}
            unoptimized
            priority
            className="pixel-art pointer-events-none absolute select-none"
            style={{
              left: `${walnutBookshelfPlacement.left}%`,
              top: `${walnutBookshelfPlacement.top}%`,
              width: `${walnutBookshelfPlacement.width}%`,
              height: `${walnutBookshelfPlacement.height}%`,
            }}
          />

          {/* Layer 7: desk surface dressing — Concept Reconciliation,
              Workspace decoration pass. Supersedes the old generic paper
              stack (see DeskDressing.tsx for the full rationale). */}
          <DeskDressing />

          {/* Layer 8: the Gramophone — Phase A ambient-audio toggle. A
              real room object, not a hotspot; see Gramophone.tsx. */}
          <Gramophone />

          {/* Layer 8b: Phase D — Clock, Coffee Corner, Window. These
              replace `CameraTestHarness`'s three remaining debug targets
              of the same names, which had no real hotspot to hand off to
              until now (see the harness's own removal below) — Design
              For Deletion in practice, same pattern as every other real
              hotspot in this room. Placed on the wall above the floor
              furniture line, not on the floor itself — see
              `CLOCK_HOTSPOT`/`COFFEE_HOTSPOT` in roomGeometry.ts for why
              the floor line had no room left for two more objects. */}
          <ClockHotspot onOpen={openClock} visited={visited.clock} />
          <CorkboardHotspot onOpen={openCoffee} visited={visited.coffee} />
          <WindowHotspot onOpen={openWindow} visited={visited.window} />

          {/* Layer 8c: Phase F.1, Part 6/7 — Rolodex (Contact) and
              Leather Portfolio (Resume), replacing `PersistentActions`.
              Same high-wall placement logic as Layer 8b above — see
              `ROLODEX_HOTSPOT`/`PORTFOLIO_HOTSPOT` in roomGeometry.ts. */}
          <RolodexHotspot onOpen={openContact} visited={visited.contact} />
          <PortfolioHotspot onOpen={openResume} visited={visited.resume} />

          {/* Layer 9: Phase C, Part 3 — the lighting pass. A sibling
              inside `CameraContainer` like every other room layer, so it
              pans/scales as one rigid piece of "the room" rather than
              re-centering on the viewport when the camera moves — a
              lamp doesn't follow your gaze around a real room. Two
              layered radial gradients, no blur/bloom filter, nothing
              that would soften the pixel art itself: a warm highlight
              centered on the Desk (the room's stated highest-priority
              object) and a separate, independent vignette darkening
              toward the room's own four corners. `pointer-events-none`
              throughout — purely a color layer, never intercepts a
              click meant for the sprite beneath it. See
              `LIGHTING_REVIEW.md`. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 55% 60% at ${DESK_HOTSPOT.centerXPercent}% ${DESK_HOTSPOT.centerYPercent}%, rgba(255, 214, 150, 0.16) 0%, rgba(255, 214, 150, 0.06) 40%, transparent 70%),
                radial-gradient(ellipse 92% 92% at 50% 50%, transparent 58%, rgba(10, 7, 4, 0.24) 100%)
              `,
            }}
          />
        </CameraContainer>
        </div>
      </div>

      {isPortrait && <PortraitFooter />}

      <LayerPanel isOpen={layers.activeLayer === "desk"} title="Desk" onClose={closeLayer}>
        <DeskPanel />
      </LayerPanel>

      <LayerPanel isOpen={layers.activeLayer === "knowledge"} title="Knowledge" onClose={closeLayer}>
        <KnowledgePanel />
      </LayerPanel>

      <LayerPanel isOpen={layers.activeLayer === "research"} title="Research" onClose={closeLayer}>
        <ResearchPanel />
      </LayerPanel>

      <LayerPanel isOpen={layers.activeLayer === "leadership"} title="Leadership" onClose={closeLayer}>
        <LeadershipPanel />
      </LayerPanel>

      <LayerPanel isOpen={layers.activeLayer === "clock"} title="Timeline" onClose={closeLayer}>
        <TimelinePanel />
      </LayerPanel>

      <LayerPanel isOpen={layers.activeLayer === "coffee"} title="About Me" onClose={closeLayer}>
        <AboutMePanel />
      </LayerPanel>

      <LayerPanel isOpen={layers.activeLayer === "window"} title="Future" onClose={closeLayer}>
        <FuturePanel />
      </LayerPanel>

      <LayerPanel isOpen={layers.activeLayer === "contact"} title="Contact" onClose={closeLayer}>
        <ContactPanel showToast={showToast} onOpenResume={openResume} />
      </LayerPanel>

      <LayerPanel isOpen={layers.activeLayer === "resume"} title="Resume" onClose={closeLayer}>
        <ResumePanel showToast={showToast} />
      </LayerPanel>
    </div>
  );
}
