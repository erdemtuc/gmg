import "server-only";
import { apiServer } from "@/infra/http/server";
import {
  ContactAddForm,
  ContactType,
} from "@/features/shared/models/contact-crud-models";
import { AddFormApiModel } from "@/features/shared/models/api-crud-models";
import { toContactAddFormModel } from "@/features/shared/lib/to-contact-add-form-model";

export async function getContactAdd(
  contactType: ContactType | null,
): Promise<ContactAddForm> {
  const apiContactDetails = await apiServer<AddFormApiModel[]>(
    "/resource.php?resource_type=form&id=contact",
    {
      query: { type: contactType },
    },
  );
  return toContactAddFormModel(apiContactDetails[0]);
}
