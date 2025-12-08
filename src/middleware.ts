// TODO: Next.js 15.5+ deprecation warning - middleware will be replaced by proxy in Next.js 16
// For now, keeping as middleware to maintain auth functionality
// Future migration should move auth logic to data layer and use proxy for routing only
import { NextResponse, type NextRequest } from "next/server";
import { chain } from "./middlewares/compose";
import { withAuth } from "./middlewares/withAuth";
import { REFRESH_COOKIE_NAME } from "@/infra/auth/cookies-constants";

export default async function middleware(req: NextRequest) {
  // Check if auth bypass is enabled at the middleware level
  const bypassAuth = process.env.BYPASS_AUTH === "true" || process.env.BYPASS_AUTH === "1";

  if (bypassAuth) {
    // If bypass is enabled, allow all requests without authentication
    // Just ensure the auth cookie is set so the frontend knows there's a "user"
    const response = NextResponse.next();
    const hasToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;

    if (!hasToken) {
      response.cookies.set(REFRESH_COOKIE_NAME, "bypass_fake_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
        sameSite: "strict",
      });
    }
    return response;
  }

  // Use the original withAuth functionality when bypass is not enabled
  const handler = chain(
    withAuth({
      publicRoutes: ["/login", "/api/health"],
      loginPath: "/login",
      cookieName: REFRESH_COOKIE_NAME,
    }),
  );

  return await handler(req);
}

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico|robots.txt|sitemap.xml|images|assets).*)",
  ],
};
