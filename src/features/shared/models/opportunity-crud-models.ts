export interface Opportunity {
  id: number | string;
  name: string;
  status: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  contactId: number | string;
  clientId: number | string;
  createdAt: string;
  createdBy: string;
  Lines: Record<string, string | number | boolean | null>[];
  additionalFields?: Array<{ name: string; value: string | number | boolean | null }>;
}

export interface OpportunityFormData {
  fields: Array<{
    name: string;
    value: string | number | boolean | null;
    type: string;
    required: boolean;
    options?: Array<{ value: string; label: string }>;
  }>;
  rules?: Record<string, any>;
}