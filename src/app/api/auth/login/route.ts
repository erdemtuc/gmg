import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/features/auth/schema";
import { apiServer } from "@/infra/http/server";
import { isApiError } from "@/infra/http/errors";
import { setAuthCookies } from "@/infra/auth/cookies-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: first?.message ?? "Invalid data." },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Use the API credentials for authentication
    const API_USER = process.env.API_USER || "abc@xx.com";
    const API_PASSWORD = process.env.API_PASSWORD || "1qaz2wsx";
    const basic = Buffer.from(`${API_USER}:${API_PASSWORD}`, "utf8").toString(
      "base64"
    );

    // Call the JWT authentication endpoint
    const response = await apiServer<any>("/api/jwt.php", {
      method: "POST",
      headers: {
        authorization: `Basic ${basic}`,
        "Content-Type": "application/json"
      },
      body: { email, password },
      auth: "omit",
    });

    // Extract tokens from response
    const access_token = response.access_token || response.accessToken;
    const refresh_token = response.refresh_token || response.refreshToken || response.access_token || response.accessToken;
    const expires_in = response.expires_in || response.expiresIn || 3600;

    if (!access_token) {
      return NextResponse.json(
        { ok: false, error: "No access token received from server" },
        { status: 500 }
      );
    }

    // Store the received tokens
    await setAuthCookies({
      access: { token: access_token, expiresIn: expires_in },
      refresh: { token: refresh_token || access_token, expiresIn: expires_in },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (isApiError(e)) {
      console.error("Login error:", e);
      return NextResponse.json(
        { ok: false, error: e.description || "Login failed." },
        { status: e.status || 500 }
      );
    }
    console.error("Unexpected error:", e);
    return NextResponse.json(
      { ok: false, error: "Unexpected error." },
      { status: 500 }
    );
  }
}
