"use client";
import { useFileUploadService } from "@/services/api/services/files";
import { FileEntity } from "@/services/api/types/file-entity";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import {
  Box,
  Text,
  Paper,
  ActionIcon,
  useMantineTheme,
  Avatar,
} from "@mantine/core";
import { Button } from "@mantine/core";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IconX } from "@tabler/icons-react";

type AvatarInputProps = {
  error?: string;
  onChange: (value: FileEntity | null) => void;
  onBlur: () => void;
  value?: FileEntity;
  disabled?: boolean;
  testId?: string;
};

function AvatarInput(props: AvatarInputProps) {
  const { onChange } = props;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const fetchFileUpload = useFileUploadService();
  const theme = useMantineTheme();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (isLoading) return; // Prevent multiple uploads while loading
      setIsLoading(true);
      try {
        const { status, data } = await fetchFileUpload(acceptedFiles[0]);
        if (status === HTTP_CODES_ENUM.CREATED) {
          onChange(data.file);
        }
      } catch (error) {
        console.error("File upload failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFileUpload, onChange, isLoading]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [], // Accept all image types
    },
    maxFiles: 1,
    disabled: isLoading || props.disabled,
  });

  const removeAvatarHandle = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      onChange(null);
    },
    [onChange]
  );

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

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
          }}
        >
          <Text size="xl" fw="bold" color="white" ta="center" mt="xl">
            {t("common:formInputs.avatarInput.dropzoneText")}
          </Text>
        </Box>
      )}
      {props?.value ? (
        <Box style={{ position: "relative", width: 100, height: 100 }}>
          <Avatar src={props.value?.path} size={100} radius="xl" />
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.7)",
              transition: ".5s ease",
              opacity: 0,
              "&:hover": {
                opacity: 1,
              },
            }}
          >
            <ActionIcon
              variant="transparent"
              onClick={removeAvatarHandle}
              color="white"
              size="xl"
            >
              <IconX size={50} color="white" />
            </ActionIcon>
          </Box>
        </Box>
      ) : (
        <Avatar src={props.value?.path} size={100} radius="xl" />
      )}
      <Box mt={theme.spacing.md} onClick={handleButtonClick}>
        <Button
          component="label"
          loading={isLoading}
          data-testid={props.testId}
          size="compact-sm"
        >
          {isLoading
            ? t("common:loading")
            : t("common:formInputs.avatarInput.selectFile")}
          <input {...getInputProps()} />
        </Button>
      </Box>
      <Box mt="xs">
        <Text size="sm">{t("common:formInputs.avatarInput.dragAndDrop")}</Text>
      </Box>
      {props.error && (
        <Text color="red" size="sm" mt="xs">
          {props.error}
        </Text>
      )}
    </Paper>
  );
}

function FormAvatarInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue"> & {
    disabled?: boolean;
    testId?: string;
  }
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <AvatarInput
          onChange={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          error={fieldState.error?.message}
          disabled={props.disabled}
          testId={props.testId}
        />
      )}
    />
  );
}

export default FormAvatarInput;
