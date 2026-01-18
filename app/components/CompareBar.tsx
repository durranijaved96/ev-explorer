"use client";
import React from "react";
import Modal from "@/app/components/Modal";
import type { Vehicle } from "@/lib/types";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function CompareBar({
  selected,
  onClear,
}: {
  selected: Vehicle[];
  onClear: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/95 dark:bg-neutral-900/90 shadow rounded-full px-4 py-2 flex items-center gap-3">
        <div className="text-sm">Compare {selected.length} vehicle{selected.length>1?"s":""}</div>
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
        >
          Open
        </button>
        <button
          onClick={onClear}
          className="p-1 rounded-md text-sm text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          title="Clear selection"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Compare vehicles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selected.map((v) => (
                <div key={v.id} className="p-3 rounded-lg border">
                  <div className="font-semibold text-lg">{v.brand} {v.model}</div>
                  <div className="text-sm opacity-70">€{v.price.toLocaleString()}</div>
                  <div className="text-sm">Range: {v.range_km} km</div>
                  <div className="text-sm">Battery: {v.battery_kwh ?? "-"} kWh</div>
                  <div className="text-sm">Fast charge: {v.fast_charge_kw ?? "-"} kW</div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
