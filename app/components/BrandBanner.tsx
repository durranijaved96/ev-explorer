"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";

export default function BrandBanner({
  brand,
  total,
  onClear,
}: {
  brand: string;
  total: number;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 px-2 py-0.5 text-xs font-medium">
          Brand
        </span>
        <span className="font-semibold">{brand}</span>
        <span className="text-sm opacity-70">• {total} vehicles</span>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
        aria-label="Clear brand"
        title="Clear brand"
      >
        <XMarkIcon className="h-4 w-4" />
        Clear
      </button>
    </div>
  );
}
