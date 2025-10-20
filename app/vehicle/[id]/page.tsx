import { loadAllVehicles } from "@/lib/getVehicles";
import Gallery from "@/app/components/Gallery";

// Use ISR instead of full SSG - pages regenerate every hour
export const revalidate = 3600;

// Only generate the first 10 most popular vehicles at build time
// The rest will be generated on-demand and cached
export async function generateStaticParams() {
  const all = await loadAllVehicles();
  
  // Only pre-render first 10 vehicles to reduce build time and size
  // Adjust this number based on your most popular vehicles
  return all.slice(0, 10).map(v => ({ id: v.id }));
}

// Enable dynamic params so non-pre-rendered pages work
export const dynamicParams = true;

export default async function VehiclePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const all = await loadAllVehicles();
  const v = all.find(x => x.id === id);
  
  if (!v) return <div className="p-6">Vehicle not found.</div>;

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">{v.brand} {v.model}</h1>
      <p className="text-gray-500">{v.year} • {v.range_km} km WLTP</p>
      <Gallery images={v.images?.length ? v.images : [v.image ?? "/images/placeholder.jpg"]} />
      <div className="text-2xl font-bold mt-4">€{v.price.toLocaleString()}</div>
      <p className="text-sm mt-2">{v.description ?? "No description available."}</p>
    </main>
  );
}