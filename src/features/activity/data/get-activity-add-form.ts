import "server-only";
import { apiServer } from "@/infra/http/server";
import { ActivityAddForm } from "@/features/shared/models/activity-crud-models";
import { AddFormApiModel } from "@/features/shared/models/api-crud-models";
import { toActivityAddFormModel } from "@/features/shared/lib/to-activity-add-form-model";

export async function getActivityAdd(
  status?: string,
  taskType?: string
): Promise<ActivityAddForm> {
  const apiActivityDetails = await apiServer<AddFormApiModel[]>(
    "/resource.php?resource_type=form&id=task",
    {
      query: { status, task_type: taskType },
    },
  );
  return toActivityAddFormModel(apiActivityDetails[0]);
}
