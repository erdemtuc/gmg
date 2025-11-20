"use server";

import { CrudResult, FormValues } from "@/features/shared/models/crud-models";
import { apiServer } from "@/infra/http/server";
import { convertFormValuesToApiModel } from "../shared/lib/convert-form-values-to-api-model";
import { CrudResponseApiModel } from "../shared/models/api-crud-models";

export async function createActivityAction(
  values: FormValues,
): Promise<CrudResult> {
  const apiModel = convertFormValuesToApiModel(values);
  const resp = await apiServer<CrudResponseApiModel>(
    "/resource.php?resource_type=task",
    {
      method: "POST",
      body: apiModel,
    },
  );

  if (resp.error) {
    return { ok: false, error: resp.message ?? resp.error };
  }

  return { ok: true, id: resp.id };
}

export async function updateActivityAction(
  activityId: string,
  values: FormValues,
): Promise<CrudResult> {
  const apiModel = convertFormValuesToApiModel(values);
  const resp = await apiServer<CrudResponseApiModel>(
    "/resource.php?resource_type=task",
    {
      method: "POST",
      query: { id: activityId },
      body: apiModel,
    },
  );

  if (resp.error) {
    return { ok: false, error: resp.message ?? resp.error };
  }

  return { ok: true, id: resp.id };
}
