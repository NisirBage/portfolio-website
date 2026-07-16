"use client";

import { useEffect, useRef } from "react";
import { POPUP_OPEN_SRC, POPUP_CLOSE_SRC, POPUP_SFX_VOLUME } from "@/lib/audio";

/**
 * Popup open/close SFX — Phase F.1, Parts 2-4.
 *
 * *Centralized at the `Workspace` level, deliberately, not one instance
 * per `LayerPanel`.* The room can only ever have one `activeLayer` at a
 * time, but switching directly from one panel to another (Desk →
 * Leadership, say) changes two panels' `isOpen` props in the *same*
 * render — one panel's `isOpen` goes true→false while another's goes
 * false→true, simultaneously. A per-panel audio hook watching its own
 * `isOpen` prop can't tell "this is a direct switch" from "this is an
 * independent close," and would fire both the close and the open sound
 * together — exactly the layering Part 3 explicitly forbids ("if one
 * popup is already closing and another opens immediately: stop previous
 * close sound, play open sound only once"). Watching `activeLayer`
 * itself, once, at the root, is what makes that distinction possible:
 * null→X is an open, X→null is a close, and X→Y (X and Y both real
 * layers) is a direct switch — handled as an open only, per Part 3.
 *
 * Two `Audio` elements, created once and reused for the life of the
 * component — playing a sound is always "seek to 0, play," which is
 * also what "restart cleanly if another popup is opened immediately"
 * means in practice: the second `play()` call doesn't need to stop
 * anything first, reusing the same element and reseeking already
 * guarantees only one instance of that sound is ever audible.
 */
export function usePopupAudio(activeLayer: string | null) {
  const openAudioRef = useRef<HTMLAudioElement | null>(null);
  const closeAudioRef = useRef<HTMLAudioElement | null>(null);
  const prevLayerRef = useRef<string | null>(null);

  useEffect(() => {
    const openAudio = new Audio(POPUP_OPEN_SRC);
    openAudio.volume = POPUP_SFX_VOLUME;
    openAudio.preload = "auto";
    const closeAudio = new Audio(POPUP_CLOSE_SRC);
    closeAudio.volume = POPUP_SFX_VOLUME;
    closeAudio.preload = "auto";
    openAudioRef.current = openAudio;
    closeAudioRef.current = closeAudio;
    return () => {
      openAudio.pause();
      closeAudio.pause();
      openAudioRef.current = null;
      closeAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const prev = prevLayerRef.current;
    prevLayerRef.current = activeLayer;
    if (activeLayer === prev) return;

    // Opening from closed, or switching directly between two panels —
    // both play the open sound and neither plays the close sound. A
    // direct switch never runs the close sound at all, per Part 3.
    if (activeLayer) {
      const audio = openAudioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Blocked by the browser's autoplay policy on a page that
          // hasn't seen a user gesture yet — not an app error. The very
          // click that set `activeLayer` is itself a trusted gesture in
          // every real scenario, so this only matters for a deep-link
          // landing directly on `?panel=X` with zero prior interaction,
          // which is exactly the case a policy like this exists to catch.
        });
      }
      return;
    }

    // Closing to nothing — only reachable when `prev` was a real layer,
    // since the `activeLayer === prev` guard above already handled the
    // null→null case.
    const audio = closeAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Same non-error as above.
      });
    }
  }, [activeLayer]);
}
