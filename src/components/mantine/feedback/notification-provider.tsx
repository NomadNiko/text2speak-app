"use client";

import { Notifications } from "@mantine/notifications";
import { PropsWithChildren } from "react";

export function NotificationsProvider({ children }: PropsWithChildren<{}>) {
  return (
    <>
      {children}
      <Notifications position="bottom-left" />
    </>
  );
}
