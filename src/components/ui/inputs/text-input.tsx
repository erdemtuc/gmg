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
    <div className="input-wrapper">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: controllerField }) => (
          <input
            id={id}
            type={field.type === "datetime-local" ? "datetime-local" : "text"}
            className="input-field border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...controllerField}
          />
        )}
      />
    </div>
  );
}
