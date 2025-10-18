import { EditField, EditFieldGroup } from "./crud-models";

export type Contact = {
  id: number;
  name: string;
  type: string;
  additionalFields: Field[];
  createdAt: string;
  createdBy: string;
};

export type ContactDetail = {
  id: number;
  name: string;
  type: string;
  fieldGroups: FieldGroup[];
  createdAt: string;
  createdBy: string;
};

export type Field = {
  name: string;
  value: string | number | boolean | null;
};

export type FieldGroup = {
  groupTitle: string;
  fields: Field[];
};

export type ContactType = "O" | "P";

export interface ContactAddForm {
  mainFields: EditField[];
  fieldGroups: EditFieldGroup[];
}

export interface ContactEditForm extends ContactAddForm {
  id: string;
}

/**
 * Extracts the contact type from ContactEditForm data by searching through
 * mainFields and fieldGroups for a field with id = "type"
 */
export function getContactTypeFromForm(
  form: ContactEditForm,
): ContactType | null {
  // Search in mainFields
  const mainFieldType = form.mainFields?.find((field) => field.id === "type");
  if (mainFieldType?.value) {
    return mainFieldType.value === "O" || mainFieldType.value === "P"
      ? (mainFieldType.value as ContactType)
      : null;
  }

  // Search in fieldGroups
  for (const group of form.fieldGroups || []) {
    const groupFieldType = group.fields?.find((field) => field.id === "type");
    if (groupFieldType?.value) {
      return groupFieldType.value === "O" || groupFieldType.value === "P"
        ? (groupFieldType.value as ContactType)
        : null;
    }
  }

  return null;
}
