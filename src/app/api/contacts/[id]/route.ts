export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isApiError } from "@/infra/http/errors";
import { getContactDetail } from "@/features/contact/data/get-contact-detail";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id: idParam } = await params;
  const parsed = Number(idParam);
  const id = Number.isFinite(parsed) && parsed > 0 ? parsed : NaN;

  if (!Number.isFinite(id)) {
    return NextResponse.json(
      {
        error: "invalid_id",
        error_description: "Contact id must be a positive number",
        status: 400,
      },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  try {
    const detail = await getContactDetail(id);
    return NextResponse.json(detail, {
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
