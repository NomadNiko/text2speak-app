"use client";
import { ForwardedRef, forwardRef } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Select, Text, Box } from "@mantine/core";
type SelectInputProps<T extends object> = {
  label: string;
  type?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  testId?: string;
  keyValue: keyof T;
  options: T[];
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  renderOption: (option: T) => React.ReactNode;
};
function SelectInputRaw<T extends object>(
  props: SelectInputProps<T> & {
    name: string;
    value: T | undefined | null;
    onChange: (value: T) => void;
    onBlur: () => void;
  },
  ref?: ForwardedRef<HTMLInputElement>
) {
  const data = props.options.map((option) => ({
    value: String(option[props.keyValue]),
    label: props.renderOption(option) as string,
  }));
  const handleChange = (value: string | null) => {
    if (value) {
      const selectedOption = props.options.find(
        (option) => String(option[props.keyValue]) === value
      );
      if (selectedOption) {
        props.onChange(selectedOption);
      }
    }
  };
  return (
    <Box>
      <Select
        ref={ref}
        data={data}
        value={props.value ? String(props.value[props.keyValue]) : null}
        onChange={handleChange}
        onBlur={props.onBlur}
        label={props.label}
        disabled={props.disabled}
        readOnly={props.readOnly}
        error={props.error}
        size={props.size}
        data-testid={props.testId}
      />
      {!!props.error && (
        <Text color="red" size="sm" data-testid={`${props.testId}-error`}>
          {props.error}
        </Text>
      )}
    </Box>
  );
}
const SelectInput = forwardRef(SelectInputRaw) as never as <T extends object>(
  props: SelectInputProps<T> & {
    name: string;
    value: T | undefined | null;
    onChange: (value: T) => void;
    onBlur: () => void;
  } & { ref?: ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof SelectInputRaw>;
function FormSelectInput<
  TFieldValues extends FieldValues = FieldValues,
  T extends object = object,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: SelectInputProps<T> &
    Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue">
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <SelectInput<T>
          {...field}
          label={props.label}
          autoFocus={props.autoFocus}
          type={props.type}
          error={fieldState.error?.message}
          disabled={props.disabled}
          readOnly={props.readOnly}
          testId={props.testId}
          options={props.options}
          renderOption={props.renderOption}
          keyValue={props.keyValue}
          size={props.size}
        />
      )}
    />
  );
}
export default FormSelectInput;
