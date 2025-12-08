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

    // Only update state if visibility has actually changed
    setFieldVisibility(prevVisibility => {
      // Compare the previous visibility with the new one
      if (areFieldVisibilityEqual(prevVisibility, visibility)) {
        return prevVisibility; // No change, return previous to prevent re-render
      }
      return visibility;
    });

    // Update visible fields based on new visibility
    setVisibleFields(prevVisibleFields => {
      // Check if the visible fields have actually changed
      const newMainFields = mainFields.filter(field => visibility.displayed.has(field.id));
      const newFieldGroups = fieldGroups.map(group => ({
        ...group,
        fields: group.fields.filter(field => visibility.displayed.has(field.id))
      }));

      // Only return new object if there are actual changes
      if (areVisibleFieldsEqual(prevVisibleFields, { mainFields: newMainFields, fieldGroups: newFieldGroups })) {
        return prevVisibleFields;
      }

      return {
        mainFields: newMainFields,
        fieldGroups: newFieldGroups
      };
    });
  }, [formRenderFunction, currentFieldValues, getAllFields, mainFields, fieldGroups]);

  // Helper function to compare FieldVisibility objects
  const areFieldVisibilityEqual = useCallback((a: FieldVisibility, b: FieldVisibility) => {
    if (a.displayed.size !== b.displayed.size || a.hidden.size !== b.hidden.size) {
      return false;
    }

    for (const id of a.displayed) {
      if (!b.displayed.has(id)) return false;
    }

    for (const id of a.hidden) {
      if (!b.hidden.has(id)) return false;
    }

    return true;
  }, []);

  // Helper function to compare visible fields objects
  const areVisibleFieldsEqual = useCallback((a: { mainFields: EditField[]; fieldGroups: EditFieldGroup[] },
                                           b: { mainFields: EditField[]; fieldGroups: EditFieldGroup[] }) => {
    if (a.mainFields.length !== b.mainFields.length || a.fieldGroups.length !== b.fieldGroups.length) {
      return false;
    }

    // Check if main fields have the same ids in the same order
    for (let i = 0; i < a.mainFields.length; i++) {
      if (a.mainFields[i].id !== b.mainFields[i].id) return false;
    }

    // Check if field groups have the same structure
    for (let i = 0; i < a.fieldGroups.length; i++) {
      const groupA = a.fieldGroups[i];
      const groupB = b.fieldGroups[i];

      if (groupA.groupTitle !== groupB.groupTitle || groupA.fields.length !== groupB.fields.length) {
        return false;
      }

      for (let j = 0; j < groupA.fields.length; j++) {
        if (groupA.fields[j].id !== groupB.fields[j].id) return false;
      }
    }

    return true;
  }, []);

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