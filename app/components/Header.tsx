// app/components/Header.tsx
"use client";

import Image from "next/image";
import Logo from "@/public/il_1080xN.6381393357_558m.webp";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import BrandCombobox from "./BrandCombobox";

export default function Header({ brands }: { brands: string[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentBrand = sp.get("brand") ?? undefined;

  const setBrand = (next?: string) => {
    const params = new URLSearchParams(sp.toString());
    if (next) params.set("brand", next);
    else params.delete("brand");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        {/* Left: Logo + wordmark */}
        <div className="flex items-center gap-3 min-w-[180px]">
          <Image
            src={Logo}
            alt="EV Explorer"
            width={40}
            height={40}
            className="rounded-lg"
            priority
          />
          <span className="text-lg font-semibold tracking-tight">EV Dashboard</span>
        </div>

        {/* Right: big brand combobox */}
        <div className="flex-1 flex justify-end">
          <BrandCombobox
            brands={brands}
            value={currentBrand}
            onChange={setBrand}
            size="lg" 
          />
        </div>
      </div>
    </header>
  );
}
