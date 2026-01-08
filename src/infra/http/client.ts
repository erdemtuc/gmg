import { ApiError, isApiError } from "./errors";

type GetOptions = {
  timeoutMs?: number; // default 10s
  cache?: RequestCache; // default 'no-store'
  // Optional query params to serialize onto the URL
  query?: Record<string, string | number | boolean | undefined | null>;
  // If you ever need to opt into Next.js fetch options on the client
  next?: NextFetchRequestConfig;
  headers?: Record<string, string>;
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
  console.log("Built URL:", url);
  return url
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
    console.log("Fetching URL:", url);
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

type PostOptions = {
  timeoutMs?: number; // default 10s
  cache?: RequestCache; // default 'no-store'
  body?: unknown;
  headers?: Record<string, string>;
  next?: NextFetchRequestConfig;
};

/**
 * POST fetch to your Next.js API routes (/api/*) from the browser.
 * Sends same-origin cookies automatically; NEVER handles tokens.
 */
export async function apiClientPost<T = unknown>(
  path: string,
  opt: PostOptions = {},
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
    const res = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...opt.headers,
      },
      body: opt.body ? JSON.stringify(opt.body) : undefined,
      cache: opt.cache ?? "no-store",
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

/**
 * GET fetch to external API with Authorization header
 */
export async function apiClientGetExternal<T = unknown>(
  path: string,
  token: string,
  opt: GetOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opt.timeoutMs ?? 10_000);

  try {
    // Build the full URL with query parameters
    const url = new URL(path, "https://api.mybasiccrm.com");
    if (opt.query) {
      Object.entries(opt.query).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        url.searchParams.set(k, String(v));
      });
    }

    console.log("Fetching external URL:", url.toString());
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        ...opt.headers,
      },
      cache: opt.cache ?? "no-store",
      signal: controller.signal,
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
