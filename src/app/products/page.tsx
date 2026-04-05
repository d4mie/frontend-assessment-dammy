import { redirect } from "next/navigation";

import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { ProductCard } from "@/features/products/components/ProductCard";
import { SearchFilters } from "@/features/products/components/SearchFilters";
import { getProductCategories, getProductsPage } from "@/lib/dummyjson/products";
import { parseProductsSearchParams, type SearchParams } from "@/features/products/lib/searchParams";
import { buildUrl } from "@/lib/url";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: SearchParams;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { page, q, category } = parseProductsSearchParams(searchParams);

  const categories = await getProductCategories();
  const validCategory = category && categories.some((c) => c.slug === category) ? category : undefined;

  if (category && !validCategory) {
    redirect(
      buildUrl("/products", {
        q,
        page: 1,
      }),
    );
  }

  const productsPage = await getProductsPage({ page, q, category: validCategory });

  if (productsPage.pageCount > 0 && page > productsPage.pageCount) {
    redirect(
      buildUrl("/products", {
        q,
        category: validCategory,
        page: productsPage.pageCount,
      }),
    );
  }

  const start = productsPage.total === 0 ? 0 : (productsPage.page - 1) * productsPage.limit + 1;
  const end = start === 0 ? 0 : start + productsPage.items.length - 1;

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Products
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {productsPage.total === 0
              ? "No results"
              : `Showing ${start.toLocaleString()}–${end.toLocaleString()} of ${productsPage.total.toLocaleString()}`}
          </p>
        </header>

        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <SearchFilters
            key={`${q ?? ""}::${validCategory ?? ""}`}
            categories={categories}
            initialQ={q}
            initialCategory={validCategory}
          />
        </section>

        <section className="mt-8" aria-labelledby="results-heading">
          <h2 id="results-heading" className="sr-only">
            Results
          </h2>
          {productsPage.total === 0 ? (
            <EmptyState
              title="No products found"
              description={
                q || validCategory
                  ? "Try a different search term or broaden your filters."
                  : "No products are available right now."
              }
              resetHref={q || validCategory ? "/products" : undefined}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {productsPage.items.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priorityImage={productsPage.page === 1 && idx < 4}
                  />
                ))}
              </div>

              <div className="mt-10">
                <Pagination
                  page={productsPage.page}
                  pageCount={productsPage.pageCount}
                  q={q}
                  category={validCategory}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

