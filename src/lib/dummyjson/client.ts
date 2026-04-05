const DEFAULT_BASE_URL = "https://dummyjson.com";

function getBaseUrl() {
  const raw = process.env.DUMMYJSON_BASE_URL;
  return (raw && raw.length > 0 ? raw : DEFAULT_BASE_URL).replace(/\/$/, "");
}

function toUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getBaseUrl()}${normalized}`;
}

export async function dummyJsonFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = toUrl(path);
  const headers = new Headers(init?.headers);
  if (!headers.has("accept")) headers.set("accept", "application/json");

  const res = await fetch(url, { ...init, headers });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const details = body ? `\n\n${body.slice(0, 300)}` : "";
    throw new Error(
      `DummyJSON request failed: ${res.status} ${res.statusText}\n${url}${details}`,
    );
  }

  return (await res.json()) as T;
}

