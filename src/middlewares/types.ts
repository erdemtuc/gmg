import type { NextRequest, NextFetchEvent } from "next/server";
import type { NextResponse } from "next/server";

export type MiniMiddleware = (
  req: NextRequest,
  ev?: NextFetchEvent,
) => void | NextResponse | Promise<void | NextResponse>;
