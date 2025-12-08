import "server-only";
import { AuthUser } from "@/core/contracts/auth";
import { getRefreshCookie } from "@/infra/auth/cookies-server";
import { getLogger } from "@/infra/logging/server";
import { redirectToLogin } from "../lib/redirect";

// Simple in-memory cache for server components
let cachedUser: AuthUser | null = null;
let cacheExpiry: number | null = null;

// TODO: either add JWT validation or use BFF session without exposing RT or RT to the client
function parseUserFromRefreshToken(refreshToken: string): AuthUser {
  try {
    const payload = JSON.parse(
      Buffer.from(refreshToken.split(".")[1], "base64").toString(),
    );
    const sub = payload.sub as string;
    const parts = sub.split("*");

    return {
      id: parts[1],
      orgId: parts[0],
    };
  } catch {
    throw new Error("Invalid refresh token");
  }
}

export const getAuthUser = async (): Promise<AuthUser> => {
  // Check if we have a cached user and it's still valid (let's say for 1 minute)
  const now = Date.now();
  if (cachedUser && cacheExpiry && now < cacheExpiry) {
    return cachedUser;
  }

  const logger = getLogger({ mod: "auth", fn: "getAuthUser" });

  // Check if auth bypass is enabled
  const bypassAuth = process.env.BYPASS_AUTH === "true" || process.env.BYPASS_AUTH === "1";
  if (bypassAuth) {
    const fakeUser = {
      id: "bypass_user_1",
      orgId: "bypass_org_1",
    };
    // Cache the fake user for 1 minute
    cachedUser = fakeUser;
    cacheExpiry = now + 60000; // 1 minute in milliseconds
    return fakeUser;
  }

  const refreshToken = await getRefreshCookie();
  if (!refreshToken) {
    logger.warn("unauthenticated: missing refresh token");
    if(process.env.ENVIRONMENT === "DEV") {
      const devUser = {
        id: "1",
        orgId: "1",
      };
      // Cache the dev user for 1 minute
      cachedUser = devUser;
      cacheExpiry = now + 60000; // 1 minute in milliseconds
      return devUser;
    }
    return redirectToLogin();
  }
  try {
    const user = parseUserFromRefreshToken(refreshToken!);
    // Cache the user for 1 minute
    cachedUser = user;
    cacheExpiry = now + 60000; // 1 minute in milliseconds
    return user;
  } catch (err) {
    logger.warn({ err }, "unauthenticated: invalid refresh token");
    if(process.env.ENVIRONMENT === "DEV") {
      const devUser = {
        id: "1",
        orgId: "1",
      };
      // Cache the dev user for 1 minute
      cachedUser = devUser;
      cacheExpiry = now + 60000; // 1 minute in milliseconds
      return devUser;
    }
    return redirectToLogin();
  }
};
