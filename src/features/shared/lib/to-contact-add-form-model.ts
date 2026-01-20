import { AddFormApiModel, LineApiModel } from "../models/api-crud-models";
import { ContactAddForm } from "../models/contact-crud-models";
import {
  EditField,
  EditFieldGroup,
  EditFieldType,
  OptionRequiredTypes,
} from "../models/crud-models";

export function toContactAddFormModel(
  apiContactAddForm: AddFormApiModel,
): ContactAddForm {
  const mainFields: (EditField | null)[] = [];
  const fieldGroups: EditFieldGroup[] = [];
  let currentGroupTitle: string | null = null;
  let currentGroupFields: (EditField | null)[] = [];

  apiContactAddForm.Lines.forEach((line: LineApiModel, index: number) => {
    if (line.Tab_name) {
      if (currentGroupTitle) {
        fieldGroups.push({
          groupTitle: currentGroupTitle,
          fields: currentGroupFields.filter(
            (field): field is EditField => field !== null,
          ),
        });
      }
      currentGroupTitle = line.Tab_name;
      currentGroupFields = [];
      return;
    }

    const editField = mapToEditField(line);
    if (currentGroupTitle) {
      currentGroupFields.push(editField);
      return;
    }

    if (index < 2) {
      mainFields.push(editField);
      return;
    }

    currentGroupTitle = "Details";
    currentGroupFields.push(editField);
  });

  if (currentGroupTitle !== null) {
    fieldGroups.push({
      groupTitle: currentGroupTitle,
      fields: currentGroupFields.filter(
        (field): field is EditField => field !== null,
      ),
    });
  }

  return {
    mainFields: mainFields.filter(
      (field): field is EditField => field !== null,
    ),
    fieldGroups,
    renderfnc: apiContactAddForm.renderfnc,
  };
}

function mapToEditField(line: LineApiModel): EditField | null {
  const id = line.fid ?? line.fname;
  if (!id) {
    throw new Error("Either field ID or field name is required");
  }

  if (line.fid) {
    if (!line.unit) {
      // If no unit is specified, treat as text field
      return {
        id,
        type: "text",
        name: String(line.label || id),
        label: line.label,
        isMulti: line.multi === 1,
        value: line.value ?? null,
      };
    }

    const type = mapType(line.unit);
    if (!type) {
      // If the unit type isn't recognized, default to text
      return {
        id,
        type: "text",
        name: String(line.label || id),
        label: line.label,
        isMulti: line.multi === 1,
        value: line.value ?? null,
      };
    }

    if (!line.label) {
      throw new Error("Label is required");
    }
    const name = line.label!;

    let options = undefined;
    if (OptionRequiredTypes.includes(type)) {
      if (!line.options) {
        // If options are required but not provided, create a default empty array
        options = [];
      } else {
        options = mapOptions(line);
      }
    }

    return {
      id,
      type,
      name,
      isMulti: line.multi === 1,
      options,
      value: line.value ?? null,
    };
  }

  switch (id) {
    case "organizationType":
      return {
        id,
        type: "text",
        name: id,
        value: line.value ?? null,
      };
    case "organizationTypeId":
      return {
        id,
        type: "select",
        name: id,
        options: mapOptions(line),
        value: line.value ?? null,
      };
    case "type":
      return {
        id,
        type: "radio",
        name: id,
        value: line.value ?? null,
        options: [
          {
            value: "O",
            id: "O",
          },
          {
            value: "P",
            id: "P",
          },
        ],
      };
    case "address":
      return {
        id,
        type: "textarea",
        name: id,
        value: line.value ?? null,
      };
    case "organizationName":
      return {
        id,
        type: "text",
        name: id,
        value: line.value ?? null,
      };
    case "organizationID":
      return {
        id,
        type: "text",
        name: id,
        value: line.value ?? null,
      };
    case "name":
      return {
        id,
        type: "text",
        name: id,
        value: line.value ?? null,
      };
    case "email":
      return {
        id,
        type: "text",
        name: id,
        value: line.value ?? null,
      };
    case "phone":
      return {
        id,
        type: "text",
        name: id,
        value: line.value ?? null,
      };
    case "title":
      return {
        id,
        type: "select",
        name: id,
        options: mapOptions(line),
        value: line.value ?? null,
      };
    case "FulNmxConn":
      return {
        id,
        type: "text",
        name: id,
        label: line.label || "Person's Name",
        value: line.value ?? null,
      };
    case "typeContact":
      return {
        id,
        type: "select",
        name: id,
        label: line.label || "Person Type",
        options: mapOptions(line),
        value: line.value ?? null,
      };
    case "email":
      return {
        id,
        type: "text",
        name: id,
        label: line.label || "Email",
        value: line.value ?? null,
      };
    case "organizationContact":
      return {
        id,
        type: "text",
        name: id,
        label: line.label || "Working for",
        value: line.value ?? null,
      };
    case "jobTitle":
      return {
        id,
        type: "text",
        name: id,
        label: line.label || "Job Title",
        value: line.value ?? null,
      };
    case "address":
      return {
        id,
        type: "textarea",
        name: id,
        label: line.label || "Address",
        value: line.value ?? null,
      };
    case "city":
      return {
        id,
        type: "text",
        name: id,
        label: line.label || "City",
        value: line.value ?? null,
      };
    case "state":
      return {
        id,
        type: "text",
        name: id,
        label: line.label || "State",
        value: line.value ?? null,
      };
    case "country":
      return {
        id,
        type: "text",
        name: id,
        label: line.label || "Country",
        value: line.value ?? null,
      };
    case "zip":
      return {
        id,
        type: "text",
        name: id,
        label: line.label || "ZIP Code",
        value: line.value ?? null,
      };
    case "notes":
      return {
        id,
        type: "textarea",
        name: id,
        label: line.label || "Notes",
        value: line.value ?? null,
      };
    case "position":
      return {
        id,
        type: "text",
        name: id,
        label: line.label || "Actual Location",
        value: line.value ?? null,
      };
    default:
      // Handle fields that have a label but weren't matched by specific cases
      if (line.label) {
        // Determine type based on unit property
        let type: EditFieldType = "text"; // default type

        if (line.unit) {
          switch (line.unit) {
            case "radio":
              type = "radio";
              break;
            case "list":
              type = "select";
              break;
            case "textarea":
              type = "textarea";
              break;
            case "number":
              type = "number";
              break;
            case "checkbox":
              type = "checkbox";
              break;
            case "datetime-local":
              type = "datetime-local";
              break;
            default:
              type = "text";
          }
        }

        return {
          id,
          type,
          name: String(id),
          label: line.label,
          options: type === "select" || type === "radio" ? mapOptions(line) : undefined,
          isMulti: line.multi === 1,
          value: line.value ?? null,
        };
      }
      return null;
  }
}

function mapOptions(line: LineApiModel) {
  return line.options?.map((option) => ({
    value: option.option,
    id: option.id,
  }));
}

function mapType(type: string): EditFieldType | null {
  switch (type) {
    case "text":
      return "text";
    case "number":
      return "number";
    case "radio":
      return "radio";
    case "list":
      return "select";
    case "textarea":
      return "textarea";
    case "checkbox":
      return "checkbox";
    case "datetime-local":
      return "datetime-local";
    case "tuser":
      return "select"; // Map tuser to select since it's typically a user selection
    case "contact":
      return "select"; // Map contact to select since it's typically a contact selection
    case "note":
      return "textarea"; // Map note to textarea
    case "button":
      return "select"; // Map button to select since it's typically a selection
    default:
      return null;
  }
}
