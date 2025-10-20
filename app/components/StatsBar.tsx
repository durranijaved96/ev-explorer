"use client";

import Donut from "./Donut";
import RangeBar from "./RangeBar";
import type { Slice, RangeStat } from "@/lib/metrics";

export default function StatsBar({
  total,
  dataset,
  accidents,
  drivetrain,
  range,
  charging,
}: {
  total: number;
  dataset: Slice[];
  accidents: number;
  drivetrain: Slice[];
  range: RangeStat;
  charging: RangeStat;
}) {
  const card =
    "flex items-center justify-between gap-5 rounded-[12px] border border-black/5 dark:border-white/10 " +
    "bg-white/80 dark:bg-neutral-800/70 backdrop-blur p-4 shadow-sm hover:shadow-md transition-shadow " +
    "min-h-[140px]";

  const accPct = total > 0 ? Math.round((accidents / total) * 100) : 0;

  return (
    <div id="tour-stats" className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* 1) Dataset (condition) + accidents */}
      <div className={card}>
        <div className="min-w-0 flex-1">
          <div className="text-sm opacity-70">Vehicles</div>
          <div className="text-2xl font-bold tabular-nums">
            {total.toLocaleString()}
          </div>
          <div className="text-xs opacity-75 mt-1">
            {dataset.map((s) => `${s.label}: ${s.value}`).join(" • ")}
          </div>

          {/* accidents chip pill */}
          <div
            className="mt-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs
                          bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
          >
            <span>Accidents</span>
            <span className="font-medium tabular-nums">{accidents}</span>
            <span className="opacity-70">({accPct}%)</span>
          </div>
        </div>
        <Donut slices={dataset} centerLabel="100%" size={116} />{" "}
        {/* slightly smaller */}
      </div>

      {/* 2) Drivetrain */}
      <div className={card}>
        <div className="min-w-0 flex-1">
          <div className="text-base font-semibold">Drivetrain</div>
          <div className="text-xs opacity-75 mt-1">
            {drivetrain.map((s) => s.label).join(" • ")}
          </div>
        </div>
        <Donut slices={drivetrain} size={116} />
      </div>

      {/* 3) Range */}
      <div className={card}>
        <div className="min-w-0 flex-1">
          <div className="text-sm opacity-70">Range (km)</div>
          <div className="text-2xl font-bold tabular-nums">
            {range.count ? `${Math.round(range.avg)} km` : "—"}
          </div>
          <div className="text-xs opacity-70">
            Based on {range.count} vehicles
          </div>
          <div className="mt-3">
            <RangeBar
              min={range.min}
              max={range.max}
              avg={range.avg}
              unit="km"
            />
          </div>
        </div>
      </div>

      {/* 4) DC Fast-charge */}
      <div className={card}>
        <div className="min-w-0 flex-1">
          <div className="text-sm opacity-70">DC fast-charge</div>
          <div className="text-2xl font-bold tabular-nums">
            {charging.count ? `${Math.round(charging.avg)} kW` : "—"}
          </div>
          <div className="text-xs opacity-70">
            Based on {charging.count} vehicles
          </div>
          <div className="mt-3">
            <RangeBar
              min={charging.min}
              max={charging.max}
              avg={charging.avg}
              unit="kW"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
