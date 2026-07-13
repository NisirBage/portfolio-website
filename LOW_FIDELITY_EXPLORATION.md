# Low-Fidelity Exploration — The Studio

**Status:** Phase 3, Deliverable 5 — produced last, as instructed, only after Deliverables 1–4 established placement, information depth, composition, and visual priority. No color, typography, or artwork below, on purpose. These sketches exist to validate layout, density, and hierarchy only; visual design begins after this is approved.

The room-level layout (Spatial Blueprint's Option A) is already decided and isn't re-explored here — sketching it is just making that decision visible in box form. Two genuinely new decisions *are* explored fresh below, because they haven't been made yet: how the Desk's Projects Layer arranges its content, and how the Leadership cluster fan-out arranges its frames.

---

## Establishing Shot (Spatial Blueprint Option A, rendered)

```
┌──────────────────────────────────────────────────────────────┐
│  ZONE 1        │  ZONE 2         │  ZONE 3       │  ZONE 4    │
│  Leadership     │  D E S K        │  Bookshelf    │  Coffee    │
│                 │  (Primary)      │  (Secondary)  │(Supporting)│
│  [ frames ]     │  ┌─────────┐    │  [ shelf ]    │ [ counter ]│
│  [ wall  ]      │  │ desk +  │    │               │ [ mug ]    │
│  (Secondary)    │  │ lamp    │◄───┼─ clock, at    │            │
│                 │  └─────────┘    │  zone 2/3     │            │
│                 │       ▲          │  boundary     │            │
│                 │       │          │  (Supporting) │            │
│                 │   [ window,      │               │            │
│                 │   above/behind — │               │            │
│                 │   tilt up only ] │               │            │
│ [door, Bg]      │[door, Bg]        │               │  [vent]    │
└──────────────────────────────────────────────────────────────┘
        ← lower density →                    ← lower density →
              denser toward center (Zones 1–2), lighter toward the edges
```

**What this validates.** Density is front-loaded, matching `SPATIAL_BLUEPRINT.md`'s "hardest content first, coast afterward" pacing shape. The Desk reads as the largest single block despite not being the leftmost — confirming `COMPOSITION_STUDY.md`'s claim actually holds at sketch resolution, not just in prose. Nothing in Zone 4 competes with Zone 2's density, consistent with `VISUAL_PRIORITY_MAP.md`.

---

## New Decision: Projects Layer Internal Layout

### Option A — Vertical stacked list

```
┌ Projects Layer ─────────────┐
│ ▸ Industrial Safety Platform │
│ ▸ Neonatal Simulator         │
│ ▸ Spam/Phishing Detector     │
│                               │
│ [Resume tab, small, corner]  │
└───────────────────────────────┘
```
- **Strengths.** Scans top-to-bottom in the natural reading order established for the panel; expanding one entry pushes the others down rather than replacing the view, so a visitor never loses track of the other two existing.
- **Weaknesses.** Taller panel once one entry expands to Level 3/4 — needs internal scroll, which the docked-side-panel decision already anticipated.

### Option B — Horizontal card row

```
┌ Projects Layer ──────────────────────────┐
│ [ Safety ] [ Neonatal ] [ Phishing ]      │
│  Platform    Simulator     Detector       │
└────────────────────────────────────────────┘
```
- **Strengths.** All three visible at equal size simultaneously without scrolling.
- **Weaknesses.** A docked side panel (already decided) is narrow by nature — three cards side by side would be cramped or force tiny type, working against the panel width Step 1 already committed to. Reintroduces exactly the horizontal-scroll-on-mobile problem `EXPERIENCE_ARCHITECTURE.md` already ruled out for the whole scene.

### Option C — Accordion (single expanded entry at a time, others collapse to a title bar)

```
┌ Projects Layer ─────────────┐
│ ▾ Industrial Safety Platform │
│   [ full Level 2–4 content ] │
│ ▸ Neonatal Simulator         │
│ ▸ Spam/Phishing Detector     │
└───────────────────────────────┘
```
- **Strengths.** Keeps panel height bounded even at Level 4 depth — the two unopened entries stay as thin title bars, not full-height placeholders.
- **Weaknesses.** A visitor can only hold one project's depth open at a time, which slightly limits comparing two projects side by side — a minor loss, not a real one, since nothing in the Recruiter Journey requires simultaneous comparison.

**Recommendation: C.** Fits the narrow docked-panel width from Step 1 without the cramping Option B introduces, and keeps panel height predictable at every depth level, which Option A doesn't once a project reaches Level 4. **Version 1.**

---

## Desk Focus, sketched with Option C

```
Workspace (dimmed, still visible behind panel) ──▶ ┌ Desk Focus ─────────────┐
                                                    │ > boot-line reveal...    │
                                                    │                          │
                                                    │ ▾ Industrial Safety Plat.│
                                                    │   Problem: ...           │
                                                    │   [ Blueprint ▸ ]        │
                                                    │ ▸ Neonatal Simulator     │
                                                    │ ▸ Spam/Phishing Detector │
                                                    │                          │
                                                    │ [Resume]                │
                                                    └──────────────────────────┘
```
**What this validates.** Panel width stays fixed regardless of which entry is expanded — density is controlled, not sprawling. Resume stays visually subordinate (bottom, small) despite being Critical-tier content, confirming the persistent-affordance decision from Information Architecture holds even at sketch resolution — Critical doesn't have to mean visually loud.

---

## New Decision: Leadership Cluster Fan-Out Arrangement

### Option A — Grid

```
[cert][cert][cert]
[cert][cert][cert]
```
- **Weaknesses.** A rigid grid implies equal importance and equal count across clusters, which isn't true (Model UN has far more items than Case Comps) — the grid would need padding/empty cells for smaller clusters, reading as gaps rather than intentional restraint.

### Option B — Arc/fan (matches the "Moments of Delight" animation description)

```
      [cert]
   [cert]  [cert]
[cert]        [cert]
```
- **Strengths.** Naturally accommodates different cluster sizes without empty placeholder slots — a small cluster is just a smaller fan, not a grid with gaps.
- **Weaknesses.** Harder to keyboard-navigate in a predictable order (arc position doesn't map cleanly to tab order) unless the underlying DOM order is explicitly linear regardless of visual arc position.

### Option C — Stacked deck (only the top card visible, others peek from behind)

```
[cert]
 [cert]
  [cert]
```
- **Weaknesses.** Hides most of the cluster's content until actively paged through — works against `VISUAL_PRIORITY_MAP.md`'s intent for the cluster headline to be legible without extra interaction, and adds a new interaction pattern (paging through a deck) nothing else in the room uses, violating Consistency Over Novelty.

**Recommendation: B, with the keyboard caveat resolved explicitly** — visual arc position for mouse/touch, but underlying DOM/tab order stays strictly linear (cluster headline → cert 1 → cert 2 → ...) regardless of where each card lands visually. This is a real implementation constraint worth stating now, before Phase 4, rather than discovering it after the fan-out is built. **Version 1.**

---

## Remaining States, Lower-Fidelity (matching their lower Interaction Heatmap priority)

```
Bookshelf Focus          Clock Focus            Coffee Focus           Window Focus
┌ Research Layer ┐       ┌ Timeline ┐            ┌ Coffee Layer ┐      ┌ Vision Layer ┐
│ Advisor: ...    │       │ 2024 ─○  │            │ [mug, steam] │      │ (brighter bg) │
│ Domain: ...      │       │ 2025 ─○  │            │ "currently   │      │ What's next:  │
│ [Journal ▸]      │       │ 2026 ─○  │            │  exploring.."│      │ ...           │
└──────────────────┘       └──────────┘            └──────────────┘      │ [Contact][Git]│
                                                                          └───────────────┘
```

**What this set validates.** Content density scales down visibly alongside each state's Depth Index score and Heatmap frequency — the Clock and Coffee sketches are genuinely sparser than the Desk and Leadership ones, not just described as lower-priority in prose elsewhere. The Window sketch is the only one where the action row (Contact/GitHub) sits inside the panel itself rather than being purely a persistent overlay — confirming the dual role established in `INFORMATION_ARCHITECTURE.md`: the persistent Contact affordance handles the fast path, and this in-panel version is its narrative reiteration for a visitor who arrived here.

---

## What Phase 3 Confirms, End to End

Every number and ranking produced across the four earlier Phase 3 documents holds up once actually sketched at low fidelity — nothing needed to be walked back to make an ASCII box diagram work. That's the actual test this deliverable was for, more than the sketches themselves: if the Blueprint, Composition Study, and Visual Priority Map had disagreed with each other once rendered, that disagreement would have surfaced here, before any real visual design work began.
