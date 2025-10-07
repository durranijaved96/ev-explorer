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
  autopilot?: boolean;
  kilometer_count?: number;
  accidents?: boolean;
  accident_description?: string;
  description?: string;
};
