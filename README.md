# The Studio

Interactive portfolio for Nisir Sanang Bage. Next.js (App Router), TypeScript (strict), Tailwind CSS.

Website link: https://nisirsdesktop.vercel.app

## Status

Architecture frozen. All 8 planned implementation milestones complete (Repository → Workspace → Camera → Interaction Engine → Desk → Projects → Knowledge/Research → Leadership), plus a post-Milestone-8 content evolution pass and an ongoing Production Hardening phase (cross-browser review, performance review, deployment prep, repository review) per [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) and [`PROJECT_HEALTH.md`](PROJECT_HEALTH.md). Deployed at https://nisirsdesktop.vercel.app; [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md) tracks remaining hardening items.

## Source of Truth

The design is not re-decided during implementation except for the six reasons listed in the architecture freeze (implementation blocker, accessibility issue, performance issue, usability issue found in testing, an Asset Truthfulness correction, or a contradiction between implementation and architecture). Start with:

- [`PORTFOLIO_STRATEGY.md`](PORTFOLIO_STRATEGY.md) — why this exists, who it's for
- [`NARRATIVE_SYSTEM.md`](NARRATIVE_SYSTEM.md) — the creative constitution
- [`EXPERIENCE_ARCHITECTURE.md`](EXPERIENCE_ARCHITECTURE.md) · [`INFORMATION_ARCHITECTURE.md`](INFORMATION_ARCHITECTURE.md) · [`SPATIAL_BLUEPRINT.md`](SPATIAL_BLUEPRINT.md) — how the experience is structured
- [`INTERACTION_SPECIFICATION.md`](INTERACTION_SPECIFICATION.md) · [`MICROINTERACTIONS.md`](MICROINTERACTIONS.md) — per-object behavior
- [`ASSET_REGISTRY.md`](ASSET_REGISTRY.md) · [`MISSING_ASSETS.md`](MISSING_ASSETS.md) — what's real, what isn't (Asset Truthfulness Protocol — never assume an asset exists)
- [`VERSION1_SCOPE.md`](VERSION1_SCOPE.md) — what's actually in scope for this version
- [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) — the milestone-by-milestone build order and Definition of Done

Implementation-side, updated every milestone:

- [`ENGINEERING_DECISIONS.md`](ENGINEERING_DECISIONS.md) — how and why, per milestone; also where real bugs get root-caused on the record rather than silently patched
- [`ASSUMPTIONS.md`](ASSUMPTIONS.md) — everything implementation depends on that hasn't been fully verified yet, with confidence/risk/validation plan for each
- [`PERFORMANCE_BUDGET.md`](PERFORMANCE_BUDGET.md) — measured numbers only, labeled with how confident each one actually is
- [`ACCESSIBILITY_CHECKLIST.md`](ACCESSIBILITY_CHECKLIST.md) — Verified / Partial / Gap per area, not rounded up

## Development

```bash
npm install
npm run dev        # start the dev server
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run build        # production build
```

## Deployment

Not yet deployed. See [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md) for the full pre-launch audit. In brief:

- **Environment variables.** One optional variable, `NEXT_PUBLIC_SITE_URL` — sets `metadataBase` for Open Graph/Twitter card resolution and the sitemap's absolute URL. Falls back to `http://localhost:3000` if unset; **must** be set to the real production domain before deploy, or social-share previews and the sitemap will point at localhost.
- **No other environment variables exist.** No backend, no API keys, no secrets — this is a fully static, client-rendered site.
- **Build output.** Standard Next.js production build (`npm run build`); no custom `output` mode configured, so any Next.js-compatible host (Vercel, or a Node server running `npm start`) works without extra configuration.
