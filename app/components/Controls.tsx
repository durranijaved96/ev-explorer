"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import HoverSelect from "./HoverSelect";
import { useMemo } from "react";

type Option = { value: string; label: string };

const CONDITION_OPTS: Option[] = [
  { value: "", label: "Any" },
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "accidents", label: "With accidents" },
];

const DRIVETRAIN_OPTS: Option[] = [
  { value: "", label: "Any" },
  { value: "fwd", label: "FWD" },
  { value: "rwd", label: "RWD" },
  { value: "awd", label: "AWD" },
];

const SORT_OPTS: Option[] = [
  { value: "price", label: "Price" },
  { value: "range_km", label: "Range" },
  { value: "year", label: "Year" },
  { value: "brand", label: "Brand" },
];

const DIR_OPTS: Option[] = [
  { value: "asc", label: "Asc ↑" },
  { value: "desc", label: "Desc ↓" },
];

export default function Controls() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setParam = (k: string, v?: string) => {
    const params = new URLSearchParams(sp.toString());
    if (v && v !== "") params.set(k, v);
    else params.delete(k);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const values = useMemo(
    () => ({
      condition: sp.get("condition") ?? "",
      drivetrain: sp.get("drivetrain") ?? "",
      sort: sp.get("sort") ?? "price",
      dir: sp.get("dir") ?? "asc",
    }),
    [sp]
  );

  return (
    <div
      role="toolbar"
      aria-label="Vehicle filters and sorting options"
      // Mobile: tighter gaps + horizontal scroll if needed
      // Desktop: wider gaps, no scroll
      className="
        -mx-2 px-2
        flex items-center
        gap-2 sm:gap-3 md:gap-4 lg:gap-6
        flex-nowrap sm:flex-wrap
        overflow-x-auto sm:overflow-visible
        [scrollbar-width:none] [-ms-overflow-style:none]
      "
      // hide scrollbar (Firefox/WebKit)
      style={{ WebkitOverflowScrolling: "touch" }}
      onWheel={(e) => {
        // prevent accidental vertical page scroll while horizontally scrolling toolbar on mobile
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.stopPropagation();
      }}
    >
      {/* MOBILE COMPACT SELECTS (shown <sm) */}
      <div className="flex w-full min-w-max items-center gap-2 sm:hidden">
        <CompactSelect
          label="Condition"
          value={values.condition}
          options={CONDITION_OPTS}
          onChange={(v) => setParam("condition", v || undefined)}
        />
        <CompactSelect
          label="Drivetrain"
          value={values.drivetrain}
          options={DRIVETRAIN_OPTS}
          onChange={(v) => setParam("drivetrain", v || undefined)}
        />
        <CompactSelect
          label="Sort"
          value={values.sort}
          options={SORT_OPTS}
          onChange={(v) => setParam("sort", v)}
        />
        <CompactSelect
          label="Direction"
          value={values.dir}
          options={DIR_OPTS}
          onChange={(v) => setParam("dir", v)}
        />
      </div>

      {/* DESKTOP HOVER MENUS (shown ≥sm) */}
      <div className="hidden w-full flex-wrap items-center gap-3 sm:flex md:gap-4 lg:gap-6">
        <HoverSelect
          label="Condition"
          value={values.condition}
          options={CONDITION_OPTS}
          onChange={(val) => setParam("condition", val || undefined)}
        />
        <HoverSelect
          label="Drivetrain"
          value={values.drivetrain}
          options={DRIVETRAIN_OPTS}
          onChange={(val) => setParam("drivetrain", val || undefined)}
        />
        <HoverSelect
          label="Sort"
          value={values.sort}
          options={SORT_OPTS}
          onChange={(val) => setParam("sort", val)}
        />
        <HoverSelect
          label="Direction"
          value={values.dir}
          options={DIR_OPTS}
          onChange={(val) => setParam("dir", val)}
        />
      </div>
    </div>
  );
}

/**
 * CompactSelect – small, accessible native select for mobile
 */
function CompactSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
}) {
  const id = `sel-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <label htmlFor={id} className="flex min-w-0 flex-col">
      <span className="sr-only">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          rounded-md
          border border-neutral-300 dark:border-neutral-700
          bg-background text-sm
          h-9 px-2
          min-w-[120px] max-w-[160px]
          focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700
        "
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
