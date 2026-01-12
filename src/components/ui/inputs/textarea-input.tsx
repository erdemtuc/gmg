import { Control, Controller, FieldValues } from "react-hook-form";
import { EditField } from "@/features/shared/models/crud-models";
import { formatFieldLabel } from "@/utils/format-label";

interface TextareaInputProps {
  field: EditField;
  control: Control<FieldValues>;
}

export function TextareaInput({ field, control }: TextareaInputProps) {
  const name = field.name;
  const id = String(field.id);
  const label = field.label || formatFieldLabel(String(field.name));

  return (
    <div className="input-wrapper h-auto">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <Controller
        name={name}
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
