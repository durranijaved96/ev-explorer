"use client";
import React, { useState } from "react";
import type { Vehicle } from "@/lib/types";

export default function ProvidersPanel({ vehicle }: { vehicle: Vehicle }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{ name: string; url?: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchProviders() {
    if (open) {
      setOpen(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: vehicle.id, brand: vehicle.brand, model: vehicle.model }),
      });
      const data = await res.json();
      if (data.ok) {
        setItems(data.providers ?? []);
      } else {
        setError(data.error ?? "Unknown error");
      }
      setOpen(true);
    } catch (e: any) {
      setError(String(e));
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <button onClick={fetchProviders} className="px-3 py-1 bg-gray-100 dark:bg-neutral-800 rounded text-sm">
        {open ? "Hide providers" : loading ? "Checking…" : "Check providers & sharing"}
      </button>

      {open && (
        <div className="mt-3 p-3 bg-white dark:bg-neutral-900 rounded shadow-sm w-full max-w-md">
          {loading && <div className="text-sm text-gray-500">Loading providers…</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}
          {!loading && !error && items && items.length === 0 && <div className="text-sm text-gray-500">No providers found nearby.</div>}
          {!loading && items && items.map((p, i) => (
            <div key={i} className="py-1">
              {p.url ? (
                <a href={p.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">{p.name}</a>
              ) : (
                <div className="text-sm">{p.name}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
