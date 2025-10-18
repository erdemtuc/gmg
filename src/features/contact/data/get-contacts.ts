import "server-only";
import { Contact } from "@/features/shared/models/contact-crud-models";
import { apiServer } from "@/infra/http/server";

export async function getContacts(page: number): Promise<Contact[]> {
  const contacts = await apiServer<ApiContact[]>(
    "/resource.php?resource_type=contact",
    {
      query: { page },
    },
  );
  return contacts.map((contact) => ({
    ...contact,
    additionalFields: Object.entries(contact.Lines?.[0] ?? {}).map(
      ([name, value]) => ({ name, value }),
    ),
  }));
}

type ApiContact = {
  id: number;
  name: string;
  type: string;
  Lines: Record<string, string | number | boolean | null>[];
  createdAt: string;
  createdBy: string;
};
