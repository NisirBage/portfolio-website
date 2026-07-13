# Composition Study — The Studio

**Status:** Phase 3, Deliverable 3. Composition, not UI — no color, typography, or chrome decisions here, only where the eye goes and why. This is what makes Spatial Blueprint's Option A actually work: placement alone put the Desk second-in-scan-order, not first; composition is where that gets corrected.

---

## Workspace (Arrival, establishing shot)

- **Primary focal point.** The Desk (Zone 2) — not because it's first in scan order (it isn't, Zone 1 is), but because it's the largest, most detailed furniture cluster in frame and sits under the room's implied light source (a desk lamp is part of the furniture set, per `ASSET_REGISTRY.md`).
- **Secondary focal point.** The Leadership Wall (Zone 1) — genuinely competing for attention, which is intentional: this is the room's other major evidence pillar, and it should be visible enough to promise depth without demanding a detour.
- **Negative space.** The floor itself — four different floor textures, but none of them cluttered with small props at this wide shot. Negative space is what keeps four visually distinct zones from reading as busy; the room breathes because most of its square footage is quiet floor, not furniture.
- **Eye path.** Left to right across Zones 1→2→3→4 (Western reading convention), but *pausing* at Zone 2 rather than continuing straight through — that pause is the whole point of giving the Desk more visual weight than its position alone would earn.
- **Balance.** Asymmetric by necessity (four different zones, not four identical ones) but weighted so no single zone reads as empty — Zone 4 (Coffee), the lightest-content zone, still carries the floor vent detail and the kitchen counter's L-shaped silhouette, enough visual interest to not read as an afterthought even though it's Optional-tier content.
- **Visual weight.** Desk > Leadership > Bookshelf > Coffee, matching `VISUAL_PRIORITY_MAP.md`'s Primary/Secondary/Supporting classification exactly — composition and content priority are required to agree with each other, and this is the check that they do.
- **How the environment guides attention.** Lighting does the work arrows would otherwise have to: the desk lamp's implied glow is the brightest point in the frame, which is where eyes land after the initial left-to-right scan regardless of literal position — no arrow, no "click here" label, no onboarding, matching your explicit ban on all three.

---

## Desk Focus

- **Primary focal point.** The three project headlines, stacked and equally weighted — no single project should visually dominate the other two before the visitor chooses one.
- **Secondary focal point.** The Resume tab, positioned to be noticed without competing — smaller, quieter, consistently present rather than demanding attention.
- **Negative space.** Generous margin around the headline list — this is the state carrying the most cognitive load once a project is opened (Cognitive Load Budget), so the surrounding composition stays deliberately calm to not add visual noise on top of reading load.
- **Eye path.** Top to bottom through the three headlines, left to right within the panel toward the "read more" affordance on whichever one is chosen.
- **Balance.** Symmetric across the three project entries — none should read as more visually important than another before the visitor picks, since `INFORMATION_ARCHITECTURE.md` treats all three as equally flagship (Depth 5).
- **Visual weight.** Flat across the three headlines at Level 1; weight only differentiates once one is expanded, at which point the other two visually recede (dim, don't vanish) rather than being removed from view.
- **How the environment guides attention.** The Blueprint Layer, when opened, becomes the visually heaviest thing on screen — appropriately, since it's the Depth-5 payload the whole state exists to deliver.

---

## Bookshelf Focus

- **Primary focal point.** The one book that slides out — everything else on the shelf recedes into supporting texture the moment this happens.
- **Secondary focal point.** The advisor/domain text block, appearing as the book settles open.
- **Negative space.** The rest of the shelf, deliberately left unlit/unfocused — a full shelf of unreachable books would imply more content exists than actually does, which would be dishonest composition even if it looked richer.
- **Eye path.** A short vertical path — shelf, to book, to text — the shortest eye path of any state, matching its Depth-3 (not deep) content.
- **Balance.** Deliberately asymmetric, weighted toward the one responding book — this is a state about specificity (one advisor, one domain), and a busy, symmetric shelf composition would undercut that.
- **Visual weight.** Lightest "hero" object of any Focus state — proportionate to Research's real content volume today, not padded to look more substantial than it is (see `MISSING_ASSETS.md`'s honesty about the research thread being real but early).
- **How the environment guides attention.** The shelf's darker surrounding wood frames the one lit book — a vignette effect achieved through the furniture's own geometry, not an added spotlight graphic.

---

## Clock Focus

- **Primary focal point.** The clock face itself, mid-sweep.
- **Secondary focal point.** None — this is the one state without a real secondary focal point, appropriate to its Depth-2, single-layer content.
- **Negative space.** Almost the entire frame — the tightest camera anchor of any state (per Spatial Blueprint) on the smallest amount of real content.
- **Eye path.** A single point, no path — the hands' motion is the entire visual event.
- **Balance.** Centered, static, calm — this state is a pause between two more demanding neighbors (Desk and Research/Leadership), and its composition should feel like a rest, not a destination.
- **Visual weight.** Deliberately the lightest state in the room.
- **How the environment guides attention.** Motion alone — the hands sweeping is the only thing that moves, so it's the only thing the eye can follow.

---

## Leadership Focus

- **Primary focal point.** The quantified cluster headlines ("24 conferences, 6 judged") — legible before any individual frame is opened, so the state's core claim lands even for a visitor who never digs further.
- **Secondary focal point.** The fanned-out frames themselves, once a cluster is opened.
- **Negative space.** Actively managed, not incidental — this is the state independently flagged as highest overload-risk (`ZONE_SUCCESS_MATRIX.md`), so negative space between clusters is load-bearing here specifically, not just aesthetic. Clusters need visible breathing room or the "curated, not dumped" feeling the fan-out animation is supposed to deliver collapses.
- **Eye path.** Four discrete stops (one per cluster) rather than one continuous scan — this state is structured as a set of choices, not a single narrative to read start to finish.
- **Balance.** Four clusters given equal visual weight at the overview level, regardless of how many certificates each actually contains — cluster *count* of items shouldn't dictate visual dominance, or Model UN (the largest raw count) would visually overwhelm Case Comps (the smallest, but the one built specifically for the Consulting Recruiter persona).
- **Visual weight.** Second-heaviest state after the Desk, matching its Depth-4 content and widest engagement-time range.
- **How the environment guides attention.** The staggered fan-out cascade itself sequences attention — each frame's arrival briefly draws the eye, creating a natural, unforced scan order across the cluster without any labeled "start here."

---

## Coffee Focus

- **Primary focal point.** The mug, mid-steam.
- **Secondary focal point.** None, deliberately — matching its Depth-2, low-stakes content.
- **Negative space.** The largest proportion of empty frame of any state — this is the one composition allowed to feel unhurried rather than purposeful, appropriate to a zone that isn't building a case for anything.
- **Eye path.** None to speak of — a single glance suffices, which is honest to the content rather than a shortcoming.
- **Balance.** Loose, informal — the one state where strict compositional discipline would work against the tone it's trying to strike.
- **Visual weight.** Lightest state in the room alongside the Clock.
- **How the environment guides attention.** Warmth (implied by the steam and the kitchen counter's soft-lit palette) rather than contrast or motion — this state persuades through mood, not through visual force.

---

## Window Focus

- **Primary focal point.** The window itself, brightening.
- **Secondary focal point.** The Contact/GitHub action, appearing after the tilt completes.
- **Negative space.** A cooler-toned sky visible through the glass — the only place in the entire composition where negative space *is* the content (open sky, standing in for "what's ahead," rather than empty room to keep things calm).
- **Eye path.** A single vertical rise — the tilt itself is the eye path, not something layered on top of a static frame.
- **Balance.** Deliberately top-weighted — the only state where weight shifts upward, physically reinforcing "looking toward what's next" rather than "settling into what's already here."
- **Visual weight.** The single most deliberate visual moment in the room — held longer, lit differently, and physically separated (vertically) from every other state's shared horizontal plane.
- **How the environment guides attention.** Everything converges here by omission as much as design — five other states have already spent their visual force by the time a visitor reaches this one, so a comparatively modest amount of brightening and camera motion reads as significant purely by contrast with what came before.
