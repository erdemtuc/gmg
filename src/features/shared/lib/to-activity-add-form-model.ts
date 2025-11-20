import { AddFormApiModel, LineApiModel } from "../models/api-crud-models";
import { ActivityAddForm } from "../models/activity-crud-models";
import {
  EditField,
  EditFieldGroup,
  EditFieldType,
  Option,
} from "../models/crud-models";

export function toActivityAddFormModel(
  apiActivityAddForm: AddFormApiModel,
): ActivityAddForm {
  const mainFields: (EditField | null)[] = [];
  const fieldGroups: EditFieldGroup[] = [];
  let currentGroupTitle: string | null = null;
  let currentGroupFields: (EditField | null)[] = [];

  apiActivityAddForm.Lines.forEach((line: LineApiModel) => {
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

    mainFields.push(editField);
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
  const idValue = line.fid ?? line.fname;
  if (!idValue) return null;
  const id = String(idValue);

  if (line.fid) {
     const type = mapType(line.unit || "text");
     if (!type) return null;
     return {
         id,
         type,
         name: line.label ? String(line.label) : String(id),
         isMulti: line.multi === 1,
         options: mapOptions(line),
         value: line.value ?? null,
     };
  }

  switch (id) {
    case "descrip":
      return { id, type: "textarea", name: "Description", value: line.value ?? null };
    case "Datetimedue":
      return { id, type: "datetime-local", name: "Due Date", value: line.value ?? null };
    case "taskstatus":
      return { id, type: "select", name: "Status", options: mapOptions(line), value: line.value ?? null };
    case "typeTaskid":
      return { id, type: "select", name: "Task Type", options: mapOptions(line), value: line.value ?? null };
    default:
       return { id, type: "text", name: String(id), value: line.value ?? null };
  }
}

function mapOptions(line: LineApiModel): Option[] | undefined {
  return line.options?.map((option) => ({
    value: option.option,
    id: option.id,
  }));
}

function mapType(type: string): EditFieldType | null {
  switch (type) {
    case "text": return "text";
    case "number": return "number";
    case "radio": return "radio";
    case "list": return "select";
    default: return "text";
  }
}
