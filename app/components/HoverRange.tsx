// app/components/HoverRange.tsx
"use client";

import { useRef, useState } from "react";

export default function HoverRange({
  label,
  minName,
  maxName,
  minValue,
  maxValue,
  onChange,
}: {
  label: string;
  minName: string;                 // e.g., "€" or "km"
  maxName: string;                 // e.g., "€" or "km"
  minValue?: string | null;
  maxValue?: string | null;
  onChange: (k: "min" | "max", v?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
    setOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 130);
  };

  return (
    <div
      className="relative"
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="h-10 w-48 rounded-xl border px-3 py-2 text-sm
                   bg-white/70 dark:bg-neutral-900/70 backdrop-blur
                   border-neutral-300/70 dark:border-neutral-700/70
                   hover:shadow focus:ring-2 focus:ring-blue-500/60 text-left"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {label}
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-72 rounded-xl shadow-2xl p-3
                     border border-neutral-200/70 dark:border-neutral-800/70
                     bg-white/90 dark:bg-neutral-900/90 backdrop-blur"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          role="dialog"
          aria-label={`${label} range`}
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder={`Min ${minName}`}
              defaultValue={minValue ?? ""}
              onBlur={(e) => onChange("min", e.target.value || undefined)}
              className="w-1/2 rounded-md border px-2 py-1 text-sm dark:bg-neutral-800"
              inputMode="numeric"
            />
            <input
              type="number"
              placeholder={`Max ${maxName}`}
              defaultValue={maxValue ?? ""}
              onBlur={(e) => onChange("max", e.target.value || undefined)}
              className="w-1/2 rounded-md border px-2 py-1 text-sm dark:bg-neutral-800"
              inputMode="numeric"
            />
          </div>
          <div className="mt-2 text-xs opacity-70">
            Values apply on blur. Hover out to close.
          </div>
        </div>
      )}
    </div>
  );
}
