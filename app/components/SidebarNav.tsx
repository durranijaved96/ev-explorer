"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SidebarNav({
  brands,
}: {
  brands: string[];
}) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const router = useRouter();

  const setParam = (k: string, v?: string) => {
    const params = new URLSearchParams(sp.toString());
    if (v && v !== "") params.set(k, v);
    else params.delete(k);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const linkClass =
    "block rounded-lg px-3 py-2 text-sm hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70";

  return (
    <nav className="flex h-full flex-col">
      {/* Primary nav */}
      <div className="mb-3">
        <div className="text-xs uppercase tracking-wide opacity-60 mb-2">Browse</div>
        <Link href="/" className={linkClass}>All vehicles</Link>
        <Link href="/?sort=price" className={linkClass}>Sort by price</Link>
        <Link href="/?sort=range_km&dir=desc" className={linkClass}>Longest range</Link>
        <Link href="/?condition=new" className={linkClass}>New vehicles</Link>
        <Link href="/?condition=accidents" className={linkClass}>Accident flagged</Link>
      </div>

      <div className="h-px bg-black/5 dark:bg-white/10 my-3" />

      {/* Quick filters (secondary) */}
      <div className="space-y-3 overflow-y-auto pr-1">
        <div>
          <div className="text-xs uppercase tracking-wide opacity-60 mb-2">Quick filters</div>

          {/* Condition buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setParam("condition", "new")}
              className="rounded-lg border border-black/5 dark:border-white/10 bg-white/60 dark:bg-neutral-800/60 backdrop-blur px-3 py-2 text-sm hover:shadow"
            >
              New
            </button>
            <button
              onClick={() => setParam("condition", "used")}
              className="rounded-lg border border-black/5 dark:border-white/10 bg-white/60 dark:bg-neutral-800/60 backdrop-blur px-3 py-2 text-sm hover:shadow"
            >
              Used
            </button>
            <button
              onClick={() => setParam("condition", "accidents")}
              className="col-span-2 rounded-lg border border-black/5 dark:border-white/10 bg-white/60 dark:bg-neutral-800/60 backdrop-blur px-3 py-2 text-sm hover:shadow"
            >
              Accidents
            </button>
          </div>
        </div>

        {/* Brand list (compact) */}
        <div>
          <div className="text-xs uppercase tracking-wide opacity-60 mt-3 mb-2">Brands</div>
          <div className="grid grid-cols-2 gap-2">
            {brands.slice(0, 10).map((b) => (
              <button
                key={b}
                onClick={() => setParam("brand", b)}
                className="truncate rounded-lg border border-black/5 dark:border-white/10 bg-white/60 dark:bg-neutral-800/60 backdrop-blur px-3 py-2 text-sm hover:shadow"
                title={b}
              >
                {b}
              </button>
            ))}
          </div>
          {/* “All brands” deep link */}
          <button
            onClick={() => setParam("brand", undefined)}
            className="mt-2 w-full rounded-lg border border-black/5 dark:border-white/10 bg-white/40 dark:bg-neutral-800/40 backdrop-blur px-3 py-2 text-sm hover:shadow"
          >
            Clear brand
          </button>
        </div>
      </div>

      <div className="mt-auto pt-3">
        <div className="h-px bg-black/5 dark:bg-white/10 mb-3" />
        <div className="text-xs opacity-60">© Aampere</div>
      </div>
    </nav>
  );
}
