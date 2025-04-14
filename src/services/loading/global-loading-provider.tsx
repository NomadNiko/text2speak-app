"use client";
import { Box, LoadingOverlay } from "@mantine/core";
import { PropsWithChildren, useMemo, useState } from "react";
import {
  GlobalLoadingActionsContext,
  GlobalLoadingContext,
} from "./global-loading-context";

function GlobalLoadingProvider({ children }: PropsWithChildren<{}>) {
  const [isLoading, setIsLoading] = useState(false);

  const contextValue = useMemo(
    () => ({
      isLoading,
    }),
    [isLoading]
  );

  const contextActionsValue = useMemo(
    () => ({
      setLoading: setIsLoading,
    }),
    []
  );

  return (
    <GlobalLoadingContext.Provider value={contextValue}>
      <GlobalLoadingActionsContext.Provider value={contextActionsValue}>
        <Box pos="relative" style={{ minHeight: "100vh" }}>
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          {children}
        </Box>
      </GlobalLoadingActionsContext.Provider>
    </GlobalLoadingContext.Provider>
  );
}

export default GlobalLoadingProvider;
