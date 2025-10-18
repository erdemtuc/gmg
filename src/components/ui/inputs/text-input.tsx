import { Control, Controller, FieldValues } from "react-hook-form";
import { EditField } from "@/features/shared/models/crud-models";

interface TextInputProps {
  field: EditField;
  control: Control<FieldValues>;
}

export function TextInput({ field, control }: TextInputProps) {
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
            type="text"
            className="input-field b-none"
            {...controllerField}
          />
        )}
      />
    </div>
  );
}
