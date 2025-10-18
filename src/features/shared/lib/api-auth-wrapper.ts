import "server-only";
import { apiServer, type HttpOptions } from "@/infra/http/server";
import { isUnauthorized } from "@/infra/http/errors";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export type AuthHttpOptions = HttpOptions & {
  onUnauthorized?: "redirect" | "throw";
  /**
   * Explicit path to return to after login (e.g. "/crm/dashboard?tab=1").
   * If not provided, will use the Referer header when available.
   */
  nextPath?: string;
  /**
   * Custom login path if different from the default ("/login").
   */
  loginPath?: string;
};

export async function apiAuth<T = unknown>(
  path: string,
  opt: AuthHttpOptions = {},
): Promise<T> {
  try {
    return await apiServer<T>(path, opt);
  } catch (err) {
    if (!isUnauthorized(err)) throw err;

    const behavior = opt.onUnauthorized ?? "redirect";
    if (behavior === "throw") throw err;

    const nextPath = await determineNextPath(opt.nextPath);
    const loginPath = opt.loginPath ?? "/login";
    const target = withNextParam(loginPath, nextPath);
    redirect(target);
  }
}

async function determineNextPath(explicit?: string): Promise<string> {
  if (explicit) return explicit;
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

function withNextParam(loginPath: string, nextPath: string): string {
  const hasQuery = loginPath.includes("?");
  const sep = hasQuery ? "&" : "?";
  return `${loginPath}${sep}next=${encodeURIComponent(nextPath)}`;
}
