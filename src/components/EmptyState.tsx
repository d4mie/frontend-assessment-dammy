import Link from "next/link";

export type EmptyStateProps = {
  title: string;
  description?: string;
  resetHref?: string;
  resetLabel?: string;
};

export function EmptyState({
  title,
  description,
  resetHref,
  resetLabel = "Start over",
}: EmptyStateProps) {
  return (
    <section className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      ) : null}
      {resetHref ? (
        <div className="mt-6">
          <Link
            href={resetHref}
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-white dark:focus-visible:ring-zinc-50/30"
          >
            {resetLabel}
          </Link>
        </div>
      ) : null}
    </section>
  );
}

