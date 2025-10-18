import "server-only";
import { ApiError, isApiError } from "../errors";
import { HttpOptionsBase } from "./options-base";
import { getLogger } from "@/infra/logging/server";

export type RawOptions = HttpOptionsBase & {
  accessToken?: string;
  responseType?: "json" | "text";
};

const BASE = process.env.API_BASE_URL ?? "";

function buildUrlWithQuery(
  url: string,
  query: HttpOptionsBase["query"],
): string {
  if (!query || Object.keys(query).length === 0) return url;

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    searchParams.append(key, value === null ? "" : String(value));
  }

  const qs = searchParams.toString();
  if (!qs) return url;

  const hashIndex = url.indexOf("#");
  const base = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : "";
  return base + (base.includes("?") ? "&" : "?") + qs + hash;
}

export async function apiServerRaw<T = unknown>(
  path: string,
  opt: RawOptions = {},
): Promise<T> {
  const logger = getLogger({ mod: "http", fn: "apiServerRaw" });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opt.timeoutMs ?? 10_000);
  const startedAt = Date.now();

  try {
    const requestPath = path.startsWith("http") ? path : `${BASE}${path}`;
    const url = buildUrlWithQuery(requestPath, opt.query);
    const headers: Record<string, string> = {
      "content-type": "application/json",
      ...(opt.headers ?? {}),
    };

    if (opt.accessToken) {
      headers.authorization = `Bearer ${opt.accessToken}`;
    }

    const method = opt.method ?? (opt.body ? "POST" : "GET");
    const res = await fetch(url, {
      method,
      headers,
      body: opt.body ? JSON.stringify(opt.body) : undefined,
      cache: opt.cache ?? "no-store",
      signal: controller.signal,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson =
      opt.responseType === "json" || contentType.includes("application/json");
    const payload = isJson
      ? await res.json().catch(() => ({}))
      : await res.text();

    const durationMs = Date.now() - startedAt;

    if (!res.ok) {
      try {
        logger.error(
          {
            req: { url, method, headers, body: opt.body },
            res: {
              status: res.status,
              headers: Object.fromEntries(res.headers.entries()),
              contentType,
              payload,
              durationMs,
            },
          },
          "HTTP request failed",
        );
      } catch {}
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

    // Log success at debug verbosity
    try {
      logger.debug(
        {
          req: { url, method, headers, body: opt.body },
          res: {
            status: res.status,
            headers: Object.fromEntries(res.headers.entries()),
            contentType,
            payload,
            durationMs,
          },
        },
        "HTTP request succeeded",
      );
    } catch {}

    return payload as unknown as T;
  } catch (err: unknown) {
    if (isApiError(err)) throw err;

    if (err instanceof Error && err.name === "AbortError") {
      try {
        const durationMs = Date.now() - startedAt;
        const method = opt.method ?? (opt.body ? "POST" : "GET");
        logger.error(
          { path, method, err: "AbortError", durationMs },
          "HTTP request aborted",
        );
      } catch {}
      throw new ApiError({
        status: 0,
        code: "timeout",
        description: "Request timed out",
      });
    }

    const description = err instanceof Error ? err.message : "Network error";
    try {
      const durationMs = Date.now() - startedAt;
      const method = opt.method ?? (opt.body ? "POST" : "GET");
      logger.error(
        { path, method, err: description, durationMs },
        "HTTP network error",
      );
    } catch {}
    throw new ApiError({
      status: 0,
      code: "network_error",
      description,
    });
  } finally {
    clearTimeout(timer);
  }
}
