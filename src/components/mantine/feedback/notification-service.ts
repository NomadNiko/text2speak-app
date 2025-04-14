import { notifications } from "@mantine/notifications";
import { ReactNode } from "react";

type NotificationVariant = "success" | "error" | "info" | "warning";

interface ShowNotificationProps {
  message: ReactNode;
  variant?: NotificationVariant;
  autoHideDuration?: number;
  title?: string;
}

export const notificationService = {
  enqueueSnackbar: (
    message: ReactNode,
    options: Partial<Omit<ShowNotificationProps, "message">> = {}
  ) => {
    const { variant = "info", autoHideDuration = 4000, title } = options;

    // Map MUI variants to Mantine color
    const colorMap: Record<NotificationVariant, string> = {
      success: "green",
      error: "red",
      info: "blue",
      warning: "yellow",
    };

    notifications.show({
      title,
      message,
      color: colorMap[variant],
      autoClose: autoHideDuration,
    });
  },
};

// Hook replacement for useSnackbar
export function useSnackbar() {
  return { enqueueSnackbar: notificationService.enqueueSnackbar };
}
