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
    additionalFields: (activity.Lines || []).map((line: any) => ({
      name: line.label || line.fname || line.fid || 'unknown',
      value: line.value,
      multi: line.multi // Include the multi property to indicate if field supports multiple values
    })).filter((field: any) => field.name && field.name !== 'unknown'),
  }));
}

type ApiActivity = {
  id: number;
  name: string;
  status: string;
  dueDate: string;
  assignedTo: string;
  Lines: Array<{
    fname?: string;
    fid?: string;
    label?: string;
    value: any;
    unit?: string;
    multi?: number;
    alternativeLabel?: string;
  }>;
  createdAt: string;
  createdBy: string;
};
