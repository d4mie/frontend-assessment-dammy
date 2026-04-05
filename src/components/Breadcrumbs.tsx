import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const content =
            item.href && !isLast ? (
              <Link
                href={item.href}
                className="rounded-sm outline-none transition hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900/40 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-50/30"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={isLast ? "text-zinc-900 dark:text-zinc-50" : undefined}
              >
                {item.label}
              </span>
            );

          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-x-2">
              {content}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

