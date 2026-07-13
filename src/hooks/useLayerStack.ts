"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PARAM = "panel";

/**
 * State Manager for which Layer is open — application state only, per
 * the Layer Responsibilities rule. Knows nothing about how a Layer
 * renders (that's LayerPanel) or what triggered opening one (that's
 * inline in whatever component calls `open`, until a second real
 * consumer justifies a dedicated Interaction/intent module).
 *
 * Deliberately a single `activeLayer: string | null`, not a generic
 * multi-depth stack — see ASSUMPTIONS.md A5 for why, and what would
 * have to change if that assumption turns out wrong.
 *
 * Synced to the URL (`?panel=<id>`) via push navigation for both open
 * and close, rather than using `router.back()` for close. `back()`
 * would be wrong for a visitor who arrived at `?panel=dummy` directly
 * (a deep link) — there's no guarantee "back" leads anywhere sensible.
 * Pushing an explicit "no panel" URL on close is deep-link-safe at the
 * cost of one extra history entry per close, a tradeoff worth
 * recording rather than leaving implicit.
 */
export function useLayerStack() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeLayer = searchParams.get(PARAM);

  const open = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(PARAM, id);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(PARAM);
    const query = params.toString();
    router.push(query ? `?${query}` : "?", { scroll: false });
  }, [router, searchParams]);

  return { activeLayer, open, close };
}
