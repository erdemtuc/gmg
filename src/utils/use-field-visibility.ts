import { useState, useEffect, useCallback } from 'react';
import { processFieldVisibility, FieldVisibility } from '@/utils/render-function';
import { EditField, EditFieldGroup } from '@/features/shared/models/crud-models';

interface FormField {
  id: string | number;
  type?: string;
  value?: any;
}

interface UseFieldVisibilityProps {
  formRenderFunction?: string;
  mainFields: EditField[];
  fieldGroups: EditFieldGroup[];
}

interface UseFieldVisibilityReturn {
  visibleFields: {
    mainFields: EditField[];
    fieldGroups: EditFieldGroup[];
  };
  fieldVisibility: FieldVisibility;
  updateFieldValues: (fieldId: string | number, value: any) => void;
  currentFieldValues: Record<string | number, any>;
}

/**
 * Custom hook to manage field visibility based on the render function logic
 */
export function useFieldVisibility({
  formRenderFunction,
  mainFields,
  fieldGroups,
}: UseFieldVisibilityProps): UseFieldVisibilityReturn {
  const [currentFieldValues, setCurrentFieldValues] = useState<Record<string | number, any>>({});
  const [fieldVisibility, setFieldVisibility] = useState<FieldVisibility>({
    displayed: new Set(),
    hidden: new Set(),
  });

  // Collect all fields in a flat structure for processing visibility
  const getAllFields = useCallback((): FormField[] => {
    const allFields: FormField[] = [];

    // Add main fields
    mainFields.forEach(field => {
      allFields.push({ id: field.id, type: field.type, value: field.value });
    });

    // Add grouped fields
    fieldGroups.forEach(group => {
      group.fields.forEach(field => {
        allFields.push({ id: field.id, type: field.type, value: field.value });
      });
    });

    return allFields;
  }, [mainFields, fieldGroups]);

  // Update visibility when render function or field values change
  useEffect(() => {
    const allFields = getAllFields();
    const visibility = processFieldVisibility(
      formRenderFunction,
      allFields,
      currentFieldValues
    );
    setFieldVisibility(visibility);
  }, [formRenderFunction, currentFieldValues, getAllFields]);

  // Update field values and trigger visibility recalculation
  const updateFieldValues = useCallback((fieldId: string | number, value: any) => {
    setCurrentFieldValues(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  }, []);

  // Function to get currently visible fields
  const getVisibleFields = useCallback((): { mainFields: EditField[]; fieldGroups: EditFieldGroup[] } => {
    if (!formRenderFunction) {
      // If no render function, show all fields
      return { mainFields, fieldGroups };
    }

    return {
      mainFields: mainFields.filter(field => fieldVisibility.displayed.has(field.id)),
      fieldGroups: fieldGroups.map(group => ({
        ...group,
        fields: group.fields.filter(field => fieldVisibility.displayed.has(field.id))
      }))
    };
  }, [mainFields, fieldGroups, fieldVisibility, formRenderFunction]);

  return {
    visibleFields: getVisibleFields(),
    fieldVisibility,
    updateFieldValues,
    currentFieldValues,
  };
}