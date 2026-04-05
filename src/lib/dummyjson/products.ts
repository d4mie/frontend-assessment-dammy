import type { PaginatedResponse } from "@/types/dummyjson";
import type { Product, ProductCategory, ProductListItem } from "@/types/product";
import { dummyJsonFetch } from "./client";

const DEFAULT_LIMIT = 20;
const LIST_SELECT = [
  "id",
  "title",
  "price",
  "discountPercentage",
  "rating",
  "stock",
  "brand",
  "category",
  "thumbnail",
] as const;

type ProductsResponse<TItem> = PaginatedResponse<TItem, "products">;

export type ProductsPage<TItem> = {
  items: TItem[];
  total: number;
  page: number;
  pageCount: number;
  limit: number;
};

export type GetProductsParams = {
  page: number;
  limit?: number;
  q?: string;
  category?: string;
};

function normalizeParam(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function listSelectParam() {
  return LIST_SELECT.join(",");
}

export async function getProductCategories() {
  return dummyJsonFetch<ProductCategory[]>("/products/categories", {
    next: { revalidate: 60 * 60 * 24 },
  });
}

export async function getProductById(id: number) {
  return dummyJsonFetch<Product>(`/products/${id}`, {
    next: { revalidate: 60 * 60 },
  });
}

export async function getProductsPage({
  page,
  limit = DEFAULT_LIMIT,
  q,
  category,
}: GetProductsParams): Promise<ProductsPage<ProductListItem>> {
  const normalizedQ = normalizeParam(q);
  const normalizedCategory = normalizeParam(category);
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : DEFAULT_LIMIT;
  const skip = (safePage - 1) * safeLimit;
  const select = listSelectParam();

  if (normalizedCategory && normalizedQ) {
    // DummyJSON doesn’t support "search within category" via query params.
    // Fetch the (small) category set and filter server-side to keep URLs shareable.
    const res = await dummyJsonFetch<ProductsResponse<ProductListItem>>(
      `/products/category/${encodeURIComponent(normalizedCategory)}?limit=1000&skip=0&select=${encodeURIComponent(select)}`,
      { next: { revalidate: 60 * 60 } },
    );

    const qLower = normalizedQ.toLowerCase();
    const filtered = res.products.filter((p) =>
      `${p.title} ${p.brand}`.toLowerCase().includes(qLower),
    );

    const total = filtered.length;
    const pageCount = total > 0 ? Math.ceil(total / safeLimit) : 0;
    const items = filtered.slice(skip, skip + safeLimit);

    return { items, total, page: safePage, pageCount, limit: safeLimit };
  }

  if (normalizedCategory) {
    const res = await dummyJsonFetch<ProductsResponse<ProductListItem>>(
      `/products/category/${encodeURIComponent(normalizedCategory)}?limit=${safeLimit}&skip=${skip}&select=${encodeURIComponent(select)}`,
      { next: { revalidate: 60 * 60 } },
    );

    return {
      items: res.products,
      total: res.total,
      page: safePage,
      pageCount: Math.ceil(res.total / safeLimit),
      limit: safeLimit,
    };
  }

  if (normalizedQ) {
    const res = await dummyJsonFetch<ProductsResponse<ProductListItem>>(
      `/products/search?q=${encodeURIComponent(normalizedQ)}&limit=${safeLimit}&skip=${skip}&select=${encodeURIComponent(select)}`,
      { cache: "no-store" },
    );

    return {
      items: res.products,
      total: res.total,
      page: safePage,
      pageCount: Math.ceil(res.total / safeLimit),
      limit: safeLimit,
    };
  }

  const res = await dummyJsonFetch<ProductsResponse<ProductListItem>>(
    `/products?limit=${safeLimit}&skip=${skip}&select=${encodeURIComponent(select)}`,
    { next: { revalidate: 60 * 60 } },
  );

  return {
    items: res.products,
    total: res.total,
    page: safePage,
    pageCount: Math.ceil(res.total / safeLimit),
    limit: safeLimit,
  };
}

