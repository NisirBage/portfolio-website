# Lighting Review — Phase C, Part 3

**Status:** One-time design/implementation record.

---

## What shipped

A single new layer inside `CameraContainer` (Layer 9, after the Gramophone), `aria-hidden`, `pointer-events-none`, positioned `inset-0` over the whole room canvas. Its `background-image` is two layered radial gradients, no filter, no blur, no `mix-blend-mode`:

```
radial-gradient(ellipse 55% 60% at 38.7% 50%, rgba(255,214,150,0.16) 0%, rgba(255,214,150,0.06) 40%, transparent 70%),
radial-gradient(ellipse 92% 92% at 50% 50%, transparent 58%, rgba(10,7,4,0.24) 100%)
```

- **The warm highlight** is centered on `DESK_HOTSPOT`'s own coordinates (38.7%, 50%) — the Desk is the room's stated highest-priority object (Visual Hierarchy section of the brief), so the light's focal point is anchored to it rather than to the room's geometric center.
- **The vignette** is centered on the room's true geometric center (50%, 50%) and is independent of the highlight — transparent through the middle 58% of the canvas, darkening toward the actual four corners, capped at 24% opacity.

## Why this layer, not a page-level effect

Placed as a sibling inside `CameraContainer` — the same container every sprite, hotspot, and the Gramophone already live in — rather than as an overlay on the outer page wrapper. This means the lighting is defined in the room's own percentage-coordinate system and pans/scales with the room as one rigid unit when the camera moves, the same way a real lamp doesn't follow your gaze around a room. It is a separate concern from Phase B's page-background vignette (`Workspace.tsx`'s outer wrapper, `dark:bg-[radial-gradient(...)]`) — that one sets the mood of the page *around* the room; this one lights the room's own interior.

## Constraints honored

- **No bloom, no blur, no modern effects.** The layer is flat gradient color, nothing else — no `filter: blur()`, no `box-shadow` glow, no `mix-blend-mode` compositing trick that could soften edges.
- **Still pixel-art.** Because the gradient sits as a translucent color layer *above* the sprites rather than modifying them, every sprite's hard pixel edges remain exactly as crisp as before — confirmed by construction (the gradient layer doesn't touch `image-rendering` or any sprite's own `filter`), not just assumed.
- **Very subtle.** Peak highlight opacity is 16%, peak vignette darkening is 24% — both chosen to be perceptible on close inspection without competing with the room's own color for attention, consistent with "the room should remain the visual focus" (a rule already established for Phase B's page vignette and applied here too).
- **Works regardless of viewport.** Every value is a percentage of the room canvas or the gradient's own ellipse, not a fixed pixel radius — confirmed at all 11 verified breakpoints (1920 down to 360px) that the layer is present and the canvas itself has no overflow it could be contributing to (`document.documentElement.scrollWidth` matched `window.innerWidth` at every width tested).

## Verification

`lint`/`tsc --noEmit`/`next build` clean. Live DOM check on a fresh dev server confirmed the layer's `background-image` computed to the intended radial-gradient value (verified via `getComputedStyle` in Phase B's continuation of this same session, re-confirmed present at every breakpoint in this pass's 11-breakpoint sweep via a direct `querySelector` check for an `aria-hidden` element with a `radial-gradient` inline style). Visual legibility (does the highlight actually read as "light" rather than just a color shift) was not independently confirmed via screenshot this pass — the Browser pane's screenshot tool was unavailable for the duration of this session (see `ENGINEERING_DECISIONS.md`'s Phase C Browser-pane limitation entry) — so this is a code-level and computed-style verification, not a visually-inspected one.
