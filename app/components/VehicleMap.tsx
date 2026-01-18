"use client";
import React, { useEffect, useRef } from "react";
import type { Vehicle } from "@/lib/types";

function loadCSS(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = href;
  document.head.appendChild(l);
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if ((window as any).L) return resolve();
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load script: " + src));
    document.body.appendChild(s);
  });
}

export default function VehicleMap({ vehicles }: { vehicles: Vehicle[] }) {
  const el = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Load Leaflet CSS & JS from CDN (avoid npm deps -> no peer conflicts)
    loadCSS("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
    loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js")
      .then(() => {
        const L = (window as any).L;
        if (!L || !el.current) return;

        // init map if not present
        if (!mapRef.current) {
          mapRef.current = L.map(el.current, { scrollWheelZoom: false }).setView([51.1657, 10.4515], 6);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
          }).addTo(mapRef.current);
        }

        // clear existing markers
        if (mapRef.current._markers) {
          mapRef.current._markers.forEach((m: any) => mapRef.current.removeLayer(m));
        }
        mapRef.current._markers = [];

        const coords = vehicles
          .map((v) => ({ id: v.id, label: `${v.brand} ${v.model}`, coords: v.coords }))
          .filter((x) => x.coords) as { id: string; label: string; coords: { lat: number; lng: number } }[];

        if (coords.length) {
          const group: any[] = [];
          coords.forEach((c) => {
            const m = L.marker([c.coords.lat, c.coords.lng]).addTo(mapRef.current).bindPopup(`<div class="font-semibold">${c.label}</div>`);
            group.push(m);
            mapRef.current._markers.push(m);
          });
          const g = L.featureGroup(group);
          mapRef.current.fitBounds(g.getBounds().pad(0.2));
        }
      })
      .catch(() => {
        // fail silently
      });

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch {}
        mapRef.current = null;
      }
    };
  }, [vehicles]);

  return <div ref={el} className="h-64 rounded-lg overflow-hidden" />;
}
