import { Control, Controller, FieldValues, useFieldArray } from "react-hook-form";
import { EditField } from "@/features/shared/models/crud-models";
import { formatFieldLabel } from "@/utils/format-label";
import { Plus } from "lucide-react";

interface MultiInputProps {
  field: EditField;
  control: Control<FieldValues>;
}

export function MultiInput({ field, control }: MultiInputProps) {
  const name = field.name; // Use field name instead of field ID
  const id = String(field.id);
  const label = field.label || formatFieldLabel(String(field.name));

  // Use field array to manage multiple inputs
  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  // Initialize with one empty field if no fields exist
  if (fields.length === 0) {
    append("");
  }

  return (
    <div className="input-wrapper">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <div className="space-y-2">
        {fields.map((fieldItem: { id: string }, index) => (
          <div key={`${name}-${index}`} className="flex items-start gap-2">
            <Controller
              name={`${name}.${index}`}
              control={control}
              defaultValue=""
              render={({ field: controllerField }) => (
                <input
                  type={field.type === "datetime-local" ? "datetime-local" : "text"}
                  className="input-field flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...controllerField}
                />
              )}
            />
            <div className="flex gap-1">
              {fields.length > 1 && (
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white rounded-md w-8 h-8 flex items-center justify-center flex-shrink-0"
                  onClick={() => remove(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
              {index === fields.length - 1 && (
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-md w-8 h-8 flex items-center justify-center flex-shrink-0"
                  onClick={() => append("")}
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

