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

export async function loginAction(
  form: LoginInput,
  next: string | undefined,
): Promise<LoginResult | undefined> {
  const parsed = loginSchema.safeParse(form);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: first?.message ?? "Invalid data." };
  }
  const { email, password } = parsed.data;

  try {
    const basic = Buffer.from(`${email}:${password}`, "utf8").toString(
      "base64",
    );
    const refresh = await apiServer<RefreshResp>("/jwtRefreshToken.php", {
      method: "POST",
      headers: { authorization: `Basic ${basic}` },
      auth: "omit",
    });

    const access = await apiServer<AccessResp>("/jwtAccessToken.php", {
      method: "POST",
      headers: { authorization: `Bearer ${refresh.refresh_token}` },
      auth: "omit",
    });

    await setAuthCookies({
      access: { token: access.access_token, expiresIn: access.expires_in },
      refresh: { token: refresh.refresh_token, expiresIn: refresh.expires_in },
    });
  } catch (e) {
    if (isApiError(e)) {
      return { ok: false, error: "Login failed." };
    }
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
