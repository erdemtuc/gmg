import { useState, useCallback } from 'react';

export interface OpportunityFilter {
  field: string;
  operator: string;
  value: string;
}

export interface OpportunitySort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface OpportunityFiltersState {
  filters: OpportunityFilter[];
  sort: OpportunitySort | null;
}

export const useOpportunityFilters = () => {
  const [filters, setFilters] = useState<OpportunityFilter[]>([]);
  const [sort, setSort] = useState<OpportunitySort | null>(null);

  const addFilter = useCallback((filter: OpportunityFilter) => {
    setFilters(prev => [...prev, filter]);
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateFilter = useCallback((index: number, filter: OpportunityFilter) => {
    setFilters(prev => prev.map((f, i) => i === index ? filter : f));
  }, []);

  const setSortBy = useCallback((sortBy: OpportunitySort) => {
    setSort(sortBy);
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters([]);
    setSort(null);
  }, []);

  return {
    filters,
    sort,
    addFilter,
    removeFilter,
    updateFilter,
    setSortBy,
    clearAllFilters,
  };
};