import { ApiError, isApiError } from "./errors";

type GetOptions = {
  timeoutMs?: number; // default 10s
  cache?: RequestCache; // default 'no-store'
  // Optional query params to serialize onto the URL
  query?: Record<string, string | number | boolean | undefined | null>;
  // If you ever need to opt into Next.js fetch options on the client
  next?: NextFetchRequestConfig;
};

/**
 * Builds a URL like `/api/contacts?search=x&page=2`
 */
function withQuery(path: string, query?: GetOptions["query"]) {
  if (!query) return path;
  const url = new URL(
    path,
    typeof window !== "undefined" ? window.location.origin : "http://localhost",
  );
  Object.entries(query).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    url.searchParams.set(k, String(v));
  });
  // Return only the path + search (keeps it relative)
  return url.pathname + url.search;
}

/**
 * GET-only fetch to your Next.js API routes (/api/*) from the browser.
 * Sends same-origin cookies automatically; NEVER handles tokens.
 */
export async function apiClientGet<T = unknown>(
  path: string,
  opt: GetOptions = {},
): Promise<T> {
  if (!path.startsWith("/api/")) {
    throw new ApiError({
      status: 0,
      code: "invalid_path",
      description: "Client can only call /api/* routes",
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opt.timeoutMs ?? 10_000);

  try {
    const url = withQuery(path, opt.query);

    const res = await fetch(url, {
      method: "GET", // enforce GET
      cache: opt.cache ?? "no-store",
      // Send cookies for same-origin requests (includes your HttpOnly session)
      credentials: "same-origin",
      signal: controller.signal,
      next: opt.next,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson
      ? await res.json().catch(() => ({}))
      : await res.text();

    if (!res.ok) {
      const code = (isJson && (payload?.error as string)) || undefined;

      const description =
        (isJson && (payload?.error_description as string)) ||
        (typeof payload === "string" ? payload : undefined) ||
        undefined;

      throw new ApiError({
        status: res.status,
        code,
        description,
        raw: payload,
      });
    }

    return payload as unknown as T;
  } catch (err: unknown) {
    if (isApiError(err)) throw err;

    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError({
        status: 0,
        code: "timeout",
        description: "Request timed out",
      });
    }

    const description = err instanceof Error ? err.message : "Network error";
    throw new ApiError({
      status: 0,
      code: "network_error",
      description,
    });
  } finally {
    clearTimeout(timer);
  }
}
