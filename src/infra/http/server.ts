import "server-only";
import { ApiError, isUnauthorized } from "./errors";
import { apiServerRaw, RawOptions } from "./_internal/raw";
import {
  clearAuthCookies,
  getAccessCookie,
  getRefreshCookie,
  setAccessCookie,
} from "../auth/cookies-server";
import { HttpOptionsBase } from "./_internal/options-base";
import { AccessResp } from "@/core/contracts/auth";
import { getLogger } from "@/infra/logging/server";

export type HttpOptions = HttpOptionsBase & {
  auth?: "include" | "omit";
};

// Prevent concurrent refresh requests per user; key by refresh token
const refreshInFlightByToken = new Map<string, Promise<string>>();

export async function apiServer<T = unknown>(
  path: string,
  opt: HttpOptions = {},
): Promise<T> {
  const requiredAuth = opt.auth !== "omit";
  if (!requiredAuth) {
    return apiServerRaw<T>(path, toRawOptions(opt));
  }

  let accessToken = await getAccessCookie();
  if (!accessToken) {
    getLogger({ mod: "http", fn: "apiServer" }).debug(
      "no access token, attempting refresh",
    );
    accessToken = await tryRefreshToken();
  }

  try {
    return apiServerRaw<T>(path, toRawOptions(opt, accessToken));
  } catch (err) {
    if (isUnauthorized(err)) {
      getLogger({ mod: "http", fn: "apiServer" }).warn(
        { path },
        "401 with access token, attempting refresh",
      );
      accessToken = await tryRefreshToken();
    } else {
      throw err;
    }
  }

  return apiServerRaw<T>(path, toRawOptions(opt, accessToken));
}

async function tryRefreshToken(): Promise<string> {
  const refreshToken = await getRefreshCookie();
  if (!refreshToken) {
    getLogger({ mod: "auth", fn: "tryRefreshToken" }).warn(
      "missing refresh token",
    );
    throw new ApiError({ status: 401, code: "unauthorized" });
  }

  const existing = refreshInFlightByToken.get(refreshToken);
  if (existing) return existing;

  const promise = (async () => {
    const logger = getLogger({ mod: "auth", fn: "tryRefreshToken" });
    logger.debug("refresh started");
    const accessResp = await apiServerRaw<AccessResp>("/jwtAccessToken.php", {
      method: "POST",
      accessToken: refreshToken,
    });

    await setAccessCookie({
      token: accessResp.access_token,
      expiresIn: accessResp.expires_in,
    });

    logger.info("refresh succeeded");
    return accessResp.access_token;
  })();

  refreshInFlightByToken.set(refreshToken, promise);

  try {
    return await promise;
  } catch (err) {
    if (isUnauthorized(err)) {
      getLogger({ mod: "auth", fn: "tryRefreshToken" }).warn(
        "refresh unauthorized; clearing cookies",
      );
      await clearAuthCookies();
    }
    getLogger({ mod: "auth", fn: "tryRefreshToken" }).error(
      { err },
      "refresh failed",
    );
    throw err;
  } finally {
    // Clear the in-flight state for this specific token after completion
    const current = refreshInFlightByToken.get(refreshToken);
    if (current === promise) {
      refreshInFlightByToken.delete(refreshToken);
    }
  }
}

function toRawOptions(opt: HttpOptions, accessToken?: string): RawOptions {
  return {
    method: opt.method,
    headers: opt.headers,
    body: opt.body,
    timeoutMs: opt.timeoutMs,
    cache: opt.cache,
    accessToken,
    responseType: "json",
    query: opt.query,
  };
}
