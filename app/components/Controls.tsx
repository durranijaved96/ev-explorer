"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import HoverSelect from "./HoverSelect";

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

  return (
    <div
      role="toolbar"
      aria-label="Vehicle filters and sorting options"
      className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 justify-start sm:justify-between"
    >
      {/* Condition (glass hover menu) */}
      <HoverSelect
        label="Condition"
        value={sp.get("condition") ?? ""}
        options={[
          { value: "", label: "Any" },
          { value: "new", label: "New" },
          { value: "used", label: "Used" },
          { value: "accidents", label: "With accidents" },
        ]}
        onChange={(val) => setParam("condition", val || undefined)}
      />

      {/* Drivetrain (glass hover menu) */}
      <HoverSelect
        label="Drivetrain"
        value={sp.get("drivetrain") ?? ""}
        options={[
          { value: "", label: "Any" },
          { value: "fwd", label: "FWD" },
          { value: "rwd", label: "RWD" },
          { value: "awd", label: "AWD" },
        ]}
        onChange={(val) => setParam("drivetrain", val || undefined)}
      />

      {/* Price range (glass hover panel) */}

      {/* Sort (glass hover menu) */}
      <HoverSelect
        label="Sort"
        value={sp.get("sort") ?? "price"}
        options={[
          { value: "price", label: "Price" },
          { value: "range_km", label: "Range" },
          { value: "year", label: "Year" },
          { value: "brand", label: "Brand" },
        ]}
        onChange={(val) => setParam("sort", val)}
      />

      {/* Direction (glass hover menu) */}
      <HoverSelect
        label="Direction"
        value={sp.get("dir") ?? "asc"}
        options={[
          { value: "asc", label: "Asc ↑" },
          { value: "desc", label: "Desc ↓" },
        ]}
        onChange={(val) => setParam("dir", val)}
      />
    </div>
  );
}
