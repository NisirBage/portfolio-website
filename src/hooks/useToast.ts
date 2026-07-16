"use client";

import { useCallback, useRef, useState } from "react";

export type ToastVariant = "success" | "info" | "error";

export interface ToastState {
  id: number;
  message: string;
  variant: ToastVariant;
}

const AUTO_DISMISS_MS = 2400;

/**
 * A minimal toast queue — Phase F.1, Part 6. Matches the sheet's own
 * "Notification / Toast (Examples)" board: a single visible toast at a
 * time (green check "Email copied!", envelope "Link opened," red X
 * "Action cancelled"), auto-dismissing rather than requiring a manual
 * close, since these are lightweight confirmations, not something that
 * needs its own dismiss interaction.
 */
export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    idRef.current += 1;
    setToast({ id: idRef.current, message, variant });
    timeoutRef.current = setTimeout(() => setToast(null), AUTO_DISMISS_MS);
  }, []);

  return { toast, showToast };
}
