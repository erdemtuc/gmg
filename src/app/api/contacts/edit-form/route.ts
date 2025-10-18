export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isApiError } from "@/infra/http/errors";
import { getContactEdit } from "@/features/contact/data/get-contact-edit-form";

export async function GET(req: Request): Promise<NextResponse> {
  const url = new URL(req.url);
  const contactId = url.searchParams.get("id");

  if (!contactId) {
    return NextResponse.json(
      {
        error: "missing_contact_id",
        error_description: "Contact ID is required",
        status: 400,
      },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  try {
    const form = await getContactEdit(contactId);
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
