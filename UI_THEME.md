# UI Theme — "Paper and Wood" (Phase B)

**Status:** Living reference for the panel/background visual language introduced in Phase B, Parts 3-6. Update this alongside any future change to the token values below, rather than letting the CSS and this description drift apart.

---

## Why CSS tokens, not a cropped frame sprite

Both Phase B reference boards show the *look* of a cream, wood-bordered panel over a warm walnut room background, but neither supplied sheet contains a croppable 9-slice panel-frame image with clean edges and a real alpha channel — checked by direct inspection of every file in the provided folders, not assumed. Per the Asset Truthfulness Protocol, that look is built with real CSS rather than a fabricated sprite standing in for an asset that doesn't exist. If a genuine panel-frame or divider sprite is supplied later, it can replace the CSS approximation below without changing `LayerPanel.tsx`'s structure — only the `.panel-paper`/`.panel-divider`/`.panel-button` rules in `globals.css` would need to change.

## Color tokens (`globals.css`, `:root` and its dark-mode override)

| Token | Light | Dark | Role |
|---|---|---|---|
| `--panel-paper` | `#f3e8d2` | `#362a1d` | Panel background — warm cream / dark parchment |
| `--panel-paper-shadow` | `#e2d2ac` | `#2a2015` | Inner bevel, one shade toward shadow |
| `--panel-wood` | `#8a5a34` | `#9c6a3e` | Border, dividers, button idle state |
| `--panel-wood-dark` | `#5c3b21` | `#4a3320` | Outer bevel, focus outline |
| `--panel-ink` | `#3a2c1c` | `#ecdfc4` | Text color |

Contrast (ink on paper, computed by hand against these exact hex values — see `ENGINEERING_DECISIONS.md`'s Phase B verification entry): ~11:1 light, ~10.6:1 dark. Both comfortably clear WCAG AA's 4.5:1 and AA's 3:1 for the bordered UI components.

Room background (`Workspace.tsx`'s outer wrapper, dark mode only — light mode's `bg-zinc-100` was unchanged, since the "pure black, too harsh" complaint specifically named dark mode): `radial-gradient(ellipse_at_center, #3b2c1f 0%, #241a12 65%, #1a120c 100%)` — a warm walnut vignette, darkest at the edges. Never pure black (`#000`) or a cool gray, per the brief's explicit "avoid pure black, pure grey."

## CSS classes

- **`.panel-paper`** — the panel surface: `--panel-paper` background, `--panel-ink` text, `border-radius: 0` (sharp corners, deliberately — see below), a 2px `--panel-wood` border plus a two-layer inset box-shadow (`--panel-paper-shadow` then `--panel-wood-dark`) simulating a carved wood frame around laid paper, and an outer drop shadow for depth against the room.
- **`.panel-divider`** — an `<hr>` styled as a wood-toned groove (a `--panel-wood` top border plus a one-pixel `--panel-paper-shadow` highlight beneath it), used above and below the panel's scrollable content region to separate header/body/footer.
- **`.panel-button`** — the Close and "✓ Done" controls: `--panel-paper-shadow` background, `--panel-wood` border, inverts to a solid `--panel-wood` fill on hover, `--panel-wood-dark` focus outline.

**Sharp corners, not rounded.** Every panel surface, divider, and button in this theme uses `border-radius: 0`. Rounded corners read as a generic app modal; flat, hard-edged rectangles read as part of the room's own pixel-art vocabulary — consistent with the brief's own "should feel like they belong to the room, no flat modern buttons."

## What did NOT change

Per the explicit "don't force these assets into the interface simply because they exist" instruction carried over from Phase A: the Controllers/Keyboard sheet's icons remain uncropped beyond the one already-used `ESC` keycap. No check/close icon was fabricated to match the reference boards' iconography — the ✕ and ✓ controls are still styled text glyphs, now themed through `.panel-button` rather than the previous plain zinc-bordered style, but structurally unchanged from Phase A.

## Animation timing (Part 14 — see `src/lib/motion.ts`)

| Band | Value | Used by |
|---|---|---|
| `DURATION.hover` | 150ms | Button/border color, gramophone brightness filter (Tailwind's default `transition-colors`/`duration-150`) |
| `DURATION.panelOpen` | 240ms | `LayerPanel` opening |
| `DURATION.panelClose` | 200ms | `LayerPanel` closing |
| `DURATION.camera` | 350ms | `useCamera`'s `focus`/`reset` |
| Gramophone idle loop | 2.4s (bounce) / 3s (glow) | `.gramophone-playing` keyframes |

All within the brief's own target bands (hover 120-180ms, panel open 220-260ms, panel close 180-220ms, camera 300-400ms, idle loop 2-3s). `DURATION.slow` (700ms) survives only for the dev-only `CameraTestHarness`'s intentionally slower demo case — it never ships.
