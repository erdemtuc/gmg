import { EditField, EditFieldGroup } from "./crud-models";

export type Activity = {
  id: number;
  name: string; // Assuming 'name' or 'title' is returned. Doc says 'descrip' for create.
  status: string;
  dueDate: string;
  assignedTo: string;
  additionalFields: Field[];
  createdAt: string;
  createdBy: string;
};

export type ActivityDetail = {
  id: number;
  name: string;
  status: string;
  fieldGroups: FieldGroup[];
  createdAt: string;
  createdBy: string;
};

export type Field = {
  name: string;
  label?: string;
  value: string | number | boolean | null;
  multi?: number; // Indicates if field supports multiple values (1 for true, 0 or undefined for false)
};

export type FieldGroup = {
  groupTitle: string;
  fields: Field[];
};

export interface ActivityAddForm {
  mainFields: EditField[];
  fieldGroups: EditFieldGroup[];
  renderfnc?: string;
}

export interface ActivityEditForm extends ActivityAddForm {
  id: string;
}
