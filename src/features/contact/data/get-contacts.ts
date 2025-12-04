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
    // Extract additional fields from Lines array, using label as the display name
    const additionalFields = (contact.Lines || []).map((line: any) => {
      // Use label if available, otherwise use fname or fid as fallback
      const name = line.label || line.fname || line.fid || 'unknown';
      const value = line.value !== undefined ? line.value : '';
      return {
        name,
        value
      };
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
  Lines: Array<{
    fname?: string;
    fid?: string;
    label?: string;
    value: any;
    unit?: string;
    multi?: number;
    alternativeLabel?: string;
  }>;
  createdAt: string;
  createdBy: string;
};
