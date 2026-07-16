"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import type { ToastState } from "@/hooks/useToast";

const VARIANT_ICON = {
  success: ASSETS.iconSuccess,
  info: ASSETS.iconEmail,
  error: ASSETS.iconClose,
} as const;

/**
 * Toast display — Phase F.1, Part 6. A single fixed-position pill,
 * paper/wood styled to match the rest of the room's UI rather than a
 * generic app toast, using the same three icons the sheet's own
 * "Notification / Toast" board shows (success check, an info-style
 * icon, error X — the sheet's own "Link opened" example uses an
 * envelope, so `iconEmail` doubles as the info glyph rather than
 * cropping a near-duplicate). `aria-live="polite"` announces the
 * message without interrupting whatever the visitor is doing, and the
 * toast is purely additive — nothing else in the UI depends on it being
 * present, so a screen reader user who misses it hasn't lost any
 * capability the message wasn't already redundant with (the copy/open
 * action itself already completed before the toast appears).
 */
export function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;
  const icon = VARIANT_ICON[toast.variant];

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      <div
        key={toast.id}
        className="panel-paper motion-transition flex items-center gap-2 px-4 py-2 text-sm"
        style={{ animation: "toast-in 180ms ease-out" }}
      >
        <Image
          src={icon.src}
          alt=""
          width={icon.width}
          height={icon.height}
          unoptimized
          className="pixel-art h-5 w-5 shrink-0 select-none"
        />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
