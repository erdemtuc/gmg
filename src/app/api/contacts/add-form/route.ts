export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isApiError } from "@/infra/http/errors";
import { getContactAdd } from "@/features/contact/data/get-contact-add-form";
import type { ContactType } from "@/features/shared/models/contact-crud-models";

export async function GET(req: Request): Promise<NextResponse> {
  const url = new URL(req.url);
  const rawType = url.searchParams.get("type");
  const type = (
    rawType === "O" || rawType === "P" ? rawType : null
  ) as ContactType | null;

  try {
    const form = await getContactAdd(type);
    return NextResponse.json(form, {
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
