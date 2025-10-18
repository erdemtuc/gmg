import "server-only";
import {
  ContactDetail,
  Field,
  FieldGroup,
} from "@/features/shared/models/contact-crud-models";
import { apiServer } from "@/infra/http/server";
import { NotFoundError } from "@/features/shared/errors/not-found-error";

export async function getContactDetail(
  contactId: number,
): Promise<ContactDetail> {
  const apiContactDetails = await apiServer<ApiContactDetail[]>(
    "/resource.php?resource_type=contact",
    {
      query: { id: contactId },
    },
  );
  return mapToContactDetail(apiContactDetails[0]);
}

function mapToContactDetail(apiContactDetail: ApiContactDetail): ContactDetail {
  if (!apiContactDetail) {
    throw new NotFoundError("Contact detail not found");
  }

  const fieldGroups: FieldGroup[] = generateFieldGroups(apiContactDetail);

  return {
    id: apiContactDetail.id,
    type: apiContactDetail.fld1,
    name: apiContactDetail.name,
    fieldGroups,
    createdAt: "N/A",
    createdBy: apiContactDetail.other_flds.nameofUseradd,
  };
}

type ApiContactDetail = {
  id: number;
  name: string;
  fld1: string;
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
function generateFieldGroups(apiContactDetail: ApiContactDetail) {
  const fieldGroups: FieldGroup[] = [];
  let currentGroupTitle: string | null = null;
  let accumulatedFields: Field[] = [];

  Object.entries(apiContactDetail.Lines).forEach(([key, value]) => {
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
