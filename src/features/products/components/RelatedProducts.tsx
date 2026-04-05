import { getProductsPage } from "@/lib/dummyjson/products";
import { ProductCard } from "./ProductCard";

type RelatedProductsProps = {
  category: string;
  currentId: number;
};

export async function RelatedProducts({ category, currentId }: RelatedProductsProps) {
  const res = await getProductsPage({ page: 1, limit: 8, category });
  const related = res.items.filter((p) => p.id !== currentId).slice(0, 4);

  if (related.length === 0) return null;

  const aisle = category.replaceAll("-", " ");

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        Also on the shelf · <span className="capitalize">{aisle}</span>
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export function RelatedProductsSkeleton() {
  return (
    <section className="mt-10">
      <div className="h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-4 grid animate-pulse grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="aspect-[4/3] w-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-6 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

