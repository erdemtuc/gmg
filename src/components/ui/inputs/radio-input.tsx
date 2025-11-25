import { Control, Controller, FieldValues } from "react-hook-form";
import { EditField } from "@/features/shared/models/crud-models";
import RadioFilledIcon from "@/assets/icons/radio-filled-button-icon.svg";
import RadioOutlinedIcon from "@/assets/icons/radio-outlined-button-icon.svg";
import Image from "next/image";
import { formatFieldLabel } from "@/utils/format-label";

interface RadioInputProps {
  field: EditField;
  control: Control<FieldValues>;
  defaultValue?: string | number | boolean;
}

export function RadioInput({ field, control }: RadioInputProps) {
  const id = String(field.id);
  const label = field.label || formatFieldLabel(String(field.name));

  return (
    <div className="input-wrapper h-auto min-h-10">
      <div className="input-label mb-2">{label}</div>
      <Controller
        name={id}
        control={control}
        render={({ field: controllerField }) => (
          <div className="flex items-center gap-4 px-2 py-2">
            {(field.options ?? []).map((opt) => {
              const isChecked =
                String(controllerField.value ?? field.value ?? "") ===
                String(opt.id);
              return (
                <label
                  key={String(opt.id)}
                  className="text-brand-gray-600 inline-flex cursor-pointer items-center gap-2 py-1 text-sm"
                >
                  <input
                    type="radio"
                    value={opt.id as string}
                    checked={isChecked}
                    onChange={(e) => {
                      controllerField.onChange(e.target.value);
                    }}
                    className="sr-only"
                  />
                  {isChecked ? (
                    <Image src={RadioFilledIcon} width={16} height={16} alt="" className="text-brand-primary-500 h-4 w-4" />
                  ) : (
                    <Image src={RadioOutlinedIcon} width={16} height={16} alt="" className="text-brand-gray-400 h-4 w-4" />
                  )}
                  <span>{opt.value}</span>
                </label>
              );
            })}
          </div>
        )}
      />
    </div>
  );
}
