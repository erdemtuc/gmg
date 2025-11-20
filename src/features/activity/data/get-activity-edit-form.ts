import { toActivityAddFormModel } from "@/features/shared/lib/to-activity-add-form-model";
import {
  AddFormApiModel,
  EditFormApiModel,
} from "@/features/shared/models/api-crud-models";
import { ActivityEditForm } from "@/features/shared/models/activity-crud-models";
import { apiServer } from "@/infra/http/server";

export async function getActivityEdit(
  activityId: string,
): Promise<ActivityEditForm> {
  const apiActivityDetails = await apiServer<EditFormApiModel[]>(
    "/resource.php?resource_type=task/edit",
    {
      query: { id: activityId },
    },
  );

  const apiActivityEditForm = apiActivityDetails[0];
  const apiActivityAddForm = apiActivityEditForm as AddFormApiModel;
  return {
    ...toActivityAddFormModel(apiActivityAddForm),
    id: apiActivityEditForm.id,
  };
}
