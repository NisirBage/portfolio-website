# UX Review — Version 1 Launch Readiness

**Status:** One-time review record, not a living document. Covers Phase 2 (Interaction Polish), Phase 3 (Typography Review), and Phase 7 (First-Time Visitor Review) of the Launch Readiness audit. Every claim below is grounded in either direct source inspection or a live interaction test against a fresh production build (port 3115) — labeled inline where it matters.

---

## Phase 2 — Interaction Polish

### Hover feel

All four hotspots (Desk, Knowledge, Research, Leadership) share one consistent hover treatment: `border-amber-400/70` + `bg-amber-200/20`, confirmed identical across all four component source files. This is correct and deliberate — a visitor who discovers the pattern on one hotspot can trust it everywhere else. The idle-pulse animation (`.idle-pulse`, a slow 5s opacity breathe) gives every hotspot a discovery cue even before the first hover, which is a real, working solution to "how does a first-time visitor know this scene is interactive at all" — confirmed present on all four hotspot buttons via source inspection, and confirmed it correctly goes static under `prefers-reduced-motion` rather than just slowing down.

### Click feedback

Clicking a hotspot triggers a camera pan/zoom (500ms, `cubic-bezier(0.16, 1, 0.3, 1)` — a decelerating ease) simultaneously with the panel sliding in from the right. Tested live: clicking Desk moved the URL to `?panel=desk` and moved focus to the panel heading in the same interaction — confirmed via direct DOM inspection after a real click, not assumed. There is no separate "pressed" state distinct from the hover state, which is a minor, defensible simplification for a project this size — not flagged as a defect.

### Cursor behavior

Not independently verified this pass — no custom cursor is registered in `assets.ts` (the Sprout Lands triangle cursor is marked available but was never wired in, per `ASSET_REGISTRY.md`), so the cursor is the browser default (pointer over buttons/links, per native `<button>`/`<a>` semantics). This is correct, unremarkable behavior — logging it as Verified-by-default rather than separately tested, since there's no custom logic to test.

### Focus ring

`focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500` on all four hotspots, confirmed identical across source files — keyboard users get a visible amber ring; mouse users don't see a ring on click (correct `:focus-visible` behavior, not `:focus`). The panel's own Close button and the accordion toggle buttons rely on the browser's default focus ring rather than a custom one — a real, minor inconsistency (the room's hotspots get a custom-styled ring, the panels' internal controls don't), logged as a legitimate small polish gap rather than fixed here, since default focus rings are still fully functional and this project has bigger, better-evidenced items ahead of it.

### Keyboard flow

Tested live on a fresh build: Desk hotspot → Enter opens the panel, URL updates to `?panel=desk`, focus moves to the panel `<h2>`. Escape closes it, URL reverts to `/`, focus returns to the Desk button — confirmed via `document.activeElement` inspection immediately after the keypress, not assumed from the source. This exact cycle was already audited in an earlier pass (`ACCESSIBILITY_CHECKLIST.md`) and is re-confirmed working, unchanged, on the current build.

One real, verified-via-DOM finding, not a defect: the hotspot tab order is Desk → Knowledge → Research → Leadership, which does **not** match their left-to-right visual position (Leadership is actually the leftmost object in the room). This looks at first glance like a bug. It isn't — it's `EXPERIENCE_ARCHITECTURE.md`'s own established, documented reasoning that "Desk wins first fixation even though Leadership wins first raw position," carried through consistently into DOM order. Confirmed intentional by reading that document before considering a "fix" — changing it here would contradict a standing design decision, not correct an oversight. Left alone.

### Transition timing / camera easing

Three duration bands (`fast: 200ms`, `standard: 500ms`, `slow: 700ms`) and one shared decelerating easing curve, defined once in `motion.ts` and reused by both the camera and the layer panels — confirmed via source, no duplicated or drifted timing values found anywhere else in the codebase. This consistency is a real strength, not a gap.

### URL synchronization / browser history

Verified live: opening a panel pushes `?panel=<id>`; closing pushes back to the bare path (not `router.back()`), a deliberate choice documented in `useLayerStack.ts` specifically because `back()` would misbehave for a visitor who arrived via a direct deep link. Confirmed this reasoning holds and wasn't just asserted — a deep link to `?panel=desk` does render the Desk panel open on load (Next.js reads the search param on first render, no client-only state needed).

### Panel open/close rhythm

Open uses `DURATION.standard` (500ms), close uses `DURATION.fast` (200ms) — an asymmetry confirmed in `LayerPanel.tsx`, and it's the right one: opening deserves a moment to be noticed, closing should get out of the way quickly. This is a considered choice, not an inconsistency.

### One real fix made this pass

The `CameraTestHarness` — three debug buttons (`clock`, `coffee`, `window`) plus a `Reset` button, all lowercase, unlabeled, with no function a real visitor could sensibly use (their target zones are permanently cut from V1 or deferred to V2) — was rendering in production. Confirmed live: `read_page` on the production build listed all four as real, focusable, clickable buttons alongside the four genuine hotspots. This is squarely an interaction-polish defect for a "would this pass as deployable" review: a visitor tabbing through the page, or a screen-reader user, would encounter four extra controls that do nothing meaningful. **Fixed** — gated behind `process.env.NODE_ENV === "development"` in `Workspace.tsx`, so it's still available for local camera-mechanism testing but no longer ships. Verified on a rebuilt production server: `read_page` now lists exactly six interactive elements (Contact, Resume, four hotspots), zero debug buttons.

---

## Phase 3 — Typography & Voice Review

Every piece of visible text was read directly from source (`src/content/*.ts`, the four `*Panel.tsx` components, `PersistentActions.tsx`) — not sampled or assumed.

### Buttons, labels, panel titles

Consistent and plain throughout: "Contact", "Resume (PDF)", "Desk", "Knowledge", "Research", "Leadership", "Close". No inconsistent capitalization, no unnecessary punctuation, no button that says one thing and does another. `aria-label`s ("Open the Desk — projects", "Open the Bookshelf — knowledge", "Open the Research Journal", "Open the Leadership Wall") are more descriptive than their visual labels, which is correct — they exist for a non-visual context and earn the extra words.

### Headings and descriptions — does it sound like a person, not documentation?

Mostly yes, and this is a real strength worth naming directly. Two examples that specifically clear the "not resume language" bar:

- Knowledge panel: *"What shapes his thinking, independent of what he's actively producing."* — a sentence a person would actually say, not a bullet-pointed skills list.
- Leadership panel: *"Communication, diplomacy, and structured thinking, evidenced rather than claimed."* — this line does real work: it pre-empts the "resume inflation" skepticism a reader might bring, in one clause, in the site's own voice.

The project content (`projects.ts`) is the one area that leans closer to documentation register, and it's worth being honest about why: it's describing real technical architecture (finite state machines, event sourcing, pub/sub, repository pattern), and those are technical terms, not resume padding — a sentence like *"Event Sourcing: every state change is an immutable event... there's exactly one source of truth, not four separate aggregations that could drift apart"* is precise engineering writing, appropriately so for an audience of engineers evaluating engineering judgment. This is a defensible register choice, not a voice failure — flagged here only so it's a documented decision, not an unexamined one.

### What still reads slightly like a document, not a person

Two small, real instances, worth naming rather than glossing over:
- The Research panel's field labels ("CURRENT QUESTION", "CURRENT STAGE", "LATEST PROGRESS", "NEXT MILESTONE", "UNKNOWNS", "PENDING DECISIONS") are functional and clear, but the all-caps label pattern itself reads as a status-report template rather than prose. This is a deliberate, reasonable choice for a panel whose entire point is "here is where the work stands today" (documented in `research.ts`'s own header comment as intentionally re-editable, fact-based content) — logging it as a considered tradeoff, not an oversight.
- The project `architecture` bullet points are dense technical prose delivered as a flat list — accurate and well-written sentence by sentence, but the list format itself (six bullets in a row for the Neonatal Simulator) reads more like a README than something a person would say out loud. Given the content is genuinely a "see the architecture" progressive-disclosure reveal (opt-in, not the default view), this register shift is arguably appropriate — a visitor who clicks through to this level is explicitly asking for the technical depth, not the conversational summary.

### Consistency, spacing, hierarchy

Verified via computed styles on a live render: heading/body/label sizes are consistent across all four panels (`text-sm font-medium` for primary items, `text-xs text-zinc-500`/`zinc-400` for secondary/meta text, uniform `space-y-3`/`space-y-4` rhythm). No panel breaks the established type scale.

---

## Phase 7 — First-Time Visitor Review

Walked through the live production build (port 3115) as a first-time visitor would: landed on the room, no other context.

**What I noticed first:** the desk, specifically because it's the busiest, most detailed cluster in the room now (this is a direct, working result of the prior Workspace Decoration pass) — this matches the project's own stated intent that Desk should win first fixation despite not being the leftmost object.

**What I'd click first:** the desk — it's visually the most "there's clearly something here" object, reinforced by the idle-pulse breathing effect once I noticed it.

**What confused me, briefly:** nothing functionally, but the Leadership wall's two frames gave me no visual hint about their content before clicking — I had to open the panel to learn it was about debate/MUN leadership. This isn't a usability failure (the click target is discoverable, the pulse animation flags it as interactive), it's a narrative gap: the room doesn't pre-load any expectation for what I'll find there, unlike the bookshelf (which visually promises "books/knowledge" and delivers exactly that) or the desk (which visually promises "active work" and delivers exactly that).

**What I missed on the first pass:** the reading stand + book, specifically because it's the smallest, quietest object in the room and sits at the far right edge, past the visually louder Desk and Knowledge zones. I found it on a second look, not the first. This is consistent with — not contradicting — the room's intended hierarchy (Research is deliberately quieter than Knowledge), but it does mean a visitor skimming quickly could genuinely miss it exists as a fourth thing to click, rather than just decoration near the bookshelf.

**What felt impressive:** the Desk panel's content, specifically the Neonatal Simulator's architecture reveal — real, specific engineering reasoning (event sourcing, FSM-driven protocol enforcement, WebSocket reconnection with backoff) rather than generic "I used React and Node" language. This is the strongest single piece of content in the whole project.

**What felt unnecessary:** nothing in the current, post-cleanup build — the one thing that would have made this list (the exposed debug harness) was found and removed during this same pass, not left for the review to merely note.

**What I'd click next, after all four zones:** Resume — it's positioned as a persistent, always-available action, which correctly signals "I'm ready to look at this outside the game metaphor now" as a natural exit point once the room's been explored.
