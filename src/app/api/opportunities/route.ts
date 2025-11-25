import { NextRequest, NextResponse } from "next/server";
import { getOpportunities } from "@/features/opportunity/data/get-opportunities";
import { getAuthUser } from "@/features/shared/services/auth-user";
import { OpportunityFilter, OpportunitySort } from "@/features/opportunity/data/get-opportunity-types";

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    await getAuthUser();
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? 1);

  // Extract filter parameters
  const filters: OpportunityFilter[] = [];
  let filterIndex = 0;
  while (searchParams.has(`filter[${filterIndex}][field]`)) {
    const field = searchParams.get(`filter[${filterIndex}][field]`);
    const operator = searchParams.get(`filter[${filterIndex}][operator]`);
    const value = searchParams.get(`filter[${filterIndex}][value]`);

    if (field && operator && value !== null) {
      filters.push({
        field,
        operator,
        value,
      });
    }
    filterIndex++;
  }

  // Extract sort parameter
  let sort: OpportunitySort | undefined;
  const sortField = searchParams.get('sort');
  const sortDirection = searchParams.get('direction') || 'asc';

  if (sortField && (sortDirection === 'asc' || sortDirection === 'desc')) {
    sort = {
      field: sortField,
      direction: sortDirection
    };
  }

  try {
    const opportunities = await getOpportunities(page, filters, sort);
    return NextResponse.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { error: "Failed to fetch opportunities" },
      { status: 500 }
    );
  }
}