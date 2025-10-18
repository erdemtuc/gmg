import { FormValues } from "../models/crud-models";
import { AddCreateFieldApiModel } from "../models/api-crud-models";

export function convertFormValuesToApiModel(
  formValues: FormValues,
): AddCreateFieldApiModel[] {
  const result: AddCreateFieldApiModel[] = [];

  for (const [key, value] of Object.entries(formValues)) {
    const field = {
      [Number.isInteger(Number(key)) ? "fid" : "fname"]: key as string,
      value: value as string | string[],
    } as AddCreateFieldApiModel;
    result.push(field);
  }

  return result;
}
