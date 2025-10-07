"use client";

import { useEffect, useRef, useState } from "react";

export default function RangeFilter({
  label,
  minValue,
  maxValue,
  valueMin,
  valueMax,
  step = 1000,
  onApply,
}: {
  label: string;
  minValue: number;
  maxValue: number;
  valueMin?: number;
  valueMax?: number;
  step?: number;
  onApply: (min?: number, max?: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState<number | undefined>(valueMin);
  const [max, setMax] = useState<number | undefined>(valueMax);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };
  const scheduleClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(false), 130);
  };

  // sync when URL changes (parent passes new values)
  useEffect(() => setMin(valueMin), [valueMin]);
  useEffect(() => setMax(valueMax), [valueMax]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="group inline-flex items-center gap-2 h-10 rounded-xl border px-3
                   bg-white/70 dark:bg-neutral-900/70 backdrop-blur
                   border-neutral-300/70 dark:border-neutral-700/70 text-sm
                   hover:bg-white/80 dark:hover:bg-neutral-900/80 transition-colors"
        aria-expanded={open}
      >
        <span className="opacity-70">{label}</span>
        <span className="font-medium">
          {min ?? "min"} – {max ?? "max"}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-60">
          <path fill="currentColor" d="M7 10l5 5l5-5z" />
        </svg>
      </button>

      {open && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className="absolute z-50 mt-2 w-80 rounded-xl shadow-2xl p-3
                     border border-neutral-200/70 dark:border-neutral-800/70
                     bg-white/80 dark:bg-neutral-900/80 backdrop-blur"
          role="dialog"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs opacity-70">Min</label>
              <input
                type="number"
                inputMode="numeric"
                step={step}
                value={min ?? ""}
                onChange={(e) =>
                  setMin(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                placeholder={String(minValue)}
                className="mt-1 w-full rounded-lg border px-2 py-1.5 bg-white dark:bg-neutral-900
                           border-neutral-300 dark:border-neutral-700 text-sm"
              />
            </div>
            <div>
              <label className="text-xs opacity-70">Max</label>
              <input
                type="number"
                inputMode="numeric"
                step={step}
                value={max ?? ""}
                onChange={(e) =>
                  setMax(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                placeholder={String(maxValue)}
                className="mt-1 w-full rounded-lg border px-2 py-1.5 bg-white dark:bg-neutral-900
                           border-neutral-300 dark:border-neutral-700 text-sm"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setMin(undefined);
                setMax(undefined);
                onApply(undefined, undefined);
              }}
              className="rounded-lg border px-3 py-1.5 text-sm border-neutral-300 dark:border-neutral-700
                         hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => onApply(min, max)}
              className="rounded-lg bg-black text-white px-3 py-1.5 text-sm hover:bg-black/90
                         dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
