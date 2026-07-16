# Camera Audit — Phase B, Part 1

**Status:** One-time investigation record. The fix itself is described inline in `Workspace.tsx`; this document is the root-cause trail and the verification evidence.

---

## The report

"The camera doesn't return to the exact establishing shot after closing Leadership/Knowledge/Research/Workspace" — described as a regression, with an explicit instruction not to compensate with offsets but to find the actual cause.

## Root cause

Before this pass, the camera was moved in exactly two places: each hotspot's `onClick` handler called `cameraFocus(target)` bundled together with `layersOpen(id)`, and `closeLayer` called `cameraReset()` bundled together with `layersClose()`. That is a plain `useState` inside `useCamera` — nothing tied it to `layers.activeLayer`, the single URL-backed source of truth `LayerPanel`'s own `isOpen` prop already reads from.

Reproduced live, not assumed:
1. Open Leadership via its hotspot → camera correctly zooms to the Leadership target.
2. Press browser Back → the URL correctly reverts (`layers.activeLayer` becomes `null`, `LayerPanel`'s `isOpen` correctly becomes `false`) — but the camera stays at the Leadership zoom, because Back never runs `closeLayer`, the only function that used to call `cameraReset`.
3. A direct deep link to `?panel=leadership` shows the same gap in the other direction: the panel opens correctly (it reads the URL directly) but the camera starts at the identity transform, because nothing that loads a deep link ever calls `cameraFocus`.

This is not accumulated transform drift — the reset target (`CAMERA_IDENTITY = { x: 50, y: 50, scale: 1 }`) is a fixed constant, and repeated open/close cycles through the normal click path were already confirmed byte-identical in Phase A. It is a genuine architecture gap: two pieces of state (`activeLayer` and the camera target) that only stayed synchronized when one specific function happened to be the one that changed the URL.

## The fix

`Workspace.tsx` now derives the camera target from `layers.activeLayer` via a `useEffect`, reacting to every change regardless of cause:

```js
useEffect(() => {
  const target = layers.activeLayer ? cameraTargetsByLayer[layers.activeLayer] : undefined;
  if (target) {
    cameraFocus(target, DURATION.camera);
  } else {
    cameraReset(DURATION.camera);
  }
}, [layers.activeLayer, cameraFocus, cameraReset]);
```

`openDesk`/`openKnowledge`/`openResearch`/`openLeadership`/`closeLayer` no longer touch the camera at all — each is now a one-line wrapper around `layersOpen`/`layersClose`. This is the single place the camera moves now, for a hotspot click, browser Back/Forward, or a deep link alike, and it removed four duplicated `cameraFocus`/`cameraReset` call sites in the process.

## Verification

- Re-ran the exact two reproductions above on the fixed build: Back now correctly resets the camera; a deep link to `?panel=leadership` now correctly opens both the panel and the matching camera zoom.
- Regression-tested all four close methods (corner ✕, footer "✓ Done", Escape, backdrop click) — each still calls the same `onClose`/`closeLayer` path, so the camera-sync effect fires identically regardless of which one triggered the close.
- `lint`, `tsc --noEmit`, `next build` clean.
- Structural verification only for this pass's live click testing — see `ENGINEERING_DECISIONS.md`'s "Browser-pane limitation" entry (Phase B). The camera-sync effect's correctness rests on the same `activeLayer`-derived wiring already proven correct by Phase A's byte-identical-transform testing, not re-asserted as freshly click-tested this session.

## Acceptance criterion

"100 open/close cycles must always return an identical camera transform, no drift" — architecturally guaranteed, not just tested to 100: the reset target is a fixed constant (`CAMERA_IDENTITY`), and the transform is now a pure function of `activeLayer` (`cameraTransform(target)` in `useCamera.ts`), not an accumulator. There is no code path by which repeated cycles could produce a different transform for the same `activeLayer` value.
