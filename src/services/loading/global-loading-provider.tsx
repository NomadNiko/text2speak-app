// src/services/loading/global-loading-provider.tsx
"use client";
import { Box } from "@mantine/core";
import { PropsWithChildren, useMemo, useState } from "react";
import {
  GlobalLoadingActionsContext,
  GlobalLoadingContext,
} from "./global-loading-context";
import { TtsLoadingAnimation } from "@/components/loading/TtsLoadingAnimation";

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
          {isLoading && (
            <Box
              pos="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                zIndex: 1000,
              }}
            >
              <TtsLoadingAnimation />
            </Box>
          )}
          {children}
        </Box>
      </GlobalLoadingActionsContext.Provider>
    </GlobalLoadingContext.Provider>
  );
}

export default GlobalLoadingProvider;
