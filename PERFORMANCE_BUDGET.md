# Performance Budget — The Studio

**Status:** Living document, tracked from Milestone 5 onward per your instruction. Every number below is labeled with the Engineering Confidence Scale (Very High / High / Medium / Low / Speculative) — nothing here is presented as more precise than what was actually measured.

---

## Milestone 5 baseline

| Metric | Value | How measured | Confidence |
|---|---|---|---|
| Total static build output | ~689 KB | `du -sh .next/static/chunks` after a production build | **Medium** — this is total build artifacts (React + Next runtime + app code combined), not an isolated "first-load JS" figure; Turbopack's current build output didn't print the per-route breakdown Next.js has historically shown, so I'm reporting the coarser number I could actually measure rather than a more precise one I couldn't |
| Largest image asset | 6,011 bytes (`floors-and-walls.png`) | `ls -la` on `public/assets/` | **Very High** — direct file size |
| Door sprite | 280 bytes | `ls -la` | **Very High** |
| Resume PDF | 98,607 bytes | `ls -la`, cross-checked against the `Content-Length` header on a live fetch (both agree) | **Very High** — loaded only on click, not part of any bundle or preload |
| Camera transition time | 200 / 500 / 700 ms (Fast / Standard / Slow bands) | Read directly from `src/lib/motion.ts` — these are declared constants, not inferred | **Very High** — this is the source of truth, not a measurement of it |
| Layer open / close time | 500 ms open, 200 ms close | Read directly from `LayerPanel.tsx`'s use of `DURATION.standard` / `DURATION.fast` | **Very High** |
| Interaction latency (click → visible response) | Not separately measured this milestone | — | **Unknown** — no profiling tooling available in this session; the Web Vitals hook (`PerfMonitor`) reports page-load metrics (TTFB, etc.), not per-interaction latency |
| Render counts / unnecessary re-renders | Not profiled | — | **Unknown** — would need React DevTools Profiler, not available in this environment |
| Memory growth | Not measured | — | **Unknown** |

## What this milestone did *not* need to optimize

Per "avoid premature optimization, but never ignore measurable regressions": nothing above crossed a threshold worth acting on. The full static bundle is well under any reasonable budget for a portfolio site; the pixel-art assets are already tiny (confirmed, not assumed, back in `ASSET_REGISTRY.md`); the resume is fetched on demand only, verified via `Content-Length` matching the source file exactly.

## Known gaps, honestly

Interaction latency, render counts, and memory growth are all **Unknown**, not **Low** — there's a real difference, and collapsing "not measured" into "probably fine" would violate Evidence Before Summary. These should be measured with real profiling tools (React DevTools Profiler, Chrome Performance panel) once there's enough real interaction surface (Milestone 6+) to make profiling meaningful — profiling a single hotspot and a five-button test harness wouldn't produce numbers worth trusting yet.
