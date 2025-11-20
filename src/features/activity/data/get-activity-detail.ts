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
  Lines: Record<
    string,
    | string
    | number
    | boolean
    | undefined
    | null
    | Record<string, string | number | boolean | null>
  >;
};

type ApiOtherFields = {
  nameofUseradd: string;
  userIDContactadd: number;
};

function generateFieldGroups(apiActivityDetail: ApiActivityDetail) {
  const fieldGroups: FieldGroup[] = [];
  let currentGroupTitle: string | null = null;
  let accumulatedFields: Field[] = [];

  Object.entries(apiActivityDetail.Lines || {}).forEach(([key, value]) => {
    if (!isNaN(Number(key))) {
      const valueObj = value as Record<Field["name"], Field["value"]>;
      if ("Tab_name" in valueObj) {
        if (currentGroupTitle !== null) {
          fieldGroups.push({
            groupTitle: currentGroupTitle,
            fields: accumulatedFields,
          });
        }
        currentGroupTitle = valueObj.Tab_name as string;
        accumulatedFields = [];
      } else if (currentGroupTitle !== null) {
        for (const [k, v] of Object.entries(valueObj)) {
          accumulatedFields.push({ name: k, value: v });
        }
      }
    }
  });

  if (currentGroupTitle !== null) {
    fieldGroups.push({
      groupTitle: currentGroupTitle,
      fields: accumulatedFields,
    });
  }
  return fieldGroups;
}
