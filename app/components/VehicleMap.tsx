"use client";
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Vehicle } from "@/lib/types";

// Leaflet's default icon asset paths need fixing when used with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function VehicleMap({ vehicles }: { vehicles: Vehicle[] }) {
  // collect coords
  const coords = vehicles
    .map((v) => ({ id: v.id, label: `${v.brand} ${v.model}`, coords: v.coords }))
    .filter((x) => x.coords) as { id: string; label: string; coords: { lat: number; lng: number } }[];

  // default center
  const center = coords.length ? [coords[0].coords.lat, coords[0].coords.lng] : [51.1657, 10.4515]; // Germany center

  useEffect(() => {
    // load leaflet css dynamically to avoid SSR issues
    import("leaflet/dist/leaflet.css");
  }, []);

  return (
    <div className="h-64 rounded-lg overflow-hidden">
      <MapContainer center={center as any} zoom={6} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {coords.map((c) => (
          <Marker key={c.id} position={[c.coords.lat, c.coords.lng] as any}>
            <Popup>
              <div className="font-semibold">{c.label}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
