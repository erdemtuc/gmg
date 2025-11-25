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
  };
}

function mapToEditField(line: LineApiModel): EditField | null {
  const id = line.fid ?? line.fname;
  if (!id) {
    throw new Error("Either field ID or field name is required");
  }

  if (line.fid) {
    if (!line.unit) {
      throw new Error("Unit is required");
    }
    const type = mapType(line.unit);
    if (!type) {
      return null;
    }

    if (!line.label) {
      throw new Error("Label is required");
    }
    const name = line.label!;

    if (OptionRequiredTypes.includes(type) && !line.options) {
      throw new Error("Options are required");
    }
    const options = mapOptions(line);

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
    default:
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
    default:
      return null;
  }
}
