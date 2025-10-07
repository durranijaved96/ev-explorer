import { loadAllVehicles } from "@/lib/getVehicles";
import Gallery from "@/app/components/Gallery";

export async function generateStaticParams() {
  const all = await loadAllVehicles();
  return all.map(v => ({ id: v.id }));
}

export default async function VehiclePage({ params }: { params: { id: string } }) {
  const all = await loadAllVehicles();
  const v = all.find(x => x.id === params.id);
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
