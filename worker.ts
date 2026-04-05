// Custom Worker entrypoint to extend the OpenNext-generated handler.
// See https://opennext.js.org/cloudflare/howtos/custom-worker

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore `.open-next/worker.js` is generated at build time
import opennext from "./.open-next/worker.js";

// The re-export is only required if your app uses the DO Queue / Tag Cache.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore `.open-next/worker.js` is generated at build time
export { BucketCachePurge, DOQueueHandler, DOShardedTagCache } from "./.open-next/worker.js";

type CfCache = Cache;

function getDefaultCache(): CfCache {
  return (caches as unknown as { default: CfCache }).default;
}

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function normalizeCacheUrl(url: URL) {
  const normalized = new URL(url.toString());
  normalized.search = "";

  const entries = Array.from(url.searchParams.entries()).sort(([ak, av], [bk, bv]) => {
    const keyCmp = ak.localeCompare(bk);
    return keyCmp !== 0 ? keyCmp : av.localeCompare(bv);
  });

  for (const [k, v] of entries) normalized.searchParams.append(k, v);
  return normalized.toString();
}

function computeProductsTtlSeconds(url: URL) {
  // Keep search results fresher than the default listing.
  return url.searchParams.get("q") ? 30 : 300;
}

function withCacheStatus(
  res: Response,
  status: "HIT" | "MISS" | "BYPASS",
  opts?: { isHead?: boolean; ttlSeconds?: number },
) {
  const headers = new Headers(res.headers);
  headers.set("x-cache-status", status);

  if (opts?.ttlSeconds) {
    headers.set(
      "Cache-Control",
      `public, max-age=0, s-maxage=${opts.ttlSeconds}, stale-while-revalidate=30`,
    );
  }

  return new Response(opts?.isHead ? null : res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

function isBypassableRequest(request: Request) {
  // Avoid caching personalized responses.
  return Boolean(request.headers.get("authorization") || request.headers.get("cookie"));
}

const worker = {
  async fetch(
    request: Request,
    env: unknown,
    ctx: { waitUntil: (promise: Promise<unknown>) => void },
  ) {
    const url = new URL(request.url);
    const pathname = normalizePathname(url.pathname);

    const isProductsListing = pathname === "/products";
    const isHead = request.method === "HEAD";
    const effectiveMethod = isHead ? "GET" : request.method;

    if (!isProductsListing || effectiveMethod !== "GET" || isBypassableRequest(request)) {
      const res = await opennext.fetch(request, env, ctx);
      return isProductsListing ? withCacheStatus(res, "BYPASS", { isHead }) : res;
    }

    const cache = getDefaultCache();
    const cacheKey = new Request(normalizeCacheUrl(url), { method: "GET" });

    const cached = await cache.match(cacheKey);
    if (cached) return withCacheStatus(cached, "HIT", { isHead });

    const ttlSeconds = computeProductsTtlSeconds(url);
    const originReq = isHead ? new Request(request.url, { method: "GET", headers: request.headers }) : request;
    const originRes: Response = await opennext.fetch(originReq, env, ctx);

    const setCookie = originRes.headers.get("set-cookie");
    const cacheable = originRes.status === 200 && !setCookie;
    if (!cacheable) return withCacheStatus(originRes, "BYPASS", { isHead });

    const toCache = originRes.clone();
    const cacheHeaders = new Headers(toCache.headers);
    cacheHeaders.delete("x-cache-status");
    cacheHeaders.set(
      "Cache-Control",
      `public, max-age=0, s-maxage=${ttlSeconds}, stale-while-revalidate=30`,
    );

    ctx.waitUntil(
      cache.put(
        cacheKey,
        new Response(toCache.body, {
          status: toCache.status,
          statusText: toCache.statusText,
          headers: cacheHeaders,
        }),
      ),
    );

    return withCacheStatus(originRes, "MISS", { isHead, ttlSeconds });
  },
};

export default worker;

