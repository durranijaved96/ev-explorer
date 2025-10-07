// lib/getVehicles.ts
import { unstable_cache } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import type { Vehicle } from "./types";
import {
  searchVehicles,
  filterVehicles,
  sortVehicles,
  paginate,
  type SortKey,
  type SortDir,
} from "./utils";

type UnknownRecord = Record<string, unknown>;
type VehicleInput = Partial<Vehicle> & UnknownRecord;

// ---------- safe getters ----------
function getStr(o: UnknownRecord, k: string): string | undefined {
  const v = o[k];
  return typeof v === "string" ? v : undefined;
}
function getNum(o: UnknownRecord, k: string): number | undefined {
  const v = o[k];
  return typeof v === "number" ? v : undefined;
}
function getBool(o: UnknownRecord, k: string): boolean | undefined {
  const v = o[k];
  return typeof v === "boolean" ? v : undefined;
}
function getStrArray(o: UnknownRecord, k: string): string[] | undefined {
  const v = o[k];
  if (!Array.isArray(v)) return undefined;
  const arr = v.filter((x): x is string => typeof x === "string");
  return arr.length ? arr : undefined;
}

// ---------- input normalization ----------
function normalizeData(raw: unknown): VehicleInput[] {
  if (Array.isArray(raw)) return raw as VehicleInput[];
  if (raw && typeof raw === "object") {
    const obj = raw as UnknownRecord;
    const candidates = ["vehicles", "data", "items", "results"] as const;
    for (const key of candidates) {
      const val = obj[key];
      if (Array.isArray(val)) return val as VehicleInput[];
    }
  }
  throw new Error(
    "vehicle_data.json must be a JSON array or an object containing an array under: vehicles, data, items, or results."
  );
}

// ---------- query type ----------
export type Query = {
  q?: string | null;
  brand?: string | null;
  condition?: "new" | "used" | "accidents" | null;
  drivetrain?: "fwd" | "rwd" | "awd" | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minRange?: number | null;
  maxRange?: number | null;
  sort?: SortKey | undefined;
  dir?: SortDir | undefined;
  page?: number | undefined;
  perPage?: number | undefined;
};

// ---------- cached reader (perf) ----------
const readVehiclesCached = unstable_cache(
  async (): Promise<Vehicle[]> => {
    const file = path.join(process.cwd(), "data", "vehicle_data.json");
    let text = await fs.readFile(file, "utf-8");
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM
    const raw = JSON.parse(text) as unknown;
    const arr = normalizeData(raw);

    return arr.map((v, i): Vehicle => {
      const vr = v as UnknownRecord;

      // images
      const images = getStrArray(vr, "images");
      const image = images?.[0];

      // alternate key normalization
      const battery_kwh =
        getNum(vr, "battery_capacity_kWh") ?? getNum(vr, "battery_kwh");
      const fast_charge_kw =
        getNum(vr, "charging_speed_kW") ?? getNum(vr, "fast_charge_kw");

      return {
        id: getStr(vr, "id") ?? String(i + 1),
        brand: (getStr(vr, "brand") ?? "Unknown").trim(),
        model: (getStr(vr, "model") ?? "Unknown").trim(),
        year: getNum(vr, "year") ?? 0,
        price: getNum(vr, "price") ?? 0,
        range_km: getNum(vr, "range_km") ?? 0,

        // media
        images,
        image,

        // normalized numeric fields
        battery_kwh,
        fast_charge_kw,

        // extras
        color: getStr(vr, "color"),
        condition: getStr(vr, "condition"),
        seats: getNum(vr, "seats"),
        drivetrain: getStr(vr, "drivetrain"),
        location: getStr(vr, "location"),
        autopilot: getBool(vr, "autopilot"),
        kilometer_count: getNum(vr, "kilometer_count"),
        accidents: getBool(vr, "accidents"),
        accident_description: getStr(vr, "accident_description"),
        description: getStr(vr, "description"),
      };
    });
  },
  ["vehicles-v1"],          // bump to v2 if data shape changes
  { revalidate: 60 * 60 }   // revalidate hourly
);

// ---------- public API ----------
export async function loadAllVehicles(): Promise<Vehicle[]> {
  return readVehiclesCached();
}

export async function loadBrands(): Promise<string[]> {
  const all = await loadAllVehicles();
  return Array.from(new Set(all.map((v) => v.brand))).sort();
}

/**
 * Returns the filtered + sorted list (UNPAGINATED).
 * Use this for KPIs/charts so they reflect the whole result set,
 * not just the current page.
 */
export async function filterAndSortVehicles(
  params: Omit<Query, "page" | "perPage">
) {
  const {
    q = null,
    brand = null,
    condition = null,
    drivetrain = null,
    minPrice = null,
    maxPrice = null,
    minRange = null,
    maxRange = null,
    sort = "price",
    dir = "asc",
  } = params;

  const sortKey: SortKey = (["price", "range_km", "year", "brand"] as const).includes(
    sort as SortKey
  )
    ? (sort as SortKey)
    : "price";
  const dirKey: SortDir = (["asc", "desc"] as const).includes(dir as SortDir)
    ? (dir as SortDir)
    : "asc";

  let list = await loadAllVehicles();

  // search + brand
  list = searchVehicles(list, q);
  list = filterVehicles(list, brand);

  // condition
  if (condition) {
    const c = condition.toLowerCase();
    if (c === "new") list = list.filter(v => (v.condition ?? "").toLowerCase() === "new");
    else if (c === "used") list = list.filter(v => (v.condition ?? "").toLowerCase() === "used");
    else if (c === "accidents") list = list.filter(v => v.accidents === true);
  }

  // drivetrain
  if (drivetrain) {
    const d = drivetrain.toLowerCase();
    list = list.filter(v => (v.drivetrain ?? "").toLowerCase() === d);
  }

  // numeric ranges
  if (minPrice != null && !Number.isNaN(minPrice)) list = list.filter(v => (v.price ?? 0) >= Number(minPrice));
  if (maxPrice != null && !Number.isNaN(maxPrice)) list = list.filter(v => (v.price ?? 0) <= Number(maxPrice));
  if (minRange != null && !Number.isNaN(minRange)) list = list.filter(v => (v.range_km ?? 0) >= Number(minRange));
  if (maxRange != null && !Number.isNaN(maxRange)) list = list.filter(v => (v.range_km ?? 0) <= Number(maxRange));

  // final sort
  list = sortVehicles(list, sortKey, dirKey);
  return list; // UNPAGINATED
}

/**
 * Returns the paginated view for the grid + correct total of matches.
 */
export async function queryVehicles(params: Query) {
  const {
    q = null,
    brand = null,
    condition = null,
    drivetrain = null,
    minPrice = null,
    maxPrice = null,
    minRange = null,
    maxRange = null,
    sort = "price",
    dir = "asc",
    page = 1,
    perPage = 12,
  } = params;

  // Get unpaginated results first (for accurate total & charts)
  const filtered = await filterAndSortVehicles({
    q, brand, condition, drivetrain,
    minPrice, maxPrice, minRange, maxRange,
    sort, dir,
  });

  // Then paginate that list for the grid
  const p = paginate(filtered, Number(page), Number(perPage));
  return { ...p, list: p.items, total: filtered.length };
}

export async function getVehicleById(id: string) {
  const list = await loadAllVehicles();
  return list.find((v) => v.id === id);
}
