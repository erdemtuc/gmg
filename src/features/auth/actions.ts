"use server";
import { loginSchema, type LoginInput } from "./schema";
import { apiServer } from "@/infra/http/server";
import { isApiError } from "@/infra/http/errors";
import { AccessResp, RefreshResp } from "@/core/contracts/auth";
import { clearAuthCookies, setAuthCookies } from "@/infra/auth/cookies-server";
import { redirectToLogin, safeRedirect } from "../shared/lib/redirect";
import { getAuthUser } from "../shared/services/auth-user";
import { revalidateTag } from "next/cache";

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function loginAction({
  email,
  password,
  next,
}: {
  email: string;
  password: string;
  next?: string;
}): Promise<LoginResult | undefined> {
  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: first?.message ?? "Invalid data." };
  }

  try {
    // Use the API credentials for authentication instead of user credentials
    const API_USER = process.env.API_USER || "abc@xx.com";
    const API_PASSWORD = process.env.API_PASSWORD || "1qaz2wsx";
    const basic = Buffer.from(`${API_USER}:${API_PASSWORD}`, "utf8").toString(
      "base64"
    );

    // Use the correct endpoint for JWT authentication
    const response = await apiServer<any>("/jwt.php", { // Using any since response format might vary
      method: "POST",
      headers: {
        authorization: `Basic ${basic}`,
        "Content-Type": "application/json"
      },
      body: { email, password }, // Send user credentials in the request body
      auth: "omit",
    });

    // The response might contain both access and refresh tokens
    // Handle different possible response formats
    const access_token = response.access_token || response.accessToken;
    const refresh_token = response.refresh_token || response.refreshToken || response.access_token || response.accessToken;
    const expires_in = response.expires_in || response.expiresIn || 3600; // default to 1 hour

    if (!access_token) {
      throw new Error("No access token received from server");
    }

    // Store the received tokens
    await setAuthCookies({
      access: { token: access_token, expiresIn: expires_in },
      refresh: { token: refresh_token || access_token, expiresIn: expires_in },
    });
  } catch (e) {
    if (isApiError(e)) {
      console.error("Login error:", e);
      return { ok: false, error: e.description || "Login failed." };
    }
    console.error("Unexpected error:", e);
    return { ok: false, error: "Unexpected error." };
  }

  safeRedirect(next);
}

export async function logoutAction(): Promise<void> {
  // No need to revalidate user data on logout since user will be logged out
  // const authUser = await getAuthUser();
  // revalidateTag(`user:${authUser.id}`);

  await clearAuthCookies();

  redirectToLogin();
}
