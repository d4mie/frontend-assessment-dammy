export type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function normalize(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export type ProductsSearchState = {
  page: number;
  q?: string;
  category?: string;
};

export function parseProductsSearchParams(searchParams: SearchParams): ProductsSearchState {
  const pageRaw = first(searchParams.page);
  const pageParsed = pageRaw ? Number.parseInt(pageRaw, 10) : NaN;
  const page = Number.isFinite(pageParsed) && pageParsed > 0 ? pageParsed : 1;

  const q = normalize(first(searchParams.q));
  const category = normalize(first(searchParams.category));

  return { page, q, category };
}

