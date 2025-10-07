"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Shell({
  sidebar,
  children,
  headerHeight = 64, // match your header's real height
}: {
  sidebar: ReactNode;
  children: ReactNode;
  headerHeight?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      style={
        {
          // used to compute sticky heights
          ["--hdr"]: `${headerHeight}px` as string,
        } as React.CSSProperties
      }
    >
      {/* Mobile toggle (FAB) */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden fixed bottom-4 right-4 z-40 rounded-full p-3 shadow-lg
                   bg-white/90 dark:bg-neutral-800/90 border border-black/10 dark:border-white/10 backdrop-blur"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        aria-label="Sidebar navigation"
        className={`fixed lg:sticky top-[var(--hdr)] left-0
                    h-[calc(100dvh-var(--hdr))] w-72 z-30
                    border-r border-black/5 dark:border-white/10
                    bg-white/70 dark:bg-neutral-900/60 backdrop-blur
                    p-4 transition-transform
                    ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {sidebar}
      </aside>

      {/* Main content: add left margin on lg to make room for sticky sidebar */}
      <div className="lg:ml-72">{children}</div>
    </div>
  );
}
