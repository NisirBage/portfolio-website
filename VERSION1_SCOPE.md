# Version 1 Scope Lock — The Studio

**Status:** Consolidates version tags that were previously scattered across `INFORMATION_ARCHITECTURE.md`, `MISSING_ASSETS.md`, `MOMENTS_OF_DELIGHT.md`, and `IMPLEMENTATION_RISKS.md` into one authoritative list, revised where the Design Debt and Implementation Risk reviews changed a prior call. **Anything outside Must Have requires explicit approval before implementation, per your instruction — this list is the gate, not a suggestion.**

---

## Must Have

- Persistent Workspace with the six-shot camera vocabulary, timing revisited per `DESIGN_DEBT.md` Finding #4
- Layer/Panel stacking engine (Focus → Layer → Detail), browser back/forward wired correctly
- Desk Focus, fully wired: Projects Layer (accordion, Low-Fi Option C), all three flagship projects to Level 4, Blueprint unroll
- Resume and Contact persistent affordances
- Leadership Focus at the **simplified grid fallback**, not the fan-out (see Feature Removal Review) — the cluster content and quantified headlines are Must Have; the fan-out animation specifically is not
- Bookshelf (Knowledge) Focus to Level 2, and Research Journal Focus with its full current-status detail (*revised, Milestone 7: these are two peer objects, not one — see `NARRATIVE_SYSTEM.md`. The Research Journal's status content is inherently a single unit, so it ships complete rather than split across a Level 2/3 boundary.*)
- Screen-reader parallel linear document, content-complete
- Mobile: the plain-list fallback (no spatial metaphor attempted)
- A subtle first-paint idle animation on the Desk, addressing `DESIGN_DEBT.md` Finding #2 (discovery-mechanism risk) — new to this document, not present in earlier drafts
- ~~The Whiteboard case-comp content, actually written~~ — *revised, Milestone 8: demoted out of Must Have.* The real worked-framework content this requires (what a specific case-comp recommendation actually argued) isn't available; per Content Truthfulness, shipping without it and logging the gap is the honest call over fabricating a framework to hit this line item. See `MISSING_CONTENT.md`. Moved to Should Have below.

## Should Have

- Leadership fan-out arc animation (upgrade from the grid fallback)
- The Whiteboard case-comp content (*moved here, Milestone 8*, pending a real worked framework)
- Blueprint unroll's diagonal-specific animation (vs. a plain reveal, if time is tight)
- Environmental storytelling (visited-glow, Narrative States lighting)
- Deep-linking to a specific Layer state, newly identified in `IMPLEMENTATION_RISKS.md`

## Nice To Have

- Clock Focus / Timeline entirely
- Coffee Focus / Coffee Corner entirely
- The remaining Moments of Delight not already covered above (Bookshelf slide-open, Clock hands-sweep, Coffee steam-rise)
- Full mobile spatial fidelity (vs. the plain-list Must Have)

## Version 2

- Ambient audio system, cut entirely from V1 per `DESIGN_DEBT.md` Finding #10 — revisit once source audio exists
- Inline resume preview (`INFORMATION_ARCHITECTURE.md`'s Resume Presentation Option B)
- Live GitHub integration
- Full mobile spatial fidelity, if not delivered in V1 as a Nice-to-Have

## Version 3

- Knowledge graph, publication explorer, visitor personalization (unchanged from `PORTFOLIO_STRATEGY.md`'s original roadmap)

## Experimental

- Blueprint-panel graph-paper texture (`MISSING_ASSETS.md`)
- WebGL camera system, only if 3D itself becomes a deliberate skills-demonstration goal (`NARRATIVE_SYSTEM.md`'s Camera Philosophy pushback)

---

## Feature Removal Review — a 40% Deadline Cut

Not hypothetical scope padding — an actual ordered list, so that if the deadline genuinely shrinks, the decision is "execute this list" rather than "renegotiate everything under pressure." Roughly 30% of planned V1 functionality removed, in this order:

1. **Coffee Focus is cut entirely**, not simplified. It was already logged as the single most defensible cut in `INTERACTION_HEATMAP.md`'s Removal Check — that finding exists specifically to be used here. The Coffee Mug sprite stays visible in the establishing shot as pure Decorative-tier dressing (no click target), so the room doesn't visually change, only the interaction disappears.
2. **Clock Focus is cut entirely**, same treatment — remains as Decorative dressing, non-interactive. Its content (career chronology) is already reconstructable from dates already present in the Projects, Research, and Leadership content individually, per `INFORMATION_ARCHITECTURE.md`'s original Timeline alternatives analysis.
3. **Leadership fan-out downgrades to the plain grid** (Low-Fi Option A) — already the Must Have baseline above, so this "cut" is really just confirming the fallback is the shipped version, not a stretch goal reached later.
4. **The audio toggle is removed from the UI chrome entirely** — already decided in Design Debt, restated here as part of the same cut list rather than a separate decision.
5. **Narrative States lighting collapses to a single static treatment** — no Quiet/Curious/Engaged/Inspired progression, just the calm, warm baseline lighting from Arrival, unchanging. Removes a real but non-essential layer of polish.
6. **Moments of Delight reduces from 8 to 4**: Desk boot-line reveal, Blueprint unroll, Window tilt-brighten, and Return-to-Workspace snap-back survive because each is tied to Must Have content or (for the Return snap-back) to the pacing function identified in `INFORMATION_ARCHITECTURE.md`'s Cognitive Load Budget. Bookshelf slide-open, Clock hands-sweep, Frame fan-out, and Coffee steam-rise are cut or become plain fades — three of the four are cut anyway because their parent states (Clock, Coffee) are gone, and the fan-out's bespoke animation goes with its downgrade to a grid.
7. **Mobile ships the plain-list fallback only** — already the Must Have baseline, confirmed here as the actual shipped scope under time pressure rather than an aspiration to exceed later.

**What this preserves.** Every cut removes a Should-Have or Nice-to-Have layer sitting on top of Must-Have content — no cut below this line removes any of the three flagship projects, the Leadership cluster's core evidence, the Research content, the accessibility parallel path, or either persistent affordance. The 30% removed is entirely presentation polish and two low-traffic states, not core evidence. That's the actual test of whether a removal list is principled: everything a hiring decision depends on survives every single cut on this list.
