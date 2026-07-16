"use client";

interface HotspotLabelProps {
  label: string;
  visited?: boolean;
  active: boolean;
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
 */
export function HotspotLabel({ label, visited = false, active }: HotspotLabelProps) {
  return (
    <span aria-hidden="true" className={`hotspot-label ${active ? "hotspot-label--active" : ""}`}>
      {visited ? "✓ " : ""}
      {label}
    </span>
  );
}
