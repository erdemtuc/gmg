import { useState, useCallback } from 'react';

export interface ActivityFilter {
  field: string;
  operator: string;
  value: string;
}

export interface ActivitySort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ActivityFiltersState {
  filters: ActivityFilter[];
  sort: ActivitySort | null;
}

export const useActivityFilters = () => {
  const [filters, setFilters] = useState<ActivityFilter[]>([]);
  const [sort, setSort] = useState<ActivitySort | null>(null);

  const addFilter = useCallback((filter: ActivityFilter) => {
    setFilters(prev => [...prev, filter]);
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateFilter = useCallback((index: number, filter: ActivityFilter) => {
    setFilters(prev => prev.map((f, i) => i === index ? filter : f));
  }, []);

  const setSortBy = useCallback((sortBy: ActivitySort) => {
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