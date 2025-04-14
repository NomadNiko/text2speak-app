import React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Select } from "@mantine/core";
type SelectExtendedInputProps<T extends object> = {
  label: string;
  error?: string;
  testId?: string;
  disabled?: boolean;
  options: T[];
  renderSelected: (option: T) => React.ReactNode;
  renderOption: (option: T) => React.ReactNode;
  keyExtractor: (option: T) => string;
  onEndReached?: () => void;
  placeholder?: string;
  searchable?: boolean;
};
function SelectExtendedInput<T extends object>(
  props: SelectExtendedInputProps<T> & {
    name: string;
    value: T | undefined | null;
    onChange: (value: T) => void;
    onBlur: () => void;
  }
) {
  // Convert options to format expected by Mantine Select
  const data = props.options.map((option) => ({
    value: props.keyExtractor(option),
    label: props.renderOption(option) as string,
    // Store original option for retrieval
    originalOption: option,
  }));
  // Get current value
  const selectedValue = props.value ? props.keyExtractor(props.value) : null;
  // Handle selection change
  const handleChange = (value: string | null) => {
    if (!value) return;
    const selectedOption = props.options.find(
      (opt) => props.keyExtractor(opt) === value
    );
    if (selectedOption) {
      props.onChange(selectedOption);
    }
  };
  return (
    <Select
      label={props.label}
      data={data}
      value={selectedValue}
      onChange={handleChange}
      onBlur={props.onBlur}
      error={props.error}
      disabled={props.disabled}
      searchable={props.searchable}
      placeholder={props.placeholder}
      data-testid={props.testId}
    />
  );
}
function FormSelectExtendedInput<
  TFieldValues extends FieldValues = FieldValues,
  T extends object = object,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue"> &
    SelectExtendedInputProps<T>
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <SelectExtendedInput<T>
          {...field}
          label={props.label}
          error={fieldState.error?.message}
          disabled={props.disabled}
          testId={props.testId}
          options={props.options}
          renderOption={props.renderOption}
          renderSelected={props.renderSelected}
          keyExtractor={props.keyExtractor}
          searchable={props.searchable}
          placeholder={props.placeholder}
          onEndReached={props.onEndReached}
        />
      )}
    />
  );
}
export default FormSelectExtendedInput;
