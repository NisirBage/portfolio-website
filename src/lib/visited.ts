/**
 * Phase B, Part 8 — persistent visited-state for the room's hotspots.
 * One `localStorage` key holding a JSON array of visited ids, mirroring
 * `lib/audio.ts`'s single-key pattern rather than inventing a second
 * storage convention for a very similar problem.
 *
 * *Revised, Phase D:* extended with `clock`/`coffee`/`window` — the same
 * mechanism, no new storage key, existing visited ids from before this
 * phase remain valid entries in the same array.
 */
export const VISITED_STORAGE_KEY = "the-studio:visited-hotspots";

export const HOTSPOT_IDS = [
  "desk",
  "knowledge",
  "research",
  "leadership",
  "clock",
  "coffee",
  "window",
  "contact",
  "resume",
] as const;
export type HotspotId = (typeof HOTSPOT_IDS)[number];

export function isHotspotId(value: string): value is HotspotId {
  return (HOTSPOT_IDS as readonly string[]).includes(value);
}
