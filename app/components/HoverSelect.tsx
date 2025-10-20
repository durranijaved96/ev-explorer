"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

type Option = { value: string; label: string };

export default function HoverSelect({
  label,
  value,
  options,
  onChange,
  className,
  menuMatchTrigger = false,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  className?: string;
  menuMatchTrigger?: boolean;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [menuW, setMenuW] = useState<number>();
  const selected = options.find(o => o.value === value)?.label ?? "Any";

  // Keep menu width = trigger width
  useEffect(() => {
    if (!menuMatchTrigger || !btnRef.current) return;
    const sync = () => setMenuW(btnRef.current!.offsetWidth);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(btnRef.current);
    return () => ro.disconnect();
  }, [menuMatchTrigger]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!btnRef.current) return;
      if (!btnRef.current.closest(".hs-root")) return;
      const root = btnRef.current.closest(".hs-root")!;
      if (!root.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative hs-root">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        onBlur={(e) => {
          // close when focus leaves the whole widget
          if (!e.currentTarget.closest(".hs-root")?.contains(e.relatedTarget as Node)) setOpen(false);
        }}
        className={[
          "w-full inline-flex items-center gap-2",
          "h-10 px-3 rounded-xl",
          "border border-neutral-300/70 dark:border-neutral-700/70",
          "bg-white/70 dark:bg-neutral-900/70 backdrop-blur",
          "text-sm hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
          className || "",
        ].join(" ")}
      >
        <span className="truncate opacity-70">{label}</span>
        <span className="truncate font-medium flex-1 text-right">{selected}</span>
        <ChevronDownIcon
          className={[
            "h-4 w-4 shrink-0 transition-transform duration-150",
            open ? "rotate-180" : "rotate-0",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-2 rounded-xl shadow-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden"
          style={menuMatchTrigger && menuW ? { width: menuW } : undefined}
        >
          <ul className="max-h-72 overflow-auto py-1">
            {options.map((o) => {
              const active = o.value === value;
              return (
                <li key={o.value}>
                  <button
                    role="option"
                    aria-selected={active}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={[
                      "w-full text-left px-3 py-2 text-sm",
                      active
                        ? "bg-neutral-100/90 dark:bg-neutral-800/90 font-medium"
                        : "hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70",
                    ].join(" ")}
                  >
                    {o.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}