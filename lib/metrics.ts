// lib/metrics.ts
import type { Vehicle } from "./types";

export type Slice = { id: number; label: string; value: number; color?: string };
export type RangeStat = { count: number; min: number; max: number; avg: number };

function toStr(v: unknown): string | undefined {
  return typeof v === "string" ? v.trim() : undefined;
}
function toNum(v: unknown): number | undefined {
  return typeof v === "number" ? v : undefined;
}
function toBool(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}

/** ✅ Donut = condition only (non-overlapping): New / Used / Unknown */
export function conditionSlices(vs: Vehicle[]): Slice[] {
  let newCnt = 0, usedCnt = 0, unknownCnt = 0;

  for (const v of vs) {
    const c = toStr(v.condition)?.toLowerCase();
    if (c === "new") newCnt++;
    else if (c === "used") usedCnt++;
    else unknownCnt++;
  }

  const slices: Slice[] = [
    { id: 0, label: "New",     value: newCnt,     color: "#22c55e" }, // green-500
    { id: 1, label: "Used",    value: usedCnt,    color: "#94a3b8" }, // slate-400
  ];
  if (unknownCnt > 0) {
    slices.push({ id: 2, label: "Unknown", value: unknownCnt, color: "#e5e7eb" });
  }
  return slices;
}

/** Accidents are independent of condition */
export function accidentsCount(vs: Vehicle[]): number {
  let n = 0;
  for (const v of vs) if (toBool(v.accidents) === true) n++;
  return n;
}

export function calcRange(vs: Vehicle[], key: keyof Vehicle): RangeStat {
  const vals = vs
    .map(v => v[key] as unknown)
    .map(toNum)
    .filter((n): n is number => n != null);
  if (vals.length === 0) return { count: 0, min: 0, max: 0, avg: 0 };
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const avg = vals.reduce((s, x) => s + x, 0) / vals.length;
  return { count: vals.length, min, max, avg };
}

export function drivetrainSlices(vs: Vehicle[]): Slice[] {
  const map = new Map<string, number>();
  const norm = (s?: string) => (s || "Unknown").toUpperCase();
  for (const v of vs) {
    const d = norm(toStr(v.drivetrain));
    map.set(d, (map.get(d) ?? 0) + 1);
  }
  const order = ["AWD", "FWD", "RWD", "4WD", "UNKNOWN"];
  const colors: Record<string, string> = {
    AWD: "#60a5fa",
    FWD: "#f59e0b",
    RWD: "#34d399",
    "4WD": "#f472b6",
    UNKNOWN: "#cbd5e1",
  };
  const entries = Array.from(map.entries());
  entries.sort((a, b) => {
    const ai = order.indexOf(a[0]); const bi = order.indexOf(b[0]);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
  return entries.map(([label, value], i) => ({
    id: i,
    label: label === "UNKNOWN" ? "Unknown" : label,
    value,
    color: colors[label] ?? "#cbd5e1",
  }));
}

export function getMetrics(vs: Vehicle[]) {
  return {
    total: vs.length,
    dataset: conditionSlices(vs),     // 👈 New / Used / Unknown
    accidents: accidentsCount(vs),    // 👈 separate count
    drivetrain: drivetrainSlices(vs),
    range: calcRange(vs, "range_km"),
    charging: calcRange(vs, "fast_charge_kw"),
  };
}
