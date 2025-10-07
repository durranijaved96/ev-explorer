// app/@modal/(.)vehicle/[id]/page.tsx
import Image from "next/image";
import { getVehicleById } from "@/lib/getVehicles";
import Modal from "@/app/components/Modal";

function yesNo(v: boolean | undefined) {
  return v === undefined ? "-" : v ? "Yes" : "No";
}
function odometer(km?: number) {
  return km == null ? "-" : `${km.toLocaleString()} km`;
}

export default async function VehicleModal({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = await getVehicleById(id);

  if (!v) {
    return (
      <Modal>
        <div className="p-6">Vehicle not found.</div>
      </Modal>
    );
  }

  return (
    <Modal>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Media / gallery */}
        <div className="space-y-3">
          <div className="aspect-video relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
            {v.image && (
              <Image
                src={v.image}
                alt={`${v.brand} ${v.model}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                priority
              />
            )}
          </div>
          {Array.isArray(v.images) && v.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {v.images.slice(0,10).map((src, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded">
                  <Image src={src} alt={`${v.brand} ${v.model} ${i+1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          {/* Title + badges */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">{v.brand} {v.model}</h1>
              <div className="opacity-70">
  {v.location ? `${v.location} • ` : ""}{v.year}
</div>

            </div>
            <div className="flex flex-wrap gap-2">
              {v.condition && (
                <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                  {v.condition}
                </span>
              )}
              {v.color && (
                <span className="px-2 py-1 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800">
                  {v.color}
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="text-2xl font-semibold">€{v.price.toLocaleString()}</div>

          {/* Specs A */}
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="opacity-70">Range</dt><dd>{v.range_km} km</dd>
            <dt className="opacity-70">Battery</dt><dd>{v.battery_kwh ?? "-"} kWh</dd>
            <dt className="opacity-70">Fast charge</dt><dd>{v.fast_charge_kw ?? "-"} kW</dd>
            <dt className="opacity-70">Drivetrain</dt><dd>{v.drivetrain ?? "-"}</dd>
            <dt className="opacity-70">Seats</dt><dd>{v.seats ?? "-"}</dd>
            <dt className="opacity-70">Autopilot</dt><dd>{yesNo(v.autopilot)}</dd>
            <dt className="opacity-70">Odometer</dt><dd>{odometer(v.kilometer_count)}</dd>
            <dt className="opacity-70">Location</dt><dd>{v.location ?? "-"}</dd>
          </dl>

          {/* Accidents */}
          {v.accidents !== undefined && (
            <div className={`rounded-xl p-3 text-sm ${v.accidents ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"}`}>
              {v.accidents
                ? <>⚠️ Reported accident(s){v.accident_description ? ` — ${v.accident_description}` : ""}</>
                : <>✅ No recorded accidents</>}
            </div>
          )}

          {/* Description */}
          {v.description && (
            <div className="text-sm leading-6 opacity-90">{v.description}</div>
          )}
        </div>
      </div>
    </Modal>
  );
}
