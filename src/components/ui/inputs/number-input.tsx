import { Control, Controller, FieldValues } from "react-hook-form";
import { EditField } from "@/features/shared/models/crud-models";

interface NumberInputProps {
  field: EditField;
  control: Control<FieldValues>;
}

export function NumberInput({ field, control }: NumberInputProps) {
  const id = String(field.id);
  const label = field.name;

  return (
    <div className="input-wrapper">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <Controller
        name={id}
        control={control}
        render={({ field: controllerField }) => (
          <input
            id={id}
            type="number"
            className="input-field"
            {...controllerField}
          />
        )}
      />
    </div>
  );
}
