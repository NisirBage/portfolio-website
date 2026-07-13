# The Studio

Interactive portfolio for Nisir Sanang Bage. Next.js (App Router), TypeScript (strict), Tailwind CSS.

## Status

Architecture frozen. Implementation in progress per [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md), one milestone at a time. Current milestone: **1 — Repository**.

## Source of Truth

The design is not re-decided during implementation except for the six reasons listed in the architecture freeze (implementation blocker, accessibility issue, performance issue, usability issue found in testing, an Asset Truthfulness correction, or a contradiction between implementation and architecture). Start with:

- [`PORTFOLIO_STRATEGY.md`](PORTFOLIO_STRATEGY.md) — why this exists, who it's for
- [`NARRATIVE_SYSTEM.md`](NARRATIVE_SYSTEM.md) — the creative constitution
- [`EXPERIENCE_ARCHITECTURE.md`](EXPERIENCE_ARCHITECTURE.md) · [`INFORMATION_ARCHITECTURE.md`](INFORMATION_ARCHITECTURE.md) · [`SPATIAL_BLUEPRINT.md`](SPATIAL_BLUEPRINT.md) — how the experience is structured
- [`INTERACTION_SPECIFICATION.md`](INTERACTION_SPECIFICATION.md) · [`MICROINTERACTIONS.md`](MICROINTERACTIONS.md) — per-object behavior
- [`ASSET_REGISTRY.md`](ASSET_REGISTRY.md) · [`MISSING_ASSETS.md`](MISSING_ASSETS.md) — what's real, what isn't (Asset Truthfulness Protocol — never assume an asset exists)
- [`VERSION1_SCOPE.md`](VERSION1_SCOPE.md) — what's actually in scope for this version
- [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) — the milestone-by-milestone build order and Definition of Done

## Development

```bash
npm install
npm run dev        # start the dev server
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run build        # production build
```
