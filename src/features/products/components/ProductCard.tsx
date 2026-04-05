import Link from "next/link";

import { SmartImage } from "@/components/SmartImage";
import { formatPriceUSD } from "@/lib/format";
import type { ProductListItem } from "@/types/product";

export type ProductCardProps = {
  product: ProductListItem;
  priorityImage?: boolean;
};

export function ProductCard({ product, priorityImage = false }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-zinc-50/30"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <SmartImage
          src={product.thumbnail}
          alt={product.title}
          width={800}
          height={600}
          priority={priorityImage}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-pretty text-base font-semibold leading-snug text-zinc-950 dark:text-zinc-50">
            {product.title}
          </h3>
          <div className="shrink-0 text-sm font-semibold tabular-nums text-zinc-950 dark:text-zinc-50">
            {formatPriceUSD(product.price)}
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Avg. rating
            </dt>
            <dd className="font-medium tabular-nums">{product.rating.toFixed(2)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              On hand
            </dt>
            <dd className="font-medium tabular-nums">{product.stock}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Aisle
            </dt>
            <dd className="font-medium">{product.category}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center justify-between gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="truncate">{product.brand}</span>
          <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {product.discountPercentage.toFixed(0)}% off
          </span>
        </div>
      </div>
    </Link>
  );
}

