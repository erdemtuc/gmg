import { Control, Controller, FieldValues, useFieldArray } from "react-hook-form";
import { EditField } from "@/features/shared/models/crud-models";
import { formatFieldLabel } from "@/utils/format-label";
import { Plus } from "lucide-react";

interface MultiInputProps {
  field: EditField;
  control: Control<FieldValues>;
}

export function MultiInput({ field, control }: MultiInputProps) {
  const id = String(field.id);
  const label = field.label || formatFieldLabel(String(field.name));

  // Use field array to manage multiple inputs
  const { fields, append, remove } = useFieldArray({
    control,
    name: id,
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
        {fields.map((fieldItem, index) => (
          <div key={fieldItem.id} className="flex items-center gap-2">
            <Controller
              name={`${id}.${index}`}
              control={control}
              defaultValue={fieldItem.value || ""}
              render={({ field: controllerField }) => (
                <input
                  type={field.type === "datetime-local" ? "datetime-local" : "text"}
                  className="input-field flex-1 border border-gray-300 rounded-md px-3 py-2"
                  {...controllerField}
                />
              )}
            />
            {index > 0 && (
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5"
                onClick={() => remove(index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-2"
          onClick={() => append("")}
        >
          <Plus className="w-4 h-4" />
          Add another
        </button>
      </div>
    </div>
  );
}

