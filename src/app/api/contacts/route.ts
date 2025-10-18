export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isApiError } from "@/infra/http/errors";
import { getContacts } from "@/features/contact/data/get-contacts";

export async function GET(req: Request): Promise<NextResponse> {
  const url = new URL(req.url);
  const rawPage = url.searchParams.get("page");
  const parsed = rawPage ? Number(rawPage) : 1;
  const page = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;

  try {
    const contacts = await getContacts(page);

    return NextResponse.json(contacts, {
      status: 200,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (err: unknown) {
    if (isApiError(err)) {
      return NextResponse.json(
        {
          error: err.code || "api_error",
          error_description: err.description || "Request failed",
          status: err.status,
        },
        {
          status: err.status || 500,
          headers: { "Cache-Control": "private, no-store" },
        },
      );
    }

    return NextResponse.json(
      {
        error: "internal_error",
        error_description: err instanceof Error ? err.message : "Unknown error",
        status: 500,
      },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
