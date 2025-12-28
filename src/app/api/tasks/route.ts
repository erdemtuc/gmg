export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isApiError } from "@/infra/http/errors";
import { apiServer } from "@/infra/http/server";

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    
    // Extract query parameters to pass to the external API
    const resourceType = url.searchParams.get("resource_type") || "task";
    const contactId = url.searchParams.get("contact_id");
    const sort_by = url.searchParams.get("sort_by");
    const filter = url.searchParams.get("filter");
    
    // Build query parameters for the external API call
    const queryParams: Record<string, string> = { resource_type: resourceType };
    
    if (contactId) queryParams.contact_id = contactId;
    if (sort_by) queryParams.sort_by = sort_by;
    if (filter) queryParams.filter = filter;

    const tasks = await apiServer<any>(
      "/resource.php",
      {
        query: queryParams,
      }
    );

    return NextResponse.json(tasks, {
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