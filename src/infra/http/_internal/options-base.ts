export type HttpOptionsBase = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  cache?: RequestCache;
  query?: Record<string, string | number | boolean | undefined | null>;
};
