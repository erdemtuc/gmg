import { Control, Controller, FieldValues } from "react-hook-form";
import { EditField } from "@/features/shared/models/crud-models";

interface TextareaInputProps {
  field: EditField;
  control: Control<FieldValues>;
}

export function TextareaInput({ field, control }: TextareaInputProps) {
  const id = String(field.id);
  const label = field.name;

  return (
    <div className="input-wrapper h-auto">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <Controller
        name={id}
        control={control}
        render={({ field: controllerField }) => (
          <textarea
            id={id}
            rows={3}
            className="input-field h-auto resize-none"
            {...controllerField}
          />
        )}
      />
    </div>
  );
}
