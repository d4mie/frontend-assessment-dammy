"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { buildUrl } from "@/lib/url";
import type { ProductCategory } from "@/types/product";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export type SearchFiltersProps = {
  categories: ProductCategory[];
  initialQ?: string;
  initialCategory?: string;
};

export function SearchFilters({ categories, initialQ, initialCategory }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputId = useId();
  const selectId = useId();

  const [q, setQ] = useState(initialQ ?? "");
  const [category, setCategory] = useState(initialCategory ?? "");

  const debouncedQ = useDebouncedValue(q, 400);

  useEffect(() => {
    const qTrimmed = debouncedQ.trim();
    const currentQ = searchParams.get("q") ?? "";
    const currentCategory = searchParams.get("category") ?? "";

    if (qTrimmed === currentQ && category === currentCategory) return;

    router.push(
      buildUrl("/products", {
        page: 1,
        q: qTrimmed || undefined,
        category: category || undefined,
      }),
    );
  }, [debouncedQ, category, router, searchParams]);

  const clear = () => {
    setQ("");
    setCategory("");
    router.push("/products");
  };

  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_16rem_auto] sm:items-end">
      <div className="grid gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Search
        </label>
        <input
          id={inputId}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title or brand…"
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-zinc-600"
        />
      </div>

      <div className="grid gap-2">
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
        >
          Category
        </label>
        <select
          id={selectId}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={clear}
        className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:focus-visible:ring-zinc-50/30"
      >
        Clear
      </button>
    </div>
  );
}

