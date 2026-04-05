export default function Loading() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="h-5 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />

        <div className="mt-5 grid animate-pulse gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <div className="aspect-[4/3] w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 w-32 shrink-0 rounded-xl bg-zinc-200 dark:bg-zinc-800"
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="h-7 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-4 flex gap-3">
              <div className="h-6 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-6 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-6 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="mt-5 space-y-2">
              <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-11/12 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-10/12 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
                  <div className="h-3 w-14 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="mt-2 h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-11/12 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-10/12 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-9/12 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

