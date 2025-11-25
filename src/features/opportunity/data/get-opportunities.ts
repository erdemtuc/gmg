import "server-only";
import { Opportunity } from "@/features/shared/models/opportunity-crud-models";
import { apiServer } from "@/infra/http/server";
import { OpportunityFilter, OpportunitySort } from "./get-opportunity-types";

export async function getOpportunities(
  page: number,
  filters?: OpportunityFilter[],
  sort?: OpportunitySort
): Promise<Opportunity[]> {
  // Build query parameters from filters and sort
  const query: Record<string, any> = { 
    resource_type: 'opp',
    page 
  };
  
  if (filters && filters.length > 0) {
    // Convert filters to the expected API format
    filters.forEach((filter, index) => {
      query[`filter[${index}][field]`] = filter.field;
      query[`filter[${index}][operator]`] = filter.operator;
      query[`filter[${index}][value]`] = filter.value;
    });
  }

  if (sort && sort.field) {
    query.sort_by = sort.field;
    query.sort_direction = sort.direction;
  }

  try {
    const opportunities = await apiServer<ApiOpportunity[]>(
      "/resource.php",
      {
        query,
      },
    );

    if (!Array.isArray(opportunities)) {
      console.error('Opportunities is not an array:', opportunities);
      return [];
    }

    return opportunities.map((opp) => ({
      ...opp,
      id: String(opp.id),
      name: opp.name || opp.title || `Opportunity ${opp.id}`,
      status: opp.status || 'Open',
      value: opp.value || 0,
      probability: opp.probability || 0,
      expectedCloseDate: opp.expectedCloseDate || '',
      assignedTo: opp.assignedTo || '',
      contactId: opp.contactId || '',
      clientId: opp.clientId || '',
      createdAt: opp.createdAt || '',
      createdBy: opp.createdBy || '',
      additionalFields: Object.entries(opp.Lines?.[0] ?? {}).map(
        ([name, value]) => ({ name: String(name), value }),
      ),
    }));
  } catch (error) {
    console.error('Error in getOpportunities API call:', error);
    // Return empty array in case of error
    return [];
  }
}

type ApiOpportunity = {
  id: number | string;
  name?: string;
  title?: string; // Some API responses might use title instead
  status?: string;
  value?: number;
  probability?: number;
  expectedCloseDate?: string;
  assignedTo?: string;
  contactId?: number | string;
  clientId?: number | string;
  Lines: Record<string, string | number | boolean | null>[];
  createdAt?: string;
  createdBy?: string;
};