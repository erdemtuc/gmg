import type { MiniMiddleware } from "./types";
import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

/** Runs mini-middlewares in order; stops at the first that returns a response. */
export function chain(...mws: MiniMiddleware[]) {
  return async (req: NextRequest, ev?: NextFetchEvent) => {
    for (const mw of mws) {
      const res = await mw(req, ev);
      if (res) return res;
    }
    return NextResponse.next();
  };
}
