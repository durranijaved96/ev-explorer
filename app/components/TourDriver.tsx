// app/components/TourDriver.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { driver } from "driver.js";
import type { DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

type TourDriverProps = {
  autoStart?: boolean;
  storageKey?: string;
  /** hide the built-in trigger button; use external trigger instead */
  hideButton?: boolean;
  /** keep the old inline/floating button styles if you do want the built-in button */
  inline?: boolean;
};

function waitForSelectors(selectors: string[], timeout = 4000) {
  const start = Date.now();
  return new Promise<void>((resolve, reject) => {
    const tick = () => {
      const ready = selectors.every((s) => !!document.querySelector(s));
      if (ready) return resolve();
      if (Date.now() - start > timeout) return reject(new Error("timeout"));
      requestAnimationFrame(tick);
    };
    tick();
  });
}

export default function TourDriver({
  autoStart = true,
  storageKey = "evx_tour_seen_v1",
  hideButton = false,
  inline = false,
}: TourDriverProps) {
  const [ready, setReady] = useState(false);

  const steps: DriveStep[] = useMemo(
    () => [
      {
        element: "#tour-logo",
        popover: {
          title: "Welcome to EV Explorer",
          description:
            "Browse and compare electric vehicles. Start with the brand selector or jump into filters.",
          side: "bottom",
          align: "start",
          popoverClass: "evx-pop",
        },
      },
      {
        element: "#tour-brand",
        popover: {
          title: "Brand quick select",
          description: "Filter the catalog by brand instantly.",
          side: "bottom",
          align: "start",
          popoverClass: "evx-pop",
        },
      },
      {
        element: "#tour-controls",
        popover: {
          title: "Filters & Sorting",
          description:
            "Narrow by condition and drivetrain, then sort by price, range, year, or brand.",
          side: "bottom",
          align: "start",
          popoverClass: "evx-pop",
        },
      },
      {
        element: "#tour-stats",
        popover: {
          title: "Key stats",
          description:
            "Quick overview of totals, accident flags, drivetrain mix, range and charging.",
          side: "bottom",
          align: "start",
          popoverClass: "evx-pop",
        },
      },
      {
        element: "#tour-pagination",
        popover: {
          title: "Pagination",
          description:
            "Browse more results. KPIs stay stable so they don’t jump when paging.",
          side: "top",
          align: "start",
          popoverClass: "evx-pop",
        },
      },
    ],
    []
  );

  const tour = useMemo(
    () =>
      driver({
        showProgress: true,
        overlayOpacity: 0.5,
        nextBtnText: "Next",
        prevBtnText: "Back",
        doneBtnText: "Got it",
        stagePadding: 6,
        allowClose: true,
        steps,
        popoverClass: "evx-pop",
      }),
    [steps]
  );

  useEffect(() => setReady(true), []);

  // Start once per browser (optional)
  useEffect(() => {
    if (!ready || !autoStart) return;
    const seen =
      typeof window !== "undefined" && localStorage.getItem(storageKey);
    if (seen) return;

    const selectors = steps.map((s) => s.element as string);
    waitForSelectors(selectors)
      .catch(() => {
        const existing = steps.filter(
          (s): s is DriveStep => !!document.querySelector(s.element as string)
        );
        if (existing.length) tour.setSteps(existing);
      })
      .finally(() => {
        setTimeout(() => tour.drive(), 150);
        localStorage.setItem(storageKey, "1");
      });
  }, [ready, autoStart, storageKey, steps, tour]);

  // ✅ External trigger: dispatchEvent(new CustomEvent("evx:start-tour"))
  useEffect(() => {
    const handler = () => tour.drive();
    window.addEventListener("evx:start-tour", handler);
    // optional global hook for debugging: window.evxStartTour?.()
    (window as any).evxStartTour = handler;
    return () => {
      window.removeEventListener("evx:start-tour", handler);
      delete (window as any).evxStartTour;
    };
  }, [tour]);

  if (hideButton) return null; // use external trigger only

  // Built-in trigger (kept for completeness)
  return (
    <button
      type="button"
      onClick={() => tour.drive()}
      aria-label="Open onboarding tour"
      className={
        inline
          ? "rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 px-3 py-1.5 text-sm hover:bg-white shadow-sm"
          : "fixed bottom-4 right-4 z-50 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur px-3 py-2 text-sm shadow-md hover:shadow-lg transition"
      }
    >
      Tour
    </button>
  );
}
