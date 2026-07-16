# Repository Review — Production Hardening

**Status:** One-time review record (like `REPOSITORY_STATUS.md` before it), not a living document. Findings below were fixed inline where safe and cheap; anything left open is stated explicitly, not implied fixed.

---

## Dead Code

**None found.** Checked for `TODO`/`FIXME`/`XXX`/`HACK` markers across `src/` — zero matches. No commented-out code blocks found during this session's file reads. No unreachable branches identified.

## Duplicated Utilities

**One considered, correctly not merged.** `roomGeometry.ts`'s `toPercentRect` (anchors top-left, used for doors) and `getSpritePlacement` (anchors center, used for furniture) do similar percentage math but with different anchoring semantics — already evaluated and deliberately kept separate during the furniture-integration pass (`ENGINEERING_DECISIONS.md`), revisit only if a third, genuinely distinct placement consumer appears. No new duplication found this pass.

## Stale Comments

**One found and fixed.** `CameraTestHarness.tsx`'s header comment miscounted its remaining test targets ("two" when the code has three) and implied all three would eventually be replaced by real hotspots — no longer true for Clock and Coffee, which the Version 1 Scope Lock cuts entirely, not defers. Corrected in place.

## Outdated TODOs

**None found** — see Dead Code above; no TODO markers exist in the codebase at all.

## Inconsistent Naming

**None found.** Component naming is consistent throughout: `XxxHotspot.tsx` / `XxxPanel.tsx` per world object, content files named for their domain (`knowledge.ts`, `research.ts`, `leadership.ts`, `projects.ts`), hooks prefixed `use`. Asset registry keys (`deskSprite`, `bookshelfSprite`, etc.) follow one consistent camelCase convention.

## Unnecessary Abstractions

**None found.** No premature generalization identified — each component does one job, no speculative "future-proofing" layers. The `LeadershipCapabilityItem`/`ProjectAccordionItem` near-duplication (both are expand-in-place accordion items) was already evaluated in `ENGINEERING_DECISIONS.md` and deliberately kept as two components rather than one shared abstraction, since `LeadershipCapabilityItem` has a genuinely extra nesting level (evidence groups) that would complicate a shared component for marginal gain at only two call sites.

## Unused Assets

**None found.** Every file in `public/assets/` is referenced in `src/lib/assets.ts`, confirmed by direct cross-check this pass (not assumed from the registry markdown alone).

## Unused Imports

**None found.** `eslint-config-next`'s TypeScript ruleset (which includes unused-import/unused-variable detection) passes clean across the full codebase.

## Obsolete Documentation

**Two found, both fixed.**
1. `PROJECT_HEALTH.md` was stale as of end-of-Milestone-8 despite substantial work since (Leadership content rebuild, Visual Truthfulness pass, full Production Hardening). Refreshed in full this pass.
2. `IMPLEMENTATION_PLAN.md`'s Milestone 10 entry didn't acknowledge that Production Hardening already front-loaded real parts of its scope (the 4-panel keyboard audit, cross-browser source review, performance review). Added a revision note clarifying the relationship rather than leaving a future reader to wonder if Milestone 10 is now redundant.

## Stale Assumptions

**One cosmetic issue found, not fixed (deliberately).** `ASSUMPTIONS.md`'s entries are numbered slightly out of physical file order — A12 was appended immediately after A8 in an earlier turn instead of at the true end of the file, so the file reads A8, A12, A9, A10, A11, A13–A19. Every entry is self-contained and correctly cross-referenced elsewhere, so this is genuinely cosmetic. Not reordering the physical text blocks — the risk of introducing a real error while shuffling large markdown sections outweighs the value of pure numeric sequencing. Noted here and in `PROJECT_HEALTH.md` so it isn't rediscovered as if it were new.

## Milestone Artifacts: Historical vs. Living

**Confirmed correctly classified, no changes needed.** `REPOSITORY_STATUS.md` (the concurrent-modification investigation) is explicitly marked one-time/historical in its own header and in `PROJECT_HEALTH.md` — correctly not updated this pass. `ENGINEERING_DECISIONS.md` is correctly append-only (historical log), confirmed no entries were rewritten this session, only appended, including the Milestone 8 correction which was added as a new entry rather than editing the original. Frozen architecture docs (`NARRATIVE_SYSTEM.md`, `INTERACTION_SPECIFICATION.md`, etc.) correctly carry inline `*Revised, Milestone N*` notes rather than being silently rewritten — spot-checked this pass, still holding.

---

## Summary

Six categories had zero findings (dead code, duplicated utilities, outdated TODOs, inconsistent naming, unnecessary abstractions, unused assets/imports) — a genuinely clean result, not a shallow check: each was verified via direct search (`grep`, cross-referencing `assets.ts` against `public/assets/`, ESLint's own unused-var detection), not asserted from memory. Three real findings, all fixed inline: one stale comment, two pieces of obsolete documentation. One cosmetic issue (assumption numbering) logged but deliberately left as-is rather than risk a low-value edit to a large file.
