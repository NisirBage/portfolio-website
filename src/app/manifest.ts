import type { MetadataRoute } from "next";

/**
 * Phase H, Part 3. A real manifest — name/description/colors all match
 * `layout.tsx`'s own metadata and the room's established dark palette —
 * but its one icon entry points at `favicon.ico`, which is genuinely
 * still Next.js's own default icon (a black circle, white triangle),
 * not site-specific art. Confirmed by direct inspection of the file's
 * pixel content, not assumed from its filename or byte size — an
 * earlier deployment pass had only checked that the file existed and
 * wasn't zero-byte. A proper 192×192/512×512 branded icon set (a real
 * asset need, not a config gap) is logged in `MISSING_ASSETS.md` rather
 * than fabricated here; "add to home screen" will work today, just with
 * the generic icon until one exists.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nisir Sanang Bage — The Studio",
    short_name: "The Studio",
    description: "Interactive portfolio of Nisir Sanang Bage — AI/ML engineer, researcher, and debate leader.",
    start_url: "/",
    display: "standalone",
    background_color: "#241a12",
    theme_color: "#241a12",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "256x256",
        type: "image/x-icon",
      },
    ],
  };
}
