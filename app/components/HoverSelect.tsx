"use client";

import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

export default function HoverSelect({
  label,
  value,
  options,
  onChange,
  className = "",
  wide = false,
}: {
  label: string;
  value: string | undefined;
  options: Option[];
  onChange: (val: string) => void;
  className?: string;
  wide?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    setOpen(true);
  };
  const scheduleClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(false), 130);
  };

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!rootRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const currentLabel = options.find(o => o.value === value)?.label ?? "—";

  return (
    <div
      ref={rootRef}
      className={`relative ${className}`}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="group inline-flex items-center gap-2 h-10 w-70 rounded-xl border px-3
                   bg-white/70 dark:bg-neutral-900/70 backdrop-blur
                   border-neutral-300/70 dark:border-neutral-700/70
                   text-sm hover:bg-white/80 dark:hover:bg-neutral-900/80 transition-colors text-left"
        aria-expanded={open}
      >
        <span className="opacity-70">{label}</span>
        <span className="font-medium truncate">{currentLabel}</span>
        <svg className="ml-auto opacity-60 group-hover:opacity-100" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M7 10l5 5l5-5z" />
        </svg>
      </button>

      {open && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className={`absolute z-50 mt-2 rounded-xl shadow-2xl p-2
                      border border-neutral-200/70 dark:border-neutral-800/70
                      bg-white/90 dark:bg-neutral-900/90 backdrop-blur
                      ${wide ? "w-64" : "w-56"}`}
          role="menu"
        >
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm
                          hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70
                          ${opt.value === value ? "font-medium" : ""}`}
              role="menuitemradio"
              aria-checked={opt.value === value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
