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
  const [visibleFields, setVisibleFields] = useState<{ mainFields: EditField[]; fieldGroups: EditFieldGroup[] }>({
    mainFields: [],
    fieldGroups: [],
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

    // Update visible fields based on new visibility
    setVisibleFields({
      mainFields: mainFields.filter(field => visibility.displayed.has(field.id)),
      fieldGroups: fieldGroups.map(group => ({
        ...group,
        fields: group.fields.filter(field => visibility.displayed.has(field.id))
      }))
    });
  }, [formRenderFunction, currentFieldValues, mainFields, fieldGroups]);

  // Update field values and trigger visibility recalculation
  const updateFieldValues = useCallback((fieldId: string | number, value: any) => {
    setCurrentFieldValues(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  }, []);


  return {
    visibleFields,
    fieldVisibility,
    updateFieldValues,
    currentFieldValues,
  };
}