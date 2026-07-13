# Information Architecture — The Studio

**Status:** Phase 2, Step 1 of 5, revised. The first version of this document was written in "screens" — that language is retired below in favor of **Experience States**, per your direction. This still covers information architecture only, not navigation mechanics or flow (Step 2) or layout (Step 3). Stopping here for review before Step 2.

---

## The Experience States Model

The environment is never unmounted, never replaced, and never navigated *away from*. There is exactly one persistent state — the **Workspace** — and everything else is either a **Focus** (where the camera's attention currently rests within that same, still-rendered Workspace) or a **Layer** (contextual information stacked on top of a Focus, at increasing depth, never covering the Workspace entirely — this is what Step 1's already-approved docked-side-panel decision was for).

```
Workspace                              ← always present, never unmounted
  └─ Desk Focus                        ← camera attention, Workspace still visible around it
       └─ Projects Layer               ← contextual layer over the Focus
            └─ Industrial Safety Detail Layer
                 └─ Blueprint Layer
                      └─ Source Layer
```

This is not a cosmetic rename. It changes what a "transition" is: moving from Desk Focus to Bookshelf Focus is a camera move *within one continuous space*, not a navigation event between two places. Nothing loads, nothing unmounts, nothing is ever "gone" — a Layer opened five minutes ago is still sitting there, dismissed but not destroyed, if the visitor's attention drifts back to it. Language throughout this document has been corrected accordingly: no state "replaces" another, states "layer over" or "recede beneath" one another.

**Six Focus states**, one per hotspot confirmed in `ASSET_REGISTRY.md`: Desk Focus, Bookshelf Focus, Clock Focus, Leadership Focus, Coffee Focus, Window Focus.

**Persistent overlays**, tied to no single Focus (per the corrections already patched into `EXPERIENCE_ARCHITECTURE.md`): the return-to-Workspace control, the audio toggle, the Contact affordance, and the Resume affordance — all reachable from any Focus without dismissing it first.

---

## Correction Carried Over From Phase 1.5

Unchanged from the previous revision, still in effect: `CONTENT_HIERARCHY.md` requires Contact at zero clicks from Arrival; the Window's narrative version alone couldn't satisfy that. Fixed with a persistent Contact overlay, already patched into `EXPERIENCE_ARCHITECTURE.md` and `INTERACTION_SPECIFICATION.md`. Restated here because the state-path language below depends on knowing Contact is reachable from *any* Focus, not just Window Focus.

---

## Structural Decisions Requiring Alternatives *(carried over, approved)*

Your last message approved all six — reduced hotspots, Research kept separate from the Desk, docked side-panel over modal/bottom-sheet/inline. No changes to the decisions themselves; only the vocabulary describing them shifts (a "docked side panel" is now understood as a **Layer**, not a screen that opens over the scene — same visual outcome, correct underlying model). Full tradeoff tables are unchanged from the previous revision and not repeated here to avoid duplicating already-approved content.

---

## Experience State Inventory

Same template you specified, plus a **State Path** field showing each state's position in the persistent layering — this replaces the old implicit "this is a screen" framing.

### Workspace *(includes what was previously called Arrival)*
- **State path.** `Workspace` (base state; Arrival is simply the first few seconds of this state, before any Focus is engaged).
- **Purpose.** Establish the whole space at a glance; deliver the Level-1 identity read before any interaction.
- **Primary audience.** Every visitor.
- **Estimated attention time.** 0–3 seconds before the first Focus is engaged — though the Workspace itself is never truly exited, so this is really "time before the first Focus," not a duration the state itself has.
- **Critical information.** Name, one-line identity, the establishing shot.
- **Interaction.** None required — passive; six Focus states available.
- **Release path.** N/A — this state persists underneath everything else for the entire session.
- **Desired takeaway.** "This is someone's actual working space."

### Desk Focus → Projects Layer
- **State path.** `Workspace → Desk Focus → Projects Layer`
- **Purpose.** Answer "can this person build software?" as directly as possible.
- **Primary audience.** Software Engineer Recruiter, ML Recruiter, Hackathon Judge, Startup Founder.
- **Secondary audience.** Everyone — this Focus is the hub.
- **Estimated attention time.** 20 seconds (headline skim) to several minutes if a Detail Layer is opened.
- **Critical information.** Three project headlines; the Resume overlay is reachable from here but isn't part of this Layer itself.
- **Interaction.** Engaging Desk Focus surfaces this Layer automatically; clicking a project headline stacks a Detail Layer on top.
- **Release path.** Dismissing the Layer returns to Desk Focus (Workspace still fully visible throughout — nothing was ever hidden).
- **Desired takeaway.** "Builds real systems."

### [Project] Detail Layer → Blueprint Layer → Source Layer *(template, filled three times)*
- **State path.** `Workspace → Desk Focus → Projects Layer → [Project] Detail Layer → Blueprint Layer → Source Layer`
- **Purpose.** Prove system-design ability with a real artifact.
- **Primary audience.** Software Engineer Recruiter, ML Recruiter.
- **Secondary audience.** Startup Founder (Spam/Phishing Detector), Data Analytics Recruiter (Safety Platform).
- **Estimated attention time.** Detail Layer ~20 sec; Blueprint Layer up to 2 min; Source Layer is a departure point, not a dwell.
- **Critical information.** Problem, architecture, one key tradeoff, one lesson learned, staged across the three stacked layers.
- **Interaction.** Each layer stacks on the previous rather than replacing it; dismissing the top layer reveals the one beneath, still in place.
- **Release path.** Layer-by-layer unstack back to Projects Layer, or a direct "return to Workspace" from any depth.
- **Desired takeaway (Industrial Safety Platform).** "Can design a scalable, explainable system."
- **Desired takeaway (Neonatal Simulator).** "Ships working, stateful, full-stack software."
- **Desired takeaway (Spam/Phishing Detector).** "Can own a project solo, start to finish."

### Bookshelf Focus → Research Layer → Research Journal Layer
- **State path.** `Workspace → Bookshelf Focus → Research Layer → Research Journal Layer`
- **Purpose.** Answer "can this person do real, independent research?"
- **Primary audience.** Professor, Research Scientist.
- **Secondary audience.** ML Recruiter.
- **Estimated attention time.** Research Layer ~30 sec; Research Journal Layer up to 2 min.
- **Critical information.** Advisor, domain, current direction (Research Layer); specific current questions (Research Journal Layer).
- **Interaction.** Book-slide-out reveals Research Layer; "read the journal" stacks the Journal Layer on top.
- **Release path.** Unstack to Research Layer, then to Workspace.
- **Desired takeaway.** "Already operates like an early-stage researcher."

### Clock Focus → Timeline Layer
- **State path.** `Workspace → Clock Focus → Timeline Layer`
- **Purpose.** Show the Curiosity→Research→Systems→Leadership arc as one continuous line.
- **Primary audience.** Professor, Consulting Recruiter.
- **Estimated attention time.** ~30–45 seconds.
- **Critical information.** A real ordered list, not a graphic-only visualization.
- **Interaction.** Hands-sweep-backward reveals the Layer.
- **Release path.** Hands sweep forward; Layer recedes, Clock Focus and Workspace remain exactly as they were.
- **Desired takeaway.** "Consistent trajectory, not a scattered resume."

### Leadership Focus → Leadership Layer → Cluster Detail Layer → Whiteboard Layer
- **State path.** `Workspace → Leadership Focus → Leadership Layer → Cluster Detail Layer → Whiteboard Layer` *(Whiteboard nests under the Case Comps cluster specifically)*
- **Purpose.** Answer "can this person lead, communicate, and structure ambiguity?"
- **Primary audience.** Consulting Recruiter, leadership-focused hiring managers, grad admissions.
- **Estimated attention time.** 1–4 minutes, widest range of any state.
- **Critical information.** Four clusters with quantified headlines before any individual cert is opened.
- **Interaction.** Fan-out gallery, clustered; each cluster stacks its own Detail Layer.
- **Release path.** Re-stack to Leadership Layer, then Workspace.
- **Desired takeaway.** "The same person who builds explainable-AI systems also runs a 400-person conference."

### Coffee Focus → Coffee Layer
- **State path.** `Workspace → Coffee Focus → Coffee Layer`
- **Purpose.** Give the Collaborator/Peer persona somewhere low-stakes to land.
- **Estimated attention time.** ~30 seconds.
- **Critical information.** None Critical-tier by design.
- **Interaction.** Steam-rise hover, fade-in Layer.
- **Release path.** Fade out to Workspace.
- **Desired takeaway.** "Seems like a genuinely good person to work with."

### Window Focus → Vision Layer
- **State path.** `Workspace → Window Focus → Vision Layer`
- **Purpose.** Close the experience on direction, not retrospective.
- **Primary audience.** Professor, Research Scientist, Startup Founder; everyone, as the closing beat.
- **Estimated attention time.** 1–2 minutes, typically last in a session.
- **Critical information.** What's next; the narrative version of Contact/GitHub.
- **Interaction.** Tilt-up camera move (available once 3+ other Focus states have been engaged).
- **Release path.** Tilt back down to Workspace.
- **Desired takeaway.** "This is someone I want to interview."

### Persistent Overlays *(Resume, Contact, Return-to-Workspace, Audio Toggle)*
- **State path.** Not nested under any Focus — reachable from the Workspace state regardless of which Focus is active.
- **Purpose.** Guarantee critical actions never require finding the "right" Focus first.
- **Estimated attention time.** Instant (Resume, Contact, Return) or a single toggle (Audio).
- **Release path.** N/A — these don't stack Layers, they perform an action or toggle a persistent setting.

---

## Interaction Depth Index

Every interactive state scored 1–5. Your rule — no decorative object may outscore a flagship project — is enforced structurally below: purely decorative elements (the plant, ambient idle-sway, the wood stove as dressing) aren't interactive at all, so they score **0**, not merely "low." That's a deliberate distinction, not an oversight: something with no click target can't compete with a 5 by definition.

| Interactive state | Depth | Reasoning |
|---|---|---|
| Resume overlay | **1** | Single action, no exploration — a quick, complete interaction |
| Contact overlay | **1** | Same — one action, no layers to descend through |
| Clock Focus → Timeline Layer | **2** | One layer deep, brief contextual information, low expected engagement (confirmed in Zone Success Matrix) |
| Coffee Focus → Coffee Layer | **2** | Deliberately brief by design (Content Hierarchy: Optional/Decorative-adjacent) |
| Bookshelf Focus → Research Layer | **3** | Standard exploration — a real overview, not a single fact |
| Leadership Focus → Leadership Layer (cluster overview) | **3** | Standard exploration — four clusters, quantified headlines |
| Window Focus → Vision Layer | **3** | Standard exploration; emotionally significant but not technically dense |
| Desk Focus → Projects Layer (headline list, before any project opened) | **3** | Standard exploration — three headlines, one decision point |
| Bookshelf → Research Journal Layer | **4** | Deep exploration — specific, current, technical |
| Leadership → Cluster Detail + Whiteboard Layer | **4** | Deep exploration — the single richest non-project content on the site |
| **Industrial Safety Platform** (Detail → Blueprint → Source) | **5** | Flagship — explainable-AI architecture, deserves several minutes |
| **Neonatal Simulator** (Detail → Blueprint → Source) | **5** | Flagship — full-stack FSM architecture, deserves several minutes |
| **Spam/Phishing Detector** (Detail → Blueprint → Source) | **5** | Flagship — solo-shipped, deserves several minutes |

**Validation of your rule:** only the three flagship projects reach Depth 5; everything else caps at 4. Nothing decorative has a depth score at all. The hierarchy already matched importance before this index was built — running the numbers confirms it rather than requiring a redesign.

---

## Cognitive Load Budget

Classified by three drivers: reading volume, decision density (how many live choices a visitor is holding at once), and technical density of the content itself — not by depth score, since a Layer can be deep but easy (a long list) or shallow but demanding (one dense paragraph).

| State | Load | Why |
|---|---|---|
| Workspace (Arrival) | **Low** | Passive, no decisions |
| Desk Focus → Projects Layer | **Medium** | First real evaluative choice point — three competing headlines, technical vocabulary begins |
| Project Detail Layer (per flagship) | **Medium** | Architecture-level thinking begins, but still summary-form |
| Blueprint Layer | **High** | The densest reasoning on the site — tradeoffs, lessons learned, real technical judgment required to follow |
| Source Layer | **Low** | Just outbound links — no new reading burden, functions as a release after the Blueprint Layer's High load |
| Bookshelf Focus → Research Layer | **Low** | Short, single fact cluster |
| Research Journal Layer | **Medium** | More specific and technical, but still short-form |
| Clock Focus → Timeline Layer | **Low** | A list; passive scan, minimal decision load |
| Leadership Focus → Leadership Layer (overview) | **Medium** | Four clusters to choose among — moderate decision load |
| Leadership → Cluster Detail (expanded certificates) | **High** | Choice-overload risk — already flagged independently in `ZONE_SUCCESS_MATRIX.md` as the site's highest-risk state before this budget was built |
| Whiteboard Layer | **Medium** | One worked example, but structured and scannable |
| Coffee Focus → Coffee Layer | **Low** | Deliberately light, no decisions |
| Window Focus → Vision Layer | **Low–Medium** | Short, reflective, not technically dense — treated as Low for pacing purposes since it's designed as a release, not a demand |

### Pacing Analysis

Walking the Storyboard's default sequence:

```
Low → Medium → Medium → High → Low → [return] → Low → Medium → Medium → High → Medium → Low → Low
Arrival  Desk   Detail  Blueprint Source          Research  Journal Leadership Cluster Whiteboard Coffee Window
                                                   Overview                    (High)
```

Both High-load moments (Blueprint Layer, Leadership Cluster Detail) are immediately followed by something lighter — Source Layer (Low) and Whiteboard Layer (Medium) respectively — which satisfies your pacing requirement along the *default* path.

**The honest risk, not smoothed over:** Navigation Philosophy (Experience Architecture) deliberately has no forced order — a fast, thorough visitor could jump from the Blueprint Layer straight into the Leadership Cluster Detail, stacking two High-load states back to back with nothing between them, since nothing prevents that specific sequence. The Storyboard's pacing is the *intended* rhythm, not a guarantee.

**What actually guarantees the pacing, structurally rather than by hoping visitors follow the intended order:** the Experience States model itself is the mitigation. Because returning to the Workspace is never a full navigation event — just a camera move back to the persistent base state — every single transition between any two Focus states passes through a brief, unavoidable Low-load beat (the return-to-Workspace motion) whether the visitor follows the Storyboard's order or not. This wasn't originally designed as a pacing device; it's a structural consequence of retiring "screens" in favor of one persistent environment. Worth stating plainly: **the persistent-Workspace model isn't only about immersion — it's also the mechanism that keeps cognitive load paced no matter what order a visitor explores in.**
