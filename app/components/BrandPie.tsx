// app/components/BrandsPie.tsx
"use client";

import { PieChart } from "@mui/x-charts/PieChart";

type BrandSlice = { id: number; label: string; value: number; color?: string };

export default function BrandsPie({
  data,
  title = "Brands",
  height = 240,
}: {
  data: BrandSlice[];
  title?: string;
  height?: number;
}) {
  // some pleasant Tailwind colors
  const fallbackColors = [
    "#3b82f6", // blue-500
    "#22c55e", // green-500
    "#ef4444", // red-500
    "#eab308", // yellow-500
    "#a855f7", // purple-500
    "#14b8a6", // teal-500
    "#f97316", // orange-500
    "#06b6d4", // cyan-500
    "#84cc16", // lime-500
    "#f43f5e", // rose-500
  ];

  const seriesData = data.map((d, i) => ({
    ...d,
    color: d.color ?? fallbackColors[i % fallbackColors.length],
  }));

  return (
    <div className="p-4 rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-neutral-800/40 backdrop-blur shadow-sm">
      <div className="mb-2 text-sm font-medium opacity-80">{title}</div>
      <PieChart
        series={[
          {
            data: seriesData,
            innerRadius: 40,
            outerRadius: 80,
            cornerRadius: 3,
            paddingAngle: 2,
          },
        ]}
        width={360}
        height={height}
        // optional: a simple legend-like labels
        hideLegend
      />

      {/* inline legend */}
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        {seriesData.map((s) => (
          <div key={s.id} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded"
              style={{ backgroundColor: s.color }}
              aria-hidden
            />
            <span className="truncate">{s.label}</span>
            <span className="ml-auto tabular-nums opacity-70">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
