import {
  Modal as MantineModal,
  Group,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { ReactNode } from "react";
export interface ModalProps {
  title?: ReactNode;
  actions?: ReactNode[];
  content?: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  opened: boolean;
  onClose: () => void;
  centered?: boolean;
  children?: ReactNode;
}
export function Modal({
  title,
  actions,
  content,
  children,
  maxWidth = "sm",
  fullWidth = false,
  opened,
  onClose,
  centered,
  ...props
}: ModalProps) {
  const theme = useMantineTheme();
  const sizeMap: Record<string, string> = {
    xs: "20rem",
    sm: "30rem",
    md: "45rem",
    lg: "60rem",
    xl: "75rem",
  };
  const size = sizeMap[maxWidth] || sizeMap.sm;
  // Extract padding to a variable to avoid direct literal in styles object
  const innerPadding = theme.spacing.md;
  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      centered={centered}
      title={title}
      size={size}
      styles={
        fullWidth
          ? {
              inner: { padding: innerPadding },
              content: { width: "100%" },
            }
          : undefined
      }
      {...props}
    >
      <Stack>
        {content || children}
        {actions && <Group justify="flex-end">{actions}</Group>}
      </Stack>
    </MantineModal>
  );
}
