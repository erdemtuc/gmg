import { Control, Controller, FieldValues } from "react-hook-form";
import { EditField } from "@/features/shared/models/crud-models";
import { formatFieldLabel } from "@/utils/format-label";

interface TextInputProps {
  field: EditField;
  control: Control<FieldValues>;
}

export function TextInput({ field, control }: TextInputProps) {
  const name = field.name;
  const id = String(field.id);
  const label = field.label || formatFieldLabel(String(field.name));

  return (
    <div className="input-wrapper border border-gray-300 rounded-md p-2">
      <label htmlFor={id} className="input-label block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: controllerField }) => (
          <input
            id={id}
            type={field.type === "datetime-local" ? "datetime-local" : "text"}
            className="input-field w-full px-3 py-1 focus:outline-none"
            {...controllerField}
          />
        )}
      />
    </div>
  );
}
