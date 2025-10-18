import "server-only";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const DEFAULT_REDIRECT = "/dashboard";

export function safeRedirect(next: unknown): never {
  redirect(validateRedirectPath(next, DEFAULT_REDIRECT));
}

export async function redirectToLogin(
  next?: unknown,
  loginPath: string = "/login",
): Promise<never> {
  const detected = next ?? (await determineNextPath());
  const nextPath = validateRedirectPath(detected, "/");
  const target = withNextParam(loginPath, nextPath);
  redirect(target);
}

function validateRedirectPath(raw: unknown, fallback: string): string {
  if (typeof raw !== "string") return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;

  const disallowed = ["/api", "/_next"];
  if (disallowed.some((p) => raw.startsWith(p))) return fallback;

  return raw;
}

function withNextParam(loginPath: string, nextPath: string): string {
  const hasQuery = loginPath.includes("?");
  const sep = hasQuery ? "&" : "?";
  return `${loginPath}${sep}next=${encodeURIComponent(nextPath)}`;
}

async function determineNextPath(): Promise<string> {
  try {
    const h = await headers();
    const referer = h.get("referer");
    if (referer) {
      const url = new URL(referer);
      return url.pathname + url.search;
    }
  } catch {
    // no-op
  }
  return "/";
}
