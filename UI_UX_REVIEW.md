# UI/UX Review — Phase A

**Status:** One-time review record for this pass. Reviews the experience against the brief's own stated Design Philosophy — what can be interacted with, what's been visited, where the visitor is, how to return, how to close, how to navigate without confusion — plus the consistency pass across the four popups.

---

## Does the visitor immediately understand what can be interacted with?

Yes. Every interactive object idle-pulses before any hover — a slow, deliberate breathe, not a distracting animation — which was this project's own established solution to exactly this question, verified still working. Hover and keyboard-focus both add a consistent amber highlight across all four content hotspots *and* the new gramophone, so the visual language for "this is interactive" is now uniform across every clickable object in the room, not just the original four.

## Does the visitor understand what's been visited?

**Not directly, and this is a real, honest gap, not something this pass fixed.** Nothing in the room currently changes appearance once a hotspot's panel has been opened — no dimming, no checkmark, no persistent visual marker. The brief's Design Philosophy lists "what has been visited" as something the visitor should understand, but implementing visited-state tracking (persisting which panels have been opened, then branching the hotspot's render based on that) is a genuine new piece of state and a new visual language, not a polish-level change to what exists — it wasn't attempted this pass, and it's called out explicitly here rather than silently skipped. See `FINAL_PHASE_A_REPORT.md`'s open items.

## Does the visitor understand where they are?

Yes, in two reinforcing ways: the camera itself frames whichever object is open (impossible to be looking at the Desk while the Knowledge panel is showing — the two are locked together), and the panel's own `<h2>` names the zone explicitly ("Desk," "Knowledge," "Research," "Leadership"). The URL also reflects it (`?panel=desk`), which is a third, more implicit signal for anyone paying attention to the address bar.

## How to return / how to close — now explicit, not just functional

Before this pass, closing a panel worked (Escape, or a plain "Close" text button) but wasn't especially *discoverable* — a first-time visitor had no visual cue that Escape was an option, and the corner button gave no more information than the word "Close." This pass makes both explicit:

- The Close button now shows the actual **ESC** keycap glyph next to the ✕, so the keyboard shortcut is visible, not just functional.
- A second, more prominent **✓ Done** control at the panel's own bottom gives a "finished reading" affordance in a natural reading-flow position, not just a corner dismiss.
- Clicking anywhere in the room while a panel is open now also closes it — a visitor who instinctively clicks the desk/bookshelf/room behind the panel (a very plausible "get me out of here" gesture) gets exactly what they'd expect, rather than nothing happening.

All four methods are verified to behave identically (same `onClose`, same camera reset, same focus restoration) — see `INTERACTION_FLOW.md`.

## Navigation without confusion

The single-URL-param architecture (`?panel=<id>`, one value, never a stack) means the room's state is always simple to reason about: exactly one thing can be open, or nothing is. This was already true before this pass; what's new is that **outside-click** now respects it identically to every other close method, and Browser Back/Forward were explicitly re-verified working this pass (not just assumed from the `router.push` implementation) — a visitor who navigates with browser buttons gets the same coherent behavior as one who uses the room's own controls.

## Consistency audit across the four popups

Checked spacing, typography, padding, margins, panel width, and focus handling across Desk, Knowledge, Research, and Leadership panels — all four render through the identical `LayerPanel` shell, so anything true of one is true of all four by construction, not by four separate implementations that happen to agree. What was found and fixed:

- **A real accessibility bug**, not a consistency issue per se, but caught during this audit: all four panels shared one hardcoded heading `id`. Fixed with `useId()` — see `ACCESSIBILITY_AUDIT.md`.
- **A real scroll-isolation gap**: on the longest panel (Leadership, four expandable capabilities), scrolling previously scrolled the title and Close button out of view along with the content, since the whole panel was one `overflow-y-auto` block. Fixed by pinning header and footer outside the scrolling region — verified live that the header/footer no longer move while the middle region scrolls.
- **Genuinely already consistent, not touched**: type scale (`text-sm`/`text-xs` throughout), the `zinc`/`amber` color language, the `space-y-3`/`space-y-4` content rhythm, and the accordion pattern shared by `ProjectAccordionItem` and `LeadershipCapabilityItem`. No changes were made to any of these — they were already right.

## Restraint, checked explicitly

The brief asks for a room that "feels alive without feeling cluttered" and warns against turning the interface into a game HUD. Concretely, this pass added exactly one new room object (the gramophone) and exactly one new pair of popup controls (✕/✓, both text glyphs, not a sprite-heavy control bar) — not the full catalogue of icons technically available in the supplied controller/keyboard pack. The pack's own controller/gamepad icons were reviewed and explicitly not used, per the brief's own "ignore unless controller support is ever implemented" instruction. This is a deliberate restraint check, not an oversight — see `AI_GENERATION_REQUEST.md`-style reasoning applied to this pack: availability of an asset is not, by itself, a reason to use it.
