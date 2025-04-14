"use client";
import { PropsWithChildren, useContext, useMemo, useState } from "react";
import {
  LeavePageActionsContext,
  LeavePageContext,
  LeavePageContextParamsType,
  LeavePageInfoContext,
  LeavePageModalContext,
} from "./leave-page-context";
import { Modal } from "@/components/mantine/feedback/Modal";
import { Button } from "@mantine/core";
import { Text } from "@mantine/core";
import Link from "@/components/link";
import { useTranslation } from "../i18n/client";

function Provider(props: PropsWithChildren<{}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [leavePage, setLeavePage] = useState<LeavePageContextParamsType>(null);
  const [leavePageCounter, setIsLeavePage] = useState(0);

  const contextModalValue = useMemo(
    () => ({
      isOpen,
    }),
    [isOpen]
  );

  const contextValue = useMemo(
    () => ({
      isLeavePage: leavePageCounter !== 0,
    }),
    [leavePageCounter]
  );

  const contextInfoValue = useMemo(
    () => ({
      leavePage,
    }),
    [leavePage]
  );

  const contextActionsValue = useMemo(
    () => ({
      trackLeavePage: () => {
        setIsLeavePage((prevValue) => prevValue + 1);
      },
      setLeavePage: (params: LeavePageContextParamsType) => {
        setLeavePage(params);
      },
      untrackLeavePage: () => {
        setLeavePage(null);
        setIsLeavePage((prevValue) => prevValue - 1);
      },
      openModal: () => {
        setIsOpen(true);
      },
      closeModal: () => {
        setIsOpen(false);
      },
    }),
    []
  );

  return (
    <LeavePageContext.Provider value={contextValue}>
      <LeavePageModalContext.Provider value={contextModalValue}>
        <LeavePageActionsContext.Provider value={contextActionsValue}>
          <LeavePageInfoContext.Provider value={contextInfoValue}>
            {props.children}
          </LeavePageInfoContext.Provider>
        </LeavePageActionsContext.Provider>
      </LeavePageModalContext.Provider>
    </LeavePageContext.Provider>
  );
}

function ModalComponent() {
  const { t } = useTranslation("common");
  const { isOpen } = useContext(LeavePageModalContext);
  const { leavePage } = useContext(LeavePageInfoContext);
  const { closeModal } = useContext(LeavePageActionsContext);
  const href = (leavePage?.push ?? leavePage?.replace) || "";

  return (
    <Modal
      opened={isOpen}
      onClose={closeModal}
      title={t("common:leavePage.title")}
      maxWidth="sm"
      centered
      content={<Text>{t("common:leavePage.message")}</Text>}
      actions={[
        <Button key="stay" onClick={closeModal} data-testid="stay">
          {t("common:leavePage.stay")}
        </Button>,
        <Button
          key="leave"
          component={Link}
          onClick={closeModal}
          href={typeof href === "string" ? href : ""}
          data-testid="leave"
        >
          {t("common:leavePage.leave")}
        </Button>,
      ]}
    />
  );
}

export default function LeavePageProvider(props: PropsWithChildren<{}>) {
  return (
    <Provider>
      {props.children}
      <ModalComponent />
    </Provider>
  );
}
