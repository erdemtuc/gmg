import { Control, Controller, FieldValues } from "react-hook-form";
import { EditField } from "@/features/shared/models/crud-models";
import { formatFieldLabel } from "@/utils/format-label";

interface NumberInputProps {
  field: EditField;
  control: Control<FieldValues>;
}

export function NumberInput({ field, control }: NumberInputProps) {
  const name = field.name;
  const id = String(field.id);
  const label = field.label || formatFieldLabel(String(field.name));

  return (
    <div className="input-wrapper border border-gray-300 rounded-md p-2">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: controllerField }) => (
          <input
            id={id}
            type="number"
            className="input-field w-full px-3 py-1 focus:outline-none"
            {...controllerField}
          />
        )}
      />
    </div>
  );
}
