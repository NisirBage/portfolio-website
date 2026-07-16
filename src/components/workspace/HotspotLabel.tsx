"use client";

interface HotspotLabelProps {
  label: string;
  visited?: boolean;
  active: boolean;
  priority: "primary" | "secondary";
}

/**
 * Shared hotspot label — Phase F.1, Part 8. Rendered as a child of each
 * hotspot's own `<button>` (which is already `position: absolute`,
 * giving this a positioning context to anchor `top: 100%` against).
 * `active` is each caller's own `useHoverState`, so desktop's
 * hover-reveal is driven by the identical mechanism already powering
 * every other hover effect in this room — see `globals.css`'s
 * `.hotspot-label` rule for the mobile-always-visible /
 * desktop-hover-only split itself.
 *
 * `priority` — added Phase H.2, Part 10. Desktop is unaffected (labels
 * are hover-revealed one at a time there, so equal weight was never a
 * problem); the portrait-only compact styling in `globals.css` reads
 * this class to size/dim Future, Timeline, Music, Contact, About Me,
 * and Resume down relative to the four hotspots the brief calls out as
 * primary — Research, Knowledge, Leadership, Workspace — instead of ten
 * equal-weight labels competing for attention on a small screen. A
 * required prop (no default) so every caller states its own priority
 * explicitly rather than one silently inheriting the wrong tier.
 */
export function HotspotLabel({ label, visited = false, active, priority }: HotspotLabelProps) {
  return (
    <span
      aria-hidden="true"
      className={`hotspot-label hotspot-label--${priority} ${active ? "hotspot-label--active" : ""}`}
    >
      {visited ? "✓ " : ""}
      {label}
    </span>
  );
}
