import type { NextRequest } from "next/server";
import { chain } from "./middlewares/compose";
import { withAuth } from "./middlewares/withAuth";
import { REFRESH_COOKIE_NAME } from "@/infra/auth/cookies-constants";

const handler = chain(
  withAuth({
    publicRoutes: ["/login", "/api/health"],
    loginPath: "/login",
    cookieName: REFRESH_COOKIE_NAME,
  }),
);

export default async function middleware(req: NextRequest) {
  return await handler(req);
}

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico|robots.txt|sitemap.xml|images|assets).*)",
  ],
};
