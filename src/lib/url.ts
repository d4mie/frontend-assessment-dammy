export type QueryValue = string | number | boolean | null | undefined;

export function buildUrl(pathname: string, query: Record<string, QueryValue>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    const stringValue = String(value);
    if (!stringValue) continue;
    params.set(key, stringValue);
  }

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

