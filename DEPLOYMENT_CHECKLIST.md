# Deployment Checklist — The Studio

**Status:** Preparation only. Nothing in this document authorizes or performs an actual deployment. Every item below is classified Verified / Measured / Assumed / Unknown, with Impact, Estimated Effort, Priority, and Confidence — not rounded up to look more finished than it is.

---

## Environment Variables

- **Status.** Verified.
- **Finding.** One variable, `NEXT_PUBLIC_SITE_URL` — introduced this pass, drives `metadataBase` (OG/Twitter image resolution), the canonical URL, and the sitemap's absolute URL. Falls back to `http://localhost:3000` if unset. No other environment variables exist anywhere in the codebase (confirmed via `find . -iname ".env*"` — none present; no backend, no API keys, no secrets).
- **Impact.** High if forgotten — social-share previews and the sitemap would silently point at `localhost` in production.
- **Effort.** Trivial (one env var on the hosting platform).
- **Priority.** P0 — must be set before deploy.
- **Confidence.** Verified.

## Production Build Warnings

- **Status.** Verified.
- **Finding.** `npm run build` (Turbopack) completes with zero warnings — confirmed on this pass and every prior milestone's verification.
- **Impact.** N/A — clean.
- **Effort.** N/A.
- **Priority.** N/A.
- **Confidence.** Verified.

## Asset Paths

- **Status.** Verified.
- **Finding.** Every image asset is referenced through `src/lib/assets.ts`'s typed registry, not hardcoded path strings — confirmed no ad hoc `/assets/...` strings exist outside that file (`ENGINEERING_DECISIONS.md`, Milestone 2). All paths are root-relative (`/assets/...`), which works correctly regardless of deployment subpath as long as the app is served from the domain root (standard for both Vercel and a plain Node host).
- **Impact.** N/A — clean.
- **Effort.** N/A.
- **Priority.** N/A.
- **Confidence.** Verified.

## Metadata

- **Status.** Verified (this pass).
- **Finding.** Added this pass: `metadataBase`, Open Graph (title/description/url/siteName/type), Twitter card (summary), canonical URL. All confirmed rendering correctly in the compiled HTML `<head>` via direct `curl` inspection, not just code review.
- **Impact.** N/A — done.
- **Effort.** N/A.
- **Priority.** N/A.
- **Confidence.** Verified.

## Open Graph / Twitter Image

- **Status.** Missing, honestly logged rather than fabricated.
- **Finding.** No OG/Twitter share image exists. Metadata is configured to support one (`openGraph`/`twitter` blocks are ready to accept an `images` field), but no real image was generated — consistent with this project's own Asset Truthfulness principle, a placeholder or AI-generated "portfolio preview card" wasn't fabricated here without your input.
- **Impact.** Medium — link shares (Slack, X, LinkedIn) will show title/description text only, no preview image, until this exists.
- **Effort.** Small once a real screenshot or designed card exists — one image file plus a two-line metadata addition.
- **Priority.** P1 — genuinely improves the first impression of a shared link, not blocking.
- **Confidence.** Verified as missing (not assumed).

## Favicon

- **Status.** Verified.
- **Finding.** `src/app/favicon.ico` exists, 25,931 bytes — a real file, not a zero-byte placeholder, correctly located per Next.js App Router convention (auto-served at `/favicon.ico`, confirmed no separate `public/favicon.ico` is needed or present).
- **Impact.** N/A — clean.
- **Effort.** N/A.
- **Priority.** N/A.
- **Confidence.** Verified.

## robots.txt

- **Status.** Verified (this pass).
- **Finding.** Added `src/app/robots.ts` (Next.js metadata route) — allows all crawlers, points at the sitemap. Confirmed generating correctly at `/robots.txt` via direct `curl` against a production build.
- **Impact.** N/A — done.
- **Effort.** N/A.
- **Priority.** N/A.
- **Confidence.** Verified.

## Sitemap

- **Status.** Verified (this pass).
- **Finding.** Added `src/app/sitemap.ts` — one real URL (`/`), since this is genuinely a single-route app (Layer state is a `?panel=` query param, not separate crawlable pages, so listing "pages" for each panel would misrepresent the site's structure to a crawler). Confirmed generating correctly at `/sitemap.xml`.
- **Impact.** N/A — done, and honestly scoped rather than padded with fake routes.
- **Effort.** N/A.
- **Priority.** N/A.
- **Confidence.** Verified.

## Canonical URLs

- **Status.** Verified (this pass) — see Metadata above.

## 404 Handling

- **Status.** Assumed adequate, not customized.
- **Finding.** No `src/app/not-found.tsx` exists — Next.js's default (generic, unbranded) 404 page is what a visitor would see. Deliberately not built this pass: a custom 404 matching the pixel-art aesthetic is a real design decision (what should it look like, does it get its own establishing-shot treatment), not a config toggle, and building it wasn't in the scope of "prepare, don't implement new features."
- **Impact.** Low-Medium — functionally correct (a real 404 status is returned), just visually generic and inconsistent with the rest of the site's crafted aesthetic.
- **Effort.** Medium — a real design decision, not a quick fix.
- **Priority.** P2 — worth doing before public launch for polish, not blocking a technical deploy.
- **Confidence.** Verified (default behavior confirmed present and functional; the gap is aesthetic, not functional).

## Error Boundaries

- **Status.** Assumed adequate, not customized.
- **Finding.** No `src/app/error.tsx` exists. Next.js's default error boundary applies — in production, this shows a generic "Something went wrong" message without leaking error details (this default behavior is itself the secure one; the risk would be in *replacing* it carelessly, not in leaving it as-is).
- **Impact.** Low — same reasoning as 404: functionally safe, aesthetically generic.
- **Effort.** Small-Medium if customized later.
- **Priority.** P2.
- **Confidence.** Assumed — Next.js's documented default behavior, not independently tested by triggering a real render error this pass.

## Loading States

- **Status.** Not applicable, verified as such.
- **Finding.** No `src/app/loading.tsx` exists, and none is needed — the entire app is one client component tree with no server-side data fetching or route transitions that would produce a meaningful loading gap. `page.tsx` already wraps `Workspace` in a `<Suspense fallback={null}>` specifically because `useLayerStack` uses `useSearchParams` (a real, existing, correct pattern — not a gap).
- **Impact.** N/A.
- **Effort.** N/A.
- **Priority.** N/A.
- **Confidence.** Verified.

## Production Logging

- **Status.** Verified.
- **Finding.** Exactly one `console` call in the entire codebase (`PerfMonitor.tsx`'s Web Vitals debug log), and it's explicitly gated behind `process.env.NODE_ENV === "development"` — confirmed via direct code read, not assumed. Nothing logs in production.
- **Impact.** N/A — clean.
- **Effort.** N/A.
- **Priority.** N/A.
- **Confidence.** Verified.

## Security Headers

- **Status.** Missing, not configured.
- **Finding.** `next.config.ts` has no custom `headers()` function — no `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, or similar set explicitly. Vercel (if used as host) applies some sensible defaults automatically; a plain Node host would not.
- **Impact.** Low-Medium for a static portfolio with no user input, no auth, no sensitive data — but "low-impact for this specific app" isn't the same as "correctly configured," and cheap security headers are cheap regardless of app sensitivity.
- **Effort.** Small — a `headers()` block in `next.config.ts`, well-understood boilerplate.
- **Priority.** P1.
- **Confidence.** Verified as missing; not implemented this pass since choosing specific header values is a real security-posture decision worth a deliberate choice, not a default I should silently pick.

## CSP Compatibility

- **Status.** No CSP configured; compatibility risk documented for whenever one is added.
- **Finding.** This app relies extensively on inline `style={{...}}` props for camera transforms and percentage-based sprite positioning (`getSpritePlacement`, `cameraTransform`) — this is core to how the room renders, not incidental. A future Content-Security-Policy with a strict `style-src 'self'` (no `'unsafe-inline'`) would break the entire room. Any CSP added later must either allow `'unsafe-inline'` for styles specifically, or the positioning system would need a real rewrite (CSS custom properties + a stylesheet, not inline styles) — a genuinely large change, not a config tweak.
- **Impact.** High *if* a strict CSP is added without this in mind — but no CSP currently exists, so no active risk today.
- **Effort.** Documentation now (done); a real architectural change later if a strict CSP is ever required.
- **Priority.** P3 — no CSP is currently planned; this is a landmine flagged for whoever adds one later, not a current gap.
- **Confidence.** Verified (inline style reliance confirmed via source read) for the finding; Assumed for "this would definitely break under a strict CSP" (not tested against an actual CSP header, reasoned from how `style-src` is specified).

## Image Caching

- **Status.** Assumed adequate (platform-default), not independently configured.
- **Finding.** All images use Next.js's `<Image unoptimized>` (necessary for pixel-art — see `ENGINEERING_DECISIONS.md` Milestone 2), which bypasses Next's built-in image optimization/caching pipeline. Static assets under `public/` are served with whatever cache headers the host applies by default (Vercel sets long-lived immutable caching for hashed static assets automatically; a plain Node host's behavior depends on configuration not currently present in this repo).
- **Impact.** Low — total image weight is ~22 KB (`PERFORMANCE_BUDGET.md`), so even an uncached repeat-fetch is trivial.
- **Effort.** Small if a specific host needs explicit cache-control configuration.
- **Priority.** P3.
- **Confidence.** Assumed — host-dependent, not tested against a specific deployment target since none is chosen yet.

## README Deployment Instructions

- **Status.** Verified (this pass).
- **Finding.** Added a Deployment section to `README.md` covering the one environment variable, confirming no others exist, and noting the build is a standard Next.js output requiring no special host configuration. Also corrected a stale status line that still said "Milestone 5, complete" despite all 8 milestones and this hardening phase being done.
- **Impact.** N/A — done.
- **Effort.** N/A.
- **Priority.** N/A.
- **Confidence.** Verified.

---

## Summary: What's Actually Blocking vs. What's Polish

**P0 (must happen before deploy):** Set `NEXT_PUBLIC_SITE_URL` to the real domain.

**P1 (should happen before public launch, doesn't block a technical deploy):** A real OG/Twitter share image; basic security headers in `next.config.ts`.

**P2 (polish, genuinely optional for launch):** Custom 404 and error pages matching the site's aesthetic.

**P3 (no current action needed):** CSP compatibility is documented for future reference, not acted on, since no CSP exists yet. Image caching is host-dependent and low-impact given the tiny asset weight.

**Not evaluated in this pass:** Actual hosting-platform selection and its specific configuration (Vercel vs. another Node host) — that's a real decision for you to make, not something to default into.
