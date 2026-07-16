/**
 * Typed pointer to every verified game asset actually wired into the
 * codebase. This mirrors ASSET_REGISTRY.md — it exists so future
 * milestones import a path from one place instead of hardcoding
 * `"/assets/..."` strings ad hoc, which is how registry and code drift
 * apart. Per the Asset Truthfulness Protocol, nothing is added here
 * until the source file has been copied into `public/` and verified.
 */

export interface RegisteredAsset {
  /** Path under `public/`, usable directly as an <img> src. */
  readonly src: string;
  /** Native pixel dimensions, confirmed via direct file inspection. */
  readonly width: number;
  readonly height: number;
  /** Where this asset is documented in the frozen architecture. */
  readonly registryRef: string;
}

export const ASSETS = {
  roomShell: {
    src: "/assets/rooms/floors-and-walls.png",
    width: 288,
    height: 144,
    registryRef: "ASSET_REGISTRY.md#floorsandwallspng",
  },
  doorClosed: {
    src: "/assets/architecture/door-closed.png",
    width: 26,
    height: 40,
    registryRef: "ASSET_REGISTRY.md#doorsandwindowspng",
  },
  /**
   * Furniture sprites — cropped from the owned source pack
   * (`TopDownHouse_FurnitureState1.png`, `TopDownHouse_SmallItems.png`)
   * during the post-Milestone-8 asset-integration pass. Verified present
   * in the pack since Milestone 1's Asset Registry, but never actually
   * rendered until now — see ASSET_REQUIREMENTS.md and
   * ENGINEERING_DECISIONS.md for the full finding. Crop boxes measured
   * by direct pixel inspection (grid-overlaid, upscaled), not estimated.
   */
  deskSprite: {
    src: "/assets/furniture/desk.png",
    width: 48,
    height: 33,
    registryRef: "ASSET_REGISTRY.md#topdownhousefurniturestate1png",
  },
  bookshelfSprite: {
    src: "/assets/furniture/bookshelf.png",
    width: 47,
    height: 49,
    registryRef: "ASSET_REGISTRY.md#topdownhousefurniturestate1png",
  },
  frameAbstract: {
    src: "/assets/furniture/frame-abstract.png",
    width: 16,
    height: 16,
    registryRef: "ASSET_REGISTRY.md#topdownhousesmallitemspng",
  },
  frameLandscape: {
    src: "/assets/furniture/frame-landscape.png",
    width: 16,
    height: 16,
    registryRef: "ASSET_REGISTRY.md#topdownhousesmallitemspng",
  },
  bookOpen: {
    src: "/assets/furniture/book-open.png",
    width: 16,
    height: 16,
    registryRef: "ASSET_REGISTRY.md#topdownhousesmallitemspng",
  },
  /**
   * Round pedestal side table, reused as the Research reading stand
   * (Concept Reconciliation pass) — replaces the previous floating-book
   * presentation. Cropped from the same owned pack, box (176,0,192,32) in
   * `TopDownHouse_FurnitureState1.png`. A genuine, previously-unused pack
   * asset, not a fabricated or recolored substitute (Asset Truthfulness).
   */
  readingStand: {
    src: "/assets/furniture/reading-stand.png",
    width: 16,
    height: 32,
    registryRef: "ASSET_REGISTRY.md#topdownhousefurniturestate1png",
  },
  /**
   * Pure decorative dressing — non-interactive, no hotspot, no click
   * handler. Added in the Phase 1 reuse pass (VISUAL_PUNCHLIST.md P1).
   */
  walnutBookshelf: {
    src: "/assets/dressing/walnut-bookshelf.png",
    width: 50,
    height: 48,
    registryRef: "ASSET_REGISTRY.md#topdownhousefurniturestate1png",
  },
  /**
   * Generated desk-dressing set (Concept Reconciliation, Workspace
   * decoration pass) — cropped from `generated_asset_sheet.png`, a
   * separately generated (not pack-sourced) sheet the user supplied,
   * matched against `updated_layout_concept.png` for object identity and
   * `Screenshot (375).png` for current-state comparison. Per the
   * Concept Reference vs. Style Reference rule, the generated sheet is
   * an Asset Reference here (used as-provided, not reinterpreted) rather
   * than a Style Reference — its own rendering (soft gradient shadows,
   * higher internal detail) does not actually match the real pack's flat
   * hard-outline style, a deviation documented in
   * `ENGINEERING_DECISIONS.md` rather than silently corrected, since the
   * user explicitly asked for these sprites "exactly as provided."
   *
   * Processing applied (documented, not silent): the sheet has no real
   * alpha channel — its "transparent" background is a drawn checkerboard
   * baked into RGB — so each crop had its background keyed out
   * (near-neutral pixels ≥233 lightness, channel spread ≤10, removed to
   * alpha 0) before use. Each was then downscaled from its native
   * sheet-crop size to the size listed below via a legibility test (crop
   * → downscale → upscaled nearest-neighbor re-inspection, same
   * methodology as the real pack's own crop verification) — sizes below
   * are the smallest that stayed recognizable, not a uniform scale
   * factor, since flat/simple silhouettes (mug, notebook) stayed legible
   * far smaller than detailed ones (monitor, lamp). Replaces the
   * previous generic `paperStack` dressing, which this set narratively
   * supersedes (Engineering Notebook and Rolled Blueprint are more
   * specific evidence of technical work than an unlabeled paper stack).
   */
  deskMonitor: {
    src: "/assets/desk/monitor.png",
    width: 16,
    height: 11,
    registryRef: "ASSET_REGISTRY.md#generated-desk-set",
  },
  deskKeyboard: {
    src: "/assets/desk/keyboard.png",
    width: 14,
    height: 7,
    registryRef: "ASSET_REGISTRY.md#generated-desk-set",
  },
  deskMouse: {
    src: "/assets/desk/mouse.png",
    width: 8,
    height: 11,
    registryRef: "ASSET_REGISTRY.md#generated-desk-set",
  },
  deskPencilCup: {
    src: "/assets/desk/pencil-cup.png",
    width: 8,
    height: 11,
    registryRef: "ASSET_REGISTRY.md#generated-desk-set",
  },
  deskCoffeeMug: {
    src: "/assets/desk/coffee-mug.png",
    width: 11,
    height: 10,
    registryRef: "ASSET_REGISTRY.md#generated-desk-set",
  },
  deskBlueprintRoll: {
    src: "/assets/desk/blueprint-roll.png",
    width: 9,
    height: 11,
    registryRef: "ASSET_REGISTRY.md#generated-desk-set",
  },
  deskNotebook: {
    src: "/assets/desk/notebook.png",
    width: 10,
    height: 12,
    registryRef: "ASSET_REGISTRY.md#generated-desk-set",
  },
  deskLamp: {
    src: "/assets/desk/desk-lamp.png",
    width: 16,
    height: 13,
    registryRef: "ASSET_REGISTRY.md#generated-desk-set",
  },
  /**
   * Gramophone — Phase A (UI/UX Refinement), ambient-audio toggle. A
   * genuine feature addition, explicitly approved as a scoped exception
   * to the otherwise-frozen Version 1 feature set. Cropped from a
   * user-supplied generated sheet (not the real pack — no gramophone
   * exists there), background-keyed (the sheet uses a solid near-black
   * panel background, not a checkerboard, per direct pixel sampling —
   * different technique from the desk-set's checkerboard removal, same
   * principle). Legibility-tested the same way as the desk set: 18px
   * wide is the smallest size the horn/body silhouette stays readable at
   * (14px blurred into an unrecognizable blob). The two badge sprites
   * are corner-accent indicators, not full alternate gramophone states —
   * the reference sheet shows the *same* gramophone body with a small
   * muted/playing badge overlaid, so only one body sprite is registered.
   */
  gramophone: {
    src: "/assets/gramophone/gramophone.png",
    width: 18,
    height: 21,
    registryRef: "AUDIO_SYSTEM.md#gramophone-asset",
  },
  /**
   * *Revised, Phase B (Camera Audit / ghost-popup fix):* shrunk from
   * 14×17/14×13 to 10×12/10×9. At the original size, positioned beside
   * the gramophone with a gap (not overlapping it), the badge read as a
   * separate floating object — a small dark square with a bold red X is
   * visually indistinguishable from stray UI chrome, which is exactly
   * what got reported as a "ghost popup." Measured, not just judged by
   * eye: the badge's right edge at the original size and position
   * (94.5% centerX + half-width) landed at 96.9% of the canvas, past
   * `ROOM_CONTENT_BOUNDS`'s own right edge (95.49%) — genuinely clipped
   * off the drawn room, not just poorly composed. A first attempt at
   * 10px, touching but not overlapping, was re-composited and inspected
   * and still read as a separate small object, not an attached badge —
   * shrunk further to 8px and repositioned to overlap the gramophone's
   * horn substantially (see `Gramophone.tsx`) before the "attached
   * badge, not a second object" read actually held up under visual
   * inspection. Confirmed to stay within `ROOM_CONTENT_BOUNDS` at the
   * final position.
   */
  gramophoneBadgeMuted: {
    src: "/assets/gramophone/badge-muted.png",
    width: 8,
    height: 10,
    registryRef: "AUDIO_SYSTEM.md#gramophone-asset",
  },
  gramophoneBadgePlaying: {
    src: "/assets/gramophone/badge-playing.png",
    width: 8,
    height: 7,
    registryRef: "AUDIO_SYSTEM.md#gramophone-asset",
  },
  /**
   * ESC key glyph — Phase A popup-control polish, "keyboard glyphs where
   * shortcuts are shown." Cropped from a real, user-supplied keyboard
   * icon pack (`kb_dark_symbols.png`, genuine alpha channel, no
   * background keying needed) — the only icon from that pack used this
   * pass, per the explicit "only use it where it materially improves
   * usability" direction. The pack's Confirm/Close/Search/Info icons
   * described in the brief don't actually exist in the supplied sheets
   * (verified by direct inspection of all files in the folder, not
   * assumed) — those UI affordances use styled text glyphs instead (see
   * `LayerPanel.tsx`), not a fabricated pixel sprite standing in for an
   * asset that was never provided.
   */
  keyEsc: {
    src: "/assets/ui/key-esc.png",
    width: 13,
    height: 14,
    registryRef: "UI_UX_REVIEW.md#keyboard-glyphs",
  },
  /**
   * Clock, Coffee Corner, and Window — Phase D. Cropped from a
   * user-supplied generated sheet (`ChatGPT Image Jul 15, 2026, 10_20_11
   * PM.png`), the canonical source per explicit instruction. Each is a
   * small still-life scene (the coffee mug crop retains its books and
   * notebook; the window crop retains its plant and stacked books),
   * background-keyed against the sheet's own per-card background color
   * (a flood-fill from confirmed background seed points, not a global
   * color threshold — a global threshold on the coffee crop specifically
   * destroyed the mug, since its cream color overlapped the wall color's
   * range; flood-fill only clears pixels contiguous with a real
   * background seed, leaving the enclosed mug shape untouched). Resized
   * from their native ~290-380px crops down to the sizes below via the
   * same legibility test as every other generated asset in this project:
   * crop, downscale, upscale-with-nearest-neighbor, re-inspect. All three
   * stayed clearly readable well below their native size; final sizes
   * are the smallest that kept every element in the scene individually
   * distinguishable, not a uniform scale factor.
   *
   * Style note, same as the Generated Desk Set and the Gramophone before
   * it: the source sheet renders with soft internal shading (gradient
   * highlights on the clock face, a shaded sky in the window) that the
   * base "Top-Down Retro Interior" pack's flat hard-outline sprites
   * don't have. Used as-provided per explicit instruction rather than
   * redrawn to match — the deviation is documented, not hidden. See
   * `ENGINEERING_DECISIONS.md`'s Phase D entry.
   */
  coffeeCorner: {
    src: "/assets/narrative/coffee-corner.png",
    width: 32,
    height: 32,
    registryRef: "ASSET_REGISTRY.md#narrative-set",
  },
  /**
   * Clock and Window — repointed, Phase F.2 (Replace Disproportionate
   * Assets). The Phase D generated crops above (`clock.png` at 32×43,
   * `window.png` at 40×41 — files left on disk, unreferenced, not
   * deleted) rendered visually dominant against the room's real
   * furniture, which is all drawn at the native "Top-Down Retro Interior"
   * pack's own scale. Both keys now point at sprites cropped directly
   * from that same source pack (`TopDownHouse_DoorsAndWindows.png`,
   * `TopDownHouse_SmallItems.png`) — the identical pack `ROOM_CANVAS`
   * itself is built from (both share the 288px-wide native coordinate
   * space), so no scale-conversion math was needed: these are the
   * sprites' true native pixel dimensions, used as-is. This is a genuine
   * scale correction, not a redesign — same hotspot, same camera target,
   * same popup, only the rendered sprite and its registered width/height
   * changed. See `ENGINEERING_DECISIONS.md`'s Phase F.2 entry for the
   * grid-scanning method used to locate and tight-crop both sprites.
   */
  clock: {
    src: "/assets/narrative/wall-clock.png",
    width: 15,
    height: 15,
    registryRef: "ENGINEERING_DECISIONS.md#phase-f2-asset-replacement",
  },
  window: {
    src: "/assets/narrative/window-small.png",
    width: 25,
    height: 28,
    registryRef: "ENGINEERING_DECISIONS.md#phase-f2-asset-replacement",
  },
  /**
   * Corkboard (About Me), Leather Portfolio (Resume), and Rolodex
   * (Contact) — Phase F.1. Cropped from a second user-supplied sheet
   * (`ChatGPT Image Jul 16, 2026, 01_26_40 AM.png`), the visual authority
   * for this pass per explicit instruction. Background-keyed with a
   * fixed-reference-color flood fill, not the per-neighbor variant used
   * earlier in this project — the per-neighbor version let a smooth
   * shading gradient "walk" the fill through an entire object one
   * similar-enough step at a time (destroyed the corkboard's own wood
   * frame on the first attempt, the same failure mode as the Coffee
   * Corner mug in Phase D but worse, since the earlier fix didn't
   * generalize to a case with continuous internal shading). Comparing
   * every candidate pixel against the same fixed background reference
   * color instead of its immediate neighbor fixed it. A residual
   * anti-aliased white-fringe artifact along some edges was cleaned up
   * with a second pass (remove any low-saturation, high-brightness pixel
   * directly adjacent to full transparency) rather than left in.
   *
   * The Corkboard replaces the Coffee Corner as the About Me hotspot's
   * visual — the coffee-mug-and-books scene from Phase D is retired from
   * that role (its asset registration above is left in place as
   * historical record, not deleted, per this registry's own "corrected,
   * not erased" convention) since this sheet is now the stated visual
   * authority and explicitly labels this object "ABOUT ME (CORK BOARD)."
   * The Telephone alternative shown alongside the Rolodex on the same
   * sheet was not cropped — the brief explicitly names the Rolodex as
   * the one to implement ("The Rolodex now replaces every remaining
   * floating Contact affordance"), not a choice between the two.
   */
  corkboard: {
    src: "/assets/narrative/corkboard.png",
    width: 34,
    height: 26,
    registryRef: "ASSET_REGISTRY.md#ui-asset-sheet-phase-f1",
  },
  portfolio: {
    src: "/assets/narrative/portfolio.png",
    width: 26,
    height: 26,
    registryRef: "ASSET_REGISTRY.md#ui-asset-sheet-phase-f1",
  },
  rolodex: {
    src: "/assets/narrative/rolodex.png",
    width: 30,
    height: 26,
    registryRef: "ASSET_REGISTRY.md#ui-asset-sheet-phase-f1",
  },
  /**
   * Ledger — Phase F.2, replaces the Rolodex above as the Contact
   * hotspot's visual. The brief's preference order was Address Book,
   * Ledger, Clipboard, Memo Board; a direct inspection of
   * `TopDownHouse_SmallItems.png` (the only sheet the brief allows for
   * this object) found exactly two book sprites — an open book and this
   * closed book — and no address book, clipboard, or memo/cork board of
   * any kind. Per the brief's own instruction ("if no suitable object
   * exists... tell me explicitly rather than inventing"), the closed
   * book is used as the Ledger (the brief's second-ranked option), not a
   * stand-in for the first-ranked Address Book — the two are visually
   * distinct and this doesn't claim to be one. The Rolodex entry above
   * is left registered, not deleted, per this registry's "corrected, not
   * erased" convention — it's a genuine object swap (a different
   * real-world object, not a resized version of the same one), the same
   * category of change as the Corkboard/Coffee-Corner swap in Phase F.1.
   */
  ledger: {
    src: "/assets/narrative/ledger.png",
    width: 7,
    height: 8,
    registryRef: "ENGINEERING_DECISIONS.md#phase-f2-asset-replacement",
  },
  /**
   * Save Slot frame and Continue button — Phase G, cropped from the
   * "GBA-Inspired Loading Screen Asset Sheet (Tier 2)" (`ChatGPT Image
   * Jul 16, 2026, 02_00_02 PM.png`), Section 1's "Standard (Recommended)"
   * variant. Unlike every prior sheet in this project, this one has no
   * real alpha channel (flat RGB, solid black canvas) and — unlike the
   * native "Top-Down Retro Interior" pack — bakes its own example
   * content directly into the art (name, subtitle, "00:00:00" Play Time,
   * a "▶ Continue" label) rather than leaving those as separate,
   * dynamic elements.
   *
   * Per this project's own established precedent (Milestone 8's "real
   * semantic content, not baked into an image" fix for the Leadership
   * cluster cards), the parts of that baked content that must be real,
   * live, or independently accessible were surgically patched out and
   * are rendered as genuine DOM text/controls instead — not left as
   * frozen pixels:
   * - The baked "Play Time  00:00:00" line (needs to increment live)
   *   was erased and replaced with tiled parchment texture cloned from
   *   a verified-clean donor region elsewhere on the same card
   *   (programmatically confirmed clean — zero dark/text pixels — via a
   *   brightness scan, not eyeballed), leaving the clock icon in place.
   *   `SaveSlot.tsx` renders the live value as real text at that exact
   *   position.
   * - The baked "▶ Continue" button was erased the same way, and its
   *   own chrome (border bevel, corner studs) was separately cropped
   *   from the *same* source region *before* erasure — so the two
   *   pieces are pixel-identical in size and position and recombine with
   *   zero seam. Cropped this way instead of reusing Section 5's
   *   standalone buttons deliberately: Section 5's buttons are a
   *   different aspect ratio (223×72, ≈3.1:1) than the slot this frame
   *   actually has for one (356×56, ≈6.4:1) — stretching a
   *   differently-proportioned sprite to fit would have visibly
   *   distorted it, where cutting the chrome from the frame's own
   *   button preserves it exactly as authored.
   *
   * What was *not* touched: the baked "SAVE SLOT 01" header (decorative
   * game-UI chrome, not personal content — the same category as the
   * frame border itself), and the baked name/subtitle/builder text and
   * portrait — real, accurate, and static, so `SaveSlot.tsx` pairs the
   * decorative image (`alt=""`) with an equivalent screen-reader-only
   * text block rather than re-render visible text on top of already-
   * correct pixels a second time.
   */
  saveSlotFrame: {
    src: "/assets/intro/save-slot-frame.png",
    width: 399,
    height: 371,
    registryRef: "ENGINEERING_DECISIONS.md#phase-g-intro-sequence",
  },
  continueButton: {
    src: "/assets/intro/continue-button.png",
    width: 356,
    height: 56,
    registryRef: "ENGINEERING_DECISIONS.md#phase-g-intro-sequence",
  },
  /**
   * 12 pixel UI icons (Email, GitHub, LinkedIn, Website, Phone, Location,
   * Resume/PDF, Download, Open Link, Copy, Success, Close) — Phase F.1,
   * from the same sheet as above, labeled "UII ICONS (PIXEL - 24×24)" in
   * the source. Cropped as full tiles (glyph plus the sheet's own dark
   * rounded-square backing), not glyph-only — the tile is what reads as
   * a cohesive pixel-art icon button at small size, and matches how this
   * project's other framed elements (the panel-button controls) already
   * present. Saved at the sheet's own stated 24×24 native size.
   */
  iconEmail: { src: "/assets/ui/icon-email.png", width: 24, height: 24, registryRef: "ASSET_REGISTRY.md#ui-asset-sheet-phase-f1" },
  iconGithub: { src: "/assets/ui/icon-github.png", width: 24, height: 24, registryRef: "ASSET_REGISTRY.md#ui-asset-sheet-phase-f1" },
  iconLinkedin: { src: "/assets/ui/icon-linkedin.png", width: 24, height: 24, registryRef: "ASSET_REGISTRY.md#ui-asset-sheet-phase-f1" },
  iconWebsite: { src: "/assets/ui/icon-website.png", width: 24, height: 24, registryRef: "ASSET_REGISTRY.md#ui-asset-sheet-phase-f1" },
  iconPhone: { src: "/assets/ui/icon-phone.png", width: 24, height: 24, registryRef: "ASSET_REGISTRY.md#ui-asset-sheet-phase-f1" },
  iconLocation: { src: "/assets/ui/icon-location.png", width: 24, height: 24, registryRef: "ASSET_REGISTRY.md#ui-asset-sheet-phase-f1" },
  iconResumePdf: { src: "/assets/ui/icon-resume-pdf.png", width: 24, height: 24, registryRef: "ASSET_REGISTRY.md#ui-asset-sheet-phase-f1" },
  iconDownload: { src: "/assets/ui/icon-download.png", width: 24, height: 24, registryRef: "ASSET_REGISTRY.md#ui-asset-sheet-phase-f1" },
  iconOpenLink: { src: "/assets/ui/icon-open-link.png", width: 24, height: 24, registryRef: "ASSET_REGISTRY.md#ui-asset-sheet-phase-f1" },
  iconCopy: { src: "/assets/ui/icon-copy.png", width: 24, height: 24, registryRef: "ASSET_REGISTRY.md#ui-asset-sheet-phase-f1" },
  iconSuccess: { src: "/assets/ui/icon-success.png", width: 24, height: 24, registryRef: "ASSET_REGISTRY.md#ui-asset-sheet-phase-f1" },
  iconClose: { src: "/assets/ui/icon-close.png", width: 24, height: 24, registryRef: "ASSET_REGISTRY.md#ui-asset-sheet-phase-f1" },
} as const satisfies Record<string, RegisteredAsset>;

/**
 * Non-image assets — no width/height, so they don't fit RegisteredAsset.
 * Separate, honestly-typed registry rather than forcing a PDF into an
 * interface built for sprites.
 */
export const DOCUMENTS = {
  resume: {
    src: "/documents/nisir-sanang-bage-resume.pdf",
    label: "Resume (PDF)",
  },
} as const;
