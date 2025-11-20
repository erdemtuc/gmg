export type FormValues = Record<string | number, unknown>;

export type CrudResult =
  | { ok: true; id?: number }
  | { ok: false; error: string };

export type EditFieldType =
  | "text"
  | "number"
  | "textarea"
  | "radio"
  | "select"
  | "search"
  | "datetime-local";

export type EditField = {
  id: string | number;
  type: EditFieldType;
  name: string;
  options?: Option[];
  isMulti?: boolean;
  listResource?: string;
  value: string | number | boolean | null;
};

export type Option = {
  value: string;
  id: string | number;
};

export const OptionRequiredTypes: EditFieldType[] = ["radio", "select"];

export type EditFieldGroup = {
  groupTitle: string;
  fields: EditField[];
};
