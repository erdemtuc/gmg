export interface OpportunityFilter {
  field: string;
  operator: string;
  value: string;
}

export interface OpportunitySort {
  field: string;
  direction: 'asc' | 'desc';
}