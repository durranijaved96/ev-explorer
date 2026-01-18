"use client";
import React, { useState } from "react";

export default function AIChat({ defaultLocation }: { defaultLocation?: string }) {
  const [location, setLocation] = useState(defaultLocation ?? "");
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minRange, setMinRange] = useState<number | undefined>(undefined);
  const [seats, setSeats] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  async function ask() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: { location, maxPrice, minRange, seats } }),
      });
      const data = await res.json();
      if (data.ok) setResults(data.recommendations ?? []);
      else setResults([]);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 p-4 border rounded-md">
      <h3 className="font-semibold">AI Optimizer / Chat</h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location (city)" className="p-2 border rounded" />
        <input value={maxPrice ?? ""} onChange={e => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)} placeholder="Max price" className="p-2 border rounded" />
        <input value={minRange ?? ""} onChange={e => setMinRange(e.target.value ? Number(e.target.value) : undefined)} placeholder="Min range km" className="p-2 border rounded" />
        <input value={seats ?? ""} onChange={e => setSeats(e.target.value ? Number(e.target.value) : undefined)} placeholder="Seats" className="p-2 border rounded" />
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={ask} disabled={loading} className="px-3 py-1 bg-indigo-600 text-white rounded">{loading ? "Searching…" : "Find best vehicles"}</button>
        <button onClick={() => { setLocation(""); setMaxPrice(undefined); setMinRange(undefined); setSeats(undefined); setResults([]); }} className="px-3 py-1 border rounded">Reset</button>
      </div>

      <div className="mt-4">
        {results.length === 0 ? (
          <div className="text-sm text-gray-500">No recommendations yet.</div>
        ) : (
          <ul className="space-y-2">
            {results.map(r => (
              <li key={r.id} className="p-2 border rounded">
                <div className="font-semibold">{r.brand} {r.model} — €{r.price?.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Score: {r.score}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
