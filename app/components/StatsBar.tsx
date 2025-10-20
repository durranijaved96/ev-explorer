"use client";

import { Car, Gauge, Battery, Zap, AlertTriangle } from "lucide-react";
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
  const CARD =
    "flex items-start justify-between gap-3 rounded-2xl border border-black/5 dark:border-white/10 " +
    "bg-white/80 dark:bg-neutral-800/70 backdrop-blur p-3 shadow-sm hover:shadow-md transition-all " +
    "min-h-[100px]";

  const LABEL =
    "text-[12.5px] font-semibold text-neutral-700 dark:text-neutral-200 tracking-tight"; // slightly larger + stronger weight
  const SUBLABEL = "text-[10.5px] font-medium text-neutral-500 dark:text-neutral-400";
  const NUM = "text-lg font-bold tabular-nums text-neutral-900 dark:text-white";

  const accPct = total > 0 ? Math.round((accidents / total) * 100) : 0;
  const driveTotal = drivetrain?.reduce((s, x) => s + (Number(x.value) || 0), 0) ?? 0;
  const pctOfTotal = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return (
    <div id="tour-stats" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {/* Vehicles */}
      <div className={CARD}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Car className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className={LABEL}>Vehicles</span>
          </div>
          <div className={`${NUM} mb-0.5`}>{total.toLocaleString()}</div>
          <div className="text-[10.5px] leading-4 text-neutral-600 dark:text-neutral-400 mb-1 line-clamp-2">
            {dataset.map((s, i) => (
              <span key={i}>
                {s.label}: <span className="font-medium">{s.value}</span>
                {i < dataset.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full px-2 py-[2px] text-[10px]
                          bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
            <AlertTriangle className="w-3 h-3" />
            <span>Accidents</span>
            <span className="tabular-nums">{accidents}</span>
            <span className="opacity-70">({accPct}%)</span>
          </div>
        </div>
        <div className="shrink-0 self-center">
          <Donut slices={dataset} centerLabel="100%" size={110} />
        </div>
      </div>

      {/* Drivetrain */}
      <div className={CARD}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Gauge className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            </div>
            <span className={LABEL}>Drivetrain</span>
          </div>

          <div className={`${SUBLABEL} mb-1`}>
            {driveTotal > 0 ? `${driveTotal} vehicles` : "—"}
          </div>

          <div className="flex flex-wrap gap-1">
            {drivetrain.map((s) => {
              const count = Number(s.value) || 0;
              const pct = pctOfTotal(count);
              return (
                <div
                  key={s.label}
                  className="flex items-center gap-1.5 px-2 py-[2px] rounded-md text-[10.5px]
                             bg-neutral-100 dark:bg-neutral-700/40 text-gray-700 dark:text-gray-300 border border-black/5 dark:border-white/10"
                >
                  <span className="font-medium">{s.label}</span>
                  <span className="font-semibold">{count}</span>
               
                </div>
              );
            })}
          </div>
        </div>
        <div className="shrink-0 self-center">
          <Donut slices={drivetrain} size={110} />
        </div>
      </div>

      {/* Range */}
      <div className={CARD}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Battery className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className={LABEL}>Range (km)</span>
          </div>
          <div className={`${NUM}`}>{range.count ? `${Math.round(range.avg)} km` : "—"}</div>
          <div className={`${SUBLABEL} mb-1`}>
            Based on {range.count} vehicles
          </div>
          <RangeBar min={range.min} max={range.max} avg={range.avg} unit="km" />
        </div>
      </div>

      {/* DC Fast-charge */}
      <div className={CARD}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Zap className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className={LABEL}>DC fast-charge</span>
          </div>
          <div className={`${NUM}`}>{charging.count ? `${Math.round(charging.avg)} kW` : "—"}</div>
          <div className={`${SUBLABEL} mb-1`}>
            Based on {charging.count} vehicles
          </div>
          <RangeBar min={charging.min} max={charging.max} avg={charging.avg} unit="kW" />
        </div>
      </div>
    </div>
  );
}
