import "server-only";
import {
  ActivityDetail,
  Field,
  FieldGroup,
} from "@/features/shared/models/activity-crud-models";
import { apiServer } from "@/infra/http/server";
import { NotFoundError } from "@/features/shared/errors/not-found-error";

export async function getActivityDetail(
  activityId: number,
): Promise<ActivityDetail> {
  const apiActivityDetails = await apiServer<ApiActivityDetail[]>(
    "/resource.php?resource_type=task",
    {
      query: { id: activityId },
    },
  );
  return mapToActivityDetail(apiActivityDetails[0]);
}

function mapToActivityDetail(apiActivityDetail: ApiActivityDetail): ActivityDetail {
  if (!apiActivityDetail) {
    throw new NotFoundError("Activity detail not found");
  }

  const fieldGroups: FieldGroup[] = generateFieldGroups(apiActivityDetail);

  return {
    id: apiActivityDetail.id,
    name: apiActivityDetail.name,
    status: apiActivityDetail.status,
    fieldGroups,
    createdAt: "N/A",
    createdBy: apiActivityDetail.other_flds?.nameofUseradd || "Unknown",
  };
}

type ApiActivityDetail = {
  id: number;
  name: string;
  status: string;
  other_flds: ApiOtherFields;
  Lines: Array<{
    fname?: string;
    fid?: string;
    label?: string;
    value: any;
    unit?: string;
    multi?: number;
    Tab_name?: string; // For field groups
    alternativeLabel?: string;
  }>;
};

type ApiOtherFields = {
  nameofUseradd: string;
  userIDContactadd: number;
};

function generateFieldGroups(apiActivityDetail: ApiActivityDetail) {
  const fieldGroups: FieldGroup[] = [];
  let currentGroupTitle: string | null = null;
  let accumulatedFields: Field[] = [];

  // Handle the Lines array structure similar to contacts
  for (const line of apiActivityDetail.Lines || []) {
    if (line.Tab_name) {
      if (currentGroupTitle !== null) {
        fieldGroups.push({
          groupTitle: currentGroupTitle,
          fields: accumulatedFields,
        });
      }
      currentGroupTitle = line.Tab_name;
      accumulatedFields = [];
    } else {
      // Add field with multi property if it exists
      const field: Field = {
        name: line.label || line.fname || line.fid || 'unknown',
        value: line.value,
        multi: line.multi
      };
      if (currentGroupTitle !== null) {
        accumulatedFields.push(field);
      } else {
        // Create a default group if no group is defined
        fieldGroups.push({
          groupTitle: "Details",
          fields: [field]
        });
        currentGroupTitle = "Details";
      }
    }
  }

  if (currentGroupTitle !== null) {
    fieldGroups.push({
      groupTitle: currentGroupTitle,
      fields: accumulatedFields,
    });
  }
  return fieldGroups;
}
