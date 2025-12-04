import { Control, Controller, FieldValues } from "react-hook-form";
import { EditField } from "@/features/shared/models/crud-models";
import { formatFieldLabel } from "@/utils/format-label";

interface CheckboxInputProps {
  field: EditField;
  control: Control<FieldValues>;
}

export function CheckboxInput({ field, control }: CheckboxInputProps) {
  const id = String(field.id);
  const label = field.label || formatFieldLabel(String(field.name));
  const options = field.options ?? [];

  return (
    <div className="input-wrapper">
      <label className="input-label">{label}</label>
      <Controller
        name={id}
        control={control}
        render={({ field: controllerField }) => (
          <div className="space-y-2">
            {options.map((opt) => {
              // Check if the current option is selected
              const isChecked = Array.isArray(controllerField.value)
                ? controllerField.value.includes(String(opt.id))
                : String(controllerField.value) === String(opt.id);
              
              return (
                <label
                  key={String(opt.id)}
                  className="text-brand-gray-600 inline-flex cursor-pointer items-center gap-2 py-1 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (field.isMulti) {
                        // Handle multi-select checkbox
                        const currentValues = Array.isArray(controllerField.value)
                          ? controllerField.value
                          : controllerField.value ? [String(controllerField.value)] : [];

                        if (e.target.checked) {
                          controllerField.onChange([...currentValues, String(opt.id)]);
                        } else {
                          controllerField.onChange(
                            currentValues.filter((val: string) => val !== String(opt.id))
                          );
                        }
                      } else {
                        // Handle single checkbox - either the option ID or null
                        controllerField.onChange(
                          e.target.checked ? String(opt.id) : null
                        );
                      }
                    }}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center w-4 h-4 rounded ${
                    isChecked
                      ? 'bg-brand-primary-500 border-brand-primary-500'
                      : 'border-2 border-brand-gray-400'
                  }`}>
                    {isChecked && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
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