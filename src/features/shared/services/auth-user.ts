import "server-only";
import { cache } from "react";
import { AuthUser } from "@/core/contracts/auth";
import { getRefreshCookie } from "@/infra/auth/cookies-server";
import { getLogger } from "@/infra/logging/server";
import { redirectToLogin } from "../lib/redirect";

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

export const getAuthUser = cache(async (): Promise<AuthUser> => {
  const logger = getLogger({ mod: "auth", fn: "getAuthUser" });
  const refreshToken = await getRefreshCookie();
  if (!refreshToken) {
    logger.warn("unauthenticated: missing refresh token");
    return redirectToLogin();
  }
  try {
    return parseUserFromRefreshToken(refreshToken!);
  } catch (err) {
    logger.warn({ err }, "unauthenticated: invalid refresh token");
    return redirectToLogin();
  }
});
