import "server-only";
import { OpportunityFormData } from "@/features/shared/models/opportunity-crud-models";
import { apiServer } from "@/infra/http/server";

export async function getOpportunityAddForm(
  clientId?: string | number,
  statusTypeId?: string | number
): Promise<OpportunityFormData> {
  const query: Record<string, any> = {
    resource_type: 'form',
    id: 'opportunity',
  };

  if (clientId) {
    query.client_id = clientId;
  }
  if (statusTypeId) {
    query.statustype = statusTypeId;
  }

  const response = await apiServer<Record<string, any>>(
    "/resource.php",
    {
      query,
    },
  );

  // Transform the API response to our form data structure
  const fields = Object.entries(response).map(([key, value]) => ({
    name: key,
    value: "",
    type: typeof value,
    required: false,
  }));

  return {
    fields,
  };
}