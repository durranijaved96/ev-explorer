export type Provider = { name: string; url?: string; note?: string };

const PROVIDER_MAP: Record<string, Provider[]> = {
  tesla: [
    { name: "Sixt", url: "https://www.sixt.com/car-rental/" },
    { name: "Share Now", url: "https://www.share-now.com/" },
  ],
  bmw: [
    { name: "Sixt", url: "https://www.sixt.com/car-rental/" },
    { name: "Free2Move", url: "https://www.free2move.com/" },
  ],
  audi: [
    { name: "Sixt", url: "https://www.sixt.com/car-rental/" },
    { name: "Share Now", url: "https://www.share-now.com/" },
  ],
};

const GENERIC: Provider[] = [
  { name: "Sixt", url: "https://www.sixt.com/" },
  { name: "Share Now", url: "https://www.share-now.com/" },
];

export function lookupProviders(brand?: string, model?: string): Provider[] {
  if (!brand) return GENERIC;
  const key = brand.toLowerCase().trim();
  const byBrand = PROVIDER_MAP[key];
  return byBrand ?? GENERIC;
}

export { PROVIDER_MAP };
