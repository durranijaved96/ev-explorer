// app/components/Controls.tsx
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
      id="tour-controls"
      role="toolbar"
      aria-label="Vehicle filters and sorting options"
      className="
        grid grid-cols-1 lg:grid-cols-4 gap-4
        -mx-2 px-2
      "
    >
      {/* Each cell uses same width so menus match */}
      <div className="w-full">
        <HoverSelect
          label="Condition"
          value={values.condition}
          options={CONDITION_OPTS}
          onChange={(val) => setParam("condition", val || undefined)}
          className="w-full max-w-none"
          menuMatchTrigger
        />
      </div>

      <div className="w-full">
        <HoverSelect
          label="Drivetrain"
          value={values.drivetrain}
          options={DRIVETRAIN_OPTS}
          onChange={(val) => setParam("drivetrain", val || undefined)}
          className="w-full max-w-none"
          menuMatchTrigger
        />
      </div>

      <div className="w-full">
        <HoverSelect
          label="Sort"
          value={values.sort}
          options={SORT_OPTS}
          onChange={(val) => setParam("sort", val)}
          className="w-full max-w-none"
          menuMatchTrigger
        />
      </div>

      <div className="w-full">
        <HoverSelect
          label="Direction"
          value={values.dir}
          options={DIR_OPTS}
          onChange={(val) => setParam("dir", val)}
          className="w-full max-w-none"
          menuMatchTrigger
        />
      </div>
    </div>
  );
}
