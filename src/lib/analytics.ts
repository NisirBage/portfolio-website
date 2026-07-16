/**
 * Phase H, Part 14 — analytics preparation, not integration. No
 * provider is hardcoded and no ID is baked in; both are read from
 * environment variables at build time, and the entire module is a
 * no-op unless both are genuinely set. This is the same "disabled
 * without configuration" contract the brief asks for, enforced at the
 * one place a call site would otherwise need to remember to check.
 */

const ENABLED = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";
const ANALYTICS_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID ?? "";

/** True only when a visitor's session would actually send analytics data anywhere. */
export const analyticsActive = ENABLED && ANALYTICS_ID.length > 0;

/**
 * Which provider `ANALYTICS_ID`'s shape suggests, purely for the
 * loader below to pick the right script — not a claim that any of
 * these are actually wired up yet. Google Analytics IDs start `G-`;
 * Plausible and Umami both just take a bare site identifier (a domain
 * for Plausible, a UUID for Umami), which look identical from the ID
 * alone, so `NEXT_PUBLIC_ANALYTICS_PROVIDER` would need to be added
 * alongside the ID to disambiguate those two once either is actually
 * connected — deliberately not solved speculatively here.
 */
export function inferredProvider(): "google-analytics" | "unconfigured" {
  if (!analyticsActive) return "unconfigured";
  return ANALYTICS_ID.startsWith("G-") ? "google-analytics" : "unconfigured";
}

export { ANALYTICS_ID };
