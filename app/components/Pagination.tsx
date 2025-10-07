"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Pagination({
  page,
  pages,
}: {
  page: number;
  pages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const goTo = (p: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`, { scroll: false }); // no scroll jump
  };

  if (pages <= 1) return null; // hide if only one page

  return (
    <div className="flex justify-center items-center gap-6 py-3">
      {/* Previous */}
      <button
        onClick={() => goTo(Math.max(page - 1, 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className={`border rounded-3xl p-2 transition-all
          ${page === 1
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-black/5 dark:hover:bg-white/10, cursor-pointer transition-all"}
          bg-transparent`}
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>

      <div className="text-sm opacity-70 font-medium">
        Page {page} of {pages}
      </div>

      {/* Next */}
      <button
        onClick={() => goTo(Math.min(page + 1, pages))}
        disabled={page === pages}
        aria-label="Next page"
        className={`border rounded-3xl p-2 transition-all
          ${page === pages
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-black/5 dark:hover:bg-white/10, cursor-pointer transition-all"}
          bg-transparent`}
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>
    </div>
  );
}
