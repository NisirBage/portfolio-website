# Accessibility Checklist — The Studio

**Status:** Living document, updated every milestone per your instruction — progressively more complete, never deferred wholesale to a single "accessibility milestone" (a mistake `IMPLEMENTATION_PLAN.md` and `DESIGN_DEBT.md` Finding #6 already flagged as a risk to avoid repeating). Each item is marked Verified, Partial, or Gap — not rounded up to look more complete than it is.

---

| Area | Status | Detail |
|---|---|---|
| **Keyboard — Tab reachability** | ✅ Verified | Every interactive control (Desk hotspot, camera test buttons, Resume, Contact, layer Close) reaches focus in a predictable order, confirmed via `document.activeElement` checks in Milestones 3–5. |
| **Keyboard — Enter/Space activation** | ⚠️ Gap in *verification*, not markup | Every control is a plain semantic `<button>`/`<a>` with zero custom keyboard handling, so activation is native browser behavior by construction. But this hasn't been confirmed with real keyboard input — the test tool's synthetic key events are malformed (`ASSUMPTIONS.md` A1). Needs a real-device check before Version 1. |
| **Keyboard — Escape closes the open layer** | ⚠️ Unverified | Implemented in `LayerPanel.tsx`, never exercised with a real or synthetic Escape key press this session — same tool limitation as above. |
| **Touch targets — real hotspots** | ✅ Verified | The Desk hotspot measures 270×247px, far exceeding the 44×44px minimum. |
| **Touch targets — temporary test harness** | ⚠️ Known gap, accepted | `CameraTestHarness`'s buttons are small (`px-2 py-1 text-xs`) and likely under 44×44px. Explicitly accepted: this is scaffolding being deleted zone-by-zone as real hotspots replace it (Design For Deletion), not a defect worth fixing in throwaway code. |
| **Reduced motion** | ✅ Verified in code, ⚠️ Assumed in effect | `.motion-transition`, `.idle-pulse`, and `.boot-line` all collapse under `prefers-reduced-motion: reduce` — confirmed by reading the CSS and by functional testing via an injected equivalent override (`ASSUMPTIONS.md` A2), not a real OS-level toggle. |
| **Focus management — moves into panel on open** | ✅ Verified | `document.activeElement.id === "layer-panel-heading"` confirmed immediately after every real open interaction, Milestones 4 and 5. |
| **Focus management — returns to trigger on close** | ⚠️ Gap, logged | `ASSUMPTIONS.md` A6 — tested via JS `.click()`, which doesn't focus an element the way a real click does; focus landed on `<body>` in that test. Needs re-verification with a real click before Version 1. |
| **Contrast** | ❓ Unknown | Not audited with a contrast-checking tool this session. Logged as Unknown, not assumed fine. |
| **Semantics** | ✅ Verified | `role="dialog"` + `aria-labelledby` on the panel, `aria-label` on the Desk hotspot, real `<button>`/`<a>` elements throughout — no `<div onClick>` pattern anywhere in the codebase. |
| **Screen reader** | ❓ Unknown | No VoiceOver/NVDA testing yet — `IMPLEMENTATION_RISKS.md` already scoped a dedicated pass for Milestone 10; not pulled forward. |
| **Browser compatibility** | ❓ Unknown beyond Chromium | Every verification this session ran against one Chromium-based tool. Firefox/Safari untested (`ASSUMPTIONS.md` A3, A7). |
| **Decorative content hidden from AT** | ✅ Verified | Room shell and door sprites use `alt=""`; the idle-pulse Desk marker has a real `aria-label` since it's interactive, not decorative. |
| **Accordion state — `aria-expanded`** | ✅ Verified (Milestone 6) | Each project's expand button carries a real `aria-expanded` attribute, confirmed `true`/`false` correctly via mouse-driven testing on a production build across all three projects, including mutual-exclusivity (opening one collapses another). |
| **Outbound links — `rel="noreferrer"`** | ✅ Verified (Milestone 6) | Every Level 4 outbound link (`target="_blank"`) carries `rel="noreferrer"`, preventing the opened page from accessing `window.opener` — a real security/privacy default, not just an accessibility one. |
| **Progressive disclosure — no forced depth** | ✅ Verified (Milestone 6) | A visitor can read a project's Level 2 summary without the Level 3 architecture list ever entering the DOM's visible content — "See the architecture" is a real second click, not auto-revealed, confirmed by inspecting the panel's content before and after that click. |
| **Status conveyed by more than color (Milestone 7)** | ✅ Verified | The Research Journal's "● Active" status uses an `aria-hidden` dot plus a real text label — confirmed the text renders independently of the dot's color, so a screen reader or a color-blind visitor gets the same information a sighted visitor does. |
| **Two new hotspots reachable and labeled (Milestone 7)** | ✅ Verified | `KnowledgeHotspot` ("Open the Bookshelf — knowledge") and `ResearchHotspot` ("Open the Research Journal") both confirmed present with real `aria-label`s via the accessibility tree, both open their respective panel and move focus to the panel heading, same pattern as the Desk hotspot. |

## What "progressively more complete" means going forward

Each future milestone should add rows or flip existing ⚠️/❓ entries to ✅ with real evidence — not rewrite this table's tone to sound more finished. The Milestone 10 audit in `IMPLEMENTATION_PLAN.md` (full keyboard walkthrough, real screen-reader testing) remains the point where the ❓ rows above get resolved with real hardware, not simulated.
