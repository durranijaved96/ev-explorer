// app/components/HoverSelect.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

export default function HoverSelect({
  label,
  value,
  options,
  onChange,
  className = "w-56",          // default width; override from parent with w-full
  menuMatchTrigger = false,     // makes menu width match trigger
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  className?: string;
  menuMatchTrigger?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [menuW, setMenuW] = useState<number | undefined>(undefined);

  // Keep menu width equal to trigger (optional)
  useEffect(() => {
    if (!menuMatchTrigger) return;
    const update = () => {
      if (btnRef.current) setMenuW(btnRef.current.offsetWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [menuMatchTrigger]);

  // Click outside / ESC to close
  useEffect(() => {
    if (!open) return;

    const handleDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!rootRef.current?.contains(t)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", handleDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  // Toggle on click (desktop + mobile). Also support keyboard.
  const toggle = () => setOpen((s) => !s);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
          if (e.key === "ArrowDown") setOpen(true);
        }}
        className="
          h-11 w-full rounded-xl border
          bg-white/70 dark:bg-neutral-900/70 backdrop-blur
          border-neutral-300/70 dark:border-neutral-700/70
          px-3 text-left outline-none
          focus:ring-2 focus:ring-blue-500/60
        "
      >
        {/* Smaller placeholder/label, medium value text */}
        <div className="text-[11px] leading-4 opacity-70">{label}</div>
        <div className="text-sm font-medium">
          {options.find((o) => o.value === value)?.label ?? "Any"}
        </div>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="
            absolute z-50 mt-2 rounded-xl shadow-2xl p-2
            border border-neutral-300 dark:border-neutral-700
            bg-white dark:bg-neutral-900
            max-h-80 overflow-y-auto
          "
          style={menuMatchTrigger && menuW ? { width: menuW } : undefined}
          // prevent menu from closing on press before click fires
          onMouseDown={(e) => e.preventDefault()}
        >
          {options.map((o) => {
            const selected = o.value === value;
            return (
              <div
                key={o.value}
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`
                  px-3 py-2 text-sm cursor-pointer rounded-lg
                  ${selected
                    ? "bg-neutral-100/90 dark:bg-neutral-800/90"
                    : "hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80"}
                `}
              >
                {o.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
