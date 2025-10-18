import { toContactAddFormModel } from "@/features/shared/lib/to-contact-add-form-model";
import {
  AddFormApiModel,
  EditFormApiModel,
} from "@/features/shared/models/api-crud-models";
import { ContactEditForm } from "@/features/shared/models/contact-crud-models";
import { apiServer } from "@/infra/http/server";

export async function getContactEdit(
  contactId: string,
): Promise<ContactEditForm> {
  const apiContactDetails = await apiServer<EditFormApiModel[]>(
    "/resource.php?resource_type=contact/edit",
    {
      query: { id: contactId },
    },
  );

  const apiContactEditForm = apiContactDetails[0];
  const apiContactAddForm = apiContactEditForm as AddFormApiModel;
  return {
    ...toContactAddFormModel(apiContactAddForm),
    id: apiContactEditForm.id,
  };
}
