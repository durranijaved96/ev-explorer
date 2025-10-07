// app/components/RangeBar.tsx
"use client";

export default function RangeBar({
  min, max, avg, unit,
}: { min: number; max: number; avg: number; unit: string }) {
  const span = Math.max(0.0001, max - min);
  const pos = Math.min(100, Math.max(0, ((avg - min) / span) * 100));

  return (
    <div>
      <div className="flex items-center justify-between text-xs opacity-70">
        <span>Min: <b className="opacity-90">{Math.round(min)} {unit}</b></span>
        <span>Avg: <b className="opacity-90">{Math.round(avg)} {unit}</b></span>
        <span>Max: <b className="opacity-90">{Math.round(max)} {unit}</b></span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-neutral-300/60 to-neutral-300/10 dark:from-neutral-600/60 dark:to-neutral-600/10" />
        <div
          className="absolute -top-1 h-4 w-1.5 rounded bg-blue-600 dark:bg-blue-500 shadow-sm"
          style={{ left: `calc(${pos}% - 3px)` }}
          aria-label="Average"
          title={`Average: ${Math.round(avg)} ${unit}`}
        />
      </div>
    </div>
  );
}
