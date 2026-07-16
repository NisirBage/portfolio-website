"use client";

import { useCallback, useState } from "react";

/**
 * Phase C, Part 2 — shared hover/press tracking for every interactive
 * room object (the four hotspots, the gramophone). Centralized here
 * because five components needed the identical `isHovered`/`isPressed`
 * state and the identical four/six event handlers; Phase B's gramophone
 * had this logic inline before any second consumer existed, which was
 * the right call then and would just be duplication now.
 *
 * JS state, not CSS `:hover`/`:focus-within` — Phase B already found
 * CSS `group-hover` unreliable to verify in this project's test
 * environment across three separate attempts (see `Gramophone.tsx`'s
 * own history), and this hook is what that investigation converged on:
 * directly readable state instead of trusting a selector chain compiled
 * and matched correctly.
 *
 * `isPressed` tracks mouse/touch press-and-hold, not `:active` — needed
 * as real state (not a CSS pseudo-class) because the press visual has to
 * compose with the hover visual and the idle-breathing animation on a
 * *different* element than the hit-target button (see each hotspot's
 * wrapping "breathe" div), which a CSS pseudo-class on the button alone
 * can't reach.
 */
export function useHoverState() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const onMouseEnter = useCallback(() => setIsHovered(true), []);
  const onMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);
  const onFocus = useCallback(() => setIsHovered(true), []);
  const onBlur = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);
  const onMouseDown = useCallback(() => setIsPressed(true), []);
  const onMouseUp = useCallback(() => setIsPressed(false), []);
  const onTouchStart = useCallback(() => setIsPressed(true), []);
  const onTouchEnd = useCallback(() => setIsPressed(false), []);

  return {
    isHovered,
    isPressed,
    handlers: {
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      onMouseDown,
      onMouseUp,
      onTouchStart,
      onTouchEnd,
    },
  };
}
