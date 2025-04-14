"use client";
import { ForwardedRef, forwardRef, ReactNode } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Checkbox, Stack, Text } from "@mantine/core";

export type CheckboxInputProps<T> = {
  label: string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  testId?: string;
  keyValue: keyof T;
  options: T[];
  keyExtractor: (option: T) => string;
  renderOption: (option: T) => ReactNode;
};

function CheckboxInputRaw<T>(
  props: CheckboxInputProps<T> & {
    name: string;
    value: T[] | undefined | null;
    onChange: (value: T[]) => void;
    onBlur: () => void;
  },
  ref?: ForwardedRef<HTMLDivElement | null>
) {
  const value = props.value ?? [];
  const onChange = (checkboxValue: T) => (isChecked: boolean) => {
    const isExist = value
      .map((option) => option[props.keyValue])
      .includes(checkboxValue[props.keyValue]);
    const newValue = isExist
      ? value.filter(
          (option) => option[props.keyValue] !== checkboxValue[props.keyValue]
        )
      : [...value, checkboxValue];
    props.onChange(newValue);
    console.log(isChecked);
  };

  return (
    <div ref={ref} data-testid={props.testId}>
      <Text fw={500} data-testid={`${props.testId}-label`}>
        {props.label}
      </Text>
      <Stack gap="xs" mt="xs">
        {props.options.map((option) => (
          <Checkbox
            key={props.keyExtractor(option)}
            checked={value
              .map((valueOption) => valueOption[props.keyValue])
              .includes(option[props.keyValue])}
            onChange={(event) => onChange(option)(event.currentTarget.checked)}
            name={props.name}
            label={props.renderOption(option)}
            data-testid={`${props.testId}-${props.keyExtractor(option)}`}
            disabled={props.disabled}
          />
        ))}
      </Stack>
      {!!props.error && (
        <Text
          color="red"
          size="sm"
          mt="xs"
          data-testid={`${props.testId}-error`}
        >
          {props.error}
        </Text>
      )}
    </div>
  );
}

const CheckboxInput = forwardRef(CheckboxInputRaw) as never as <T>(
  props: CheckboxInputProps<T> & {
    name: string;
    value: T[] | undefined | null;
    onChange: (value: T[]) => void;
    onBlur: () => void;
  } & { ref?: ForwardedRef<HTMLDivElement | null> }
) => ReturnType<typeof CheckboxInputRaw>;

function FormCheckboxInput<
  TFieldValues extends FieldValues = FieldValues,
  T = unknown,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: CheckboxInputProps<T> &
    Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue">
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <CheckboxInput<T>
          {...field}
          label={props.label}
          autoFocus={props.autoFocus}
          error={fieldState.error?.message}
          disabled={props.disabled}
          readOnly={props.readOnly}
          testId={props.testId}
          options={props.options}
          keyValue={props.keyValue}
          keyExtractor={props.keyExtractor}
          renderOption={props.renderOption}
        />
      )}
    />
  );
}

export default FormCheckboxInput;
