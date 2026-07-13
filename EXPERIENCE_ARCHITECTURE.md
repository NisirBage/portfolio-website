# Experience Architecture — The Studio

**Status:** Draft for review. Governs how the portfolio is *experienced*, not how it looks. Every rule here is downstream of [NARRATIVE_SYSTEM.md](NARRATIVE_SYSTEM.md) and upstream of [INTERACTION_SPECIFICATION.md](INTERACTION_SPECIFICATION.md), [EXPERIENCE_STORYBOARD.md](EXPERIENCE_STORYBOARD.md), and [ZONE_SUCCESS_MATRIX.md](ZONE_SUCCESS_MATRIX.md).

This document answers the question you asked for: **how should someone experience this**, not what it should look like. Visual design is Phase 2's job, once this is approved.

---

## Layout Options Considered

You asked for multiple proposals before committing. Three, evaluated against Purpose Before Beauty, Maintainability First, and Recruiter Time Is Precious.

### Option A — Radial Hub (your example, adapted)
Desk at dead center; Research, Engineering, Leadership, and Analytics as four cardinal branches; Observatory above. Each branch is a full camera swing to a distinct framed view.

- **Strengths:** Immediately legible as "one workspace, multiple facets" — matches your instruction closely. Symmetrical, easy to reason about.
- **Weaknesses:** A true radial layout implies the visitor can approach the desk from any of four directions, which only makes sense in a real 3D or top-down space — it re-introduces the "walk around a room" framing you just moved away from. Also produces a fifth zone (Analytics) that, per the real project inventory, doesn't have enough independent evidence to justify a full branch — see the cut discussed under Option C.

### Option B — Single Continuous Rectangular Studio
*(Corrected from "L-Shaped Studio" — see the note below.)* One unbroken background (not five separate scenes) — desk facing a window, bookshelf on one wall, a gallery wall behind, a kitchen nook in the corner. Camera never cuts to a new scene, only zooms/pans within one continuous image.

- **Strengths:** Cheapest to build (one background asset, not five), most literally "coherent workspace" (it's physically one room, not five connected rooms), best mobile story (a single wide image scrolls naturally).
- **Weaknesses:** Doesn't encode information priority — sightline position is arbitrary (whatever the art happens to place stage-left) rather than meaningful.

> **Asset Truthfulness correction (post Phase-1.5 verification):** this option was originally written up as an "L-shaped" room, assumed from a quick look at the floor/wall tile sheet. A pixel-level re-inspection (see `ASSET_REGISTRY.md`) shows `TopDownHouse_FloorsAndWalls.png` is actually one **complete, pre-built rectangular room** — full four-wall border, two pre-cut door openings, four material zones side by side. There is no corner/L-junction tile in either pack. The fix is a straight rectangular studio, not an L-shape — which is simpler to build, not a downgrade: it's one ready-made background instead of tiles I'd need to assemble.

### Option C — Single Continuous Studio, Priority-Ordered (recommended)
Physically Option B (one continuous **rectangular** scene, cheap, real, and — per the correction above — already a single complete asset), but wall placement is **not arbitrary** — distance from the Desk encodes information priority from the Content Hierarchy. Critical evidence (Engineering, the resume/contact anchor) sits in the same sightline as the Desk with no camera movement required to notice it exists. Important evidence (Research, Leadership) is one deliberate zoom away, immediately visible in the establishing shot but requiring a click to open. Optional depth (Coffee Corner, full certificate gallery) sits at the periphery — present, discoverable, never demanding attention.

- **Strengths:** Gets Option B's build simplicity and Option A's "everything branches from one place" feeling, plus makes the room's *geometry itself* an expression of Recruiter Time Is Precious — the highest-value information is structurally the easiest to reach. This is the kind of decision that itself signals systems thinking to the exact personas this is for.
- **Weaknesses:** Requires the establishing shot to be composed carefully (asset/art risk if the scene gets cluttered) — mitigated by keeping the object count small, per Narrative System's reconciliation of your object list down to six interactive props.

**Decision: Option C.** It satisfies your instruction ("everything branches from one place") without reintroducing room-to-room teleportation, and it's the only option where the spatial layout *is* a piece of evidence about how Nisir thinks, rather than just a container for evidence. Building on a verified single rectangular room asset (not an assumed L-shape) also removes a compositing risk this document originally carried without flagging it — corrected above once caught.

---

## World Hierarchy

```
                         Window / Observatory
                          (Vision — tilt up)
                                  ▲
                                  │
   Bookshelf ◄────►  Research   The Desk  ──────────────►  Leadership Wall
   (Knowledge)        Journal    (HUB —                      (Awards, roles,
                     (Research)  resume · contact ·           case-comp work)
                                 project index)
                                  │
                                  ▼
                            Coffee Corner
                         (About · currently
                          exploring · contact)
```

*Revised, Milestone 7.* The Bookshelf and Research Journal are two distinct, peer objects sharing Zone 3, not one object doing double duty — Knowledge (what shapes his thinking) and Research (how he contributes new thinking) are different claims with different evidence. See `NARRATIVE_SYSTEM.md`'s World Rules table for the full rationale.

- **The Desk** is the only object visible and legible from Arrival at full detail — everything else is visible in the wide establishing shot but requires a zoom to read.
- **Engineering evidence lives at the Desk itself**, not on a separate wall. The three projects are papers/objects *on* the desk surface — this is the Option A "Analytics" branch folded in, and is the one deliberate deviation from a strict five-spoke model. Reasoning: the real project inventory is three projects, all with dashboards/data-analysis components already inside them (the Safety Platform's dashboards *are* the analytics evidence). Giving Analytics its own branch would mean either duplicating that evidence or building a fourth, thinner branch — both violate Content Hierarchy's instruction to cut anything that dilutes rather than strengthens. Keeping Engineering unified at the hub also matches reality: engineering is *the* central activity, not one branch among equals.
- **Coffee Corner replaces "Data Lab"** in your example layout, for the persona reason above (Section 3 of the Strategy doc — the Collaborator/Peer persona has no other zone that serves them) and because thin content is worse than no zone at all.

---

## Zone Relationships

All six destinations (Desk, Bookshelf/Knowledge, Research Journal, Leadership, Coffee Corner, Window) are visible in a single establishing shot — no zone is ever "behind" another or reachable only through a different zone. This matters for two reasons: it lets a fast visitor jump straight to whatever they care about (Recruiter Time Is Precious), and it means there is no possible "dead end" or "lost in the house" state, which a genuine multi-room layout risks. *Revised, Milestone 7: count updated from five to six now that the Bookshelf and Research Journal are separate destinations rather than one.*

Sightline priority (nearest → farthest from Desk, i.e. Critical → Optional per Content Hierarchy):
1. Desk itself (resume, contact, project index) — Critical
2. Leadership Wall + Bookshelf/Knowledge + Research Journal — Important, Zone 3's two objects sharing the priority tier the single Research shelf previously held
3. Window — Important but deliberately requires 3+ prior interactions to "light up" (see Narrative States)
4. Coffee Corner — Optional, peripheral

---

## Navigation Philosophy

- **Point-and-click hotspots only.** No player character, confirmed. The cursor is the only moving "actor."
- **Contextual zoom, not scene changes.** Clicking a hotspot animates the viewport toward it; the underlying scene never unloads or reloads.
- **Always-available home anchor.** A small, quiet "return to Desk" affordance is present the instant a visitor has zoomed anywhere — justified because without it a visitor mid-zoom has no way back except browser-back, which would reload the whole experience. This does not count as a "large navigation menu" (an explicitly banned pattern) — it's one small control, not a menu.
- **Persistent Contact affordance.** A second small, quiet UI element — same visual weight class as the home anchor and the audio toggle — is present at all times, not just inside the Window panel. **This is a correction, not an original decision:** `CONTENT_HIERARCHY.md` places "Contact method" at Critical tier, meaning zero clicks from Arrival, but `INTERACTION_SPECIFICATION.md`'s Window entry described Contact primarily as something reached through the Window's narrative payoff — those two requirements directly contradicted each other. Resolved by having both: the persistent affordance satisfies the Critical-tier requirement for a fast visitor, and the Window panel still reiterates Contact as its narrative closing beat for a visitor who reaches it that way. Three total persistent elements (home anchor, audio toggle, contact) is still far short of "large navigation menu."
- **No breadcrumbs, no site-wide nav bar.** Wayfinding comes from the room being small enough (seven objects, *revised Milestone 7*) to hold in memory, not from UI chrome.

---

## Interaction Philosophy

One hotspot, one clear reveal, no dead clicks. Concretely: every hotspot's hover state previews *what* will happen (a one-line label, e.g. "Open the Safety Platform") before the click commits to it — a visitor should never click something out of curiosity and get a result they didn't expect, which is a subtle but real trust cost.

---

## Progressive Discovery Model

Your four levels, formalized as the depth contract every object must honor (per-object specifics in Interaction Specification):

| Level | Time budget | Content | Trigger |
|---|---|---|---|
| **1 — Glance** | ~3 sec | Headline + visual, readable from the establishing shot or first hover | Hover / establishing view |
| **2 — Overview** | ~20 sec | Summary + architecture-level shape | First click |
| **3 — Depth** | ~2 min | Challenges, tradeoffs, lessons learned, reflection copy | Expand within the same panel — no new click target, just "read more" |
| **4 — Source** | 5+ min | Full technical documentation, source links, GitHub, related research | Explicit outbound link at the bottom of Level 3 |

No object skips a level (nothing jumps from headline straight to source-code depth), and no object requires passing through a level to reach a later one visually — Level 4 is always reachable by continuing to scroll/read from Level 3, never gated behind a separate re-click.

---

## Recruiter Journey (mapped onto the hub)

- **90 seconds (Software Engineer / ML Recruiter, fast pass):** Arrival → Desk Level 1 (name, one-line identity, project headlines) → one project opened to Level 2 → resume/contact, both reachable directly from the Desk without ever leaving it.
- **5 minutes (typical persona):** Desk → one project to Level 3 → Leadership Wall Level 2 → Bookshelf/Knowledge Level 2.
- **10 minutes (Professor / Research Scientist / deeply interested recruiter):** All six destinations, at least one object per destination reached to Level 3–4, including the Research Journal's current-status detail, ending at the Window.

---

## Emotional Pacing

Reuses the Narrative System's arc (Arrival → Curiosity → Discovery → Understanding → Respect → Confidence → Inspiration), now anchored to concrete geography: Understanding requires visiting a second, differently-themed destination; Confidence requires three; Inspiration is the Window, deliberately last.

---

## Accessibility Strategy

Non-negotiable, considered from the start per your own Accessibility By Default principle:

- **Full keyboard path.** Tab order follows hub → spoke priority (Desk first, then Leadership/Research, then Window, then Coffee Corner), matching the sightline priority above. Enter/Space activates a hotspot exactly as a click would.
- **Screen-reader parallel path.** The pixel scene is decorative from an assistive-technology standpoint — a semantic, linear HTML document (real headings, real landmarks) carries every piece of Level 1–4 content in reading order, independent of the visual scene. A screen-reader user gets the full portfolio; they just don't get the camera choreography, which is the correct tradeoff (content over spectacle).
- **`prefers-reduced-motion` respected everywhere.** Zoom/pan transitions become instant cuts; the Narrative States' brightness shifts either disable or become near-instant.
- **Focus visibility.** Every hotspot gets a visible focus ring that works against the pixel-art background (tested for contrast, not assumed).
- **Contrast.** Modern-UI panel text meets WCAG AA minimum against both light and dark themes (Phase 1's palette already separates "pixel world" from "UI panel" — the panel is where all real reading happens, so its contrast is the one that actually matters for legibility).
- **Touch.** Every hotspot has a minimum 44×44px touch target regardless of how small it renders visually in the pixel scene.

---

## Camera Philosophy

Full reasoning in Narrative System's Camera Philosophy section; the operational summary:

- Implemented as CSS transform (`translate` + `scale`) on a single flat scene — not a 3D/WebGL camera.
- Easing: a custom cubic-bezier that decelerates into the target (no linear pans — linear reads as mechanical, not cinematic).
- Duration: 400–600ms for a zoom, ~250ms for the return-to-Desk snap-back (faster on the way out, since the visitor already knows where "home" is).
- Never moves without a corresponding state change (see Narrative System's Immersion Rules) — no idle camera drift.
- **Mobile/narrow-viewport fallback:** below a defined breakpoint, pan/zoom on a small screen is a known usability failure for text-heavy content (fingers obscure the content they're trying to zoom into, and small-screen zoom-to-read is fatiguing). The Studio collapses to a vertical scroll-snap sequence of the same five destinations in the same priority order, with the same Level 1–4 content per destination — same information architecture, different input model. This is decided now, in Phase "1.5," because it changes how the scene needs to be built (the underlying content structure must be independent of the camera system) — deferring it to implementation would risk building something that only works one way.

---

## Movement Philosophy

There is no character. The visitor's attention is the only thing that moves, and the camera follows attention, not the reverse — a hotspot is clicked *because* the visitor decided to look at it, the camera doesn't lead the visitor around on rails. This is the concrete difference between "exploring" and "playing," which was the instruction.

---

## State Transitions

```
        ┌────────────┐
        │    Idle     │  (Desk-centered establishing shot)
        └─────┬──────┘
              │ click hotspot
              ▼
        ┌────────────┐
        │  Focused    │  (camera zoomed to destination, Level 1–2 visible)
        └─────┬──────┘
              │ click "read more" / scroll
              ▼
        ┌────────────┐
        │   Detail    │  (Level 3–4 panel open, modern UI layer)
        └─────┬──────┘
              │ close panel or "return to Desk"
              ▼
        ┌────────────┐
        │    Idle     │  (camera snaps back, visited-glow updates)
        └────────────┘
```

Deterministic, four states, no hidden intermediate states, no dead ends. Browser back/forward should map cleanly onto this stack (Detail → Focused → Idle) — a real requirement for both usability and accessibility, formalized here so Phase 3 builds routing around it rather than bolting it on after.
