// app/page.tsx
export const dynamic = "force-dynamic";

import {
  loadAllVehicles,
  queryVehicles,
  // if you have this helper; if not, see patch #2
  filterAndSortVehicles,
} from "@/lib/getVehicles";
import type { SortKey, SortDir } from "@/lib/utils";

import Header from "./components/Header";
import Controls from "./components/Controls";
import VehicleGrid from "./components/VehicleGrid";
import Pagination from "./components/Pagination";

import StatsBar from "./components/StatsBar";
import { getMetrics } from "@/lib/metrics";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const q          = typeof sp.q === "string" ? sp.q : null;
  const brand      = typeof sp.brand === "string" ? sp.brand : null;

  // ✅ read these two
  const condition  = typeof sp.condition === "string" ? (sp.condition as "new" | "used" | "accidents") : null;
  const drivetrain = typeof sp.drivetrain === "string" ? (sp.drivetrain as "fwd" | "rwd" | "awd") : null;

  const sortRaw = typeof sp.sort === "string" ? sp.sort : "price";
  const dirRaw  = typeof sp.dir  === "string" ? sp.dir  : "asc";

  const sort: SortKey = (["price","range_km","year","brand"] as const)
    .includes(sortRaw as SortKey) ? (sortRaw as SortKey) : "price";
  const dir:  SortDir  = (["asc","desc"] as const)
    .includes(dirRaw  as SortDir)  ? (dirRaw  as SortDir)  : "asc";

    const page = Number(sp.page ?? 1);
    const perPage = 9;

  // ✅ Use the full filtered list (no pagination) for KPIs so they don't jump when paging
  const filteredAll =
    typeof filterAndSortVehicles === "function"
      ? await filterAndSortVehicles({ q, brand, condition, drivetrain, sort, dir })
      : null;

  // ✅ Paginated list for the grid (now with condition & drivetrain)
  const { list, pages, page: p, total } =
    await queryVehicles({ q, brand, condition, drivetrain, sort, dir, page, perPage });

  // Brands for header combobox
  const all = await loadAllVehicles();
  const brands = Array.from(new Set(all.map(v => v.brand))).sort();

  // KPIs from full filtered set if available; otherwise from current page as fallback
  const m = getMetrics(filteredAll ?? list);

  return (
    <>
      <Header brands={brands} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        <Controls />

        <StatsBar
          total={m.total}
          dataset={m.dataset}
          accidents={m.accidents}
          drivetrain={m.drivetrain}
          range={m.range}
          charging={m.charging}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-lg font-semibold">
              {q ? `Results for “${q}”` : "All Electric Vehicles"}
            </h2>
            <span className="text-sm opacity-70">{total} results</span>
          </div>
          <Pagination page={p} pages={pages} />
        </div>

        {list.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 text-sm">
            <div className="font-medium mb-1">No vehicles match your filters.</div>
            <div className="opacity-70">Try clearing filters or picking another brand/model.</div>
          </div>
        ) : (
          <VehicleGrid vehicles={list} />
        )}
      </main>
    </>
  );
}
