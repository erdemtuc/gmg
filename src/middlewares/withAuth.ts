import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Options = {
  publicRoutes?: string[];
  loginPath: string;
  cookieName: string;
};

const matchPath = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(prefix + "/");

export function withAuth(opts: Options) {
  const { publicRoutes, loginPath, cookieName } = opts;

  return (req: NextRequest) => {
    const { pathname, search } = req.nextUrl;

    const token = req.cookies.get(cookieName)?.value;

    // If user is already logged in and tries to access the login page, redirect to dashboard
    if (token && matchPath(pathname, loginPath)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const requiresAuth =
      !publicRoutes || !publicRoutes.some((p) => matchPath(pathname, p));
    if (!requiresAuth) {
      return;
    }

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = loginPath;
      url.searchParams.set("next", pathname + search); // preserve target
      return NextResponse.redirect(url);
    }

    // allow
    return;
  };
}
