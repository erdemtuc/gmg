import "server-only";
import { cookies } from "next/headers";
import { isLocal } from "@/config/env";
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from "./cookies-constants";

type TokenInput = {
  token: string;
  expiresIn: number; // seconds
};

function getCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true as const,
    secure: !isLocal,
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.max(1, Math.floor(maxAgeSeconds || 0)),
  };
}

export async function getAccessCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE_NAME)?.value || null;
}

export async function getRefreshCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE_NAME)?.value || null;
}

export async function setAuthCookies(args: {
  access?: TokenInput;
  refresh?: TokenInput;
}): Promise<void> {
  const store = await cookies();

  if (args.access) {
    store.set(
      ACCESS_COOKIE_NAME,
      args.access.token,
      getCookieOptions(args.access.expiresIn),
    );
  }

  if (args.refresh) {
    store.set(
      REFRESH_COOKIE_NAME,
      args.refresh.token,
      getCookieOptions(args.refresh.expiresIn),
    );
  }
}

export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE_NAME);
  store.delete(REFRESH_COOKIE_NAME);
}

export async function setAccessCookie(access: TokenInput): Promise<void> {
  await setAuthCookies({ access });
}

export async function setRefreshCookie(refresh: TokenInput): Promise<void> {
  await setAuthCookies({ refresh });
}
