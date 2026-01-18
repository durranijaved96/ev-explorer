import React from "react";
import type { Vehicle } from "@/lib/types";

export default function LeaseOptions({ vehicle }: { vehicle: Vehicle }) {
  const lease = vehicle.lease_monthly;
  const sub = vehicle.subscription_monthly;
  const loc = vehicle.location;
  const coords = (vehicle as any).coords;

  const mapsHref = coords
    ? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
    : loc
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`
    : undefined;

  return (
    <div className="mt-6 p-4 border rounded-md">
      <h3 className="font-semibold">Lease & Subscription</h3>
      <div className="mt-2 flex gap-4">
        <div>
          <div className="text-sm text-gray-500">Lease (est.)</div>
          <div className="text-lg font-bold">{lease ? `€${lease.toLocaleString()}/mo` : "N/A"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Subscription (est.)</div>
          <div className="text-lg font-bold">{sub ? `€${sub.toLocaleString()}/mo` : "N/A"}</div>
        </div>
      </div>
      <div className="mt-3 flex gap-3">
        <button className="px-3 py-1 bg-blue-600 text-white rounded">Start lease</button>
        <button className="px-3 py-1 bg-green-600 text-white rounded">Start subscription</button>
        {mapsHref && (
          <a href={mapsHref} target="_blank" rel="noreferrer" className="ml-auto text-sm text-blue-600 underline">View on map</a>
        )}
      </div>
    </div>
  );
}
