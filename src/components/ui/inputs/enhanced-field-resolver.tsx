import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { FieldResolver as OriginalFieldResolver } from '@/components/ui/inputs/field-resolver';
import { EditField } from '@/features/shared/models/crud-models';

interface EnhancedFieldResolverProps {
  field: EditField;
  value: any;
  onValueChange: (fieldId: string | number, value: any) => void;
}

export function EnhancedFieldResolver({ field, value, onValueChange }: EnhancedFieldResolverProps) {
  // Update the parent when field value changes
  useEffect(() => {
    if (value !== undefined && value !== null) {
      onValueChange(field.id, value);
    }
  }, [value, field.id, onValueChange]);

  return (
    <Controller
      name={field.name || String(field.id)}
      defaultValue={field.value || ''}
      render={({ field: controllerField }) => (
        <OriginalFieldResolver
          field={field}
          control={undefined as any} // We're using Controller, so we don't need the control prop
          {...controllerField}
        />
      )}
    />
  );
}