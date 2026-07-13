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
