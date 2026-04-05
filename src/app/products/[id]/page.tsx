import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SmartImage } from "@/components/SmartImage";
import { RelatedProducts, RelatedProductsSkeleton } from "@/features/products/components/RelatedProducts";
import { getProductById } from "@/lib/dummyjson/products";
import { formatPriceUSD } from "@/lib/format";
import { SITE_NAME } from "@/lib/site-copy";

type PageProps = {
  params: Promise<{ id: string }>;
};

function parseId(raw: string) {
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) return { title: "Can’t find that item" };

  try {
    const product = await getProductById(id);
    const image = product.thumbnail || product.images?.[0];

    return {
      title: product.title,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: "Can’t find that item" };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) notFound();

  const product = await getProductById(id).catch(() => notFound());
  const heroImage = product.images[0] ?? product.thumbnail;

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <Breadcrumbs
          items={[
            { label: SITE_NAME, href: "/products" },
            { label: product.title },
          ]}
        />

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <section className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <SmartImage
                src={heroImage}
                alt={product.title}
                width={1200}
                height={900}
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="h-auto w-full object-cover"
              />
            </div>

            {product.images.length > 1 ? (
              <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                {product.images.slice(0, 10).map((src, idx) => (
                  <div
                    key={`${src}-${idx}`}
                    className="shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <SmartImage
                      src={src}
                      alt={`${product.title} image ${idx + 1}`}
                      width={240}
                      height={180}
                      sizes="160px"
                      className="h-24 w-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {product.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                {formatPriceUSD(product.price)}
              </div>
              <div className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                {product.discountPercentage.toFixed(0)}% off
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Shoppers rate it{" "}
                <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-200">
                  {product.rating.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              {product.description}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Maker
                </dt>
                <dd className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">
                  {product.brand}
                </dd>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Aisle
                </dt>
                <dd className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">
                  {product.category}
                </dd>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  On hand
                </dt>
                <dd className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">
                  {product.stock}
                </dd>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  SKU
                </dt>
                <dd className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">
                  {product.sku}
                </dd>
              </div>
            </dl>

            <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Before it arrives
              </h2>
              <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                <li>{product.shippingInformation}</li>
                <li>{product.warrantyInformation}</li>
                <li>{product.returnPolicy}</li>
              </ul>
            </div>
          </section>
        </div>

        {product.reviews.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
              What people are saying
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {product.reviews.slice(0, 4).map((r, idx) => (
                <article
                  key={`${r.reviewerEmail}-${idx}`}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-zinc-950 dark:text-zinc-50">
                        {r.reviewerName}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(r.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold tabular-nums text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      {r.rating.toFixed(0)}/5
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                    {r.comment}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts category={product.category} currentId={product.id} />
        </Suspense>
      </div>
    </div>
  );
}

