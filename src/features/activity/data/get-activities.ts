import "server-only";
import { Activity } from "@/features/shared/models/activity-crud-models";
import { apiServer } from "@/infra/http/server";

// Define filter and sort types
export interface ActivityFilter {
  field: string;
  operator: string;
  value: string;
}

export interface ActivitySort {
  field: string;
  direction: 'asc' | 'desc';
}

export async function getActivities(
  page: number,
  filters?: ActivityFilter[],
  sort?: ActivitySort
): Promise<Activity[]> {
  // Build query parameters from filters and sort
  const query: Record<string, any> = { page };

  if (filters && filters.length > 0) {
    filters.forEach((filter, index) => {
      query[`filter[${index}][field]`] = filter.field;
      query[`filter[${index}][operator]`] = filter.operator;
      query[`filter[${index}][value]`] = filter.value;
    });
  }

  if (sort && sort.field) {
    query['sort'] = `${sort.field}:${sort.direction}`;
  }

  const activities = await apiServer<ApiActivity[]>(
    "/resource.php?resource_type=task",
    {
      query,
    },
  );
  return activities.map((activity) => ({
    ...activity,
    additionalFields: Object.entries(activity.Lines?.[0] ?? {}).map(
      ([name, value]) => ({ name, value }),
    ),
  }));
}

type ApiActivity = {
  id: number;
  name: string;
  status: string;
  dueDate: string;
  assignedTo: string;
  Lines: Record<string, string | number | boolean | null>[];
  createdAt: string;
  createdBy: string;
};
