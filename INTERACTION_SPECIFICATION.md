# Interaction Specification — The Studio

**Status:** Draft for review. Every object below satisfies the Object Story Rules and Narrative Consistency Check in [NARRATIVE_SYSTEM.md](NARRATIVE_SYSTEM.md). The scene has **six world-visible hotspots** (Desk, Bookshelf, Clock, Leadership Frames, Coffee Mug, Window) plus **three sub-interactions** that live inside a parent object's Level 2–3 panel rather than as separate pixel props (Blueprint and Resume within the Desk; Research Journal within the Bookshelf) — this reconciles every object you named in your brief without inflating the physical scene. See Narrative System's "Reconciliation with your object list" for why Computer/Terminal/Blueprint/Whiteboard aren't separate sprites, and Content Hierarchy for how the Timeline is folded into the Clock rather than duplicated.

Every object's animation is unique — no two use the same motion vocabulary, per your explicit instruction to avoid repeating popup behaviour.

---

## The Desk

**Purpose.** The hub. The single object every visitor sees at full clarity from Arrival, and the anchor everything else returns to.
**Asset status.** VERIFIED — wood desk sprite confirmed in `TopDownHouse_FurnitureState1.png` (see `ASSET_REGISTRY.md`).
**Associated skill.** Execution — turning research and leadership into shipped, working systems.
**Primary audience.** Software Engineer Recruiter, ML Recruiter, Hackathon Judge, Startup Founder.
**Secondary audience.** Everyone — this is also where Resume and Contact live, so no persona skips it.
**Interaction trigger.** Click/tap anywhere on the desk surface, or the papers on it.
**Animation.** A short monospace line-by-line reveal (three lines, ~150ms each) inside the modern panel as it opens — not a literal terminal window, just enough rhythm to feel like something is booting, echoing the engineering register without needing a screen sprite.
**Transition.** Zoom-in on the desk (500ms, decelerating ease) → panel slides up from the bottom edge of the viewport, overlapping the tail end of the zoom rather than waiting for it to finish.
**Exit behaviour.** "Return to Desk" affordance or `Esc` snaps the camera back (250ms) and the panel slides back down; state returns to Idle.
**Accessibility.** Panel is a real focusable region with a heading (`<h2>Projects</h2>`) announced on open; focus moves into the panel automatically.
**Keyboard support.** `Enter`/`Space` opens; `Tab` cycles the three project entries inside; `Esc` closes.
**Touch behaviour.** Single tap opens; the three project entries are individually tappable, each ≥44×44px regardless of on-screen pixel-art scale.
**Audio.** None by default; if the opt-in ambient toggle is on, a single soft keyboard-tap sound plays once, not looped.
**Narrative role.** Curiosity → Systems in the central metaphor — this is where "what does he build" gets answered directly.
**Success metric.** % of sessions that open the Desk panel (expected to approach 100% — it's the hub) and % that open at least one project to Level 3.
**Future expansion.** V4's live GitHub integration (Strategy doc roadmap) surfaces here — recent commit activity as a fourth "paper" on the desk, not a new object.

### Sub-interaction: Blueprint (Desk, Level 3)
**Asset status.** N/A — not a pixel-world sprite by design (see Narrative System's reconciliation note). Lives entirely in the modern UI panel as rendered diagram content. Optional dressing (a loose-paper-stack sprite) is VERIFIED available in `TopDownHouse_SmallItems.png` if the pixel scene wants a visual hint that papers are "on the desk," but nothing requires it.
**Purpose.** Prove system-design thinking with an actual artifact, not a claim.
**Trigger.** "See the architecture" link inside a project's Level 2 summary.
**Animation.** The diagram unrolls diagonally across the panel, like a drawing being unrolled on a real desk — distinct from every other object's transition.
**Exit.** Rolls back up on close; returns to the project's Level 2 view, not all the way to Idle (preserves the visitor's place).
**Accessibility/keyboard/touch.** Standard panel content — no interaction beyond scroll/read, so no special handling needed beyond the parent panel's.
**Narrative role.** Research → Systems — the moment an idea becomes a diagram becomes real infrastructure.
**Success metric.** % of project opens that reach Blueprint depth (a strong signal of a technically serious visitor).

### Sub-interaction: Resume
**Asset status.** N/A — a PDF download link, not a pixel asset. A folder-stack sprite is VERIFIED available in `SmallItems.png` as optional visual dressing, unused currently.
**Purpose.** The single most frictionless action in the entire experience — Critical tier, per Content Hierarchy.
**Trigger.** A small, always-visible tab/paper corner at the edge of the Desk panel, visible from Level 1, not buried at Level 4.
**Animation.** No transition ceremony at all — a direct PDF download. This is the one interaction in the whole spec that's deliberately *not* handcrafted, because making a recruiter wait through an animation to get your resume is a Recruiter Time Is Precious violation.
**Accessibility/keyboard/touch.** Standard link semantics (`<a href download>`), fully keyboard- and screen-reader-native.
**Narrative role.** None — this is the one object explicitly exempt from the narrative system, and that exemption is itself intentional.
**Success metric.** Resume download count (Strategy doc Section 12).

---

## Bookshelf

**Asset status.** VERIFIED — oak bookshelf sprite confirmed in `TopDownHouse_FurnitureState1.png`. The "single book slides out and opens flat" animation described below is a code-driven transform of the VERIFIED open/closed book sprites in `SmallItems.png`, not a new asset.
**Purpose.** Research and knowledge depth — proof of independent inquiry, not coursework.
**Associated skill.** Research aptitude, independent learning.
**Primary audience.** Professor, Research Scientist.
**Secondary audience.** ML Recruiter (the Kamilya lab work is directly relevant to ML hiring too).
**Interaction trigger.** Click/tap the shelf.
**Animation.** A single book slides partway out and opens flat, its pages becoming the panel's content surface — the shelf itself never fully "opens," only the one book responds, which reads as a considered choice rather than a UI gimmick.
**Transition.** Zoom-in on the shelf (500ms) → the book-opening animation plays in place, panel content fades in as the pages settle.
**Exit behaviour.** Book closes and slides back; camera returns to Idle.
**Accessibility.** Panel heading `<h2>Research</h2>`; content includes advisor name, domain, and current direction as real text, not baked into an image.
**Keyboard support.** `Enter`/`Space` opens; standard panel `Tab`/`Esc` behaviour.
**Touch behaviour.** Single tap.
**Audio.** Opt-in only: a soft page-riffle sound on open, once.
**Narrative role.** Curiosity → Research in the central metaphor.
**Success metric.** % of sessions reaching Level 2 here; average time spent (a genuinely interested Research Scientist persona should linger longer here than the median visitor).
**Future expansion.** V6's publication explorer (Strategy doc roadmap) becomes a second "book" on the same shelf once there's published work — not a new object.

### Sub-interaction: Research Journal (Bookshelf, Level 3)
**Asset status.** N/A — panel content, not a pixel-world sprite.
**Purpose.** Show the research as active and current, not archived.
**Trigger.** "Read the journal" link inside the Bookshelf's Level 2 panel.
**Animation.** Page-turn, distinct from the book-opening animation that got the visitor here — the journal is a different physical object (a notebook, not a bound book) and reads that way.
**Narrative role.** The most granular Research → Systems evidence: specific current questions, not just the advisor/domain summary.
**Success metric.** Depth-reach rate within the Research branch.

---

## Clock

**Asset status.** VERIFIED — the grandfather clock sprite in `TopDownHouse_FurnitureState1.png`, confirmed via direct pixel-level inspection (a second, smaller wall-clock sprite also exists in `SmallItems.png` but is not used — see `ASSET_REGISTRY.md`).
**Purpose.** The only place a timeline lives — deliberately not duplicated as a separate "Timeline" object (see Content Hierarchy for the reasoning: two objects both meaning "time" would be redundant and clutter the six-object scene).
**Associated skill.** Growth, trajectory, consistency over time.
**Primary audience.** Professor, Consulting Recruiter (both care about trajectory, not just a snapshot).
**Secondary audience.** Anyone curious how the pieces fit chronologically.
**Interaction trigger.** Click/tap the clock face.
**Animation.** The hands sweep backward, unlike normal clock motion, before the timeline panel opens — a small, specific visual cue that this object is about looking back through time, not telling the current time.
**Transition.** Zoom to the clock (450ms) → hands sweep (600ms) → panel opens.
**Exit behaviour.** Hands sweep forward again to the present on close, then camera returns to Idle — a small bookend that makes the object feel considered rather than reused.
**Accessibility.** Timeline content is a real ordered list (`<ol>`) in the DOM, not just a visual graphic — a screen-reader user gets the chronology as text.
**Keyboard support.** Standard.
**Touch behaviour.** Single tap.
**Audio.** Opt-in only: a soft tick, twice, timed to the hand-sweep.
**Narrative role.** Spans the whole central metaphor at a glance — this is the one object that shows Curiosity → Research → Systems → Leadership as a single continuous line rather than as separate branches.
**Success metric.** Open rate (a lower open rate than the Desk or Leadership Wall is expected and fine — see Zone Success Matrix's overload risk for this object).
**Future expansion.** New milestones (talks, publications) are new list entries, not new UI.

---

## Leadership Frames

**Asset status.** VERIFIED — filled picture-frame sprites (2 content variants) confirmed in `TopDownHouse_SmallItems.png`.
**Purpose.** External validation — leadership, communication, and structured thinking, evidenced rather than claimed.
**Associated skill.** Leadership, communication, mentoring, structured business thinking.
**Primary audience.** Consulting Recruiter, hiring managers assessing culture/leadership fit.
**Secondary audience.** Grad admissions committees (leadership is a real factor in most programs).
**Interaction trigger.** Click/tap the frame wall.
**Animation.** Gallery expansion — the frames fan out from the wall like a hand of cards being spread, clustered by category (Debate & APD / Model UN / Case Comps / Positions) rather than dumped as one flat grid.
**Transition.** Zoom to the wall (500ms) → fan-out (400ms, staggered ~40ms per frame for a natural cascade rather than all frames moving in lockstep).
**Exit behaviour.** Frames re-stack to the wall in reverse order; camera returns to Idle.
**Accessibility.** Each frame is a real, individually focusable element with alt text describing the certificate (organization, role, date) — not just a decorative image.
**Keyboard support.** `Tab` moves between frames within a cluster; arrow keys move between clusters.
**Touch behaviour.** Tap a cluster to expand it; tap a frame to open its detail (Level 3: the reflection copy — what the round/role actually involved, not just the certificate scan).
**Audio.** None — a gallery of dozens of items is exactly the kind of interaction where repeated sound would become genuinely annoying, so this is the one object with no audio option at all, opt-in or not.
**Narrative role.** Systems → Leadership — the pivot point where the metaphor moves from building things to leading people.
**Success metric.** Cluster-open rate per category (tells us which achievement type recruiters actually care about, feeding future content priority).

### Sub-interaction: Whiteboard (one specific frame, Leadership Wall)
**Asset status.** VERIFIED, corrected — originally specified as a filled certificate frame reused with different content; a closer-matching **blank frame sprite** was found in `TopDownHouse_SmallItems.png` during the asset re-verification pass and is now the specified asset (see `ASSET_REGISTRY.md`).
**Purpose.** Show structured problem-solving directly, not just the placement result.
**Content.** One worked case-competition example, styled as a hand-sketched framework rather than a certificate scan — same physical frame *category* as the certificates (a picture frame), but the blank variant rather than a filled one.
**Narrative role.** The one piece of direct evidence for "can structure ambiguity into a recommendation" (Strategy doc Evidence Matrix).
**Success metric.** Open rate relative to the certificate clusters — if this consistently underperforms, it's a signal the content isn't compelling enough and needs a rewrite, not that the object should be cut (it's the only Consulting-Recruiter-specific evidence in the whole scene).

---

## Coffee Mug (Coffee Corner)

**Asset status.** VERIFIED — mug sprite (4 color variants) confirmed in `TopDownHouse_SmallItems.png`. The steam-rise hover effect described below is **not a sprite** — it's a code-generated CSS effect layered over the verified static mug, logged here for transparency rather than in `MISSING_ASSETS.md`, since nothing needs sourcing to build it.
**Purpose.** The person underneath the work — informal, low-stakes, honest. Also stands in for what your brief called "current focus" (originally proposed as a separate fireplace object) — merged here rather than duplicated, since a fireplace and a coffee mug in the same corner would both be answering "what's Nisir into right now," which the Object Story Rules flag as redundant.
**Associated skill.** None directly — this is the one zone not built to prove a hiring-relevant skill, and that's deliberate (the Collaborator/Peer persona needs somewhere to land that isn't a pitch).
**Primary audience.** Collaborator/Peer.
**Secondary audience.** Anyone who's already been convinced by the other zones and wants to know if he'd be good to work with.
**Interaction trigger.** Click/tap the mug or the counter.
**Animation.** A small steam-rise loop starts on hover (subtle, ambient-only, not a "reveal" cue) and the panel simply fades in on click — the least ceremonious open in the spec, on purpose, matching the zone's low-stakes tone.
**Transition.** Zoom (500ms) → fade (200ms).
**Exit behaviour.** Fade out; camera returns to Idle.
**Accessibility.** Standard panel; nothing unusual.
**Keyboard support.** Standard.
**Touch behaviour.** Single tap.
**Audio.** Opt-in only: a soft coffee-pour sound, once, on open.
**Narrative role.** The Curiosity anchor — the one place the metaphor's starting point is made explicit and personal (content writing, Tribal Design Forum, the "why" behind the range).
**Success metric.** Lowest expected open rate of the six objects, and that's fine — this zone succeeds by being *available*, not by being visited by everyone.
**Future expansion.** Blog posts / talks (V6 roadmap) surface here first, before they'd warrant their own zone.

---

## Window / Observatory

**Asset status.** VERIFIED — window sprites (multiple pane styles and wood-tone finishes) confirmed in `TopDownHouse_DoorsAndWindows.png`.
**Purpose.** Vision — where this compounds next. The deliberate emotional close of the experience.
**Associated skill.** Direction, ambition, self-awareness about what's still ahead.
**Primary audience.** Professor, Research Scientist, Startup Founder — anyone evaluating trajectory, not just track record.
**Secondary audience.** Every persona, as the closing beat.
**Interaction trigger.** Camera tilts up toward the window once available (see Narrative States: requires 3+ prior branches visited); clicking it opens the panel.
**Animation.** Slow brighten + soft tilt-up camera move — the single most deliberate motion in the entire spec, held slightly longer than any other transition (700ms) because this is the one moment allowed to feel like a payoff rather than a utility.
**Transition.** Tilt (700ms, slow decelerating ease) → panel fades in over a lightly cooler-toned background, per Narrative System's Visual Storytelling.
**Exit behaviour.** Tilt back down; camera returns to Idle.
**Accessibility.** Available in the linear screen-reader document regardless of the 3-branch visual gate — the gate is a visual pacing device, not an actual content restriction (Progressive Discovery never blocks content, only paces its visual reveal).
**Keyboard support.** Standard; reachable via `Tab` at any time even before the visual "unlock," consistent with the accessibility note above.
**Touch behaviour.** Single tap.
**Audio.** Opt-in only: a soft breeze, once.
**Narrative role.** Leadership → Vision — the final beat of the central metaphor.
**Success metric.** % of sessions that reach the Window (this is effectively the "completion rate" metric from the Strategy doc) and the click-through rate from here to Contact/GitHub. Note: Contact itself is **not exclusive to this panel** — see Experience Architecture's Navigation Philosophy for the persistent Contact affordance added to satisfy Content Hierarchy's Critical-tier (zero-click) requirement. The Window's version of Contact is the narrative closing beat for visitors who arrive here; the persistent affordance is the fast path for visitors who don't.
