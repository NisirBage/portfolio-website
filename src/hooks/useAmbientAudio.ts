"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AMBIENT_TRACK_SRC, AMBIENT_VOLUME, FADE_IN_MS, FADE_OUT_MS, STORAGE_KEY } from "@/lib/audio";

/**
 * Ambient audio state + playback — Phase A. Manages a single `<audio>`
 * element (created once, in a ref, never duplicated) independent of
 * whether a real track exists yet, per the explicit "build the system
 * now, wire audio in later" direction.
 *
 * Default is muted, always — never autoplays, on this visit or a
 * returning one. The last preference is persisted to `localStorage` and
 * restored as the toggle's *visual* state on mount, but actual playback
 * is never started programmatically on mount: starting audio without a
 * fresh user gesture is exactly the "unexpected autoplay" this was
 * asked to avoid, and every modern browser would block it anyway.
 * Playback only ever starts inside `toggle`, which is only ever called
 * from a real click or keydown handler.
 *
 * With `AMBIENT_TRACK_SRC` empty (no real file supplied — see
 * `lib/audio.ts`), this hook manages state and fade timing only; it
 * never touches the underlying `<audio>` element, so there is no
 * possibility of a rejected `play()` promise or a network request for a
 * file that doesn't exist. The moment a real `src` is set, playback
 * activates with no other code change.
 */
export function useAmbientAudio() {
  // Deliberately initialized to `false` on every render, server or
  // client — `localStorage` doesn't exist on the server, so a lazy
  // initializer that reads it would make the client's first (hydration)
  // render disagree with the server-rendered HTML for a returning
  // visitor who'd previously unmuted, producing exactly the hydration
  // mismatch this project's own verification passes check for. The
  // effect below re-syncs from `localStorage` immediately after mount
  // (client-only, post-hydration) instead — a one-time, unavoidable
  // extra render for this specific "value only exists on the client"
  // case, not the general setState-in-effect anti-pattern
  // `react-hooks/set-state-in-effect` warns about.
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const hasRealTrack = AMBIENT_TRACK_SRC.length > 0;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see the comment above `useState(false)`: this specific setState is a hydration-safe localStorage sync, not a substitute for a lazy initializer.
    setIsPlaying(window.localStorage.getItem(STORAGE_KEY) === "playing");
  }, []);

  useEffect(() => {
    if (!hasRealTrack) return;
    const audio = new Audio(AMBIENT_TRACK_SRC);
    // Native `loop` is the seamless-looping mechanism here — the only one
    // available without moving to the Web Audio API's buffer-source
    // looping (a real rewrite for one 55s ambient clip, not a
    // proportionate response to a requirement `loop` already satisfies
    // for every mainstream browser's mp3 decoding path).
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "none";
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [hasRealTrack]);

  /**
   * *Revised, Phase F.1.* Duration is now a parameter, not a module-level
   * constant — the brief specifies asymmetric fade timing (1.5-2s in, 1s
   * out), so `toggle` below passes `FADE_IN_MS`/`FADE_OUT_MS` explicitly
   * per direction rather than one shared value serving both.
   */
  const fadeTo = useCallback((target: number, durationMs: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) {
      onDone?.();
      return;
    }
    if (fadeFrameRef.current !== null) cancelAnimationFrame(fadeFrameRef.current);
    const start = audio.volume;
    const startTime = performance.now();
    function step(now: number) {
      if (!audio) return;
      const elapsed = now - startTime;
      const t = Math.min(elapsed / durationMs, 1);
      audio.volume = start + (target - start) * t;
      if (t < 1) {
        fadeFrameRef.current = requestAnimationFrame(step);
      } else {
        fadeFrameRef.current = null;
        onDone?.();
      }
    }
    fadeFrameRef.current = requestAnimationFrame(step);
  }, []);

  const toggle = useCallback(() => {
    setIsPlaying((current) => {
      const next = !current;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next ? "playing" : "muted");
      }
      if (hasRealTrack) {
        const audio = audioRef.current;
        if (next) {
          audio?.play().catch(() => {
            // A rejected autoplay-policy promise here means the browser
            // itself blocked it — not an app error, and not surfaced as
            // one. The toggle's own visual state is the source of truth
            // for the user; a blocked play() just means no sound yet
            // until the next direct interaction, same as any site.
          });
          fadeTo(AMBIENT_VOLUME, FADE_IN_MS);
        } else {
          fadeTo(0, FADE_OUT_MS, () => audio?.pause());
        }
      }
      return next;
    });
  }, [hasRealTrack, fadeTo]);

  // Phase C, Part 1: "audio resumes after refresh if enabled" and "never
  // autoplay" are in real tension — resolved the same way real sites
  // resolve a stale AudioContext: the *preference* restores immediately
  // (the effect above, and the gramophone's visual state along with it),
  // but actual playback only resumes on the next genuine user gesture
  // *anywhere on the page*, not specifically another click on the
  // gramophone. A page-wide `pointerdown`/`keydown` listener, armed only
  // when the restored preference says "was playing" and the audio
  // element hasn't actually started yet, resumes it once and then
  // removes itself — it never fires again this session. This still
  // satisfies "never autoplay" by construction: nothing here calls
  // `.play()` without a real, trusted gesture already having occurred in
  // the same call stack.
  //
  // Edge case, reasoned through rather than special-cased away: if the
  // visitor's first interaction after reload happens to be clicking the
  // gramophone itself to turn it *off*, this listener and the button's
  // own `toggle()` both react to that same gesture — this one resumes
  // playback, then `toggle()` immediately fades it back out. The
  // audible result is a brief resume-then-fade rather than silence, but
  // it isn't wrong: the stored state genuinely was "on," so it dutifully
  // came back, and the explicit click genuinely turned it back off.
  useEffect(() => {
    if (!hasRealTrack || !isPlaying) return;
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;
    function resume() {
      audio?.play().catch(() => {
        // Same non-error as the toggle's own play() rejection handling —
        // a blocked autoplay-policy promise isn't a bug to surface.
      });
      fadeTo(AMBIENT_VOLUME, FADE_IN_MS);
    }
    document.addEventListener("pointerdown", resume, { once: true });
    document.addEventListener("keydown", resume, { once: true });
    return () => {
      document.removeEventListener("pointerdown", resume);
      document.removeEventListener("keydown", resume);
    };
  }, [hasRealTrack, isPlaying, fadeTo]);

  return { isPlaying, toggle, hasRealTrack };
}
