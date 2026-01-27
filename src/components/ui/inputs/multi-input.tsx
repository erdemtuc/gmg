import { Control, Controller, FieldValues, useFieldArray } from "react-hook-form";
import { EditField } from "@/features/shared/models/crud-models";
import { formatFieldLabel } from "@/utils/format-label";
import { Plus, Trash2 } from "lucide-react";

interface MultiInputProps {
  field: EditField;
  control: Control<FieldValues>;
}

export function MultiInput({ field, control }: MultiInputProps) {
  const name = field.name; // Use field name instead of field ID
  const id = String(field.id);
  const label = field.label || formatFieldLabel(String(field.name));

  // Use field array to manage multiple inputs
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: name,
  });

  // Initialize with one empty field if no fields exist
  if (fields.length === 0) {
    append({ value: "" });
  }

  return (
    <div className={`input-wrapper ${fields.length > 1 ? 'h-auto' : 'max-h-[calc(85vh-2rem)]'} border border-gray-300 rounded-md p-1`}>
      <label htmlFor={id} className="input-label mb-2 block text-sm font-medium text-gray-700">
        {label}
        {fields.length}
      </label>
      <div className="space-y-2">
        {fields.map((fieldItem, index) => (
          <div key={fieldItem.id} className="relative">
            <Controller
              name={`${name}.${index}.value`}
              control={control}
              defaultValue=""
              render={({ field: controllerField }) => (
                <div className="relative">
                  <input
                    type={field.type === "datetime-local" ? "datetime-local" : "text"}
                    className="input-field w-full px-3 py-2 pr-24 focus:outline-none"
                    {...controllerField}
                    placeholder={`Enter ${label}...`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                    {fields.length > 1 && (
                      <button
                        type="button"
                        className={`text-red-500 hover:text-red-700 p-1 m-1 mb-2 ${index === fields.length - 1 ? 'rounded-full hover:bg-red-100 mr-3' : ''}`}
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {fields.length <= 1 && (
                      // Placeholder to maintain consistent spacing when trash button is not shown
                      <div className="w-6 h-6 m-1"></div>
                    )}
                    {index === fields.length - 1 && ( // Show add button only on the last row
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white m-1 mb-2 rounded-sm"
                        onClick={() => insert(index + 1, { value: "" })}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                    {index !== fields.length - 1 && (
                      // Placeholder to maintain consistent spacing when add button is not shown
                      <div className="w-6 h-6 m-1"></div>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

