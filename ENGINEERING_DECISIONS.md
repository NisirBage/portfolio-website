# Engineering Decisions — The Studio

**Status:** Living document, implementation-side counterpart to the frozen design documents. Design docs explain *what* and *why* at the product level; this explains *how* and why that specific technical approach, and evolves as milestones ship. Entries are appended, not rewritten, so later decisions can be understood in context of what came before.

---

## Milestone 2

### Rendering approach: CSS transforms on flat DOM/images, not PixiJS/WebGL

`NARRATIVE_SYSTEM.md`'s Camera Philosophy already made this call, and you explicitly approved it ("CSS-based cinematic camera instead of WebGL for Version 1"). It's restated here because Milestone 2's brief referenced "PixiJS configuration" as an example decision to document — flagged in the Implementation Readiness Check as likely a generic template example, not a deliberate reversal, and confirmed by proceeding without objection.

Concretely: the room is a plain `<img>` (via `next/image`) inside absolutely-positioned `<div>`s, not a `<canvas>` or WebGL context. A future camera pan is a CSS `transform` on `CameraContainer`, not a render-loop redraw. This keeps the whole scene inspectable in browser dev tools, keeps the screen-reader parallel path (a plain DOM tree) trivially achievable rather than fought for, and avoids a render-loop, texture-loading, and canvas-accessibility story that a WebGL engine would require — all real costs `IMPLEMENTATION_RISKS.md` already priced the camera system at Medium-High complexity for; a canvas engine would move that to High-Very High for no capability Milestone 2 through the current Version 1 scope actually needs.

### Layer order: room shell, then door dressing, nothing above yet

Two DOM layers inside `CameraContainer`, bottom to top: the room shell image, then two door-dressing images absolutely positioned on top. This is the minimum layer count that proves the *ordering mechanism* works (later milestones will insert furniture and hotspot layers between or above these without restructuring the container) without building layers Milestone 2 explicitly excludes.

### Scaling strategy: canvas-ratio container + percentage-based child placement, not fixed pixel positions

The room's outer wrapper locks to the room shell's native aspect ratio (288:144) via CSS `aspect-ratio`, and scales fluidly within `max-w-5xl`. Door sprites are positioned as percentages of that same canvas (computed in `roomGeometry.ts`'s `getDoorPlacements`), not fixed pixel offsets — so they track the room shell's scale at any viewport width instead of drifting off-position as the container resizes. This is what "responsive scaling strategy" required beyond just "the image doesn't stretch": every child layer has to scale in lockstep with the base layer, not just the base layer itself.

### Pixel-perfect rendering: `image-rendering: pixelated` + `unoptimized` on `next/image`

Two parts, both necessary. First, a small custom `.pixel-art` utility class (Tailwind has no built-in one) sets `image-rendering: pixelated` with a `crisp-edges` fallback for older Firefox. Second — and easy to miss — `next/image`'s default optimization pipeline resizes images server-side to match likely display sizes, which for pixel art means the blur happens *before* the browser ever gets to apply `image-rendering`, defeating it entirely. Every pixel-art sprite in this project uses `unoptimized` on `next/image` for that reason. This is scoped specifically to pixel-art sprites — photographic content (certificate scans, project screenshots, arriving in later milestones) should keep Next's normal optimization, since blur isn't a risk for those and the bandwidth savings are real.

### Asset pipeline: a typed registry (`src/lib/assets.ts`) mirroring `ASSET_REGISTRY.md`

Every sprite referenced in code goes through one typed object, not ad hoc path strings scattered across components. This exists specifically to prevent the registry markdown and the actual code from drifting apart — a change to a file path has exactly one place to update, and TypeScript's `satisfies` constraint means a malformed entry fails to compile rather than fails silently at runtime.

### Asset Truthfulness correction: the front-wall door gap is in Zone 2, not at the Zone 1/2 boundary

`SPATIAL_BLUEPRINT.md` described the second door-shaped gap as "near the boundary between Zone 1 and Zone 2," based on visual inspection alone. Direct pixel measurement during this milestone (scanning for the gap's semi-transparent lavender fill color, then confirming alpha values to rule out false positives from fully-transparent canvas padding that happened to share the same RGB channels) placed it at x≈88–135 in the 288-wide canvas — solidly inside Zone 2 (x 80–143, the Desk zone), not at its boundary with Zone 1. `SPATIAL_BLUEPRINT.md` and `ASSET_REGISTRY.md` are corrected accordingly. This is exactly the kind of revision the Asset Truthfulness Protocol exists for: a claim made from a screenshot, corrected once real measurement was possible.

### `CameraContainer` is structural only

It renders with an explicit identity transform (`translate(0px, 0px) scale(1)`) and takes no props beyond `children`. No event handlers, no state, no easing — Milestone 2's brief was explicit that camera *movement* is Milestone 3's job. The component exists now so Milestone 3 adds behavior to an already-correct structure instead of restructuring the DOM tree while also trying to get animation right at the same time.

### Performance instrumentation: `useReportWebVitals`, console-only, dev-only

Next.js ships a built-in Web Vitals hook; using it is near-zero marginal cost and gives a real, standard metric (LCP, CLS, INP) rather than a bespoke measurement. It logs to console only in development — no analytics backend exists yet, and building one isn't in Milestone 2's scope (or arguably any milestone's scope until `VERSION1_SCOPE.md` explicitly schedules `PORTFOLIO_STRATEGY.md`'s Section 12 metrics work).
