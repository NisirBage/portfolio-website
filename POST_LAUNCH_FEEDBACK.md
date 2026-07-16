# Post-Launch Feedback — The Studio

**Status:** New deliverable, Phase H. A template and a set of ground rules for how this project should absorb real feedback after v1.0 ships — not feedback itself (none exists yet, since the site isn't deployed as of this document being written).

---

## The brief's own closing instruction, restated as a rule

"Once deployed, stop feature development. The next phase should be driven by real user feedback... not by adding speculative enhancements." This document exists to make that rule operable rather than aspirational — a place to actually log what real visitors say, so future work traces back to a real quote or observation, not a guess about what they might think.

## What counts as "real feedback" here

Per this project's own Evidence Before Summary discipline, applied to user research the same way it's been applied to every asset and content claim so far: a feedback entry below should be something a real person actually said or did, not an inference about what "users in general" would probably want. "My professor said the Research section undersold the ongoing biosensor work" is real feedback. "Users probably want a dark mode toggle" is not — that's a feature idea, and belongs in a different conversation (or nowhere, until it's backed by something someone actually said).

## Template for each entry

```
### [Date] — [Who: recruiter / professor / peer / collaborator, kept anonymous unless they say otherwise]

**What they said or did:**


**Which part of the site this is about:**


**My read on it (optional, clearly marked as interpretation, not fact):**


**Action taken (or: not acted on, and why):**

```

## Ground rules for acting on feedback

- **One data point isn't a pattern.** If one person says the intro sequence felt slow, that's worth noting, not immediately re-tuning `INTRO.titleHold`/`INTRO.roomTransition` in `lib/motion.ts`. If three independent people say it, that's a pattern worth acting on.
- **Distinguish "didn't understand" from "didn't like."** A recruiter who couldn't find the Resume hotspot is a real usability finding (the Leather Portfolio isn't as recognizable a target as the brief assumed, maybe). A recruiter who found it but thought the pixel-art style was unprofessional for their specific industry is a real piece of information too, but a different kind — a fit question, not a bug.
- **Log it even if you don't act on it.** An entry with "not acted on, and why" is more valuable a year from now than a piece of feedback that was heard, dismissed, and forgotten with no record of the reasoning.
- **This document is not a queue.** It's a log. When something here does turn into real work, that work gets its own phase/task, tracked the way every other phase in this project has been — this file stays the historical record of what prompted it, consistent with `ENGINEERING_DECISIONS.md`'s own "append, don't rewrite" convention.

## Entries

*(None yet — this document ships with v1.0, before any real visitor has seen the deployed site. The first entry goes here once real feedback exists.)*
