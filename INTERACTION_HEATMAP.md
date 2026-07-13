# Interaction Heatmap — The Studio

**Status:** Phase 2, Step 2. Estimates only — there's no live traffic yet, so every number below is a reasoned projection grounded in `ZONE_SUCCESS_MATRIX.md`'s qualitative engagement ranges and the persona weighting in `PORTFOLIO_STRATEGY.md`, not measured data. Once V1 ships, `PORTFOLIO_STRATEGY.md`'s Section 12 success metrics should replace these estimates with real numbers, and this document should be revisited rather than trusted indefinitely.

Removal rule applied literally, as instructed: any state scoring low on both Recruiter Importance and Narrative Importance is flagged. One state trips that rule; I'm not recommending removing it, and I explain why below rather than silently overriding your instruction.

---

## Ratings

| State | Expected frequency | Expected dwell | Recruiter importance | Engineering importance | Narrative importance |
|---|---|---|---|---|---|
| Desk Focus → Projects Layer | **~95–100%** of sessions — the hub, near-unavoidable | **Highest** of any state — 20 sec to several minutes | **Critical** | **Critical** | **High** |
| Bookshelf Focus → Research Layer | **~40–60%**, persona-dependent | Low–Medium | **Medium** (High for Professor/Research Scientist specifically) | Medium | **High** — structurally required for the central metaphor |
| Clock Focus → Timeline Layer | **~20–30%** — already flagged as lower-engagement in Zone Success Matrix | Low | **Low–Medium** | Low | **Medium** |
| Leadership Focus → Leadership Layer | **~70–90%** — the site's designed differentiator | **Highest range** of any state, 1–4 min | **High** | Low (not engineering evidence, doesn't need to be) | **High** — the pivot point of the metaphor |
| Coffee Focus → Coffee Layer | **~15–25%** — lowest expected open rate by design (`INTERACTION_SPECIFICATION.md`) | Low | **Low** (explicitly, by design) | None | **Low–Medium** |
| Window Focus → Vision Layer | **~50–70%** of sessions reach it (capped below 100% by the 3-branch gate) | Medium, 1–2 min | **High** — precedes the primary conversion | Low | **Highest** — the deliberate closing beat |

---

## The Removal Check

**Coffee Focus scores Low on Recruiter Importance and Low–Medium on Narrative Importance — mechanically, this trips your removal rule.** I'm flagging that plainly rather than rounding it up to avoid the conclusion.

**I'm not recommending removal, and here's the actual reasoning, not a reflex defense of a prior decision:** this heatmap's two axes — Recruiter Importance and Narrative Importance — are both proxies for *hiring-decision value*. That's the right lens for five of the six states, because five of the six exist to move a hiring decision. Coffee Corner was never scoped that way. It was added in `EXPERIENCE_ARCHITECTURE.md` specifically to serve the Collaborator/Peer persona from `PORTFOLIO_STRATEGY.md` Section 3 — a persona this heatmap's two axes don't measure at all, because that persona isn't evaluating a hiring decision. Applying a hiring-decision-shaped ruler to the one state explicitly built for a non-hiring audience will always read it as low-value, regardless of how well it serves the audience it's actually for.

That's a real limitation of this heatmap as a tool, not a loophole. So the honest resolution is: **keep Coffee Corner, but log its low mechanical score as evidence for a different decision** — if V1 scope needs to shrink for schedule reasons, this is the single most defensible state to cut, precisely because its removal wouldn't weaken any hiring-relevant evidence. That's a materially different justification than "the heatmap says cut it," and it's the one I'd actually stand behind under real time pressure.

**Second-most cuttable, for the record:** Clock Focus. It doesn't trip the literal removal rule (Narrative Importance is Medium, not Low), but it has the second-lowest frequency and its content — the full career arc — is already reconstructable from dates already present in the Projects, Research, and Leadership layers individually. If a second cut were needed beyond Coffee Corner, this is where I'd look next, and I'd say so before being asked.

---

## What This Confirms

The Desk and Leadership Wall — the two states carrying the most narrative weight — are also projected to have the highest frequency and dwell time. That's not a coincidence to celebrate; it's a sanity check the architecture should pass, and it does: the states doing the most work are the ones visitors are actually projected to spend the most time in. If the highest-narrative-importance state had come out as the lowest-frequency one, that would have been a real signal something in the Attention Flow or Experience Architecture needed to change before Version 1, not after.
