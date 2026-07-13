# Attention Flow — The Studio

**Status:** Phase 2, Step 2. This replaces a conventional sitemap/flow-diagram with an attention map, per your correction: navigation here means *Attention → Focus → Understanding → Confidence*, not click-to-page movement. The camera never transports the visitor between places — it directs where their attention lands within the one Workspace state defined in `INFORMATION_ARCHITECTURE.md`.

Every transition below is described twice: mechanically (what captures/releases attention, what primes the next moment, how load and curiosity shift — reusing the Depth Index and Cognitive Load Budget already built) and cinematographically (what a director would call the shot, and why — never how it's implemented in code, which stays in `EXPERIENCE_ARCHITECTURE.md`'s Camera Philosophy).

---

## The Vocabulary of Shots

Six shot types, each with one emotional job. Nothing in this document uses a shot type outside this list — the constraint is deliberate, per Version 1 Discipline: a small vocabulary used consistently reads as intentional; a large one reads as a demo reel.

| Shot | Emotional purpose |
|---|---|
| **Establishing** | "You are somewhere real." Orientation, no urgency. |
| **Push-in** | "Your attention is committing to this." A decision has been made, by the visitor, to look closer. |
| **Focus shift** | "Notice this specific thing without leaving where you are." Small, doesn't reset the visitor's sense of place. |
| **Reveal** | "Understanding just increased." The moment content actually becomes visible/legible. |
| **Pause** | "Let this land before moving on." A deliberate beat of stillness — no camera motion, no new content — placed after anything cognitively demanding. |
| **Return** | "You're safe, nothing was lost, home is unchanged." The Workspace is exactly as it was. |

---

## Primary Attention Path

Following your example order (Desk → Projects → Research → Leadership → Future), which is the *intended* rhythm — not a forced one, per Navigation Philosophy. Real sessions branch; this is the spine.

| Transition | Captures attention | Releases attention | Primes next | Load Δ | Curiosity Δ | Shot |
|---|---|---|---|---|---|---|
| Workspace (Arrival) | The whole establishing shot at once — nothing singled out yet | N/A — this is the starting state | The Desk, simply by being the most legible object in frame | — (Low) | Rising, from zero | **Establishing** |
| → Desk Focus | The desk surface, now the sole subject | The rest of the room, gently | The three project headlines about to surface | Low → Medium | Rising sharply — "there's something specific to find here" | **Push-in** |
| → Projects Layer | Three headlines, one visible choice | The ambiguity of "what does he build" | Whichever headline reads as most relevant to *this* visitor | Medium | Peaks — a real decision is being made | **Reveal** |
| → Project Detail Layer | The chosen project's problem statement | The other two headlines, without erasing them (still one unstack away) | The architecture question a technical reader already wants answered | Medium | Sustained — curiosity converting into engagement | **Focus shift** |
| → Blueprint Layer | The unrolled diagram | The summary-level framing | Nothing yet — this state asks for full attention, not a next thing | Medium → High | Narrows to depth, not breadth — this is where a visitor stops browsing and starts evaluating | **Reveal** |
| *(held)* | — | — | The next state, deliberately not rushed toward | High, sustained | — | **Pause** |
| → Source Layer | Outbound links, nothing to read | The density of the Blueprint Layer | The relief of "I'm done here, and I got what I came for" | High → Low | Settles — satisfied, not still hungry | **Focus shift** |
| → return to Workspace | The whole room again | The one project's depth | Whichever of the remaining destinations catches a glancing look first | Low | Resets, ready to redirect | **Return** |
| → Bookshelf Focus → Research Layer | The shelf, then the one book that responds | The Desk, without disorientation (nothing moved) | The advisor/domain fact as a checkable claim | Low → Medium | A different register of curiosity — "oh, there's more than engineering here" | **Push-in → Reveal** |
| → Research Journal Layer | The open notebook page | The overview-level summary | Nothing forced — this is opt-in depth | Medium | Sustained for the persona it's built for, otherwise flat | **Focus shift** |
| → return to Workspace | The whole room | The research thread | The Leadership Wall, likely already glimpsed in peripheral vision | Low | Resets | **Return** |
| → Leadership Focus → Leadership Layer | The fanned-out cluster wall | Everything else | The quantified headline ("24 conferences, 6 judged") before any individual frame | Low → Medium | Sharp rise — this is the site's designed surprise | **Reveal** |
| → Cluster Detail / Whiteboard Layer | One cluster's contents, or the worked case-comp example | The wall-level overview | The realization that this and the Desk describe the same person | Medium → High | Peaks a second time, differently — respect rather than curiosity | **Push-in** |
| *(held)* | — | — | — | High, sustained | — | **Pause** |
| → return to Workspace | The whole room | The density of the cluster | The Window, now visibly brighter (3+ branches visited) | High → Low | Resets, but changed — the visitor now knows what they're looking for next | **Return** |
| → Window Focus → Vision Layer | The brightening window, then what's next | Everything that came before, as a completed picture rather than a discarded one | Contact / GitHub | Low | The one moment curiosity converts fully into intent to act | **Reveal**, held longer than any other |

---

## Secondary Branches

Lower-traffic states (confirmed in `INTERACTION_HEATMAP.md`) get a lighter treatment here — same rigor, less real estate, because they don't carry the same narrative load.

**Clock Focus → Timeline Layer.** Captures attention via the hands-sweep-backward motion itself (the mechanism is the hook, more than the destination). Releases the "is there a throughline" question implicitly raised by having just seen two very different kinds of evidence (Engineering, then Research or Leadership). Primes nothing specific — it's a synthesis stop, not a lead-in. Load: Low. Curiosity: flat-to-mild — this state exists to answer a question a visitor might have, not to generate a new one. Shot: **Focus shift**, the smallest camera move of any state, matching its supporting (not central) role.

**Coffee Focus → Coffee Layer.** Captures attention via the steam-rise idle loop — the one hover cue that exists purely to invite, not to inform. Releases nothing, because it follows no obligation; it's reachable at any point without needing to have "earned" it. Primes only itself — a visitor who opens this isn't being set up for anything else. Load: Low throughout. Curiosity: shifts register entirely, from "what can this person do" to "what is this person like" — the only state in the whole map where that's the question being answered. Shot: **Push-in**, gentle, the least urgent camera move in the system.

---

## What This Confirms

The Pause shot only appears twice — after the Blueprint Layer and after the Leadership Cluster/Whiteboard Layer — which are exactly the two High-load states identified in `INFORMATION_ARCHITECTURE.md`'s Cognitive Load Budget. That wasn't planned as a matching exercise; running the attention map independently landed on the same two moments, which is a real (if small) validation that the load analysis and the attention analysis are describing the same underlying structure from two directions, not two unrelated documents that happen to coexist.
