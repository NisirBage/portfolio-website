# Missing Assets — The Studio

**Status:** Living document under the Asset Truthfulness Protocol. Entries are appended, never removed — if you later provide an asset that resolves one, it gets marked resolved in place with a note, not deleted, so the history of the decision stays visible.

None of the entries below block V1. Each has a working substitute already in place (see [ASSET_REGISTRY.md](ASSET_REGISTRY.md)).

---

### Asset Name: Computer / Monitor Sprite

- **Purpose.** A literal on-desk screen object, as named in your original object list.
- **Narrative Value.** Would let "Engineering" be visually distinct from "the Desk as hub" at a glance, without relying on panel content alone to carry the distinction.
- **Priority.** Low.
- **Current Substitute.** The Desk itself is the click trigger; the "computer" feeling is delivered via the monospace boot-line reveal inside the modern panel (Interaction Specification's Desk entry), not a screen sprite.
- **Tradeoffs.** The substitute works and costs nothing — but a visitor glancing at the establishing shot for under a second sees "a desk," not "an engineer's desk," which a monitor sprite would signal instantly, before any click.
- **Suggested Style.** A small CRT-free flat monitor or open laptop, matching the warm-wood palette of the rest of the Top-Down Retro Interior pack — most existing asset packs of this style include one; this specific pack doesn't.
- **Animation Requirements.** None required beyond a static sprite; a screen-glow hover state would be a nice-to-have, not essential.
- **Potential Sources.** A matching "office/study" expansion pack from the same asset author, if one exists, would be the safest stylistic match.
- **User Action Required.** **No** — not needed for V1. Worth revisiting only if V1 user-testing shows visitors don't parse the Desk as "engineering" fast enough on their own.

---

### Asset Name: Drafting Table (your own example from the brief)

- **Purpose.** A dedicated surface for the Blueprint sub-interaction, separate from the Desk's general "papers and resume" surface.
- **Narrative Value.** Would let Architecture (the Blueprint reveal) read as its own distinct activity rather than one more thing that happens at the Desk.
- **Priority.** Low.
- **Current Substitute.** The Desk, doing double duty as both the hub and the Blueprint trigger.
- **Tradeoffs.** The Desk works fine functionally, but a second, visually distinct surface would reduce how much narrative weight one object has to carry — right now the Desk alone represents Execution, Architecture, and the Resume/Contact anchor simultaneously.
- **Suggested Style.** Angled drafting table, papers/ruler visible, same warm-wood palette.
- **Recommendation.** User may source one later; not essential for V1, and I'd rather ship with one well-used Desk than add a second surface before there's evidence visitors are confused by the Desk carrying multiple jobs.
- **User Action Required.** No, unless you specifically want the visual distinction sooner than V2.

---

### Asset Name: Ambient Sound Pack

- **Purpose.** The opt-in audio palette committed to in `NARRATIVE_SYSTEM.md` (soft ambience, keyboard typing, page turns, coffee pour, breeze).
- **Narrative Value.** Adds texture for visitors who opt in; supports the "lived-in workspace" feeling for anyone who turns it on.
- **Priority.** **Medium** — this is the one real gap that affects a feature already specified, not a nice-to-have I'm speculating about.
- **Current Substitute.** None. **I want to be explicit here, per the Honesty Policy: neither asset pack contains any audio files at all** — I verified this against the original file listing for both packs and found zero `.mp3`/`.wav`/`.ogg` files. The audio toggle described in the Narrative and Interaction specs currently has nothing to play.
- **Tradeoffs.** Shipping V1 with the audio toggle removed entirely is honest and simple, but loses a piece of atmosphere you asked for. Shipping the toggle with no sound behind it would be worse — a control that does nothing is a bug, not a feature.
- **Suggested Style.** Short (1–3 second), soft, mono or low-stereo-width clips — the register you specified (soft ambience, no arcade sounds) is the right brief for whoever sources these.
- **Animation Requirements.** N/A (audio, not visual).
- **Potential Sources.** Royalty-free sound-effect libraries (e.g., Freesound.org's CC0-licensed clips) would need to be checked individually for license compatibility with a portfolio site; alternatively, sourcing 5–6 short custom clips is a small, well-scoped ask.
- **User Action Required.** **Yes, if you want audio in V1.** Otherwise my recommendation is to build the toggle's plumbing now (so it's not an afterthought) but ship it disabled/hidden until real audio exists, rather than delay V1 waiting on sourced sound. Flag which you'd prefer before Phase 3 locks the build scope.

---

### Asset Name: Technical-drawing texture (Blueprint panel background)

- **Purpose.** A blueprint-style grid/graph-paper texture behind the architecture diagrams in the Desk's Level-3 Blueprint reveal.
- **Narrative Value.** Small polish — reinforces "this is a real technical drawing" beyond just the unroll animation.
- **Priority.** Low, Experimental.
- **Current Substitute.** A plain modern-UI panel background (matches the rest of the site's glassmorphic style).
- **Tradeoffs.** The current plain panel is fully functional and stylistically consistent; a blueprint-grid texture would be a nice-to-have flourish, not a gap that affects comprehension.
- **Suggested Style.** Faint blue/graphite grid lines, low contrast, doesn't compete with the diagram content on top of it.
- **Animation Requirements.** None.
- **Potential Sources.** Easily generated in code (a repeating CSS grid pattern) — this one likely doesn't need a sourced asset at all, flagged here mainly for completeness under the "log every gap" rule rather than because it needs your action.
- **User Action Required.** No.

---

### Asset Name: Desk calculator, USB drive, SSD/external drive, small desk plant

- **Purpose.** Four items named directly in the Phase C, Part 5 storytelling brief as candidates for reinforcing the "AI engineer, researcher, builder" read of the desk.
- **Narrative Value.** A calculator and a USB/SSD would add a second, more contemporary "hands-on hardware" signal alongside the existing monitor/keyboard/blueprint cluster; a small plant would soften the desk with a human, lived-in touch the current all-technical item set doesn't have.
- **Priority.** Low — not blocking, see Current Substitute.
- **Current Substitute.** None of the four exist in either owned pack or the previously-generated desk-item sheet — checked directly against `ASSET_REGISTRY.md`'s Generated Desk Set entry and the pack's own small-items catalog, not assumed absent. Per Asset Truthfulness, none was fabricated to fill the gap.
- **Tradeoffs.** The desk already reads as a coherent "engineer who researches and builds" scene without these four (monitor/keyboard/mouse = builder, notebook/blueprint = researcher/engineer, lamp/mug = human/late-night realism) — confirmed via a fresh PIL composite render this pass, not assumed from memory. More importantly, the desk is already documented as tightly packed at its 8 items' minimum-legible sizes (`DeskDressing.tsx`'s own comment); a same-pass repositioning experiment (moving the mouse/notebook/blueprint to make room) was rendered and rejected — it introduced a new notebook/lamp overlap and made the blueprint appear to hang off the desk's front edge, a worse result than the arrangement it replaced. Adding four more items to a surface this constrained, without new source sprites at a genuinely smaller minimum-legible size than the existing set, would risk the same failure mode at a larger scale. "Do not overcrowd" was taken as a real constraint here, not a soft suggestion.
- **Suggested Style.** Same flat, hard-outline pixel style as the existing Generated Desk Set (not the softer gradient-shadow style the original generated sheet used, which `ENGINEERING_DECISIONS.md` already flagged as a style mismatch) — and, critically, generated at a genuinely small native footprint (≤8px on the long edge) so they can fit the desk's remaining margins without displacing an already-placed item.
- **Animation Requirements.** None.
- **Potential Sources.** A follow-up generation pass against the same style reference used for the original 8-item set, explicitly briefed on the small-footprint constraint this time.
- **User Action Required.** Only if you want these added — the desk's current composition was re-verified this pass and doesn't require them to read correctly.

---

### Asset Name: Pendulum-only sprite (Clock) and cloud-only sprite (Window)

- **Purpose.** Phase D asked for a gentle pendulum swing on the Clock and drifting clouds on the Window, with an explicit fallback for both: "otherwise keep static."
- **Narrative Value.** Would let the Timeline and Future hotspots carry a small piece of the room's ambient motion (matching the Gramophone's bounce, the Coffee Corner's steam, the sprite-breathing every other hotspot already has) rather than being the two static objects in an otherwise gently-alive room.
- **Priority.** Low — the brief's own fallback already covers this, and both hotspots are fully functional and legible without it.
- **Current Substitute.** Both stay static. `clock.png` and `window.png` are each one flattened crop from the source sheet, with the pendulum and clouds baked into the same image as the case/frame — there's no separate layer to animate independently, and animating the whole sprite would swing the case or shift the frame along with it, the same mechanically-wrong move already ruled out for the Gramophone's horn and the Clock's own case in this same pass.
- **Tradeoffs.** None significant — static is the brief's own sanctioned outcome here, not a compromise being quietly accepted.
- **Suggested Style.** A pendulum bob cropped alone (transparent background, pivoting from the same point the case's pendulum slot sits at) for the Clock; a cloud silhouette cropped alone (transparent background, sized to drift slowly left-to-right within the window's upper panes without leaving them) for the Window. Same palette/shading as the existing crops, cropped from the same source sheet if a version with isolated layers is ever generated.
- **Animation Requirements.** Pendulum: a slow rotational swing, few degrees each direction, matching the Idle motion band (2-4s) already used elsewhere. Clouds: a very slow horizontal drift, looping.
- **Potential Sources.** A follow-up generation pass against the same style reference, explicitly briefed to produce the pendulum and a cloud as separate transparent-background layers rather than baked into the full scene.
- **User Action Required.** Only if you want the motion — both hotspots work and read correctly as static objects today.

---

### Asset Name: Branded favicon/PWA icon set, and an Open Graph share image

- **Purpose.** A real, site-specific icon for the browser tab, "add to home screen," and PWA install prompts; a real preview image for link shares (Slack, X, LinkedIn, iMessage).
- **Narrative Value.** First impressions before a visitor ever reaches the room — a shared link's preview card and a browser tab's own icon are both part of "does this look like a finished, professional portfolio" before the pixel-art establishing shot ever loads.
- **Priority.** P1 (OG image, already logged in `DEPLOYMENT_CHECKLIST.md` since an earlier pass) / P2 (icon set — newly found this pass).
- **Current Substitute.** `src/app/favicon.ico` exists and is genuinely served, but a direct pixel-content check this pass (not just a file-existence/byte-size check, which is what an earlier deployment audit had done) found it's Next.js's own stock default icon — a black circle with a white triangle — not site-specific art. `manifest.ts` (Phase H) references this same file honestly rather than fabricate a replacement; the OG/Twitter `images` fields remain unset, same as previously logged.
- **Tradeoffs.** Shipping without either is fully functional — the tab still has an icon, shared links still show title/description text — just generic rather than branded. Not a blocker for a technical deploy.
- **Suggested Style.** A simple, small-footprint mark that reads clearly at 16×16 (browser tab) through 512×512 (PWA install) — the room's own pixel sprites are largely too detailed for the smallest sizes; the Gramophone is the closest thing this project has to a recognizable "mark" if one is wanted, but a purpose-cropped icon (not a room sprite repurposed) would likely read better at 16px. For the OG image: a real screenshot of the room's establishing shot, or a designed card pairing that screenshot with the name/title text, sized to the standard 1200×630 share-image convention.
- **Animation Requirements.** None — both are static.
- **Potential Sources.** A dedicated small icon-set generation pass for the favicon/PWA icons; a real browser screenshot (this project already has the tooling to take one) or a short design pass for the OG card.
- **User Action Required.** Only if branded versions are wanted before public launch — both are cosmetic, not functional, gaps.
