import { Control, FieldValues } from "react-hook-form";
import {
  TextInput,
  NumberInput,
  TextareaInput,
  RadioInput,
  SelectInput,
  MultiSelectInput,
} from "./index";
import { EditField } from "@/features/shared/models/crud-models";

interface FieldResolverProps {
  field: EditField;
  control: Control<FieldValues>;
}

export function FieldResolver({ field, control }: FieldResolverProps) {
  const baseProps = { field, control };

  switch (field.type) {
    case "text":
    case "datetime-local":
      return <TextInput {...baseProps} />;
    case "number":
      return <NumberInput {...baseProps} />;
    case "textarea":
      return <TextareaInput {...baseProps} />;
    case "radio":
      return <RadioInput {...baseProps} />;
    case "select": {
      const isMulti = !!field.isMulti;
      return isMulti ? (
        <MultiSelectInput {...baseProps} />
      ) : (
        <SelectInput {...baseProps} />
      );
    }
    default:
      // Fallback to text input for unknown types
      return <TextInput {...baseProps} />;
  }
}
