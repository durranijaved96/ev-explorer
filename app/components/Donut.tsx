// app/components/Donut.tsx
"use client";

import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import type { PieItemIdentifier } from "@mui/x-charts";

export type DonutSlice = { id: number; label: string; value: number; color?: string };

export default function Donut({
  slices,
  size = 140,
  onSliceClick,
  centerLabel,
}: {
  slices: DonutSlice[];
  size?: number;
  centerLabel?: string;
  onSliceClick?: (label: string) => void;
}) {
  // ✅ Make values deterministic and integer to avoid minute float drifts between SSR/CSR
  const safeSlices = React.useMemo(
    () =>
      slices.map((s, i) => ({
        id: s.id ?? i,
        label: s.label,
        value: Math.round(Number.isFinite(s.value) ? s.value : 0),
        color: s.color,
      })),
    [slices]
  );

  const total = React.useMemo(
    () => safeSlices.reduce((sum, x) => sum + x.value, 0) || 1,
    [safeSlices]
  );

  const data = React.useMemo(
    () =>
      safeSlices.map((s) => ({
        id: s.id,
        value: s.value,
        label: s.label,
        color: s.color,
      })),
    [safeSlices]
  );

  const handleItemClick = React.useCallback(
    (_: unknown, item: PieItemIdentifier) => {
      if (!onSliceClick) return;
      const idx = item.dataIndex;
      const label = safeSlices[idx]?.label;
      if (label) onSliceClick(label);
    },
    [onSliceClick, safeSlices]
  );

  return (
    <div className="relative">
      <PieChart
        series={[
          {
            data,
            innerRadius: Math.round(size * 0.34),
            outerRadius: Math.round(size * 0.46),
            paddingAngle: 2,
            cornerRadius: 3,
            highlightScope: { highlight: "item", fade: "global" },
            faded: { additionalRadius: -4, color: "rgba(0,0,0,0.06)" },
            valueFormatter: (item) => {
              const v = Math.round(item.value ?? 0);
              const pct = total > 0 ? Math.round((v / total) * 100) : 0;
              return `${pct}%`;
            },
          },
        ]}
        width={size}
        height={size}
        onItemClick={handleItemClick}
        // hideLegend is a prop alias that may vary by version—use sx to hide safely
      hideLegend
      />

      {centerLabel && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-sm font-medium opacity-80">{centerLabel}</div>
        </div>
      )}
    </div>
  );
}
