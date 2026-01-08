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
    createdBy: apiContactDetail.other_flds?.nameofUseradd || "Unknown",
  };
}

type ApiContactDetail = {
  id: number;
  name: string;
  fld1: string;
  other_flds?: ApiOtherFields;
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
function generateFieldGroups(apiContactDetail: ApiContactDetail) {
  const fieldGroups: FieldGroup[] = [];
  let currentGroup: FieldGroup | null = null;
  const processedFnames = new Set(); // To track which fname fields we've processed

  // Process each line in the Lines array
  for (const line of apiContactDetail.Lines || []) {
    // Check if this line defines a new tab/group
    if (line.Tab_name) {
      // If we already have a group with fields, save it
      if (currentGroup && currentGroup.fields.length > 0) {
        fieldGroups.push(currentGroup);
      }
      // Start a new group
      currentGroup = {
        groupTitle: line.Tab_name,
        fields: []
      };
    }
    // Check if this is a standard field with fname and label
    else if (line.fname && line.label) {
      // Create a field using the label as the display name (and possibly fname as a backup)
      const field: Field = {
        name: line.label, // Use the human-readable label
        value: line.value,
        multi: line.multi // Include the multi property to indicate if field supports multiple values
      };

      // If we're in a group, add to it; otherwise, create a default group
      if (currentGroup) {
        currentGroup.fields.push(field);
      } else {
        // Create a default group for fields that don't have a Tab_name
        if (!fieldGroups.length) {
          currentGroup = {
            groupTitle: "General Information",
            fields: [field]
          };
        } else {
          // Add to the last group or create a new generic one
          if (fieldGroups[fieldGroups.length - 1].groupTitle === "General Information") {
            fieldGroups[fieldGroups.length - 1].fields.push(field);
          } else {
            fieldGroups.push({
              groupTitle: "General Information",
              fields: [field]
            });
          }
        }
      }
      processedFnames.add(line.fname);
    }
    // Handle fields with fid (form field IDs)
    else if (line.fid && line.label) {
      const field: Field = {
        name: line.label, // Use the human-readable label
        value: line.value,
        multi: line.multi // Include the multi property to indicate if field supports multiple values
      };

      if (currentGroup) {
        currentGroup.fields.push(field);
      } else {
        // Create a default group for fid-based fields
        if (fieldGroups.length) {
          fieldGroups[fieldGroups.length - 1].fields.push(field);
        } else {
          fieldGroups.push({
            groupTitle: "Additional Information",
            fields: [field]
          });
        }
      }
    }
  }

  // Don't forget to add the last group if it exists and has fields
  if (currentGroup && currentGroup.fields.length > 0) {
    fieldGroups.push(currentGroup);
  }

  // If no groups were created at all, create a default one with all fields
  if (fieldGroups.length === 0) {
    const allFields = (apiContactDetail.Lines || [])
      .filter(line => line.label || line.fname)
      .map(line => ({
        name: line.label || line.fname || 'Unknown Field',
        value: line.value,
        multi: line.multi // Include the multi property to indicate if field supports multiple values
      }));

    if (allFields.length > 0) {
      fieldGroups.push({
        groupTitle: "Contact Information",
        fields: allFields
      });
    }
  }

  return fieldGroups;
}
