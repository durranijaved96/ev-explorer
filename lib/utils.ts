// lib/utils.ts
import type { Vehicle } from "./types";

export type SortKey = "price" | "range_km" | "year" | "brand";
export type SortDir = "asc" | "desc";

export function searchVehicles(list: Vehicle[], q?: string | null) {
  if (!q) return list;
  const n = q.trim().toLowerCase();
  return list.filter(v =>
    `${v.brand} ${v.model}`.toLowerCase().includes(n)
  );
}

// ✅ accept brand as string | string[] | null (CSV supported)
export function filterVehicles(
  list: Vehicle[],
  brand?: string | string[] | null
) {
  if (!brand || (Array.isArray(brand) && brand.length === 0)) return list;

  const brands = Array.isArray(brand)
    ? brand
    : brand.split(",").map(s => s.trim()).filter(Boolean);

  if (brands.length === 0) return list;

  const set = new Set(brands.map(b => b.toLowerCase()));
  return list.filter(v => set.has(v.brand.toLowerCase()));
}

export function sortVehicles(list: Vehicle[], key: SortKey, dir: SortDir) {
  const m = dir === "asc" ? 1 : -1;
  return [...list].sort((a, b) => {
    const av = a[key] as string | number; // Adjust the types based on your Vehicle definition
    const bv = b[key] as string | number; // Adjust the types based on your Vehicle definition
    if (av < bv) return -1 * m;
    if (av > bv) return  1 * m;
    return 0;
  });
}

export function paginate<T>(list: T[], page: number, perPage: number) {
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const p = Math.min(Math.max(1, page), pages);
  const start = (p - 1) * perPage;
  const items = list.slice(start, start + perPage);
  return { items, page: p, pages, total };
}
