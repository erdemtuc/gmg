import "server-only";
import { Activity } from "@/features/shared/models/activity-crud-models";
import { apiServer } from "@/infra/http/server";

export async function getActivities(page: number): Promise<Activity[]> {
  const activities = await apiServer<ApiActivity[]>(
    "/resource.php?resource_type=task",
    {
      query: { page },
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
