"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { Vehicle } from "@/lib/types";
import Modal from "@/app/components/Modal";
import {
  Battery50Icon,
  BoltIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function VehicleGrid({ vehicles }: { vehicles: Vehicle[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [thumbPage, setThumbPage] = useState(0); // thumbnails pagination

  const selected = useMemo(
    () => vehicles.find((v) => v.id === openId) || null,
    [vehicles, openId]
  );

  useEffect(() => {
    const onHash = () => setOpenId(null);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // helpers
  const imgs = selected?.images ?? [];
  const hasImgs = imgs.length > 0;

  // thumbnail pager (5 per page)
  const thumbsPerPage = 4;
  const totalThumbPages = Math.max(1, Math.ceil(imgs.length / thumbsPerPage));
  const paginatedThumbs = imgs.slice(
    thumbPage * thumbsPerPage,
    thumbPage * thumbsPerPage + thumbsPerPage
  );

  // chip helper
  const chipClass = (type: "new" | "used" | "accident" | "other") => {
    switch (type) {
      case "new":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200";
      case "used":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-200";
      case "accident":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200";
      default:
        return "bg-neutral-100 dark:bg-neutral-800";
    }
  };

  return (
    <>
      {/* GRID – keep all cards with consistent aspect ratio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((v) => {
          const src =
            v.image && v.image.trim() !== ""
              ? v.image
              : "/images/placeholder.jpg";
          return (
            <button
              key={v.id}
              onClick={() => {
                setOpenId(v.id);
                setGalleryIndex(0);
                setThumbPage(0);
              }}
              className="text-left card p-3 hover:shadow-md transition-shadow rounded-2xl"
            >
              <div className="aspect-[16/9] relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={src}
                  alt={`${v.brand} ${v.model}`}
                  fill
                  className="object-cover"
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                />
              </div>

              <div className="pt-3 flex items-baseline justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">
                    {v.brand} {v.model}
                  </h3>
                  <div className="text-sm opacity-70 truncate">
                    {v.year} • {v.range_km} km WLTP
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold">
                    €{v.price.toLocaleString()}
                  </div>
                  <div className="text-xs opacity-70">incl. VAT</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* MODAL */}
      {selected && (
        <Modal onClose={() => setOpenId(null)}>
         <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4 sm:gap-6">

            {/* LEFT: gallery */}
            <div className="relative space-y-3">
              <div className="aspect-[16/9] relative overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={
                    hasImgs
                      ? imgs[Math.min(galleryIndex, imgs.length - 1)]
                      : selected.image ?? "/images/placeholder.jpg"
                  }
                  alt={`${selected.brand} ${selected.model}`}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 50vw"
                  priority
                />
              </div>

              {/* one place for pagination: thumbnails below the main image */}
              {/* Thumbnails with stable sizing (no jump) */}
              {/* Mobile thumbs (scrollable) */}
              {hasImgs && imgs.length > 1 && (
                <div className="sm:hidden flex gap-2 overflow-x-auto px-1 snap-x">
                  {imgs.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      onClick={() => setGalleryIndex(i)}
                      className={`relative w-24 h-16 flex-none snap-start overflow-hidden rounded-md ring-1 ring-black/10 dark:ring-white/10 transition
          ${
            galleryIndex === i
              ? "ring-2 ring-blue-500"
              : "opacity-80 hover:opacity-100"
          }`}
                      aria-label={`Thumbnail ${i + 1}`}
                    >
                      <Image
                        src={src}
                        alt={`Thumb ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Desktop thumbs (paged, no jump) */}
              {hasImgs && imgs.length > 1 && (
                <div className="relative hidden sm:flex items-center justify-center py-1">
                  <button
                    onClick={() => setThumbPage((p) => Math.max(0, p - 1))}
                    disabled={thumbPage === 0}
                    aria-label="Previous thumbnails"
                    className={`absolute left-0 rounded-full p-1 shadow bg-white/90 dark:bg-neutral-800/80 hover:bg-white
                  ${thumbPage === 0 ? "opacity-40 pointer-events-none" : ""}`}
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>

                  <div className="flex gap-2 overflow-hidden px-8 min-h-[72px]">
                    {paginatedThumbs.map((src, i) => {
                      const idx = thumbPage * thumbsPerPage + i;
                      const active = galleryIndex === idx;
                      return (
                        <button
                          key={`${src}-${idx}`}
                          onClick={() => setGalleryIndex(idx)}
                          aria-label={`Thumbnail ${idx + 1}`}
                          className={`relative w-24 h-16 flex-none overflow-hidden rounded-md border-2 transition
              ${
                active
                  ? "border-blue-500"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`}
                        >
                          <Image
                            src={src}
                            alt={`Thumb ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setThumbPage((p) => Math.min(totalThumbPages - 1, p + 1))
                    }
                    disabled={thumbPage >= totalThumbPages - 1}
                    aria-label="Next thumbnails"
                    className={`absolute right-0 rounded-full p-1 shadow bg-white/90 dark:bg-neutral-800/80 hover:bg-white
                  ${
                    thumbPage >= totalThumbPages - 1
                      ? "opacity-40 pointer-events-none"
                      : ""
                  }`}
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT: details */}
            <div className="space-y-5 md:pr-10">
              {/* title row; pr-10 so chips don’t hit the close button */}
              <div className="flex flex-wrap justify-between items-start gap-3 pr-10">
                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold break-words">
                    {selected.brand} {selected.model}
                  </h1>
                  <div className="opacity-70 text-sm flex items-center gap-3">
                    {selected.location && (
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4 opacity-60" />
                        {selected.location}
                      </span>
                    )}
                    {selected.year && (
                      <span className="flex items-center gap-1">
                        <CalendarDaysIcon className="h-4 w-4 opacity-60" />
                        {selected.year}
                      </span>
                    )}
                  </div>
                </div>

                {/* status chips – moved left and colored */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {selected.accidents && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${chipClass(
                        "accident"
                      )}`}
                    >
                      Accident
                    </span>
                  )}
                  {selected.condition && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        selected.condition.toLowerCase() === "new"
                          ? chipClass("new")
                          : chipClass("used")
                      }`}
                    >
                      {selected.condition}
                    </span>
                  )}
                  {selected.color && (
                    <span className="px-2 py-1 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800">
                      {selected.color}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-2xl font-semibold">
                €{selected.price.toLocaleString()}
              </div>

              {/* spec grid with icons */}
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <BoltIcon className="h-4 w-4 opacity-70" />
                  <dt className="opacity-70">Range</dt>
                  <dd>{selected.range_km} km</dd>
                </div>
                <div className="flex items-center gap-2">
                  <Battery50Icon className="h-4 w-4 opacity-70" />
                  <dt className="opacity-70">Battery</dt>
                  <dd>{selected.battery_kwh ?? "-"} kWh</dd>
                </div>
                <div className="flex items-center gap-2">
                  <CpuChipIcon className="h-4 w-4 opacity-70" />
                  <dt className="opacity-70">Fast charge</dt>
                  <dd>{selected.fast_charge_kw ?? "-"} kW</dd>
                </div>
                <div className="flex items-center gap-2">
                  <Cog6ToothIcon className="h-4 w-4 opacity-70" />
                  <dt className="opacity-70">Drivetrain</dt>
                  <dd>{selected.drivetrain ?? "-"}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <InformationCircleIcon className="h-4 w-4 opacity-70" />
                  <dt className="opacity-70">Autopilot</dt>
                  <dd>
                    {selected.autopilot === undefined
                      ? "-"
                      : selected.autopilot
                      ? "Yes"
                      : "No"}
                  </dd>
                </div>
              </dl>

              {/* accidents banner */}
              {selected.accidents !== undefined && (
                <div
                  className={`rounded-xl p-3 text-sm flex items-center gap-2 ${
                    selected.accidents
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                  }`}
                >
                  {selected.accidents ? (
                    <>
                      <ExclamationTriangleIcon className="h-5 w-5" />
                      <span>
                        Reported accident(s)
                        {selected.accident_description
                          ? ` — ${selected.accident_description}`
                          : ""}
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5" />
                      <span>No recorded accidents</span>
                    </>
                  )}
                </div>
              )}

              {selected.description && (
                <div className="text-sm leading-6 opacity-90">
                  {selected.description}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
