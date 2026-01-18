// lib/location.ts — simple city -> coords lookup used to enrich vehicle data
export type Coords = { lat: number; lng: number };

const CITY_MAP: Record<string, Coords> = {
  berlin: { lat: 52.5200, lng: 13.4050 },
  munchen: { lat: 48.1351, lng: 11.5820 },
  muenchen: { lat: 48.1351, lng: 11.5820 },
  hamburg: { lat: 53.5511, lng: 9.9937 },
  frankfurt: { lat: 50.1109, lng: 8.6821 },
  "frankfurt am main": { lat: 50.1109, lng: 8.6821 },
  koln: { lat: 50.9375, lng: 6.9603 },
  koeln: { lat: 50.9375, lng: 6.9603 },
  hannover: { lat: 52.3759, lng: 9.7320 },
  stuttgart: { lat: 48.7758, lng: 9.1829 },
  munich: { lat: 48.1351, lng: 11.5820 },
};

export function geocodeCity(loc?: string): Coords | undefined {
  if (!loc) return undefined;
  const key = loc.toLowerCase().trim();
  // try direct, then simplified token match
  if (CITY_MAP[key]) return CITY_MAP[key];
  const token = key.split(/[,\-–\/]/)[0].trim();
  if (CITY_MAP[token]) return CITY_MAP[token];
  // fall back: look for any known city inside the string
  for (const k of Object.keys(CITY_MAP)) {
    if (key.includes(k)) return CITY_MAP[k];
  }
  return undefined;
}
