# Information Blueprint — The Studio

**Status:** Phase 3, Deliverable 2. Maps every information layer using the exact `Workspace → Focus → Layer → Detail` model established in `INFORMATION_ARCHITECTURE.md`, now with the specific fields you've asked for: maximum depth, exit behaviour, relationship to neighbouring interactions, and progressive disclosure. This document doesn't re-derive the Experience State Inventory — it re-frames the same, already-approved states through this new lens.

---

## Desk Focus

| Field | Detail |
|---|---|
| **Maximum depth** | `Workspace → Desk Focus → Projects Layer → [Project] Detail Layer → Blueprint Layer → Source Layer` — 4 layers deep, the deepest state in the room, matched to its Depth-5 flagship content |
| **Exit behaviour** | Unstacks one layer at a time; a direct "return to Workspace" is also available from any depth, per Experience Architecture's State Transitions |
| **Relationship to neighbours** | The only state every other state implicitly refers back to — Research and Leadership both exist partly to answer "is this the same person who built that?" The Desk doesn't reference them |
| **Progressive disclosure** | Headline (Level 1) → summary (Level 2) → tradeoffs/lessons (Level 3) → source (Level 4), exactly the model from `EXPERIENCE_ARCHITECTURE.md`'s Progressive Discovery Model, now confirmed as this state's literal layer stack |

## Bookshelf Focus

| Field | Detail |
|---|---|
| **Maximum depth** | `Workspace → Bookshelf Focus → Research Layer → Research Journal Layer` — 2 layers deep |
| **Exit behaviour** | Unstack to Research Layer, then Workspace |
| **Relationship to neighbours** | Depends on the Desk existing first — Research only reads as a distinct pillar because Systems (the Desk) already established what "building" looks like; without that contrast, Research would just be a second project list |
| **Progressive disclosure** | Advisor/domain/direction (Level 2) → specific current questions (Level 3). No Level 4 — there's no external source link to hand off to yet, honestly reflecting that the research is real but early (`MISSING_ASSETS.md`-adjacent honesty: nothing is padded to look like it has a Level 4 it doesn't have) |

## Clock Focus

| Field | Detail |
|---|---|
| **Maximum depth** | `Workspace → Clock Focus → Timeline Layer` — 1 layer deep, the shallowest state in the room |
| **Exit behaviour** | Single unstack to Workspace |
| **Relationship to neighbours** | The only state that references *all* others at once (a synthesis view) rather than adding new content of its own — its role is entirely relational |
| **Progressive disclosure** | None — a single ordered list, no further depth. This is intentional, not a gap: `INFORMATION_ARCHITECTURE.md`'s Depth Index already scored this state a 2, and a shallow, single-layer state is the honest shape for that score, not an oversight to fix later |

## Leadership Focus

| Field | Detail |
|---|---|
| **Maximum depth** | `Workspace → Leadership Focus → Leadership Layer → Cluster Detail Layer → Whiteboard Layer` — 3 layers deep, second-deepest state in the room |
| **Exit behaviour** | Re-stack to Leadership Layer, then Workspace; individual clusters can be dismissed independently without collapsing the whole Layer (a visitor who's opened the Case Comps cluster can also peek at Debate & APD without losing their place) |
| **Relationship to neighbours** | The pivot state — it's the one place Systems (Desk) and people-leadership are shown belonging to the same person, which is the entire differentiation argument from `PORTFOLIO_STRATEGY.md` Section 2 |
| **Progressive disclosure** | Quantified cluster headlines (Level 2, e.g. "24 conferences, 6 judged") → individual certificate/frame detail (Level 3) → the Whiteboard's fully worked example (Level 3, sibling depth to individual certs, not deeper than them) |

## Coffee Focus

| Field | Detail |
|---|---|
| **Maximum depth** | `Workspace → Coffee Focus → Coffee Layer` — 1 layer deep |
| **Exit behaviour** | Fade to Workspace |
| **Relationship to neighbours** | Deliberately unrelated to the other five — the one state that doesn't build toward or reference the hiring-decision narrative at all (confirmed reasoning in `INTERACTION_HEATMAP.md`'s Removal Check) |
| **Progressive disclosure** | None — by design, matching its Depth-2 score and Optional content tier |

## Window Focus

| Field | Detail |
|---|---|
| **Maximum depth** | `Workspace → Window Focus → Vision Layer` — 1 layer deep, but positioned as the deepest *narrative* moment despite shallow information architecture — depth and narrative weight aren't the same axis, and this state is the clearest proof of that |
| **Exit behaviour** | Tilt down to Workspace |
| **Relationship to neighbours** | Requires 3+ other states to have been visited first (Narrative States gate) — the only state with a hard dependency on prior exploration, everything else is reachable at any time |
| **Progressive disclosure** | None within the state itself — its "depth" is emotional/positional (last in the Storyboard), not layered content. Contact/GitHub sit adjacent to it as an action, not a deeper layer |

---

## Cross-State Relationships (the part a per-state table can't show)

- **Desk ↔ Leadership** is the load-bearing relationship in the whole architecture — every other relationship exists to support the visitor eventually holding both in mind at once. This is why Spatial Blueprint's Option C (placing them adjacent) was rejected on pacing grounds even though it would have made this specific relationship spatially obvious — the relationship needs to be *realized by the visitor's own memory*, not handed to them by proximity, or it stops being a discovery and starts being a caption.
- **Research** depends on the Desk existing first (noted above) but has no dependency running the other direction — a visitor could see Research before Engineering with no loss of meaning, since Research doesn't reference Engineering's content directly.
- **Clock** depends on at least some prior states existing to synthesize — visiting it first would show an mostly-empty timeline, which isn't broken, just less rewarding. No hard gate is placed on it (unlike the Window) because an empty-ish timeline isn't confusing, just less interesting, and Recruiter Time Is Precious argues against adding friction to a low-stakes state.
- **Window** is the one true dependency in the system (3+ states required), justified because its entire content — "what's next" — is meaningless without the "what's already happened" it's responding to.
