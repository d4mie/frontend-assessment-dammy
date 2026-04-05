import Link from "next/link";

import { buildUrl } from "@/lib/url";

type PaginationItem = number | "ellipsis";

function getPaginationItems(currentPage: number, pageCount: number): PaginationItem[] {
  if (pageCount <= 1) return [];

  const siblings = 1;
  const items: PaginationItem[] = [1];

  const start = Math.max(2, currentPage - siblings);
  const end = Math.min(pageCount - 1, currentPage + siblings);

  if (start > 2) items.push("ellipsis");
  for (let p = start; p <= end; p += 1) items.push(p);
  if (end < pageCount - 1) items.push("ellipsis");

  if (pageCount > 1) items.push(pageCount);
  return items;
}

export type PaginationProps = {
  page: number;
  pageCount: number;
  q?: string;
  category?: string;
};

export function Pagination({ page, pageCount, q, category }: PaginationProps) {
  if (pageCount <= 1) return null;

  const hrefFor = (p: number) =>
    buildUrl("/products", {
      page: p,
      q,
      category,
    });

  const items = getPaginationItems(page, pageCount);

  return (
    <nav className="flex items-center justify-between gap-4" aria-label="Page through the shelf">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : 0}
        className={[
          "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition",
          page <= 1
            ? "pointer-events-none border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600"
            : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900",
        ].join(" ")}
      >
        Previous
      </Link>

      <ol className="flex items-center gap-2">
        {items.map((item, idx) => {
          if (item === "ellipsis") {
            return (
              <li key={`e-${idx}`} className="px-2 text-zinc-500 dark:text-zinc-400">
                …
              </li>
            );
          }

          const isCurrent = item === page;
          return (
            <li key={item}>
              <Link
                href={hrefFor(item)}
                aria-current={isCurrent ? "page" : undefined}
                className={[
                  "inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition",
                  isCurrent
                    ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900",
                ].join(" ")}
              >
                {item}
              </Link>
            </li>
          );
        })}
      </ol>

      <Link
        href={hrefFor(Math.min(pageCount, page + 1))}
        aria-disabled={page >= pageCount}
        tabIndex={page >= pageCount ? -1 : 0}
        className={[
          "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition",
          page >= pageCount
            ? "pointer-events-none border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600"
            : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900",
        ].join(" ")}
      >
        Next
      </Link>
    </nav>
  );
}

export { getPaginationItems };

