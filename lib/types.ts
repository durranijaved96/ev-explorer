export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  range_km: number;

  image?: string;
  images?: string[];

  color?: string;
  condition?: "New" | "Used" | string;
  battery_kwh?: number;
  fast_charge_kw?: number;
  seats?: number;
  drivetrain?: string;
  location?: string;
  coords?: { lat: number; lng: number };
  lease_monthly?: number;
  subscription_monthly?: number;
  autopilot?: boolean;
  kilometer_count?: number;
  accidents?: boolean;
  accident_description?: string;
  description?: string;
};
