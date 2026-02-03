import { useState, useMemo, useCallback } from 'react';
import { EditFieldGroup } from '@/features/shared/models/crud-models';

interface SearchableField {
  id: string | number;
  name: string;
  value: any;
  type: string;
}

interface SearchableGroup {
  groupTitle: string;
  fields: SearchableField[];
}

export interface VisibleFieldsResult {
  mainFields: any[];
  fieldGroups: EditFieldGroup[];
}

export const useModalSearch = <T extends { fieldGroups?: EditFieldGroup[]; mainFields?: any[] }>(data: T | undefined, visibleFields: VisibleFieldsResult | undefined) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm || !visibleFields) {
      return visibleFields;
    }

    const term = searchTerm.toLowerCase();

    // Filter main fields if they exist
    const filteredMainFields = visibleFields.mainFields?.filter(field =>
      field.name.toLowerCase().includes(term) ||
      String(field.value || '').toLowerCase().includes(term)
    );

    // Filter field groups and their fields
    const filteredFieldGroups = visibleFields.fieldGroups?.map(group => {
      const filteredFields = group.fields.filter(field =>
        field.name.toLowerCase().includes(term) ||
        String(field.value || '').toLowerCase().includes(term)
      );

      return {
        ...group,
        fields: filteredFields
      };
    }).filter(group => group.fields.length > 0); // Only keep groups that have matching fields

    return {
      mainFields: filteredMainFields,
      fieldGroups: filteredFieldGroups
    };
  }, [visibleFields, searchTerm]);

  // Memoize the setSearchTerm function to prevent unnecessary re-renders
  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return {
    searchTerm,
    setSearchTerm: handleSetSearchTerm,
    filteredData,
    hasResults: searchTerm ? (filteredData?.fieldGroups?.some(g => g.fields.length > 0) ||
                             (filteredData?.mainFields && filteredData.mainFields.length > 0)) : true
  };
};