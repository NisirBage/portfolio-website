# Design Debt — The Studio

**Status:** Formal design review, adversarial. Eight reviewer lenses, each attacking the design independently rather than defending prior decisions. One entry below (#3) is a real, previously-uncaught contradiction between two existing documents, found by cross-checking rather than re-reading each document in isolation — that's the kind of finding this review exists to produce, and its presence is the evidence this pass was genuine rather than performed.

Format: Issue / Impact / Likelihood / Priority / Suggested Fix / Version / Owner. "Owner" is Nisir for every entry — there's no team to delegate to, which is itself Finding #7.

---

### 1. No visitor has ever seen this design

- **Issue.** Eighteen documents of design reasoning exist, validated only against each other, never against a real person unfamiliar with the project. Every claim about what a recruiter will notice, understand, or feel is inference, not observation.
- **Impact.** High — the entire architecture could be internally consistent and still fail on contact with a real visitor in ways no amount of document cross-checking can surface.
- **Likelihood.** Certain — this isn't a risk that might materialize, it's a guaranteed gap that exists right now.
- **Priority.** Critical.
- **Suggested fix.** The first testable build (Implementation Plan's early milestones) should go in front of 3–5 real people — ideally including at least one actual recruiter or hiring manager — before Version 1 content is fully built out, not after.
- **Version.** Must happen before V1 ships, not a V2 item.
- **Owner.** Nisir.

### 2. The core discovery mechanism is unproven and has no fallback

- **Issue.** "No onboarding, no tutorial, the room teaches itself" is a stated principle, but the entire discovery mechanism resting on it is a hover-glow and a one-line label. Pixel-art top-down interiors are not a common web interaction pattern — a first-time visitor may not even register that furniture is clickable, and if they don't, they see what looks like a static illustration and leave. Every other document in this project assumes discovery succeeds; none tests what happens when it doesn't.
- **Impact.** High — if this fails, nothing downstream matters, regardless of how well-reasoned the content hierarchy or attention flow is.
- **Likelihood.** Medium — plausible for a meaningful fraction of first-time visitors, especially anyone quickly tabbing through many candidates.
- **Priority.** Critical.
- **Suggested fix.** A single, minimal affordance beyond hover — e.g., the Desk (already the Primary object) carries a very subtle idle animation from first paint, not just on hover, so *something* moves without requiring the visitor to already know to interact. This is a small addition, not a reversal of the no-onboarding principle — it doesn't explain anything, it just proves the scene is alive.
- **Version.** Must Have — this is a discovery-mechanism fix, not a polish item.
- **Owner.** Nisir.

### 3. Visual Priority Map and Composition Study disagree with each other

- **Issue.** `VISUAL_PRIORITY_MAP.md` places the Bookshelf and Leadership Frames in the same tier (both Secondary). `COMPOSITION_STUDY.md`'s Workspace entry states an explicit, different ranking: "Desk > Leadership > Bookshelf > Coffee" — four distinct weight levels, not two tied at Secondary. These are two documents both claiming to describe the same thing and they don't agree.
- **Impact.** Medium — not a fatal flaw, but exactly the kind of quiet contradiction that becomes a real bug once someone implements one document faithfully and it conflicts with the other.
- **Likelihood.** Certain — it already exists in the current documentation, not a future risk.
- **Priority.** High.
- **Suggested fix.** Composition Study's finer-grained ordering is the more useful one for implementation (it's actionable at the pixel level); Visual Priority Map's tier should be corrected to either add a fourth tier or explicitly note that "Secondary" spans a range, with Leadership at the top of that range and Bookshelf beneath it. A one-line patch to `VISUAL_PRIORITY_MAP.md`, not a redesign.
- **Version.** Fix before Phase 4 visual design begins — it directly affects the visual weight implementation is supposed to build.
- **Owner.** Nisir.

### 4. The cinematic camera model may directly conflict with the 90-second recruiter priority

- **Issue.** Every zoom/pan/reveal costs 400–700ms (`MICROINTERACTIONS.md`). A fast, decisive recruiter moving Desk → three projects → Leadership Wall in sequence accumulates multiple seconds of pure transition time contributing zero information — in a budget explicitly defined elsewhere as 90 seconds total. This tension has never been named, let alone resolved, across any of the eighteen documents.
- **Impact.** High — this is a direct conflict between two of the project's own stated top priorities (cinematic camera philosophy vs. Recruiter Time Is Precious), not a minor friction.
- **Likelihood.** High — this will affect every single fast-pass visitor, which is the largest expected audience segment.
- **Priority.** Critical.
- **Suggested fix.** Either (a) shorten Standard-band timing specifically for the primary path's first few transitions (front-load speed, spend the cinematic budget later once a visitor has shown they're staying), or (b) allow rapid re-clicking to cancel/skip an in-progress transition rather than queuing it, so a fast visitor's fourth click doesn't wait for the third click's animation to finish. Needs a decision before Milestone 3 (Camera System) is built, not after.
- **Version.** Must Have — this affects the highest-value persona.
- **Owner.** Nisir.

### 5. Mobile has been asserted, never designed

- **Issue.** Every spatial, compositional, and attention-flow document in Phase 3 was built for the desktop establishing shot. Mobile gets one sentence in `EXPERIENCE_ARCHITECTURE.md` ("collapses to a vertical scroll-snap sequence") and has never received its own Spatial Blueprint, Composition Study, or low-fidelity pass.
- **Impact.** Medium-High, depending on actual mobile traffic share, which is currently unknown.
- **Likelihood.** Certain that the gap exists; unknown how much it matters until real traffic data exists.
- **Priority.** High.
- **Suggested fix.** Either commit real design time to a mobile-specific pass before Version 1, or explicitly accept a much plainer mobile experience (a simple content list, no spatial metaphor at all) as a deliberate, named scope decision rather than a silently-discovered gap during implementation. See `VERSION1_SCOPE.md`'s Feature Removal Review for the recommendation.
- **Version.** Must Have (the decision), Should Have (a fully-designed mobile experience, vs. the plain-list fallback).
- **Owner.** Nisir.

### 6. The screen-reader parallel path may be structurally unequal, not just differently-presented

- **Issue.** The accessibility strategy commits to "the pixel scene is decorative; a linear document carries every piece of content." That's the right instinct, but it also means a screen-reader or keyboard-primary user never experiences any part of the Attention Flow, Composition Study, Camera Philosophy, or Moments of Delight work — four full documents' worth of design exist for sighted mouse/touch users only. The parallel path may be content-equal but experience-unequal, and that gap has never been examined honestly, only asserted as sufficient.
- **Impact.** Medium-High — a real equity concern, and also a real maintenance concern (two experiences to keep in sync forever, see Implementation Risks).
- **Likelihood.** Certain.
- **Priority.** High.
- **Suggested fix.** Name this tradeoff explicitly rather than imply parity that doesn't exist: the linear path guarantees equal *information*, not equal *experience*, and that's an acceptable, defensible design decision — but it should be a stated decision, not a gap discovered by an accessibility audit after launch.
- **Version.** Must Have (the honest documentation of the tradeoff), ongoing (any future narrowing of the experience gap).
- **Owner.** Nisir.

### 7. Eighteen planning documents, zero lines of product code

- **Issue.** This is a solo project competing for time against coursework, active research, MUN leadership responsibilities, and everything else on the resume this site is meant to showcase. The volume of planning relative to implementation is disproportionate for a project of this scope and owner, and there's a real risk the planning phase itself becomes a form of avoidance — polishing documents feels like progress and carries no risk of the thing not working, unlike shipping code.
- **Impact.** High if it continues — the best-designed portfolio in the world has zero value unfinished.
- **Likelihood.** Medium, and rising the longer this phase continues without a milestone shipping.
- **Priority.** Critical.
- **Suggested fix.** This review, and the Version 1 Scope Lock and Implementation Plan produced alongside it, should be the last purely-planning deliverable before code starts. No new planning documents should be created without a specific, named gap they close — this document itself should be treated as the closing argument for the planning phase, not an invitation to write a nineteenth document.
- **Version.** Immediate.
- **Owner.** Nisir.

### 8. The Leadership Wall carries the entire Consulting Recruiter persona on one thin object

- **Issue.** The Whiteboard sub-interaction is the *only* piece of content built specifically for the Consulting Recruiter persona across the whole site — one object, three layers deep, and its actual content (a worked case-competition framework) hasn't been written yet. `ZONE_SUCCESS_MATRIX.md` already flagged this risk once; it hasn't been mitigated since, only restated.
- **Impact.** Medium-High for that specific persona, though it's one of eight, not the whole audience.
- **Likelihood.** High that the content, once written, needs at least one revision to land well — first-draft persuasive writing rarely works on the first attempt.
- **Priority.** Medium.
- **Suggested fix.** Draft the actual Whiteboard content early (it's a writing task, not an engineering one — it can happen in parallel with early milestones) so there's time to revise it before launch, rather than writing it under deadline pressure in the final week.
- **Version.** Must Have (the content itself), content-quality iteration can continue post-launch.
- **Owner.** Nisir.

### 9. The interactive-portfolio format may be a net-negative signal for the Grad Admissions / Research Scientist persona specifically

- **Issue.** Academic reviewers culturally weight depth-of-thought over production polish, and evaluate under even tighter time constraints than industry recruiters (hundreds of applications against transcripts and statements of purpose, with a portfolio site as a minor signal at best). An elaborately produced pixel-art workspace risks reading, to this specific audience, as "prioritized packaging over substance" — the opposite of the intended signal — even though the actual research content inside it (a named advisor, a specific domain, real current questions) is genuinely strong on its own merits.
- **Impact.** Medium — affects one of eight personas, and only if that persona engages with the site at all rather than going straight to the resume/CV.
- **Likelihood.** Medium — a plausible but unverified reaction; no data exists either way.
- **Priority.** Medium.
- **Suggested fix.** No design change recommended — the Resume affordance already provides a plain, format-neutral escape hatch for this exact persona, and that was a deliberate Critical-tier decision, not an accident. Worth stating this risk exists and is accepted, rather than assuming the interactive format is unambiguously good for every named persona.
- **Version.** No action required for V1; worth revisiting only if real feedback from this persona surfaces.
- **Owner.** Nisir.

### 10. The audio system has zero source assets and no content-sourcing owner or timeline

- **Issue.** `MISSING_ASSETS.md` already logged this as a gap; this review escalates it. A persistent UI toggle for a feature with literally nothing behind it isn't a deferred feature, it's a broken control sitting in the permanent chrome — and it adds real testing/accessibility surface (the toggle itself needs states, focus handling, and a disabled/enabled story) for a feature that currently produces zero user value.
- **Impact.** Low-Medium on its own; the issue is the cost-to-benefit ratio, not severity.
- **Likelihood.** Certain, as currently scoped.
- **Priority.** Medium.
- **Suggested fix.** Cut the audio toggle from Version 1 entirely — not shipped-but-disabled as previously recommended in Missing Assets, actually removed from the UI chrome — and reintroduce it in Version 2 once real audio assets exist. A stronger conclusion than the earlier, softer recommendation, reached under harder scrutiny.
- **Version.** Removed from V1; Version 2 if audio is ever sourced.
- **Owner.** Nisir.
