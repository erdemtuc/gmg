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
  return contacts.map((contact) => {
    // Extract additional fields from Lines array
    // Each line object has field names as keys and field values as values
    const additionalFields = (contact.Lines || []).flatMap((lineObj: any) => {
      // Convert each object in Lines array to an array of field objects
      return Object.entries(lineObj).map(([name, value]: [string, any]) => ({
        name,
        value: value !== undefined && value !== null ? value as string | number | boolean : null,
        multi: undefined // Set multi to undefined since we don't have this info from the current structure
      }));
    }).filter(field => field.name && field.name !== 'unknown'); // Filter out unknown fields

    return {
      ...contact,
      additionalFields,
    };
  });
}

type ApiContact = {
  id: number;
  name: string;
  type: string;
  Lines: Array<Record<string, any>>;
  createdAt: string;
  createdBy: string;
};
