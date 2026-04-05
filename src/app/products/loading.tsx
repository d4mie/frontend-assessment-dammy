function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="aspect-[4/3] w-full bg-zinc-200 dark:bg-zinc-800" />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="h-5 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-5 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="h-3 w-14 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-14 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="col-span-2 space-y-2">
            <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-6 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="h-7 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-3 h-5 w-64 rounded bg-zinc-200 dark:bg-zinc-800" />

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="grid gap-4 sm:grid-cols-[1fr_16rem_auto] sm:items-end">
            <div className="space-y-2">
              <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-11 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-11 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="h-11 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>

        <div className="mt-8 grid animate-pulse grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

