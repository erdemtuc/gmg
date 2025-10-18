export type ApiErrorInit = {
  status: number;
  code?: string; // e.g. "invalid_grant", "rate_limited"
  description?: string; // human-readable message
  raw?: unknown; // raw parsed body for diagnostics
};

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly description?: string;
  readonly raw?: unknown;

  constructor(init: ApiErrorInit) {
    super(init.description || init.code || `HTTP ${init.status}`);
    this.name = "ApiError";
    this.status = init.status;
    this.code = init.code;
    this.description = init.description;
    this.raw = init.raw;
  }
}

export function isApiError(e: unknown): e is ApiError {
  return (
    e instanceof ApiError ||
    (typeof e === "object" && e !== null && (e as Error).name === "ApiError")
  );
}

export function isUnauthorized(e: unknown): boolean {
  return isApiError(e) && e.status === 401;
}
