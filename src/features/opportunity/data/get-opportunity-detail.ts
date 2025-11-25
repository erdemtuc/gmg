import "server-only";
import { OpportunityFormData } from "@/features/shared/models/opportunity-crud-models";
import { apiServer } from "@/infra/http/server";

export async function getOpportunityDetail(
  id: string | number
): Promise<OpportunityFormData> {
  const response = await apiServer<Record<string, any>>(
    "/resource.php",
    {
      query: {
        resource_type: 'opp',
        id,
      },
    },
  );

  // Transform the API response to our form data structure
  const fields = Object.entries(response).map(([key, value]) => ({
    name: key,
    value: value,
    type: typeof value,
    required: false, // This would come from API metadata in a real implementation
  }));

  return {
    fields,
  };
}