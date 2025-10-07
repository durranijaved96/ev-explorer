// app/components/Skeletons.tsx
export function SkeletonControls() {
  return (
    <div className="flex flex-wrap items-center gap-3 animate-pulse">
      <div className="h-10 w-40 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/60" />
      <div className="h-10 w-56 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/60" />
      <div className="h-10 w-32 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/60" />
      <div className="h-10 w-28 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/60" />
      <div className="h-10 w-28 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/60" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-3">
      <div className="relative aspect-video rounded-xl bg-neutral-200/70 dark:bg-neutral-800/70 animate-pulse" />
      <div className="pt-3 space-y-2">
        <div className="h-4 w-2/3 rounded bg-neutral-200/70 dark:bg-neutral-800/70 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-neutral-200/70 dark:bg-neutral-800/70 animate-pulse" />
      </div>
    </div>
  );
}
