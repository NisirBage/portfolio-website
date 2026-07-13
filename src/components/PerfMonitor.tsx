"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Basic performance instrumentation, per Milestone 2's scope — Core Web
 * Vitals logged to the console in development only. This is intentionally
 * minimal: no analytics backend exists yet (PORTFOLIO_STRATEGY.md Section
 * 12's success metrics are a separate, later concern), so this establishes
 * the measurement hook without building a collection pipeline that isn't
 * in scope.
 */
export function PerfMonitor() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[web-vitals] ${metric.name}:`, metric.value);
    }
  });

  return null;
}
