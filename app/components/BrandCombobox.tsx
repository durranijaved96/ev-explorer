// app/components/BrandCombobox.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const cx = (...c: (string | false | undefined)[]) =>
  c.filter(Boolean).join(" ");

export default function BrandCombobox({
  brands,
  value,
  onChange,
  size = "sm",
}: {
  brands: string[];
  value?: string;
  onChange: (brand?: string) => void;
  size?: "sm" | "lg";
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value ?? "");
  const [active, setActive] = useState(-1);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // hover timer for graceful close
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      const root = rootRef.current;
      if (!root) return setOpen(false);
      const activeEl = document.activeElement;
      if (!activeEl || !root.contains(activeEl)) setOpen(false);
    }, 150);
  };
  const cancelClose = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  useEffect(() => setText(value ?? ""), [value]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!rootRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const items = useMemo(() => {
    const q = text.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((b) => b.toLowerCase().includes(q));
  }, [brands, text]);

  const apply = (b?: string) => {
    onChange(b);
    setOpen(false);
  };

  // width presets
  const widthClass =
    size === "lg" ? "w-full sm:w-[28rem] md:w-[36rem] lg:w-[44rem]" : "w-64";

  return (
    <div
      ref={rootRef}
      className="relative min-w-0"
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      <div className="relative">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") apply(text || undefined);
            if (e.key === "Escape") setOpen(false);
            if (e.key === "ArrowDown")
              setActive((a) => (a + 1) % Math.max(items.length, 1));
            if (e.key === "ArrowUp")
              setActive((a) =>
                a <= 0 ? Math.max(items.length - 1, 0) : a - 1
              );
          }}
          placeholder="Search your vehicle brand by typing..."
          role="combobox"
          aria-label="Search vehicle brand"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="brand-listbox"
          aria-activedescendant={
            active >= 0 ? `brand-opt-${active}` : undefined
          }
          className={cx(
            "h-11 rounded-xl border pl-10 pr-10",
            "bg-white/70 dark:bg-neutral-900/70 backdrop-blur",
            "border-neutral-300/70 dark:border-neutral-700/70",
            "text-[15px] outline-none focus:ring-2 focus:ring-blue-500/60",
            widthClass
          )}
        />

        {/* Left: search icon (decorative) */}
        <MagnifyingGlassIcon
          aria-hidden="true"
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500"
        />

        {/* Right: clear button */}
        {text && (
          <button
            type="button"
            onClick={() => {
              setText("");
              apply(undefined);
            }}
            className="
      absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1
      hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60
      cursor-pointer transition-all
    "
            aria-label="Clear brand"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {open && (
        <div
          className="absolute z-50 mt-2 w-72 rounded-xl shadow-2xl p-2
               border border-neutral-300 dark:border-neutral-700
               bg-white dark:bg-neutral-900
               max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700
               transition-all duration-200"
          role="listbox"
          id="brand-listbox"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {items.length === 0 ? (
            <div className="px-3 py-2 text-sm opacity-70">No brands found</div>
          ) : (
            items.map((b, i) => (
              <div
                id={`brand-opt-${i}`}
                key={b}
                role="option"
                aria-selected={active === i}
                onMouseDown={(e) => {
                  e.preventDefault();
                  apply(b);
                }}
                onMouseEnter={() => setActive(i)}
                className={cx(
                  "px-3 py-2 text-sm cursor-pointer rounded-lg",
                  active === i
                    ? "bg-neutral-100/90 dark:bg-neutral-800/90"
                    : "hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80"
                )}
              >
                {b}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
