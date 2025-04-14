"use client";
import { useFileUploadService } from "@/services/api/services/files";
import { FileEntity } from "@/services/api/types/file-entity";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import {
  Box,
  Text,
  Paper,
  Button,
  Group,
  ActionIcon,
  Image as MantineImage,
  useMantineTheme,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

type ImagePickerProps = {
  error?: string;
  onChange: (value: FileEntity | null) => void;
  onBlur: () => void;
  value?: FileEntity;
  disabled?: boolean;
  testId?: string;
  label?: React.ReactNode;
};

function ImagePicker(props: ImagePickerProps) {
  const { onChange } = props;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const fetchFileUpload = useFileUploadService();
  const theme = useMantineTheme();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsLoading(true);
      const { status, data } = await fetchFileUpload(acceptedFiles[0]);
      if (status === HTTP_CODES_ENUM.CREATED) {
        onChange(data.file);
      }
      setIsLoading(false);
    },
    [fetchFileUpload, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 2, // 2MB
    disabled: isLoading || props.disabled,
  });

  const removeImageHandle = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onChange(null);
  };

  return (
    <Paper
      {...getRootProps()}
      p={theme.spacing.md}
      mt={theme.spacing.md}
      withBorder
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing.md,
        border: "1px dashed #ddd",
        borderRadius: "8px",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {isDragActive && (
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text size="xl" fw="bold" color="white" ta="center">
            {t("common:formInputs.singleImageInput.dropzoneText")}
          </Text>
        </Box>
      )}
      {props?.value && (
        <Box
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 300,
            marginBottom: theme.spacing.md,
          }}
        >
          <Box style={{ position: "relative", height: 250, width: "100%" }}>
            <MantineImage
              src={props.value.path}
              alt={
                t("common:formInputs.singleImageInput.imageAlt") ||
                "Uploaded image"
              }
              fit="cover"
              h={250}
            />
            <ActionIcon
              color="red"
              variant="filled"
              onClick={removeImageHandle}
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                zIndex: 2,
              }}
            >
              <IconX size={18} />
            </ActionIcon>
          </Box>
        </Box>
      )}
      <Group mt={props.value ? 0 : theme.spacing.md}>
        <Button
          loading={isLoading}
          data-testid={props.testId}
          size="compact-sm"
        >
          {isLoading
            ? t("common:loading")
            : t("common:formInputs.singleImageInput.selectFile")}
          <input {...getInputProps()} />
        </Button>
      </Group>
      <Text mt="xs" size="sm" color="dimmed">
        {t("common:formInputs.singleImageInput.dragAndDrop")}
      </Text>
      {props.error && (
        <Text color="red" size="sm" mt="xs">
          {props.error}
        </Text>
      )}
    </Paper>
  );
}

function FormImagePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue"> & {
    disabled?: boolean;
    testId?: string;
    label?: React.ReactNode;
  }
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <ImagePicker
          onChange={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          error={fieldState.error?.message}
          disabled={props.disabled}
          testId={props.testId}
          label={props.label}
        />
      )}
    />
  );
}

export default FormImagePicker;
