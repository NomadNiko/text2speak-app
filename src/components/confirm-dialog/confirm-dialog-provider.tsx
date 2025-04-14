"use client";
import { Button } from "@mantine/core";
import { Modal } from "@/components/mantine/feedback/Modal";
import { Text } from "@mantine/core";
import {
  ConfirmDialogActionsContext,
  ConfirmDialogOptions,
} from "./confirm-dialog-context";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "@/services/i18n/client";

function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("confirm-dialog");

  const defaultConfirmDialogInfo = useMemo<ConfirmDialogOptions>(
    () => ({
      title: t("title"),
      message: t("message"),
      successButtonText: t("actions.yes"),
      cancelButtonText: t("actions.no"),
    }),
    [t]
  );

  const [confirmDialogInfo, setConfirmDialogInfo] =
    useState<ConfirmDialogOptions>(defaultConfirmDialogInfo);

  const resolveRef = useRef<(value: boolean) => void>(undefined);

  const handleClose = () => {
    setIsOpen(false);
  };

  const onCancel = () => {
    setIsOpen(false);
    resolveRef.current?.(false);
  };

  const onSuccess = () => {
    setIsOpen(false);
    resolveRef.current?.(true);
  };

  const confirmDialog = useCallback(
    (options: Partial<ConfirmDialogOptions> = {}) => {
      return new Promise<boolean>((resolve) => {
        setConfirmDialogInfo({
          ...defaultConfirmDialogInfo,
          ...options,
        });
        setIsOpen(true);
        resolveRef.current = resolve;
      });
    },
    [defaultConfirmDialogInfo]
  );

  const contextActions = useMemo(
    () => ({
      confirmDialog,
    }),
    [confirmDialog]
  );

  return (
    <>
      <ConfirmDialogActionsContext.Provider value={contextActions}>
        {children}
      </ConfirmDialogActionsContext.Provider>
      <Modal
        opened={isOpen}
        onClose={handleClose}
        title={confirmDialogInfo.title}
        maxWidth="sm"
        centered
        actions={[
          <Button key="cancel" onClick={onCancel} size="compact-sm">
            {confirmDialogInfo.cancelButtonText}
          </Button>,
          <Button key="confirm" onClick={onSuccess} autoFocus size="compact-sm">
            {confirmDialogInfo.successButtonText}
          </Button>,
        ]}
      >
        <Text>{confirmDialogInfo.message}</Text>
      </Modal>
    </>
  );
}

export default ConfirmDialogProvider;
